import { expect, type JSHandle, type Locator, type Page, test } from "@playwright/test"

export async function expectVisibleBackdrop(page: Page) {
	const backdrop = page
		.locator(
			'[data-slot="dialog-overlay"]:visible, [data-slot="alert-dialog-overlay"]:visible, [data-slot="sheet-overlay"]:visible',
		)
		.last()
	await expect(backdrop).toBeVisible()
	await expect
		.poll(
			() =>
				backdrop.evaluate(element => {
					const style = getComputedStyle(element)
					const canvas = document.createElement("canvas")
					canvas.width = canvas.height = 1
					const context = canvas.getContext("2d")
					if (!context) throw new Error("Canvas is required to measure backdrop alpha")
					context.fillStyle = "rgba(0,0,0,0)"
					context.fillStyle = style.backgroundColor
					context.fillRect(0, 0, 1, 1)
					const alpha = (context.getImageData(0, 0, 1, 1).data[3] ?? 0) / 255
					const rect = element.getBoundingClientRect()
					let opacity = 1
					for (let node: Element | null = element; node; node = node.parentElement)
						opacity *= Number(getComputedStyle(node).opacity)
					const paintsAbovePage = [
						[5, 5],
						[innerWidth - 5, 5],
						[5, innerHeight - 5],
						[innerWidth - 5, innerHeight - 5],
					].some(([x, y]) => {
						const stack = document.elementsFromPoint(x ?? 0, y ?? 0)
						const index = stack.indexOf(element)
						// Full-screen sheets can cover every corner; their own popup may
						// paint above the backdrop, while ordinary page content may not.
						return (
							index >= 0 &&
							stack
								.slice(0, index)
								.every(node =>
									node.closest('[role="dialog"], [role="alertdialog"]'),
								)
						)
					})
					return (
						alpha * opacity > 0.05 &&
						paintsAbovePage &&
						rect.left <= 1 &&
						rect.right >= innerWidth - 30 &&
						rect.top <= 1 &&
						rect.bottom >= innerHeight - 1 &&
						rect.width >= innerWidth - 30 &&
						rect.height >= innerHeight - 1
					)
				}),
			{ message: "Backdrop must visibly dim the viewport" },
		)
		.toBe(true)
}

export async function expectPointerCursor(button: Locator) {
	await expect(button).toBeVisible()
	await expect(button).toBeEnabled()
	await expect(button).toHaveCSS("cursor", "pointer")
}

type MotionFrame = {
	time: number
	opacity: number
	transform: string
	translate: string
	scale: string
	rotate: string
	xOverflow: number
	yOverflow: number
	layoutWidth: number
	layoutHeight: number
	layoutX: number
	layoutY: number
	animationStarts: number[]
	spatialAnimation?: boolean
}

export type RowAnimationSample = {
	text: string
	frames: MotionFrame[]
}

