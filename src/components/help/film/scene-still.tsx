import { AbsoluteFill } from "remotion"
import cueFile from "../../../lib/guide-video-cues.json"
import { filmLabels } from "../../../lib/guide-video-script"
import timeline from "../../../lib/guide-video-timeline.json"
import { Backdrop } from "./chrome"
import { Cues } from "./motion"
import { BeatStart, scenes } from "./scenes"
import { accentFor, color } from "./theme"

export type StillBeat = "problem" | "idea" | "check" | "example"

const cueMap = cueFile as Record<string, number[]>
const labels = {
	problem: filmLabels.problem,
	idea: filmLabels.idea,
	check: filmLabels.check,
	example: filmLabels.example,
}

/** A still's canvas: the film's 952 × 520 stage plus a margin of backdrop around it. */
export const still = { width: 1040, height: 600 } as const

/** Where a film scene is fully built: the end of its narration, before it fades out. */
export function stillFrame(chapterId: string, beat: StillBeat) {
	const chapter = timeline.chapters.find(item => item.id === chapterId)
	const segment = chapter?.segments.find(item => item.label === labels[beat])
	if (!chapter || !segment || !scenes[chapterId]?.[beat === "idea" ? "helps" : beat]) return null
	return {
		segment,
		frame: segment.durationInFrames - 4,
		start: chapter.startFrame + segment.from,
	}
}

/** One film scene on its own, without captions or chrome, for Help articles to show as a picture. */
export function SceneStill({ chapterId, beat }: { chapterId: string; beat: StillBeat }) {
	const chapter = timeline.chapters.find(item => item.id === chapterId)
	const found = stillFrame(chapterId, beat)
	const Scene = scenes[chapterId]?.[beat === "idea" ? "helps" : beat]
	if (!chapter || !found || !Scene) return null
	const { segment } = found
	const firstWord = beat === "problem" ? (cueMap[segment.audio]?.[0] ?? 0) : 0
	return (
		<AbsoluteFill
			style={{
				fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
				color: color.ink,
			}}
		>
			<Backdrop
				tint={accentFor(chapter.group)}
				seed={timeline.chapters.indexOf(chapter) + 1}
			/>
			<Cues.Provider
				value={{
					words: segment.text.split(/\s+/).filter(Boolean),
					frames: cueMap[segment.audio] ?? [],
				}}
			>
				<BeatStart.Provider value={firstWord}>
					<div
						style={{ position: "absolute", left: 44, top: 40, width: 952, height: 520 }}
					>
						<Scene />
					</div>
				</BeatStart.Provider>
			</Cues.Provider>
		</AbsoluteFill>
	)
}
