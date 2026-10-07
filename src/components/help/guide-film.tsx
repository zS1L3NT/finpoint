import { Audio } from "@remotion/media"
import type { ReactNode } from "react"
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion"
import cueFile from "../../lib/guide-video-cues.json"
import timeline from "../../lib/guide-video-timeline.json"
import { Spoken } from "./film/captions"
import { Backdrop, Header, TitleCard } from "./film/chrome"
import { type DemoKey, demoFrame, UiDemo } from "./film/demo"
import { Cues, ReducedMotion, useLayer, useProgress, useReduced } from "./film/motion"
import { type Beat, BeatStart, scenes } from "./film/scenes"
import { accentFor, alpha, color, font, layout } from "./film/theme"

type Chapter = (typeof timeline.chapters)[number]
type Segment = Chapter["segments"][number]

const cueMap = cueFile as Record<string, number[]>
/** Frames a finished beat lingers under the next one, so cuts read as soft crossfades. */
const OVERLAP = 12

const wordsOf = (segment: Segment) => segment.text.split(/\s+/).filter(Boolean)

function SegmentCues({ segment, children }: { segment: Segment; children: ReactNode }) {
	const frames = cueMap[segment.audio] ?? []
	return <Cues.Provider value={{ words: wordsOf(segment), frames }}>{children}</Cues.Provider>
}

/** "Step 2 of 4", with a dot per step, for beats that belong to a chapter's tutorial. */
function StepPill({ segment, tint, at = 0 }: { segment: Segment; tint: string; at?: number }) {
	const progress = useProgress(at, 18)
	const reduced = useReduced()
	if (!segment.step || !segment.steps) return null
	return (
		<div
			style={{
				display: "inline-flex",
				flexShrink: 0,
				alignItems: "center",
				gap: 16,
				padding: "10px 20px 10px 12px",
				borderRadius: 999,
				background: alpha(color.night, 0.85),
				boxShadow: `inset 0 0 0 1.5px ${alpha(tint, 0.45)}`,
				opacity: progress,
				transform: reduced ? undefined : `translateY(${(1 - progress) * 12}px)`,
			}}
		>
			<span
				style={{
					display: "grid",
					placeItems: "center",
					width: 40,
					height: 40,
					borderRadius: 99,
					background: tint,
					color: color.night,
					fontSize: 22,
					fontWeight: 800,
					...font.numbers,
				}}
			>
				{segment.step}
			</span>
			<span
				style={{
					fontSize: 22,
					fontWeight: 700,
					letterSpacing: "0.08em",
					textTransform: "uppercase",
					color: tint,
				}}
			>
				Step {segment.step} of {segment.steps}
			</span>
			<span style={{ display: "flex", gap: 6 }}>
				{Array.from({ length: segment.steps }, (_, index) => (
					<span
						key={`step-${index + 1}`}
						style={{
							width: index + 1 === segment.step ? 26 : 10,
							height: 10,
							borderRadius: 9,
							background:
								index + 1 <= (segment.step ?? 0) ? tint : "rgba(255,255,255,0.18)",
						}}
					/>
				))}
			</span>
		</div>
	)
}

/** An illustrated beat: narration down the left, the scene on the stage to the right. */
function StageLayer({
	segment,
	Scene,
	tint,
	start,
}: {
	segment: Segment
	Scene: Beat
	tint: string
	start: number
}) {
	const style = useLayer(segment.durationInFrames)
	const visible = useProgress(start - 6, 16)
	return (
		<SegmentCues segment={segment}>
			<BeatStart.Provider value={start}>
				<AbsoluteFill style={{ ...style, opacity: style.opacity * visible }}>
					<div
						style={{
							position: "absolute",
							left: layout.gutter,
							top: layout.columnTop,
							bottom: 120,
							width: layout.columnWidth,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							gap: 28,
						}}
					>
						{segment.step ? (
							<div>
								<StepPill segment={segment} tint={tint} at={start} />
							</div>
						) : null}
						<Spoken size={48} maxChars={150} lineHeight={1.28} />
					</div>
					<div
						style={{
							position: "absolute",
							left: layout.stageLeft,
							top: layout.stageTop,
							width: 952,
							height: 520,
							transform: `scale(${layout.stageScale})`,
							transformOrigin: "0 0",
						}}
					>
						<Scene />
					</div>
				</AbsoluteFill>
			</BeatStart.Provider>
		</SegmentCues>
	)
}