// Sampling begins before the action, including opacity-zero elements that occupy the viewport.
// Keep the action in the current document (client navigation, click, or data reveal).
async function startSampling(page: Page, selector: string, descendants = false) {
	await page.evaluate(async () => {
		await document.fonts.ready
		await Promise.all(
			document
				.getAnimations()
				.filter(
					animation =>
						(animation.playState === "running" || animation.pending) &&
						Number.isFinite(animation.effect?.getComputedTiming().endTime),
				)
				.map(animation => animation.finished.catch(() => undefined)),
		)
	})
	return page.evaluateHandle(
		({ selector, descendants }) => {
			const records = new Map<Element, { text: string; frames: MotionFrame[] }>()
			let firstSeen = 0
			let frameId = 0
			let stopped = false
			let stableSince = 0
			let previous = ""
			let actionCompleted = 0
			let lastFrameTime = 0
			const visible = (element: Element, insidePopup = false) => {
				const rect = element.getBoundingClientRect()
				const style = getComputedStyle(element)
				let top = rect.top
				// Keep early frames for a row that starts below the viewport while rising in.
				if (!descendants) {
					for (let node: Element | null = element; node; node = node.parentElement) {
						const transform = getComputedStyle(node).transform
						if (transform !== "none") top -= new DOMMatrixReadOnly(transform).m42
					}
				}
				return (
					style.display !== "none" &&
					style.visibility !== "hidden" &&
					style.clip !== "rect(0px, 0px, 0px, 0px)" &&
					style.clipPath !== "inset(50%)" &&
					rect.width > 0 &&
					rect.height > 0 &&
					(insidePopup ||
						(top + rect.height > 0 &&
							top < innerHeight &&
							rect.right > 0 &&
							rect.left < innerWidth))
				)
			}
			const diagnostics = () => {
				const elements = [...records.keys()]
				return {
					url: location.href,
					selector,
					descendants,
					viewport: { width: innerWidth, height: innerHeight },
					timeOrigin: performance.timeOrigin,
					time: performance.now(),
					lastFrameTime,
					firstSeen,
					actionCompleted,
					stableSince,
					currentOrder: [...document.querySelectorAll(selector)].map(element => ({
						node: elements.indexOf(element),
						visible: visible(element),
						href: element.querySelector("a")?.getAttribute("href"),
					})),
					records: [...records].map(([element, record], node) => {
						const rect = element.getBoundingClientRect()
						const style = getComputedStyle(element)
						const inViewport =
							rect.bottom > 0 &&
							rect.top < innerHeight &&
							rect.right > 0 &&
							rect.left < innerWidth
						return {
							node,
							...record,
							isConnected: element.isConnected,
							href: element.querySelector("a")?.getAttribute("href"),
							visible: visible(element, descendants),
							inViewport,
							rect: rect.toJSON(),
							display: style.display,
							visibility: style.visibility,
							status: !element.isConnected
								? "disconnected"
								: !inViewport
									? "left viewport"
									: !visible(element, descendants)
										? "hidden or empty layout"
										: record.frames.length < 3
											? "undersampled"
											: record.frames.at(-1)?.time !== lastFrameTime
												? "not sampled in final frame"
												: "complete",
						}
					}),
				}
			}
			let failure: ReturnType<typeof diagnostics> | undefined
			// Exclude modal roots already visible before the action, so a departing
			// sheet cannot satisfy or pollute the entering popup assertion. Row
			// sampling (descendants=false) keeps every visible row.
			const preexisting = descendants
				? new Set(
						[...document.querySelectorAll(selector)].filter(element =>
							visible(element),
						),
					)
				: new Set<Element>()
			const done = new Promise<RowAnimationSample[]>((resolve, reject) => {
				const sample = (now: number) => {
					lastFrameTime = now
					if (stopped) return resolve([...records.values()])
					const roots = [...document.querySelectorAll(selector)].filter(
						element => visible(element) && !preexisting.has(element),
					)
					if (roots.length && !firstSeen) firstSeen = now
					let animating = false
					const current: unknown[] = []
					for (const root of roots) {
						const elements = descendants
							? [root, ...root.querySelectorAll("*")]
							: [root]
						for (const element of elements.filter(element =>
							visible(element, descendants),
						)) {
							const style = getComputedStyle(element)
							let record = records.get(element)
							if (!record) {
								record = {
									text: `${element.tagName} ${element.textContent?.trim().slice(0, 100)}`,
									frames: [],
								}
								records.set(element, record)
							}
							const animations = element.getAnimations()
							animating ||= animations.some(
								animation => animation.playState === "running" || animation.pending,
							)
							const frame = {
								time: now,
								opacity: Number(style.opacity),
								transform: new DOMMatrixReadOnly(
									style.transform === "none" ? undefined : style.transform,
								).isIdentity
									? "none"
									: style.transform,
								translate: /^(none|0px(?: 0px){0,2})$/.test(style.translate)
									? "none"
									: style.translate,
								scale: /^(none|1(?: 1){0,2})$/.test(style.scale)
									? "none"
									: style.scale,
								rotate: /^(none|0deg)$/.test(style.rotate) ? "none" : style.rotate,
								xOverflow: Math.max(0, element.scrollWidth - element.clientWidth),
								yOverflow: Math.max(0, element.scrollHeight - element.clientHeight),
								layoutWidth: element.clientWidth,
								layoutHeight: element.clientHeight,
								layoutX: element instanceof HTMLElement ? element.offsetLeft : 0,
								layoutY: element instanceof HTMLElement ? element.offsetTop : 0,
								spatialAnimation: animations.some(
									animation =>
										animation.effect instanceof KeyframeEffect &&
										Number(animation.effect.getComputedTiming().duration) > 0 &&
										animation.effect
											.getKeyframes()
											.some(frame =>
												["transform", "translate", "scale", "rotate"].some(
													property => property in frame,
												),
											),
								),
								animationStarts: animations.flatMap(animation => {
									// Hover/focus colour transitions are not item entrances.
									if (
										!(animation.effect instanceof KeyframeEffect) ||
										!animation.effect
											.getKeyframes()
											.some(frame =>
												[
													"opacity",
													"transform",
													"translate",
													"scale",
													"rotate",
												].some(property => property in frame),
											)
									)
										return []
									const timing = animation.effect?.getComputedTiming()
									return typeof animation.startTime === "number" && timing
										? [animation.startTime + Number(timing.delay)]
										: []
								}),
							}
							record.frames.push(frame)
							current.push([
								frame.opacity,
								frame.transform,
								frame.translate,
								frame.scale,
								frame.rotate,
								frame.xOverflow,
								frame.yOverflow,
								frame.layoutWidth,
								frame.layoutHeight,
								frame.layoutX,
								frame.layoutY,
							])
						}
					}
					const signature = JSON.stringify(current)
					if (signature !== previous || animating) stableSince = now
					previous = signature
					if (
						actionCompleted &&
						firstSeen &&
						roots.length &&
						now - firstSeen >= (descendants ? 1000 : 400) &&
						now - stableSince >= 200
					) {
						const incomplete = [...records].find(
							([, record]) =>
								record.frames.length < 3 || record.frames.at(-1)?.time !== now,
						)
						if (incomplete) {
							failure = diagnostics()
							const record =
								failure.records[[...records.keys()].indexOf(incomplete[0])]
							reject(
								new Error(
									`${incomplete[1].text}: incomplete rendered samples (${record?.status}; isConnected=${incomplete[0].isConnected}; frames=${incomplete[1].frames.length}; last=${incomplete[1].frames.at(-1)?.time}; now=${now})`,
								),
							)
						} else resolve([...records.values()])
					} else if (actionCompleted && now - actionCompleted > 10_000) {
						failure = diagnostics()
						reject(
							new Error(
								`Motion sampling did not settle: ${records.size} elements for ${selector}`,
							),
						)
					} else {
						frameId = requestAnimationFrame(sample)
					}
				}
				frameId = requestAnimationFrame(sample)
			})
			// Keep browser rejection reporting quiet; the caller receives the original rejection.
			void done.catch(() => undefined)
			return {
				done,
				diagnostics: () => failure ?? diagnostics(),
				actionDone: () => {
					actionCompleted = performance.now()
				},
				stop: () => {
					stopped = true
					cancelAnimationFrame(frameId)
				},
			}
		},
		{ selector, descendants },
	)
}

