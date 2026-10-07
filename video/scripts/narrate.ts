// Local, reproducible narration with Kokoro. Run from the repository root with Bun:
//   bun video/scripts/narrate.ts
// Speaks every sentence separately, lays them out with deliberate pauses, then writes the
// timeline, word cues, WebVTT captions and transcript together. Unchanged clips are reused.
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { filmChapters as guideTopics, filmSections as guideSections } from "../../src/lib/guide-video-script"

const fps = 30
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const audioDir = resolve(root, "public/guide-audio")
const cacheFile = resolve(root, "video/narration.json")

/** Voice and pacing. Changing any of these regenerates every clip. */
const voice = { voice: "af_heart", lang: "en-us", speed: 0.95 }
/** Silence, in seconds, around and between spoken parts. */
const pause = {
	leadIn: 0.2,
	afterTitle: 0.8,
	afterLabel: 0.5,
	betweenSentences: 0.38,
	betweenSections: 0.85,
	betweenChapters: 1.6,
}

const model = process.env.KOKORO_DIR ?? resolve(root, "video/.kokoro")
const python = process.env.KOKORO_PYTHON ?? resolve(model, ".venv/bin/python")
mkdirSync(audioDir, { recursive: true })

type Cached = { key: string; duration: number; parts: { start: number; end: number }[] }
const cache: Record<string, Cached> = existsSync(cacheFile)
	? JSON.parse(readFileSync(cacheFile, "utf8"))
	: {}

const ones = [
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen",
]
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

function words(value: number): string {
	if (value < 20) return ones[value] ?? ""
	if (value < 100)
		return `${tens[Math.floor(value / 10)]}${value % 10 ? ` ${ones[value % 10]}` : ""}`
	if (value < 1000)
		return `${ones[Math.floor(value / 100)]} hundred${value % 100 ? ` ${words(value % 100)}` : ""}`
	return `${words(Math.floor(value / 1000))} thousand${value % 1000 ? ` ${words(value % 1000)}` : ""}`
}

/** Written copy → what the voice should say. Amounts are spelled out so signs are never skipped. */
function spoken(text: string) {
	return text
		.replace(/([−+])?\$([\d,]+)/g, (_, sign: string | undefined, digits: string) => {
			const value = Number(digits.replaceAll(",", ""))
			const prefix = sign === "−" ? "minus " : sign === "+" ? "plus " : ""
			return `${prefix}${words(value)} ${value === 1 ? "dollar" : "dollars"}`
		})
		.replace(/(\d+)\.(\d)%/g, "$1 point $2 percent")
		.replaceAll(" + ", " plus ")
		.replaceAll(" = ", " equals ")
		.replaceAll(" → ", ", into ")
		.replaceAll(" ← ", ", and from ")
		.replaceAll("·", ".")
		.replaceAll("/", " or ")
		.replaceAll("&", "and")
		.replaceAll("CSV", "C S V")
		.replaceAll("JSON", "Jason")
		.replaceAll("DBS", "D B S")
		.replaceAll("OCBC", "O C B C")
		.replaceAll("UOB", "U O B")
		.replaceAll("PDF", "P D F")
}

