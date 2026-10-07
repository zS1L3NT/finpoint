// Word cues for the narrated guide: when each caption word is spoken, in frames from its segment start.
// Sentence pauses are measured from the narration audio; words inside a sentence are spread by syllables.
// Run from the repository root with Bun after `narrate.ts`: `bun video/scripts/cues.ts`.
import { spawnSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const timeline = JSON.parse(
	readFileSync(resolve(root, "src/lib/guide-video-timeline.json"), "utf8"),
) as {
	fps: number
	chapters: {
		title: string
		segments: { label: string; text: string; audio: string }[]
	}[]
}
const fps = timeline.fps

const ones = [
	"",
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
	if (value < 100) return `${tens[Math.floor(value / 10)]} ${ones[value % 10]}`
	if (value < 1000) return `${ones[Math.floor(value / 100)]} hundred ${words(value % 100)}`
	return `${words(Math.floor(value / 1000))} thousand ${words(value % 1000)}`
}

function syllables(word: string) {
	const groups = word.toLowerCase().replace(/[^a-z]/g, "").match(/[aeiouy]+/g)
	return Math.max(1, groups?.length ?? 1)
}

/** Roughly how long a written word takes to say, in syllables, including any pause after it. */
function weight(token: string) {
	let total = 0
	if (token.includes("−") || token.includes("+")) total += token.includes("−") ? 2 : 1
	const amount = token.match(/\$([\d,]+)(?:\.(\d+))?/)
	if (amount) {
		const spoken = words(Number(amount[1]?.replaceAll(",", "")))
		total += spoken.split(/\s+/).filter(Boolean).reduce((sum, part) => sum + syllables(part), 2)
		if (amount[2]) total += 3
	} else if (/^\d/.test(token)) {
		total += words(Number.parseInt(token, 10) || 0)
			.split(/\s+/)
			.filter(Boolean)
			.reduce((sum, part) => sum + syllables(part), 0)
	} else if (/^[A-Z]{2,}/.test(token)) {
		total += token.replace(/[^A-Z]/g, "").length
	} else if (/^[→←·]$/.test(token)) {
		total += 4
	} else {
		total += token
			.split(/[-/]/)
			.filter(Boolean)
			.reduce((sum, part) => sum + syllables(part), 0)
	}
	if (/[,;]$/.test(token) || /^[→←·]$/.test(token)) total += 1.5
	return total
}

const ends = (token: string) => /[.?!:;]["”’)]?$/.test(token) || /^[·]$/.test(token)

function pauses(file: string) {
	const result = spawnSync(
		"ffmpeg",
		["-hide_banner", "-i", file, "-af", "silencedetect=noise=-35dB:d=0.15", "-f", "null", "-"],
		{ encoding: "utf8" },
	)
	const log = result.stderr
	const duration = Number(
		spawnSync(
			"ffprobe",
			["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
			{ encoding: "utf8" },
		).stdout,
	)
	const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map(match => Number(match[1]))
	const stops = [...log.matchAll(/silence_end: ([\d.]+)/g)].map(match => Number(match[1]))
	const silences = starts.map((start, index) => ({ start, end: stops[index] ?? duration }))
	let speechStart = 0
	let speechEnd = duration
	if (silences[0] && silences[0].start < 0.05) speechStart = silences.shift()?.end ?? 0
	const last = silences[silences.length - 1]
	if (last && last.end >= duration - 0.05) speechEnd = silences.pop()?.start ?? duration
	return { speechStart, speechEnd, gaps: silences }
}

const cues: Record<string, number[]> = {}

for (const chapter of timeline.chapters) {
	chapter.segments.forEach((segment, index) => {
		const prefix = `${index === 0 ? `${chapter.title} ` : ""}${segment.label}.`
			.split(/\s+/)
			.filter(Boolean)
		const display = segment.text.split(/\s+/).filter(Boolean)
		const tokens = [...prefix, ...display]
		const { speechStart, speechEnd, gaps } = pauses(resolve(root, "public", segment.audio))

		// Split into sentences, then pin each sentence boundary to the nearest measured pause.
		const sentences: number[][] = [[]]
		tokens.forEach((token, position) => {
			sentences[sentences.length - 1]?.push(position)
			if (ends(token) && position < tokens.length - 1) sentences.push([])
		})
		const weights = tokens.map(weight)
		const total = weights.reduce((sum, value) => sum + value, 0)
		const pauseCount = sentences.length - 1
		const speaking = speechEnd - speechStart - pauseCount * 0.25
		let used = -1
		let cursor = 0
		const boundaries: { end: number; next: number }[] = []
		for (let sentence = 0; sentence < pauseCount; sentence++) {
			cursor += (sentences[sentence] ?? []).reduce((sum, at) => sum + (weights[at] ?? 0), 0)
			const estimate = speechStart + (cursor / total) * speaking + sentence * 0.25
			let best = -1
			for (let gap = used + 1; gap < gaps.length; gap++) {
				const distance = Math.abs((gaps[gap]?.start ?? 0) - estimate)
				if (distance < 0.9 && (best < 0 || distance < Math.abs((gaps[best]?.start ?? 0) - estimate)))
					best = gap
			}
			if (best >= 0) {
				used = best
				boundaries.push({ end: gaps[best]?.start ?? estimate, next: gaps[best]?.end ?? estimate })
			} else {
				boundaries.push({ end: estimate, next: estimate + 0.25 })
			}
		}

		const starts: number[] = []
		sentences.forEach((sentence, at) => {
			const from = at === 0 ? speechStart : (boundaries[at - 1]?.next ?? speechStart)
			const to = at === sentences.length - 1 ? speechEnd : (boundaries[at]?.end ?? speechEnd)
			const sum = sentence.reduce((value, position) => value + (weights[position] ?? 0), 0)
			let offset = 0
			for (const position of sentence) {
				starts[position] = from + (offset / sum) * Math.max(0, to - from)
				offset += weights[position] ?? 0
			}
		})
		cues[segment.audio] = starts
			.slice(prefix.length)
			.map(seconds => Math.round(seconds * fps))
	})
}

writeFileSync(
	resolve(root, "src/lib/guide-video-cues.json"),
	`{\n${Object.entries(cues)
		.map(([audio, frames]) => `\t${JSON.stringify(audio)}: ${JSON.stringify(frames)}`)
		.join(",\n")}\n}\n`,
)
console.log(`Word cues for ${Object.keys(cues).length} narration clips.`)