async function attachSamplingFailure(sampler: Awaited<ReturnType<typeof startSampling>>) {
	// Preserve the original failure even if the page closed during the action.
	try {
		const diagnostics = await sampler.evaluate(state => state.diagnostics())
		await test.info().attach("motion-sampling-failure", {
			body: JSON.stringify(diagnostics),
			contentType: "application/json",
		})
	} catch (error) {
		await test.info().attach("motion-sampling-diagnostic-error", {
			body: String(error),
			contentType: "text/plain",
		})
	}
}

export async function sampleVisibleRowAnimations(
	page: Page,
	selector: string,
	reveal: () => Promise<void>,
): Promise<RowAnimationSample[]> {
	const sampler = await startSampling(page, selector)
	try {
		await reveal()
		return await sampler.evaluate(state => {
			state.actionDone()
			return state.done
		})
	} catch (error) {
		await attachSamplingFailure(sampler)
		throw error
	} finally {
		await sampler.evaluate(state => state.stop())
		await sampler.dispose()
	}
}

export function expectReducedRowMovement(samples: RowAnimationSample[], minimumRows = 1) {
	expect(samples.length).toBeGreaterThanOrEqual(minimumRows)
	for (const row of samples) {
		expect(row.frames.length).toBeGreaterThan(2)
		expect(row.frames[0]?.layoutHeight, "Initial content occupies layout").toBeGreaterThan(0)
		expect(row.frames.at(-1)?.opacity).toBeGreaterThan(0.99)
		expect(
			row.frames.some(frame => frame.spatialAnimation),
			"Reduced motion has no positional animation",
		).toBe(false)
		const poses = row.frames.map(
			frame => `${frame.transform}|${frame.translate}|${frame.scale}|${frame.rotate}`,
		)
		// MotionConfig allows fades and snaps initial positional values to their
		// destination. It must never interpolate or replay positional movement.
		expect(new Set(poses).size, "No intermediate spatial poses").toBeLessThanOrEqual(2)
		const resting = poses.at(-1)
		let settled = false
		for (const pose of poses) {
			if (pose === resting) settled = true
			if (settled) expect(pose, "The settled pose must not replay").toBe(resting)
		}
	}
}