const endsSentence = (token: string) => /[.?!;:]["”’)]?$/.test(token)

/** Splits copy into sentences of whitespace tokens, the same tokens the film's captions use. */
function sentences(text: string) {
	const result: string[][] = [[]]
	const tokens = text.split(/\s+/).filter(Boolean)
	tokens.forEach((token, index) => {
		result[result.length - 1]?.push(token)
		if (endsSentence(token) && index < tokens.length - 1) result.push([])
	})
	return result
}

function syllables(word: string) {
	const groups = word.toLowerCase().replace(/[^a-z]/g, "").match(/[aeiouy]+/g)
	return Math.max(1, groups?.length ?? 1)
}

/** Roughly how long a caption word takes to say, so words inside a sentence get fair shares. */
const weight = (token: string) =>
	spoken(token)
		.split(/[\s-]+/)
		.filter(Boolean)
		.reduce((sum, part) => sum + (/^[A-Z]$/.test(part) ? 1.4 : syllables(part)), 0) +
	(/[,;:]$/.test(token) ? 1 : 0)

const timestamp = (seconds: number) => {
	const milliseconds = Math.round(seconds * 1000)
	const pad = (value: number, size = 2) => String(value).padStart(size, "0")
	return `${pad(Math.floor(milliseconds / 3600000))}:${pad(Math.floor(milliseconds / 60000) % 60)}:${pad(Math.floor(milliseconds / 1000) % 60)}.${pad(milliseconds % 1000, 3)}`
}

// 1. Plan every segment: its spoken parts and the pause after each one.
const plan = guideTopics.flatMap((topic, chapterIndex) =>
	guideSections(topic).map((section, sectionIndex, all) => {
		const body = sentences(section.text)
		const last = sectionIndex === all.length - 1
		const parts = [
			...(sectionIndex === 0
				? [{ text: spoken(topic.title), pauseAfter: pause.afterTitle, words: 0 }]
				: []),
			{ text: spoken(`${section.label}.`), pauseAfter: pause.afterLabel, words: 0 },
			...body.map((tokens, index) => ({
				text: spoken(tokens.join(" ")),
				words: tokens.length,
				pauseAfter:
					index < body.length - 1
						? pause.betweenSentences
						: last && chapterIndex < guideTopics.length - 1
							? pause.betweenChapters
							: pause.betweenSections,
			})),
		]
		const file = `${topic.id}-${sectionIndex}.mp3`
		const key = JSON.stringify({ voice, pause, parts, leadIn: pause.leadIn })
		return { topic, section, sectionIndex, file, parts, body, key }
	}),
)

// 2. Speak whatever changed.
const stale = plan.filter(
	item => cache[item.file]?.key !== item.key || !existsSync(resolve(audioDir, item.file)),
)
if (stale.length) {
	if (!existsSync(python))
		throw new Error(
			`Kokoro is not set up. See video/README.md (looked for ${python}; set KOKORO_PYTHON/KOKORO_DIR).`,
		)
	const temporary = mkdtempSync(resolve(tmpdir(), "finpoint-narration-"))
	try {
		const jobFile = resolve(temporary, "job.json")
		writeFileSync(
			jobFile,
			JSON.stringify({
				...voice,
				model: resolve(model, "kokoro-v1.0.onnx"),
				voices: resolve(model, "voices-v1.0.bin"),
				segments: stale.map(item => ({
					file: resolve(audioDir, item.file),
					leadIn: pause.leadIn,
					parts: item.parts.map(({ text, pauseAfter }) => ({ text, pauseAfter })),
				})),
			}),
		)
		console.log(`Speaking ${stale.length} of ${plan.length} clips with ${voice.voice}…`)
		const result = spawnSync(python, [resolve(root, "video/scripts/tts.py"), jobFile], {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "inherit"],
			maxBuffer: 64 * 1024 * 1024,
		})
		if (result.status !== 0) throw new Error("Kokoro narration failed.")
		const spokenClips = JSON.parse(result.stdout) as (Omit<Cached, "key"> & { file: string })[]
		spokenClips.forEach((clip, index) => {
			const item = stale[index]
			if (item) cache[item.file] = { key: item.key, duration: clip.duration, parts: clip.parts }
		})
		writeFileSync(cacheFile, `${JSON.stringify(cache, null, "\t")}\n`)
	} finally {
		rmSync(temporary, { recursive: true, force: true })
	}
}

// 3. Timeline, word cues, captions and transcript, all from the measured sentence positions.
let cursor = 0
let captions = "WEBVTT\n\n"
const cues: Record<string, number[]> = {}
const chapters = guideTopics.map(topic => {
	const startFrame = cursor
	const segments = plan
		.filter(item => item.topic === topic)
		.map(item => {
			const clip = cache[item.file]
			if (!clip) throw new Error(`Missing narration for ${item.file}`)
			const durationInFrames = Math.ceil(clip.duration * fps)
			const sentenceParts = clip.parts.slice(item.parts.length - item.body.length)
			const audio = `guide-audio/${item.file}`
			cues[audio] = item.body.flatMap((tokens, index) => {
				const part = sentenceParts[index]
				if (!part) return []
				const weights = tokens.map(weight)
				const total = weights.reduce((sum, value) => sum + value, 0)
				let before = 0
				return weights.map(value => {
					const at = part.start + (before / total) * (part.end - part.start)
					before += value
					return Math.round(at * fps)
				})
			})
			const segmentStart = cursor / fps
			clip.parts.forEach((part, index) => {
				const words = item.parts[index]
				const text =
					index === 0 && item.sectionIndex === 0
						? topic.title
						: index < item.parts.length - item.body.length
							? item.section.label
							: (item.body[index - (item.parts.length - item.body.length)] ?? []).join(" ")
				if (words)
					captions += `${timestamp(segmentStart + part.start)} --> ${timestamp(segmentStart + part.end + 0.2)}\n${text}\n\n`
			})
			const segment = {
				label: item.section.label,
				text: item.section.text,
				from: cursor - startFrame,
				durationInFrames,
				audio,
			}
			cursor += durationInFrames
			return segment
		})
	console.log(`${guideTopics.indexOf(topic) + 1}/${guideTopics.length}: ${topic.title}`)
	return {
		id: topic.id,
		title: topic.title,
		group: topic.group,
		startFrame,
		durationInFrames: cursor - startFrame,
		segments,
	}
})

writeFileSync(
	resolve(root, "src/lib/guide-video-timeline.json"),
	`${JSON.stringify({ fps, width: 1920, height: 1080, durationInFrames: cursor, chapters }, null, "\t")}\n`,
)
writeFileSync(
	resolve(root, "src/lib/guide-video-cues.json"),
	`{\n${Object.entries(cues)
		.map(([audio, frames]) => `\t${JSON.stringify(audio)}: ${JSON.stringify(frames)}`)
		.join(",\n")}\n}\n`,
)
writeFileSync(resolve(root, "public/finpoint-guide.vtt"), `${captions.trimEnd()}\n`)
writeFileSync(
	resolve(root, "public/finpoint-guide-transcript.txt"),
	chapters
		.map(
			chapter =>
				`${chapter.title}\n\n${chapter.segments.map(segment => `${segment.label}\n${segment.text}`).join("\n\n")}`,
		)
		.join("\n\n————————\n\n"),
)
console.log(`Narrated guide: ${(cursor / fps / 60).toFixed(1)} minutes with ${voice.voice}.`)
