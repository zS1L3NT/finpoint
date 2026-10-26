// Publishes the rendered film to `public/guide`: a web-sized MP4, its chapter marks, a poster and
// one still per beat for the Help articles (taken where the beat's picture is complete).
//   bun video/scripts/publish.ts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { root, runFfmpeg } from "./tools"

const fps = 30
const source = resolve(root, "video/renders/finpoint-guide.mp4")
const out = resolve(root, "public/guide")
mkdirSync(resolve(out, "stills"), { recursive: true })

type Segment = { id: string; from: number; durationInFrames: number }
type Chapter = { id: string; title: string; startFrame: number; durationInFrames: number; segments: Segment[] }
const timeline: { chapters: Chapter[] } = JSON.parse(
	readFileSync(resolve(root, "src/lib/guide-video-timeline.json"), "utf8"),
)

function run(args: string[]) {
	const result = runFfmpeg(["-hide_banner", "-loglevel", "error", "-y", ...args])
	if (result.status !== 0) throw new Error(`ffmpeg: ${result.stderr}`)
}

// Screen content compresses well: 1080p H.264 at a modest quality stays small enough to ship.
run([
	"-i", source,
	"-c:v", "libx264", "-preset", "slow", "-crf", "26", "-tune", "stillimage", "-pix_fmt", "yuv420p",
	"-c:a", "aac", "-b:a", "96k", "-ac", "1",
	"-movflags", "+faststart",
	resolve(out, "finpoint-guide.mp4"),
])

const timestamp = (seconds: number) => {
	const ms = Math.round(seconds * 1000)
	const pad = (value: number, size = 2) => String(value).padStart(size, "0")
	return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)}.${pad(ms % 1000, 3)}`
}
writeFileSync(
	resolve(out, "chapters.vtt"),
	`WEBVTT\n\n${timeline.chapters
		.map(chapter => `${timestamp(chapter.startFrame / fps)} --> ${timestamp((chapter.startFrame + chapter.durationInFrames) / fps)}\n${chapter.title}`)
		.join("\n\n")}\n`,
)

const still = (seconds: number, file: string) =>
	run(["-ss", seconds.toFixed(3), "-i", source, "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "4", file])
still(1.2, resolve(out, "poster.jpg"))
let count = 0
for (const chapter of timeline.chapters)
	for (const segment of chapter.segments) {
		const end = (chapter.startFrame + segment.from + segment.durationInFrames) / fps
		still(Math.max(0, end - 0.6), resolve(out, "stills", `${chapter.id}-${segment.id}.jpg`))
		count++
	}
console.log(`Published the film, its chapters and ${count} stills to public/guide.`)