export function expectVisibleRowCascade(samples: RowAnimationSample[], minimumRows = 1) {
	expect(
		samples.length,
		"All viewport rows must be sampled; tall desktop should require >12",
	).toBeGreaterThanOrEqual(minimumRows)
	const starts: number[] = []
	const exact: boolean[] = []
	for (const row of samples) {
		expect(row.frames.length, `${row.text}: multiple rendered frames`).toBeGreaterThanOrEqual(3)
		const last = row.frames.at(-1)
		if (!last) throw new Error(`${row.text}: no rendered frames`)
		expect(
			Math.min(...row.frames.map(frame => frame.opacity)),
			`${row.text}: entrance opacity`,
		).toBeLessThan(0.95)
		expect(last.opacity, `${row.text}: settled opacity`).toBeGreaterThan(0.99)
		const firstChange = row.frames.find(frame => frame.opacity > 0.05)
		expect(firstChange, `${row.text}: visible progress`).toBeDefined()
		if (!firstChange) throw new Error(`${row.text}: no visible progress`)
		const scheduled = row.frames.flatMap(frame => frame.animationStarts)
		exact.push(scheduled.length > 0)
		starts.push(scheduled.length ? Math.min(...scheduled) : firstChange.time)
		expect(row.frames[0]?.opacity, `${row.text}: must not flash before entering`).toBeLessThan(
			0.95,
		)
	}
	if (samples.length > 1) {
		const allExact = exact.length > 0 && exact.every(Boolean)
		if (allExact) {
			// Exact scheduled starts supersede arbitrary spread thresholds: bounded
			// presets compress tail gaps below 15ms while remaining strictly ordered.
			// Simultaneous entrances share one exact start and must fail here.
			let latest = starts[0] ?? 0
			for (let index = 1; index < starts.length; index++) {
				expect(
					(starts[index] ?? NaN) - latest,
					"Cascade follows visible item order",
				).toBeGreaterThanOrEqual(0.5)
				latest = Math.max(latest, starts[index] ?? 0)
			}
			expect(
				Math.max(...starts) - Math.min(...starts),
				"Scheduled entrances span visible cascade progress",
			).toBeGreaterThan(15)
			return
		}
		for (let index = 1; index < samples.length; index++) {
			const previous = samples[index - 1]
			const current = samples[index]
			if (!previous || !current) throw new Error("Cascade samples must be complete")
			const differs = current.frames.some(frame => {
				const before = previous.frames.find(candidate => candidate.time === frame.time)
				return before && Math.abs(before.opacity - frame.opacity) > 0.0001
			})
			expect(
				differs,
				"Every item beyond twelve and every earlier item has separate rendered progress",
			).toBe(true)
		}
		let latestStart = starts[0] ?? 0
		for (let index = 1; index < starts.length; index++) {
			expect(
				(starts[index] ?? NaN) - latestStart,
				"Cascade follows visible item order",
			).toBeGreaterThanOrEqual(-20)
			latestStart = Math.max(latestStart, starts[index] ?? 0)
		}
		const suffix = starts.slice(12)
		if (suffix.length > 3)
			expect(
				Math.max(...suffix) - Math.min(...suffix),
				"Every item beyond twelve must also cascade",
			).toBeGreaterThan(15)
		// Short tails (13-15 items) have no spread check above; where exact starts
		// exist, simultaneous tails must still fail while rAF frame ties pass.
		if (suffix.length > 0 && suffix.length <= 3) {
			const tail = starts.slice(11)
			const tailExact = exact.slice(11)
			if (tail.length > 1 && tailExact.length > 1 && tailExact.every(Boolean))
				expect(
					Math.max(...tail) - Math.min(...tail),
					"Every item beyond twelve must also cascade",
				).toBeGreaterThan(1)
		}
		// Late items can share a rendered frame, but cannot all share one entrance.
		const later = starts.slice(Math.floor(starts.length / 2))
		if (later.length > 3)
			expect(
				Math.max(...later) - Math.min(...later),
				"The second half also cascades",
			).toBeGreaterThan(15)
		expect(
			Math.max(...starts) - Math.min(...starts),
			"Rows must cascade, not all fade simultaneously",
		).toBeGreaterThan(15)
	}
}