/** A filmed beat: the real Finpoint screen fills the frame, with the narration as subtitles. */
function DemoLayer({
	segment,
	keys,
	tint,
	start,
}: {
	segment: Segment
	keys: DemoKey[]
	tint: string
	start: number
}) {
	const style = useLayer(segment.durationInFrames)
	const visible = useProgress(start - 6, 16)
	return (
		<SegmentCues segment={segment}>
			<AbsoluteFill style={{ ...style, opacity: style.opacity * visible }}>
				<div
					style={{
						position: "absolute",
						left: (layout.width - demoFrame.width) / 2,
						top: 146,
					}}
				>
					<UiDemo keys={keys} tint={tint} />
				</div>
				<div
					style={{
						position: "absolute",
						left: (layout.width - demoFrame.width) / 2,
						right: (layout.width - demoFrame.width) / 2,
						top: 146 + demoFrame.height + 20,
						bottom: 22,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 32,
					}}
				>
					{segment.step ? <StepPill segment={segment} tint={tint} at={start} /> : null}
					<Spoken
						size={40}
						maxChars={segment.step ? 76 : 96}
						lineHeight={1.25}
						align={segment.step ? "left" : "center"}
						style={{ flex: segment.step ? 1 : undefined }}
					/>
				</div>
			</AbsoluteFill>
		</SegmentCues>
	)
}

function ChapterProgress({ chapter, tint }: { chapter: Chapter; tint: string }) {
	const frame = useCurrentFrame()
	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 0,
				height: 6,
				background: "rgba(255,255,255,0.06)",
			}}
		>
			<div
				style={{
					width: `${Math.min(1, frame / chapter.durationInFrames) * 100}%`,
					height: "100%",
					background: `linear-gradient(90deg, ${alpha(tint, 0.4)}, ${tint})`,
					boxShadow: `0 0 16px ${tint}`,
				}}
			/>
		</div>
	)
}

export function GuideChapter({ chapter, number }: { chapter: Chapter; number: number }) {
	const frame = useCurrentFrame()
	const tint = accentFor(chapter.group)
	const segments = chapter.segments
	const first = segments[0]
	const firstWord = (first && cueMap[first.audio]?.[0]) ?? 60
	const index = Math.max(
		0,
		segments.findIndex(item => frame >= item.from && frame < item.from + item.durationInFrames),
	)
	const current = segments[index]
	const segmentProgress = current ? (frame - current.from) / current.durationInFrames : 0
	return (
		<AbsoluteFill
			style={{
				fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
				color: color.ink,
			}}
		>
			<Backdrop tint={tint} seed={number} />
			{segments.map(segment => (
				<Sequence
					key={segment.audio}
					from={segment.from}
					durationInFrames={segment.durationInFrames}
				>
					<Audio src={staticFile(segment.audio)} />
				</Sequence>
			))}
			{segments.map((segment, position) => {
				const entry = scenes[chapter.id]?.[segment.id]
				if (!entry) return null
				const start = position === 0 ? firstWord : 0
				return (
					<Sequence
						key={`${segment.audio}-layer`}
						from={segment.from}
						durationInFrames={segment.durationInFrames + OVERLAP}
						premountFor={15}
					>
						{"demo" in entry ? (
							<DemoLayer
								segment={segment}
								keys={entry.demo}
								tint={tint}
								start={start}
							/>
						) : (
							<StageLayer segment={segment} Scene={entry} tint={tint} start={start} />
						)}
					</Sequence>
				)
			})}
			<Header
				number={number}
				total={timeline.chapters.length}
				group={chapter.group}
				title={chapter.title}
				tint={tint}
				at={firstWord - 8}
				segment={index}
				segmentProgress={segmentProgress}
				segments={segments.length}
			/>
			<TitleCard
				number={number}
				group={chapter.group}
				title={chapter.title}
				tint={tint}
				until={firstWord}
				first={number === 1}
			/>
			<ChapterProgress chapter={chapter} tint={tint} />
		</AbsoluteFill>
	)
}

// Chapters have independent timeline nodes so another designer can replace their visuals.
export function GuideFilm({ reducedMotion = false }: { reducedMotion?: boolean }) {
	return (
		<ReducedMotion.Provider value={reducedMotion}>
			<AbsoluteFill style={{ background: color.night }}>
				{timeline.chapters.map((chapter, index) => (
					<Sequence
						key={chapter.id}
						from={chapter.startFrame}
						durationInFrames={chapter.durationInFrames}
						name={chapter.title}
						premountFor={30}
					>
						<GuideChapter chapter={chapter} number={index + 1} />
					</Sequence>
				))}
			</AbsoluteFill>
		</ReducedMotion.Provider>
	)
}
