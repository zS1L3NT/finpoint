// Isolate the three proof scenes with the exact per-mount cues from the composed film.
// Run from any directory: bun video/scripts/visual-proof.ts. No narration or takes are required.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"

const video = new URL("../", import.meta.url)
const film = readFileSync(new URL("index.html", video), "utf8")
for (const name of ["model-diagram", "pending-reasons", "dashboard-source"]) {
	const mount = film.match(new RegExp(`<div[^>]+scenes/${name}\\.html[^>]+>`))![0]
	const duration = mount.match(/data-duration="([^"]+)"/)![1]
	const values = mount.match(/data-variable-values='([^']+)'/)![1]
	const folder = new URL(`.hyperframes/visual-proof/${name}/`, video)
	mkdirSync(new URL("compositions/scenes/", folder), { recursive: true })
	mkdirSync(new URL("assets/vendor/", folder), { recursive: true })
	cpSync(new URL(`compositions/scenes/${name}.html`, video), new URL(`compositions/scenes/${name}.html`, folder))
	cpSync(new URL("node_modules/gsap/dist/gsap.min.js", video), new URL("assets/vendor/gsap.min.js", folder))
	writeFileSync(new URL("index.html", folder), `<!doctype html>
<html><head><script src="assets/vendor/gsap.min.js"></script><style>body { margin: 0; background: #08080a; }</style></head><body>
<div id="root" data-composition-id="proof" data-width="1920" data-height="1080" data-duration="${duration}">
<div id="scene" class="clip" data-composition-id="${name}" data-composition-src="compositions/scenes/${name}.html" data-start="0" data-duration="${duration}" data-width="1920" data-height="1080" data-variable-values='${values}'></div>
</div><script>const tl = gsap.timeline({ paused: true }); tl.set({}, {}, ${duration}); window.__timelines = window.__timelines || {}; window.__timelines.proof = tl;</script></body></html>`)
}