export async function expectPopupEntrance(page: Page, open: () => Promise<void>) {
	const previousBackdrops = await page.evaluateHandle(
		() =>
			new Set(
				[
					...document.querySelectorAll(
						'[data-slot="dialog-overlay"], [data-slot="alert-dialog-overlay"], [data-slot="sheet-overlay"]',
					),
				].filter(element => element.getBoundingClientRect().width > 0),
			),
	)
	let introducedBackdrop = false
	const sampler = await startSampling(page, '[role="dialog"], [role="alertdialog"]', true)
	let samples: RowAnimationSample[]
	try {
		await open()
		samples = await sampler.evaluate(state => {
			state.actionDone()
			return state.done
		})
		introducedBackdrop = await previousBackdrops.evaluate(previous =>
			[
				...document.querySelectorAll(
					'[data-slot="dialog-overlay"], [data-slot="alert-dialog-overlay"], [data-slot="sheet-overlay"]',
				),
			].some(
				element =>
					!previous.has(element) &&
					element.getBoundingClientRect().width > 0 &&
					getComputedStyle(element).visibility !== "hidden",
			),
		)
	} catch (error) {
		await attachSamplingFailure(sampler)
		throw error
	} finally {
		await sampler.evaluate(state => state.stop())
		await sampler.dispose()
		await previousBackdrops.dispose()
	}
	expect(samples.length, "An editor popup must open").toBeGreaterThan(1)
	const popup = samples[0]
	if (!popup) throw new Error("No popup was sampled")
	const children = samples.slice(1)
	const reduced = await page.evaluate(
		() => matchMedia("(prefers-reduced-motion: reduce)").matches,
	)
	expect(popup.frames.at(-1)?.opacity, "Popup must settle fully visible").toBeGreaterThan(0.99)
	if (reduced) {
		const transforms = new Set(
			popup.frames.map(
				frame => `${frame.transform}|${frame.translate}|${frame.scale}|${frame.rotate}`,
			),
		)
		expect(
			transforms.size,
			`Reduced motion must suppress popup movement: ${[...transforms].join(" → ")}`,
		).toBe(1)
	} else {
		expect(popup.frames[0]?.opacity, "Popup must not flash before entering").toBeLessThan(0.99)
		expect(
			popup.frames.filter(frame => frame.opacity > 0.01 && frame.opacity < 0.99).length,
			"The whole popup must fade through intermediate rendered frames, not flash",
		).toBeGreaterThan(1)
	}
	for (const child of children) {
		for (const dimension of ["layoutWidth", "layoutHeight", "layoutX", "layoutY"] as const) {
			const values = child.frames.map(frame => frame[dimension])
			expect(
				Math.max(...values) - Math.min(...values),
				`${child.text}: initial child layout must remain stable`,
			).toBeLessThanOrEqual(1)
		}
		expect(
			(child.frames[0]?.time ?? NaN) - (popup.frames[0]?.time ?? NaN),
			`${child.text}: initial content must already be mounted`,
		).toBeLessThanOrEqual(50)
		const transforms = new Set(
			child.frames.map(
				frame => `${frame.transform}|${frame.translate}|${frame.scale}|${frame.rotate}`,
			),
		)
		expect(
			transforms.size,
			`${child.text}: initial children must not independently transform`,
		).toBe(1)
		expect(
			Math.max(...child.frames.map(frame => frame.opacity)) -
				Math.min(...child.frames.map(frame => frame.opacity)),
			`${child.text}: initial children must not independently fade`,
		).toBeLessThan(0.01)
	}
	// Compare with settled overflow, so genuinely tall mobile editors may remain scrollable.
	const last = popup.frames.at(-1)
	if (!last) throw new Error("No popup frames were sampled")
	for (const dimension of ["layoutWidth", "layoutHeight"] as const) {
		const values = popup.frames.map(frame => frame[dimension])
		expect(
			Math.max(...values) - Math.min(...values),
			`Popup ${dimension} must remain stable while opening`,
		).toBeLessThanOrEqual(1)
	}
	expect(
		Math.max(...popup.frames.map(frame => frame.xOverflow)),
		"No transient horizontal popup overflow",
	).toBeLessThanOrEqual(last.xOverflow + 1)
	expect(
		Math.max(...popup.frames.map(frame => frame.yOverflow)),
		"No transient vertical popup overflow",
	).toBeLessThanOrEqual(last.yOverflow + 1)
	expect(introducedBackdrop, "The entering popup introduces its own backdrop").toBe(true)
	await expectVisibleBackdrop(page)
}

