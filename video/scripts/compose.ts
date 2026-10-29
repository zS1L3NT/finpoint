// Writes the HyperFrames film from its sources: the guide's narration timeline, the recorded takes
// (`video/takes.json`) and the illustrated scenes (`video/scenes.ts`). Run from the repository root:
//   bun video/scripts/compose.ts
// It regenerates `video/index.html` and `video/compositions/captions.html`. Scenes, the title card
// and the look live in hand-written files and are only mounted from here.
//
// Every beat is shown by a take or a scene. Consecutive beats shown by the same take or scene are
// one run: the picture stays continuous across them, and only runs crossfade into each other.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { guideChapters } from "../../src/lib/guide"
import { levelColor } from "../../src/lib/guide-theme"
import { type CueRef, scenes } from "../scenes"
import type { TakeInfo } from "./director"
import { root } from "./tools"

const fps = 30
const video = resolve(root, "video")
const FADE = 0.5
/** A scene starts this long before its first word, so it is settled when the word lands. */
const SCENE_LEAD = 0.35

type Segment = {
	id: string
	text: string
	from: number
	durationInFrames: number
	audio: string
	titleEnd?: number
	step?: number
	steps?: number
}
type Chapter = { id: string; title: string; group: string; startFrame: number; durationInFrames: number; segments: Segment[] }
const timeline: { durationInFrames: number; chapters: Chapter[] } = JSON.parse(
	readFileSync(resolve(root, "src/lib/guide-video-timeline.json"), "utf8"),
)
const cues: Record<string, number[]> = JSON.parse(readFileSync(resolve(root, "src/lib/guide-video-cues.json"), "utf8"))
const takes: Record<string, TakeInfo> = existsSync(resolve(video, "takes.json"))
	? JSON.parse(readFileSync(resolve(video, "takes.json"), "utf8"))
	: {}

const words = (text: string) => text.split(/\s+/).filter(Boolean)
const bare = (word: string) => word.toLowerCase().replace(/[^\p{L}\p{N}$.%]/gu, "").replace(/\.$/, "")
const round = (value: number) => Math.round(value * 1000) / 1000
const attr = (value: unknown) => JSON.stringify(value).replaceAll("&", "&amp;").replaceAll("'", "&#39;")
const escape = (text: string) =>
	text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")

/** Seconds into the chapter when `word` is said in `beat` (its first word when omitted). */
function wordTime(chapter: Chapter, [beat, word, nth = 0]: CueRef) {
	const segment = chapter.segments.find(item => item.id === beat)
	if (!segment) throw new Error(`${chapter.id}: no beat ${beat}`)
	const times = cues[segment.audio] ?? []
	let index = 0
	if (word) {
		const target = words(word).map(bare)
		const spoken = words(segment.text).map(bare)
		const hits = spoken.map((_, i) => i).filter(i => target.every((part, k) => spoken[i + k] === part))
		const hit = hits[nth]
		if (hit === undefined) throw new Error(`${chapter.id}/${beat}: "${word}" is not said`)
		index = hit
	}
	return (segment.from + (times[index] ?? 0)) / fps
}

type Run =
	| { kind: "take"; id: string; beats: string[]; start: number; end: number }
	| { kind: "scene"; id: string; scene: string; beats: string[]; start: number; end: number; values: Record<string, unknown> }

type Owner =
	| { kind: "take"; id: string; key: string }
	| { kind: "scene"; id: string; scene: string; values: Record<string, unknown>; key: string }

let missing = 0
const clips: string[] = []
const audio: string[] = []
const fades: string[] = []
const captionGroups: { chapter: string; id: string; start: number; end: number; text: string }[] = []
const captionHosts: string[] = []
const chapterMarks: { id: string; title: string; start: number }[] = []

