// The stage: a 1920×1080 page that frames the real app in an iframe. The camera (a CSS transform on
// the iframe) and the highlight rings live here, outside the app, and follow its elements live, so
// after any UI change only the story's locators matter: positions are measured, never stored.
//
// The recorder serves this page on the app's own origin (`/__guide-stage`), so the stage can read
// the iframe's layout. Open it headed (`bun video/scripts/record.ts --headed`) to watch a take
// being authored against the current build.

export const STAGE = { width: 1920, height: 1080 }
/** The app's own viewport inside the stage: 16:9, shown at 1.2× when the camera is wide. */
export const APP = { width: 1600, height: 900 }

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
		position: absolute; border-radius: 14px;
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

	// Highlights follow their element every frame, through the camera.
	const targets = new Map()
	function track() {
		const win = frame.contentWindow
		const live = (win && win.__guideTargets) || new Map()
		for (const [key, ring] of targets) if (!live.has(key)) { ring.classList.remove("on"); setTimeout(() => ring.remove(), 300); targets.delete(key) }
		for (const [key, el] of live) {
			let ring = targets.get(key)
			if (!ring) { ring = document.createElement("div"); ring.className = "ring"; rings.appendChild(ring); targets.set(key, ring); requestAnimationFrame(() => ring.classList.add("on")) }
			const r = el.isConnected ? el.getBoundingClientRect() : null
			if (!r || !r.width) { ring.style.opacity = "0"; continue }
			ring.style.opacity = ""
			const pad = 6
			ring.style.left = (view.x + (r.left - pad) * view.s) + "px"
			ring.style.top = (view.y + (r.top - pad) * view.s) + "px"
			ring.style.width = ((r.width + pad * 2) * view.s) + "px"
			ring.style.height = ((r.height + pad * 2) * view.s) + "px"
		}
		requestAnimationFrame(track)
	}
	requestAnimationFrame(track)

	window.guideStage = {
		frameBox,
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
