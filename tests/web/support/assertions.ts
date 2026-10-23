import { expect, type JSHandle, type Locator, type Page } from "@playwright/test"

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