export async function scrollWithInput(page: Page, point: { x: number; y: number }, delta: number) {
	if (await page.evaluate(() => matchMedia("(pointer: coarse)").matches)) {
		const gesture = await page.evaluate(
			({ point, delta }) => {
				// A portalled popup can enlarge the layout viewport on mobile without
				// enlarging the visible viewport. Input must start on a visible surface.
				const viewport = visualViewport
				const left = viewport?.offsetLeft ?? 0
				const top = viewport?.offsetTop ?? 0
				const width = viewport?.width ?? innerWidth
				const height = viewport?.height ?? innerHeight
				const reachable = ({ x, y }: { x: number; y: number }) => {
					const hit = document.elementFromPoint(x, y)
					return (
						x > left &&
						x < left + width &&
						y > top &&
						y < top + height &&
						hit &&
						!hit.closest(
							'[role="menu"], [role="listbox"], [data-slot="popover-content"], [data-radix-popper-content-wrapper], input, textarea, select, [contenteditable="true"]',
						) &&
						!hit
							.closest('[role="presentation"]')
							?.querySelector('[data-slot="select-content"]')
					)
				}
				if (!reachable(point)) {
					const points = [left + width - 20, left + 20, left + width / 2].flatMap(x =>
						[top + height - 60, top + height / 2, top + 100].map(y => ({ x, y })),
					)
					const replacement = points.find(reachable)
					if (!replacement)
						throw new Error("No visible scroll surface outside popup and native inputs")
					point = replacement
				}
				let direction = Math.sign(delta)
				const room = (sign: number) =>
					sign > 0 ? point.y - top - 20 : top + height - point.y - 20
				const scrolling = document.scrollingElement
				const oppositeScroll =
					direction > 0
						? (scrolling?.scrollTop ?? 0)
						: (scrolling?.scrollHeight ?? 0) -
							(scrolling?.clientHeight ?? 0) -
							(scrolling?.scrollTop ?? 0)
				// A focused trigger can sit against a viewport edge. Reverse the
				// preferred swipe only when the page can genuinely scroll that way.
				if (room(direction) <= 30 && room(-direction) > 30 && oppositeScroll > 10)
					direction *= -1
				return {
					...point,
					direction,
					distance: Math.min(Math.abs(delta), room(direction)),
				}
			},
			{ point, delta },
		)
		expect(
			gesture.distance,
			"Visible surface needs room for a real touch swipe",
		).toBeGreaterThan(30)
		const session = await page.context().newCDPSession(page)
		try {
			// Chrome's synthesized gesture produces no touchmove in this emulation.
			// Dispatch an actual finger sequence, spaced like frames, so native
			// scrolling and popup dismissal handlers both receive trusted input.
			await session.send("Input.dispatchTouchEvent", {
				type: "touchStart",
				touchPoints: [{ x: gesture.x, y: gesture.y, id: 1 }],
			})
			for (let step = 1; step <= 12; step++) {
				await session.send("Input.dispatchTouchEvent", {
					type: "touchMove",
					touchPoints: [
						{
							x: gesture.x,
							y: gesture.y - (gesture.direction * gesture.distance * step) / 12,
							id: 1,
						},
					],
				})
				await new Promise(resolve => setTimeout(resolve, 16))
			}
		} finally {
			try {
				await session.send("Input.dispatchTouchEvent", {
					type: "touchEnd",
					touchPoints: [],
				})
			} finally {
				await session.detach()
			}
		}
	} else {
		await page.mouse.move(point.x, point.y)
		await page.mouse.wheel(0, delta)
	}
}

