// Local, reproducible narration. Run from the repository root with Bun.
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { guideSections, guideTopics } from "../../src/lib/guide-content"

const fps = 30
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const audioDir = resolve(root, "public/guide-audio")
mkdirSync(audioDir, { recursive: true })
const temporary = mkdtempSync(resolve(tmpdir(), "finpoint-narration-"))
const timelineFile = resolve(root, "src/lib/guide-video-timeline.json")
const previous = existsSync(timelineFile) ? JSON.parse(readFileSync(timelineFile, "utf8")) : null

function command(program: string, args: string[]) {
	const result = spawnSync(program, args, { encoding: "utf8" })
	if (result.status !== 0) throw new Error(`${program}: ${result.stderr}`)
	return result.stdout
}

function spoken(text: string) {
	return text
		.replaceAll("−", "minus ")
		.replaceAll("→", ", connected to ")
		.replaceAll("←", ", connected to ")
		.replaceAll("·", ". ")
		.replaceAll(" / ", " or ")
		.replaceAll("CSV", "C S V")
		.replaceAll("JSON", "J S O N")
		.replaceAll("DBS", "D B S")
		.replaceAll("OCBC", "O C B C")
		.replaceAll("UOB", "U O B")
}

function timestamp(frame: number) {
	const milliseconds = Math.round((frame / fps) * 1000)
	return `${Math.floor(milliseconds / 3600000)
		.toString()
		.padStart(2, "0")}:${Math.floor((milliseconds / 60000) % 60)
		.toString()
		.padStart(2, "0")}:${Math.floor((milliseconds / 1000) % 60)
		.toString()
		.padStart(2, "0")}.${(milliseconds % 1000).toString().padStart(3, "0")}`
}

try {
	let cursor = 0
	let captions = "WEBVTT\n\n"
	const chapters = guideTopics.map((topic, chapterIndex) => {
		const startFrame = cursor
		const segments = guideSections(topic).map((section, sectionIndex) => {
			const file = `${topic.id}-${sectionIndex}.mp3`
			const text = `${sectionIndex === 0 ? topic.title + ". " : ""}${section.label}. ${section.text}`
			const aiff = resolve(temporary, "speech.aiff")
			const oldChapter = previous?.chapters.find(
				(chapter: { id: string }) => chapter.id === topic.id,
			)
			if (
				!existsSync(resolve(audioDir, file)) ||
				oldChapter?.segments[sectionIndex]?.text !== section.text ||
				(sectionIndex === 0 && oldChapter?.title !== topic.title)
			) {
				command("/usr/bin/say", ["-v", "Samantha", "-r", "155", "-o", aiff, spoken(text)])
				command("/opt/homebrew/bin/ffmpeg", [
					"-hide_banner",
					"-loglevel",
					"error",
					"-y",
					"-i",
					aiff,
					"-codec:a",
					"libmp3lame",
					"-b:a",
					"96k",
					resolve(audioDir, file),
				])
			}
			const seconds = Number(
				command("/opt/homebrew/bin/ffprobe", [
					"-v",
					"error",
					"-show_entries",
					"format=duration",
					"-of",
					"default=noprint_wrappers=1:nokey=1",
					resolve(audioDir, file),
				]),
			)
			if (!Number.isFinite(seconds) || seconds <= 0)
				throw new Error(`Missing narration for ${file}`)
			const durationInFrames = Math.ceil(seconds * fps) + 24
			const segment = {
				...section,
				from: cursor - startFrame,
				durationInFrames,
				audio: `guide-audio/${file}`,
			}
			captions += `${topic.id}-${sectionIndex}\n${timestamp(cursor)} --> ${timestamp(cursor + durationInFrames)}\n${text}\n\n`
			cursor += durationInFrames
			return segment
		})
		console.log(`${chapterIndex + 1}/17: ${topic.title}`)
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
		JSON.stringify(
			{ fps, width: 1080, height: 1080, durationInFrames: cursor, chapters },
			null,
			"\t",
		) + "\n",
	)
	writeFileSync(resolve(root, "public/finpoint-guide.vtt"), captions.trimEnd() + "\n")
	writeFileSync(
		resolve(root, "public/finpoint-guide-transcript.txt"),
		chapters
			.map(
				(chapter) =>
					`${chapter.title}\n\n${chapter.segments.map((segment) => `${segment.label}\n${segment.text}`).join("\n\n")}`,
			)
			.join("\n\n————————\n\n"),
	)
	console.log(
		`Narrated guide: ${(cursor / fps / 60).toFixed(1)} minutes. ${readFileSync(resolve(root, "public/finpoint-guide-transcript.txt"), "utf8").split(/\s+/).length} words.`,
	)
} finally {
	rmSync(temporary, { recursive: true, force: true })
}