guideChapters.forEach((source, chapterIndex) => {
	const chapter = timeline.chapters.find(item => item.id === source.id)
	if (!chapter) throw new Error(`No narration for ${source.id}. Run narrate first.`)
	const base = chapter.startFrame / fps
	const end = base + chapter.durationInFrames / fps
	const firstSegment = chapter.segments[0]
	// The card holds a full second after its title is spoken, so it can be read before it fades.
	const titleEnd = base + (firstSegment?.titleEnd ?? 1.5) + 1
	chapterMarks.push({ id: chapter.id, title: chapter.title, start: base })

	// Who shows each beat: a take, a scene, or (until one exists) the placeholder card.
	const uses = scenes[chapter.id] ?? []
	const owner = (beat: string): Owner => {
		const take = Object.entries(takes).find(([, info]) => info.chapter === chapter.id && info.beats.includes(beat))
		if (take) return { kind: "take", id: take[0], key: `take:${take[0]}` }
		const index = uses.findIndex(use => use.beats.includes(beat))
		const use = uses[index]
		if (use) return { kind: "scene", id: `${chapter.id}-${index}`, scene: use.scene, values: use.values ?? {}, key: `scene:${index}` }
		missing++
		return { kind: "scene", id: `${chapter.id}-${beat}-card`, scene: "card", values: {}, key: `card:${beat}` }
	}
	const runs: (Run & { key: string })[] = []
	for (const segment of chapter.segments) {
		const who = owner(segment.id)
		const last = runs[runs.length - 1]
		if (last && last.key === who.key) {
			last.beats.push(segment.id)
			continue
		}
		const spoken = base + segment.from / fps + (segment.titleEnd ?? 0)
		const start =
			who.kind === "take"
				? base + (takes[who.id]?.start ?? 0)
				: Math.max(base, spoken - SCENE_LEAD)
		runs.push({ ...who, beats: [segment.id], start: runs.length ? start : Math.max(start, titleEnd - FADE), end } as Run & {
			key: string
		})
	}
	runs.forEach((run, index) => {
		const next = runs[index + 1]
		run.end = next ? next.start + FADE : end
		if (run.kind === "take") {
			const info = takes[run.id]
			if (info) run.end = Math.min(run.end, base + info.start + info.duration)
		}
	})

	// The title card, then each run on top of the last.
	const titleId = `title-${chapter.id}`
	clips.push(
		`<div id="${titleId}" data-composition-id="${titleId}" data-composition-src="compositions/title.html" data-start="${round(base)}" data-duration="${round(titleEnd - base + FADE)}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080" data-variable-values='${attr({ number: String(chapterIndex + 1).padStart(2, "0"), title: chapter.title, level: chapter.group, tone: levelColor(chapter.group) })}' style="z-index: 1"></div>`,
	)
	runs.forEach((run, index) => {
		const id = `run-${chapter.id}-${index}`
		const duration = round(run.end - run.start)
		const z = 2 + index
		if (run.kind === "take") {
			const info = takes[run.id]
			const media = info ? round(run.start - (base + info.start)) : 0
			clips.push(
				`<video id="${id}" class="clip" src="assets/takes/${run.id}.mp4" muted playsinline data-start="${round(run.start)}" data-duration="${duration}" data-media-start="${media}" data-track-index="2" style="position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; object-fit: contain; z-index: ${z}"></video>`,
			)
		} else {
			const cueTimes: Record<string, number> = {}
			for (const [name, ref] of Object.entries(uses.find(use => use.scene === run.scene && use.beats.includes(run.beats[0] ?? ""))?.cues ?? {}))
				cueTimes[name] = round(Math.max(0, wordTime(chapter, ref) - (run.start - base)))
			const text = run.scene === "card" ? chapter.segments.find(item => item.id === run.beats[0])?.text ?? "" : undefined
			clips.push(
				`<div id="${id}" data-composition-id="${id}" data-composition-src="compositions/scenes/${run.scene}.html" data-start="${round(run.start)}" data-duration="${duration}" data-track-index="2" data-track-kind="graphics" data-width="1920" data-height="1080" data-variable-values='${attr({ ...run.values, tone: levelColor(chapter.group), cues: JSON.stringify(cueTimes), ...(text === undefined ? {} : { text }) })}' style="z-index: ${z}"></div>`,
			)
		}
		fades.push(`tl.fromTo("#${id}", { opacity: 0 }, { opacity: 1, duration: ${FADE}, ease: "power1.inOut" }, ${round(run.start)})`)
	})

	// Narration, one clip per beat, and captions in short groups.
	for (const segment of chapter.segments) {
		const at = base + segment.from / fps
		const name = segment.audio.replace(/^narration\/|\.mp3$/g, "")
		// Alternate lanes: back-to-back clips touch, and one lane would read as overlapping.
		const lane = 10 + (audio.length % 2)
		audio.push(`<audio id="voice-${name}" class="clip" src="assets/${segment.audio}" data-start="${round(at)}" data-duration="${round(segment.durationInFrames / fps)}" data-track-index="${lane}" data-volume="1"></audio>`)
		const times = cues[segment.audio] ?? []
		const tokens = words(segment.text)
		let group: number[] = []
		const flush = (endAt: number) => {
			const first = group[0]
			const last = group[group.length - 1]
			if (first === undefined || last === undefined) return
			captionGroups.push({
				chapter: chapter.id,
				id: `cap-${name}-${first}`,
				start: round(at - base + (times[first] ?? 0) / fps - 0.05),
				end: round(endAt - base),
				text: group.map(i => tokens[i]).join(" "),
			})
			group = []
		}
		tokens.forEach((token, i) => {
			group.push(i)
			const next = times[i + 1]
			const sentenceEnd = /[.!?…]["”’)]?$/.test(token)
			const pause = next !== undefined && (next - (times[i] ?? 0)) / fps > 0.6
			if (group.length >= 7 || sentenceEnd || pause || /[,;:—]$/.test(token) && group.length >= 4 || i === tokens.length - 1) {
				const endAt = next !== undefined ? at + next / fps - 0.05 : at + segment.durationInFrames / fps - 0.3
				flush(endAt)
			}
		})
	}
	const captionsId = `captions-${chapter.id}`
	captionHosts.push(
		`<div id="${captionsId}" data-composition-id="${captionsId}" data-composition-src="compositions/captions/${chapter.id}.html" data-start="${round(base)}" data-duration="${round(end - base)}" data-track-index="9" data-track-kind="captions" data-width="1920" data-height="1080" style="z-index: 1000"></div>`,
	)
})

if (missing) console.warn(`! ${missing} beats have no take or scene yet; they show a placeholder card.`)

// ─── Captions ───────────────────────────────────────────────────────────────────────────────

const total = round(timeline.durationInFrames / fps)
mkdirSync(resolve(video, "compositions/captions"), { recursive: true })
for (const chapter of timeline.chapters) {
	const groups = captionGroups.filter(group => group.chapter === chapter.id)
	writeFileSync(
		resolve(video, `compositions/captions/${chapter.id}.html`),
		`<!-- Generated by video/scripts/compose.ts from the narration. -->
<template>
	<style>
		#root { position: absolute; inset: 0; pointer-events: none; }
		.cap { position: absolute; left: 0; right: 0; bottom: 64px; display: flex; justify-content: center; opacity: 0; }
		.cap span {
			max-width: 1500px; padding: 10px 22px; border-radius: 14px;
			background: rgb(8 8 10 / 0.78); color: #fafafa;
			font: 500 38px/1.3 Inter, sans-serif; letter-spacing: -0.01em; text-align: center;
		}
	</style>
	<div id="root" data-composition-id="captions" data-width="1920" data-height="1080">
${groups.map(group => `\t\t<div id="${group.id}" class="cap"><span>${escape(group.text)}</span></div>`).join("\n")}
	</div>
	<script>
		const tl = gsap.timeline({ paused: true })
		const groups = ${JSON.stringify(groups.map(({ id, start, end }) => [id, start, end]))}
		for (const [id, start, end] of groups) {
			tl.set("#" + id, { opacity: 1, visibility: "visible" }, start)
			tl.set("#" + id, { opacity: 0, visibility: "hidden" }, end)
		}
		tl.set({}, {}, ${round(chapter.durationInFrames / fps)})
		window.__timelines["captions"] = tl
	</script>
</template>
`,
	)
}

// ─── The film ───────────────────────────────────────────────────────────────────────────────

mkdirSync(resolve(video, "assets/vendor"), { recursive: true })
copyFileSync(resolve(video, "node_modules/gsap/dist/gsap.min.js"), resolve(video, "assets/vendor/gsap.min.js"))

writeFileSync(
	resolve(video, "index.html"),
	`<!doctype html>
<!-- Generated by video/scripts/compose.ts from the guide, its narration and the recorded takes. -->
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=1920, height=1080" />
	<script src="assets/vendor/gsap.min.js"></script>
	<link rel="stylesheet" href="look.css" />
</head>
<body>
	<div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080">
		<div id="ground" class="ground"></div>
		${clips.join("\n\t\t")}
		${captionHosts.join("\n\t\t")}
		${audio.join("\n\t\t")}
	</div>
	<script>
		const tl = gsap.timeline({ paused: true })
		${fades.join("\n\t\t")}
		tl.set({}, {}, ${total})
		window.__timelines["main"] = tl
	</script>
</body>
</html>
`,
)
writeFileSync(resolve(video, "chapters.json"), `${JSON.stringify(chapterMarks, null, "\t")}\n`)
console.log(`Composed ${chapterMarks.length} chapters, ${(total / 60).toFixed(1)} minutes.`)