export async function expectDropdownPreservesScroll(
	page: Page,
	open: () => Promise<void>,
	scrollContainer?: Locator,
) {
	const container = scrollContainer ?? page.locator("html")
	const read = () =>
		container.evaluate(element => ({
			overflow: [document.documentElement, document.body, element].map(node => {
				const style = getComputedStyle(node)
				return [style.overflowX, style.overflowY, style.paddingRight, style.marginRight]
			}),
			width: element.clientWidth,
			top: element.scrollTop,
			max: element.scrollHeight - element.clientHeight,
		}))
	const before = await read()
	expect(before.max, "Fixture needs a genuinely scrollable page/container").toBeGreaterThan(20)
	const previous = await page.evaluateHandle(
		() =>
			new Set(
				[...document.querySelectorAll('[role="menu"], [role="listbox"]')].filter(
					element => {
						const box = element.getBoundingClientRect()
						return (
							box.width > 0 &&
							box.height > 0 &&
							getComputedStyle(element).visibility !== "hidden"
						)
					},
				),
			),
	)
	let popup: JSHandle<Element | undefined> | undefined
	try {
		await open()
		await expect
			.poll(
				() =>
					previous.evaluate(
						existing =>
							[
								...document.querySelectorAll('[role="menu"], [role="listbox"]'),
							].filter(element => {
								const box = element.getBoundingClientRect()
								return (
									!existing.has(element) &&
									box.width > 0 &&
									box.height > 0 &&
									getComputedStyle(element).visibility !== "hidden"
								)
							}).length,
					),
				{
					message:
						"The intended dropdown must open; an existing unrelated listbox cannot satisfy this check",
				},
			)
			.toBeGreaterThan(0)
		popup = await previous.evaluateHandle(existing =>
			[...document.querySelectorAll('[role="menu"], [role="listbox"]')].find(element => {
				const box = element.getBoundingClientRect()
				return (
					!existing.has(element) &&
					box.width > 0 &&
					box.height > 0 &&
					getComputedStyle(element).visibility !== "hidden"
				)
			}),
		)
	} finally {
		await previous.dispose()
	}
	await expect(
		page.locator('[role="menu"]:visible, [role="listbox"]:visible').last(),
	).toBeVisible()
	const after = await read()
	expect(
		after.overflow,
		"Dropdown must preserve existing overflow and scrollbar compensation",
	).toEqual(before.overflow)
	expect(after.width, "Dropdown must preserve scrollbar width").toBe(before.width)
	const box = await container.boundingBox()
	expect(box).not.toBeNull()
	// Base UI dismisses a touch swipe outside Select after 10px. Starting on
	// its non-native trigger still exercises page scrolling with the popup open.
	// Menu triggers toggle on pointerdown, so swipe a background surface instead.
	const point = await container.evaluate((element, popup) => {
		const rect = element.getBoundingClientRect()
		const viewport = visualViewport
		const left = viewport?.offsetLeft ?? 0
		const top = viewport?.offsetTop ?? 0
		const width = viewport?.width ?? innerWidth
		const height = viewport?.height ?? innerHeight
		const reachable = (x: number, y: number) => {
			const hit = document.elementFromPoint(x, y)
			return (
				x > left &&
				x < left + width &&
				y > top &&
				y < top + height &&
				hit &&
				element.contains(hit) &&
				!hit.closest(
					'[role="menu"], [role="listbox"], [data-slot="popover-content"], [data-radix-popper-content-wrapper], input, textarea, select, [contenteditable="true"]',
				) &&
				!hit.closest('[role="presentation"]')?.querySelector('[data-slot="select-content"]')
			)
		}
		if (matchMedia("(pointer: coarse)").matches && popup?.getAttribute("role") === "listbox") {
			for (const trigger of document.querySelectorAll(
				'button[aria-expanded="true"][aria-controls]',
			)) {
				if (document.getElementById(trigger.getAttribute("aria-controls") ?? "") !== popup)
					continue
				const box = trigger.getBoundingClientRect()
				const x = box.x + box.width / 2
				const y = box.y + box.height / 2
				if (reachable(x, y)) return { x, y }
			}
		}
		for (const x of [
			Math.min(rect.right, left + width) - 20,
			Math.max(rect.left, left) + 20,
			left + width / 2,
		]) {
			for (const y of [top + height - 60, top + height / 2, top + 100]) {
				if (reachable(x, y)) return { x, y }
			}
		}
		return null
	}, popup)
	expect(point, "Scrollable surface outside the dropdown must remain reachable").not.toBeNull()
	if (!point) throw new Error("No reachable scroll surface outside the dropdown")
	await scrollWithInput(page, point, after.top < after.max / 2 ? 300 : -300)
	await expect
		.poll(async () => Math.abs((await read()).top - after.top), {
			message: "Pointer input must still scroll the page with the dropdown open",
		})
		.toBeGreaterThan(10)
	expect(
		await popup?.evaluate(
			element =>
				element?.isConnected &&
				element.getBoundingClientRect().height > 0 &&
				getComputedStyle(element).visibility !== "hidden",
		),
		"The same dropdown remains open during page scrolling",
	).toBe(true)
	await popup?.dispose()
}
