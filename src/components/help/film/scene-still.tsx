import { AbsoluteFill } from "remotion"
import cueFile from "../../../lib/guide-video-cues.json"
import timeline from "../../../lib/guide-video-timeline.json"
import { Backdrop } from "./chrome"
import { demoFrame, UiDemo } from "./demo"
import { Cues } from "./motion"
import { BeatStart, scenes } from "./scenes"
import { accentFor, color } from "./theme"

const cueMap = cueFile as Record<string, number[]>
/** An illustrated scene's canvas: the film's 952 × 520 stage plus a margin of backdrop around it. */
const stageStill = { width: 1040, height: 600 } as const

/**
 * Where a beat's picture is fully built (the end of its narration, before it fades), and the size
 * of the canvas it is drawn on: wide for filmed screens, the stage for illustrations.
 */
export function stillFrame(chapterId: string, beatId: string) {
	const chapter = timeline.chapters.find(item => item.id === chapterId)
	const segment = chapter?.segments.find(item => item.id === beatId)
	const entry = scenes[chapterId]?.[beatId]
	if (!chapter || !segment || !entry) return null
	const size = "demo" in entry ? demoFrame : stageStill
	return { segment, frame: segment.durationInFrames - 4, ...size }
}

/** One beat's picture on its own, without captions or chrome, for Help articles. */
export function SceneStill({ chapterId, beatId }: { chapterId: string; beatId: string }) {
	const chapter = timeline.chapters.find(item => item.id === chapterId)
	const found = stillFrame(chapterId, beatId)
	const entry = scenes[chapterId]?.[beatId]
	if (!chapter || !found || !entry) return null
	const { segment } = found
	const firstWord = chapter.segments[0] === segment ? (cueMap[segment.audio]?.[0] ?? 0) : 0
	const tint = accentFor(chapter.group)
	return (
		<AbsoluteFill
			style={{
				fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
				color: color.ink,
			}}
		>
			<Cues.Provider
				value={{
					words: segment.text.split(/\s+/).filter(Boolean),
					frames: cueMap[segment.audio] ?? [],
				}}
			>
				{"demo" in entry ? (
					<UiDemo
						keys={entry.demo}
						tint={tint}
						style={{ borderRadius: 0, boxShadow: "none" }}
					/>
				) : (
					<>
						<Backdrop tint={tint} seed={timeline.chapters.indexOf(chapter) + 1} />
						<BeatStart.Provider value={firstWord}>
							<div
								style={{
									position: "absolute",
									left: 44,
									top: 40,
									width: 952,
									height: 520,
								}}
							>
								{(() => {
									const Scene = entry
									return <Scene />
								})()}
							</div>
						</BeatStart.Provider>
					</>
				)}
			</Cues.Provider>
		</AbsoluteFill>
	)
}
