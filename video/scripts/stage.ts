// The stage: a 1920×1080 page that frames the real app in an iframe. The camera (a CSS transform on
// the iframe) and the highlight rings live here, outside the app, and follow its elements live, so
// after any UI change only the story's locators matter: positions are measured, never stored.
//
// The recorder serves this page on the app's own origin (`/__guide-stage`), so the stage can read
// the iframe's layout. Open it headed (`bun video/scripts/record.ts --headed`) to watch a take
// being authored against the current build.

export const STAGE = { width: 1920, height: 1080 }
/** The app's own viewport inside the stage: 16:9, shown at 1.33× when the camera is wide. */
export const APP = { width: 1440, height: 810 }

export type RingAudit = {
	take: string
	key: string
	occurrence: number
	mode: "control" | "region"
	minVisibility: number
	belowMs: number
	detachedIntervals: { from: number; to: number | null }[]
	hiddenIntervals: { from: number; to: number | null }[]
	worstMs: number
	cause: string
	startMs: number
	endMs: number
	reason: string
}

export const stagePath = "/__guide-stage"

export function stageHtml(appUrl: string) {
	return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
	html, body { margin: 0; width: ${STAGE.width}px; height: ${STAGE.height}px; overflow: hidden; background: #0b0b10; }
	#camera {
		position: absolute; left: 0; top: 0;
		width: ${APP.width}px; height: ${APP.height}px;
		transform-origin: 0 0;
		transform: scale(${STAGE.width / APP.width});
		will-change: transform;
	}
	#app { width: 100%; height: 100%; border: 0; display: block; background: #0b0b10; }
	#rings { position: absolute; inset: 0; pointer-events: none; }
	.ring {
		position: absolute; box-sizing: border-box; border-radius: 14px;
		border: 3px solid rgb(165 148 255);
		box-shadow: 0 0 0 6px rgb(165 148 255 / 0.18), 0 0 32px rgb(165 148 255 / 0.35);
		opacity: 0; transition: opacity 260ms ease-out;
	}
	.ring.on { opacity: 1; }
</style>
</head>
<body>
<div id="camera"><iframe id="app" name="app" src="${appUrl}"></iframe></div>
<div id="rings"></div>
<script>
(() => {
	const camera = document.getElementById("camera")
	const frame = document.getElementById("app")
	const rings = document.getElementById("rings")
	const wide = ${STAGE.width / APP.width}
	let view = { x: 0, y: 0, s: wide }
	let anim = null
	const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
	const apply = v => { camera.style.transform = "translate(" + v.x + "px," + v.y + "px) scale(" + v.s + ")" }

	/** Moves the camera so the app-space box fills the stage at most at \`max\` zoom. */
	function frameBox(box, max, ms) {
		let to = { x: 0, y: 0, s: wide }
		if (box) {
			const pad = 1.18
			const s = Math.max(wide, Math.min(max, ${STAGE.width} / (box.w * pad), ${STAGE.height} / (box.h * pad)))
			const cx = box.x + box.w / 2, cy = box.y + box.h / 2
			const x = Math.min(0, Math.max(${STAGE.width} - ${APP.width} * s, ${STAGE.width} / 2 - cx * s))
			const y = Math.min(0, Math.max(${STAGE.height} - ${APP.height} * s, ${STAGE.height} / 2 - cy * s))
			to = { x, y, s }
		}
		const from = { ...view }
		const start = performance.now()
		cancelAnimationFrame(anim)
		return new Promise(done => {
			const step = now => {
				const k = ease(Math.min(1, (now - start) / ms))
				view = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k, s: from.s + (to.s - from.s) * k }
				apply(view)
				if (k < 1) anim = requestAnimationFrame(step)
				else done()
			}
			anim = requestAnimationFrame(step)
		})
	}

	// Geometry stays in iframe coordinates until the final camera transform.
	const rect = r => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom })
	const area = r => Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top)
	const intersect = (a, b) => ({ left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) })
	const label = el => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "")
	const subtract = (r, cut) => {
		const i = intersect(r, cut)
		if (!area(i)) return [r]
		return [
			{ ...r, bottom: i.top }, { ...r, top: i.bottom },
			{ left: r.left, right: i.left, top: i.top, bottom: i.bottom },
			{ left: i.right, right: r.right, top: i.top, bottom: i.bottom },
		].filter(r => area(r) > 0)
	}
	// Sticky and fixed elements, re-listed at most every half second: scanning every element
	// on every frame would slow the recording down.
	let overlayCache = { at: 0, stale: true, doc: null, list: [] }
	let watched = null
	function overlays(win) {
		// A dialog or sheet opening must count at once, so DOM changes drop the cached list.
		if (watched !== win.document) {
			watched = win.document
			// Only mounts matter (a dialog or sheet appearing); style changes happen every frame.
			new win.MutationObserver(() => { overlayCache.stale = true }).observe(win.document, { childList: true, subtree: true })
		}
		const age = performance.now() - overlayCache.at
		if (overlayCache.doc === win.document && (overlayCache.stale ? age < 150 : age < 1000)) return overlayCache.list.filter(item => item.isConnected)
		overlayCache = { at: performance.now(), stale: false, doc: win.document, list: [...win.document.querySelectorAll("*")].filter(item => /^(sticky|fixed)$/.test(win.getComputedStyle(item).position)) }
		return overlayCache.list
	}
	function measure(el) {
		const win = frame.contentWindow
		const causes = []
		const r = rect(el.getBoundingClientRect())
		let clip = { left: 0, top: 0, right: win.innerWidth, bottom: win.innerHeight }
		let hidden = !el.isConnected || !area(r)
		for (let p = el; p; p = p.parentElement) {
			const css = win.getComputedStyle(p)
			if (css.display === "none" || css.visibility === "hidden" || css.visibility === "collapse" || Number(css.opacity) === 0) hidden = true
			if (p === el) continue
			const box = p.getBoundingClientRect()
			// client dimensions exclude borders and scrollbars, retaining padding.
			const sx = p.offsetWidth ? box.width / p.offsetWidth : 1
			const sy = p.offsetHeight ? box.height / p.offsetHeight : 1
			const inner = { left: box.left + p.clientLeft * sx, top: box.top + p.clientTop * sy }
			inner.right = inner.left + p.clientWidth * sx
			inner.bottom = inner.top + p.clientHeight * sy
			const before = area(intersect(r, clip))
			if (/^(hidden|auto|scroll|clip)$/.test(css.overflowX)) { clip.left = Math.max(clip.left, inner.left); clip.right = Math.min(clip.right, inner.right) }
			if (/^(hidden|auto|scroll|clip)$/.test(css.overflowY)) { clip.top = Math.max(clip.top, inner.top); clip.bottom = Math.min(clip.bottom, inner.bottom) }
			if (area(intersect(r, clip)) < before) causes.push(label(p) + " overflow " + css.overflowX + "/" + css.overflowY)
		}
		if (area(intersect(r, { left: 0, top: 0, right: win.innerWidth, bottom: win.innerHeight })) < area(r)) causes.push("iframe viewport")
		const before = area(intersect(r, clip))
		clip = intersect(clip, { left: -view.x / view.s, top: -view.y / view.s, right: (${STAGE.width} - view.x) / view.s, bottom: (${STAGE.height} - view.y) / view.s })
		if (area(intersect(r, clip)) < before) causes.push("camera / stage viewport")
		let regions = area(clip) ? [clip] : []
		// Sticky/fixed siblings can paint over a target without clipping its layout box.
		for (const overlay of overlays(win)) {
			if (overlay === el || overlay.contains(el) || el.contains(overlay)) continue
			const css = win.getComputedStyle(overlay)
			if (css.visibility !== "visible" || Number(css.opacity) === 0) continue
			const box = rect(overlay.getBoundingClientRect())
			const overlap = intersect(intersect(r, clip), box)
			if (!area(overlap)) continue
			const stack = win.document.elementsFromPoint((overlap.left + overlap.right) / 2, (overlap.top + overlap.bottom) / 2)
			const front = stack.find(item => overlay.contains(item) || el.contains(item))
			if (!front || !overlay.contains(front)) continue
			regions = regions.flatMap(part => subtract(part, box))
			causes.push(label(overlay) + " " + css.position + " overlay")
		}
		const visible = regions.map(part => intersect(r, part)).filter(part => area(part) > 0)
		const fraction = hidden ? 0 : Math.min(1, visible.reduce((sum, part) => sum + area(part), 0) / (area(r) || 1))
		if (hidden) causes.push(el.isConnected ? "hidden" : "detached")
		return { r, regions, visible, fraction, hidden, detached: !el.isConnected, cause: causes.join("; ") || "none" }
	}

	const targets = new Map()
	let reports = [], serial = 0, take = "", recording = false, started = performance.now()
	function sample(item, now) {
		const geometry = measure(item.el)
		const audit = item.audit
		const dt = now - item.last
		if (item.previous.fraction < 0.999) audit.belowMs += dt
		for (const state of ["detached", "hidden"]) {
			if (geometry[state] && !item.previous[state]) audit[state + "Intervals"].push({ from: now - started, to: null })
			if (!geometry[state] && item.previous[state]) audit[state + "Intervals"].at(-1).to = now - started
		}
		if (geometry.fraction < audit.minVisibility) { audit.minVisibility = geometry.fraction; audit.worstMs = now - started; audit.cause = geometry.cause }
		item.last = now
		item.previous = geometry
		const visible = geometry.visible
		item.wrapper.style.display = geometry.fraction > 0 ? "" : "none"
		if (visible.length) {
			const box = { left: Math.min(...visible.map(r => r.left)), top: Math.min(...visible.map(r => r.top)), right: Math.max(...visible.map(r => r.right)), bottom: Math.max(...visible.map(r => r.bottom)) }
			const pad = 6 * view.s
			// Pull the ring inside the area that shows the target, so a target flush with a scroll
			// area's edge (a tab, a card in a carousel, a page cut by the viewport) keeps its whole outline.
			const room = geometry.regions.reduce((best, part) => (area(intersect(box, part)) > area(intersect(box, best)) ? part : best), geometry.regions[0])
			const edge = { left: view.x + room.left * view.s, top: view.y + room.top * view.s, right: view.x + room.right * view.s, bottom: view.y + room.bottom * view.s }
			const left = Math.max(edge.left, view.x + box.left * view.s - pad), top = Math.max(edge.top, view.y + box.top * view.s - pad)
			const right = Math.min(edge.right, view.x + box.right * view.s + pad), bottom = Math.min(edge.bottom, view.y + box.bottom * view.s + pad)
			Object.assign(item.ring.style, { left: left + "px", top: top + "px", width: (right - left) + "px", height: (bottom - top) + "px" })
			// Clip the wrapper, so the ring's shadow obeys every boundary too.
			item.wrapper.style.clipPath = 'path("' + geometry.regions.map(r => {
				const l = view.x + r.left * view.s, t = view.y + r.top * view.s, right = view.x + r.right * view.s, bottom = view.y + r.bottom * view.s
				return "M" + l + " " + t + "H" + right + "V" + bottom + "H" + l + "Z"
			}).join(" ") + '")'
		}
		const offender = audit.mode === "control" ? geometry.fraction < 0.999 : geometry.fraction === 0
		if (offender && !item.notified) {
			item.notified = true
			if (recording) void window.guideRingFailure?.({ ...audit })
		}
	}
	function close(key, reason) {
		const item = targets.get(key)
		if (!item) return
		const now = performance.now()
		sample(item, now)
		for (const state of ["detached", "hidden"]) if (item.previous[state]) item.audit[state + "Intervals"].at(-1).to = now - started
		item.audit.endMs = now - started
		item.audit.reason = reason
		reports.push(item.audit)
		item.ring.classList.remove("on")
		setTimeout(() => item.wrapper.remove(), 300)
		targets.delete(key)
	}
	function sync() {
		const live = frame.contentWindow?.__guideTargets || new Map()
		for (const [key, item] of targets) if (live.get(key) !== item.target) close(key, "unring / navigation / replacement")
		for (const [key, target] of live) {
			let item = targets.get(key)
			if (!item) {
				const wrapper = document.createElement("div"), ring = document.createElement("div")
				wrapper.style.cssText = "position:absolute;inset:0;pointer-events:none"
				ring.className = "ring"
				wrapper.appendChild(ring); rings.appendChild(wrapper)
				const now = performance.now()
				item = { el: target.el, target, wrapper, ring, last: now, previous: { fraction: 1, detached: false, hidden: false }, notified: false,
					audit: { take, key, occurrence: ++serial, mode: target.mode, minVisibility: 1, belowMs: 0, detachedIntervals: [], hiddenIntervals: [], worstMs: now - started, cause: "none", startMs: now - started } }
				targets.set(key, item)
				requestAnimationFrame(() => ring.classList.add("on"))
			}
			sample(item, performance.now())
		}
	}
	function flush(reason) { sync(); for (const key of targets.keys()) close(key, reason); frame.contentWindow?.__guideTargets?.clear() }
	function track() { sync(); requestAnimationFrame(track) }
	requestAnimationFrame(track)
	frame.addEventListener("load", () => { for (const key of targets.keys()) close(key, "navigation") })

	window.guideStage = {
		frameBox, measure, sync, flush,
		startAudit: (name, live) => { flush("begin"); reports = []; take = name; recording = live; started = performance.now() },
		/** Ends the audit of rings on an element about to be pressed: clicking it may close or replace it. */
		release: el => {
			const live = frame.contentWindow?.__guideTargets
			for (const [key, item] of targets) if (item.el === el || item.el.contains(el) || el.contains(item.el)) { close(key, "pressed"); live?.delete(key) }
		},
		drainAudit: reason => { flush(reason); const result = reports; reports = []; return result },
		/** Maps an app-space point to the stage, for the driver's mouse. */
		toStage: (x, y) => [view.x + x * view.s, view.y + y * view.s],
	}
})()
</script>
</body>
</html>`
}

/** Runs in every frame. The app frame draws a cursor that follows real mouse events. */
export function installCursor() {
	if (window.top === window) return
	const draw = () => {
		if (document.getElementById("guide-cursor")) return
		const cursor = document.createElement("div")
		cursor.id = "guide-cursor"
		cursor.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24"><path d="M5 3 L5 19.5 L9.5 15.5 L12.4 21.6 L15.3 20.3 L12.5 14.3 L18.6 14.3 Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`
		Object.assign(cursor.style, {
			position: "fixed",
			left: "0",
			top: "0",
			zIndex: "2147483647",
			pointerEvents: "none",
			filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.45))",
			transformOrigin: "5px 3px",
			transition: "scale 90ms ease-out",
		})
		const saved = JSON.parse(sessionStorage.getItem("guide-cursor") ?? "[1500,840]")
		cursor.style.translate = `${saved[0] - 5}px ${saved[1] - 3}px`
		document.documentElement.appendChild(cursor)
		addEventListener(
			"mousemove",
			event => {
				cursor.style.translate = `${event.clientX - 5}px ${event.clientY - 3}px`
				sessionStorage.setItem("guide-cursor", JSON.stringify([event.clientX, event.clientY]))
			},
			true,
		)
		addEventListener(
			"mousedown",
			event => {
				cursor.style.scale = "0.85"
				const ring = document.createElement("div")
				Object.assign(ring.style, {
					position: "fixed",
					left: `${event.clientX - 22}px`,
					top: `${event.clientY - 22}px`,
					width: "44px",
					height: "44px",
					borderRadius: "999px",
					border: "3px solid rgba(165,148,255,0.95)",
					zIndex: "2147483646",
					pointerEvents: "none",
					transition: "transform 380ms ease-out, opacity 380ms ease-out",
					transform: "scale(0.3)",
				})
				document.documentElement.appendChild(ring)
				requestAnimationFrame(() => {
					ring.style.transform = "scale(1)"
					ring.style.opacity = "0"
				})
				setTimeout(() => ring.remove(), 420)
			},
			true,
		)
		addEventListener("mouseup", () => (cursor.style.scale = "1"), true)
		addEventListener("beforeunload", () => {
			;(window.parent as unknown as { guideStage?: { flush: (reason: string) => void } }).guideStage?.flush("navigation")
		})
		const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
		Object.assign(window, {
			guideScroll: (dy: number, ms: number) =>
				new Promise<void>(done => {
					const from = window.scrollY
					const start = performance.now()
					const step = (time: number) => {
						const t = Math.min(1, (time - start) / ms)
						window.scrollTo(0, from + dy * ease(t))
						if (t < 1) requestAnimationFrame(step)
						else done()
					}
					requestAnimationFrame(step)
				}),
		})
	}
	if (document.readyState === "loading") addEventListener("DOMContentLoaded", draw)
	else draw()
}
