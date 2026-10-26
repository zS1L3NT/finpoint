// Publishes the rendered film to `public/guide`: a web-sized MP4, its chapter marks, a poster and
// one still per beat for the Help articles (taken where the beat's picture is complete).
//   bun video/scripts/publish.ts
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
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

// Stills come from the composition, not the render, so the Help articles show the picture without
// the film's burned-in captions: a copy of the project without its caption tracks is snapshotted.
const shots: { seconds: number; file: string }[] = [{ seconds: 1.2, file: resolve(out, "poster.jpg") }]
for (const chapter of timeline.chapters)
	for (const segment of chapter.segments) {
		const end = (chapter.startFrame + segment.from + segment.durationInFrames) / fps
		shots.push({ seconds: Math.max(0, end - 0.6), file: resolve(out, "stills", `${chapter.id}-${segment.id}.jpg`) })
	}
const video = resolve(root, "video")
const project = mkdtempSync(resolve(tmpdir(), "finpoint-stills-"))
try {
	for (const entry of ["assets", "compositions", "look.css", "hyperframes.json", "package.json", "node_modules"])
		symlinkSync(resolve(video, entry), resolve(project, entry))
	const index = readFileSync(resolve(video, "index.html"), "utf8")
	writeFileSync(
		resolve(project, "index.html"),
		index.split("\n").filter(line => !line.includes('data-track-kind="captions"')).join("\n"),
	)
	const frames = resolve(project, "frames")
	const at = shots.map(shot => shot.seconds.toFixed(3)).join(",")
	const snapshot = spawnSync(
		"npx",
		["--yes", "hyperframes@0.8.203", "snapshot", project, "--at", at, "--no-end", "-o", frames],
		{ cwd: video, stdio: "inherit" },
	)
	if (snapshot.status !== 0) throw new Error("hyperframes snapshot failed")
	// Named frame-NN-at-…, in the order of `--at`.
	const pngs = readdirSync(frames)
		.filter(name => name.startsWith("frame-") && name.endsWith(".png"))
		.sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]))
	if (pngs.length !== shots.length) throw new Error(`Expected ${shots.length} stills, got ${pngs.length}`)
	shots.forEach((shot, index) =>
		run(["-i", resolve(frames, pngs[index] as string), "-vf", "scale=1280:-2", "-q:v", "4", shot.file]),
	)
} finally {
	rmSync(project, { recursive: true, force: true })
}
console.log(`Published the film, its chapters and ${shots.length - 1} stills to public/guide.`)
