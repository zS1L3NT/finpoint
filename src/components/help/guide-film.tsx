import { Audio } from "@remotion/media"
import { createContext, type ReactNode, useContext, useState } from "react"
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion"
import cueFile from "../../lib/guide-video-cues.json"
import timeline from "../../lib/guide-video-timeline.json"
import { Spoken } from "./film/captions"
import { Backdrop, Header, TitleCard } from "./film/chrome"
import { type DemoScene, demoFrame, UiDemo } from "./film/demo"
import { StageRoot } from "./film/kit"
import { Cues, cueFrame, ReducedMotion, useLayer, useProgress, useReduced } from "./film/motion"
import { type Beat, BeatStart, scenes } from "./film/scenes"
import { accentFor, alpha, color, font, layout } from "./film/theme"

type Chapter = (typeof timeline.chapters)[number]
type Segment = Chapter["segments"][number]

const cueMap = cueFile as Record<string, number[]>
/** Frames a finished picture or caption lingers under the next one, so cuts read as soft crossfades. */
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

/** Fades captions in on arrival and out at `end`, without moving them. */
function useFade(end: number) {
	const frame = useCurrentFrame()
	return Math.min(
		interpolate(frame, [0, 10], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}),
		interpolate(frame, [end - 2, end + OVERLAP - 2], [1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}),
	)
}

/** One beat's narration: down the left column beside a diagram, or as subtitles under a demo. */
function Narration({
	segment,
	kind,
	tint,
	start,
}: {
	segment: Segment
	kind: "stage" | "demo"
	tint: string
	start: number
}) {
	const opacity = useFade(segment.durationInFrames) * useProgress(start - 6, 16)
	if (kind === "stage")
		return (
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
					opacity,
				}}
			>
				{segment.step ? (
					<div>
						<StepPill segment={segment} tint={tint} at={start} />
					</div>
				) : null}
				<Spoken size={48} maxChars={150} lineHeight={1.28} />
			</div>
		)
	return (
		<div
			style={{
				position: "absolute",
				left: (layout.width - demoFrame.width) / 2,
				right: (layout.width - demoFrame.width) / 2,
				top: layout.demoTop + demoFrame.height + 10,
				bottom: 14,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: 32,
				opacity,
			}}
		>
			{segment.step ? <StepPill segment={segment} tint={tint} at={start} /> : null}
			<Spoken
				size={40}
				maxChars={segment.step ? 72 : 92}
				lineHeight={1.25}
				align={segment.step ? "left" : "center"}
				style={{ flex: segment.step ? 1 : undefined }}
			/>
		</div>
	)
}

/**
 * Consecutive beats that show the same thing: one filmed take, or one diagram. A run stays mounted
 * for all of its beats, so the app (or the diagram) never fades, jumps or restarts while the
 * viewer is following one task; only the narration changes underneath it.
 */
type Run = {
	from: number
	durationInFrames: number
	segments: Segment[]
	/** Where the first segment's visuals may start (after the title card for a chapter's first). */
	start: number
} & ({ kind: "demo"; scene: DemoScene } | { kind: "stage"; Scene: Beat })

function runsOf(chapter: Chapter, firstWord: number): Run[] {
	const runs: Run[] = []
	chapter.segments.forEach((segment, position) => {
		const entry = scenes[chapter.id]?.[segment.id]
		if (!entry) return
		const last = runs[runs.length - 1]
		const end = segment.from + segment.durationInFrames
		if ("demo" in entry) {
			const joins = last?.kind === "demo" && last.scene.take === entry.demo.take
			const offset = joins && last ? segment.from - last.from : 0
			// Each key's cue becomes a frame within the run, found in this beat's own words.
			const cues = { words: wordsOf(segment), frames: cueMap[segment.audio] ?? [] }
			const keys = entry.demo.keys.map((key, index) => ({
				...key,
				at:
					offset +
					(index === 0
						? 0
						: typeof key.at === "number"
							? key.at
							: cueFrame(cues, key.at ?? "", { nth: key.nth, fallback: index * 60 })),
				nth: undefined,
			}))
			if (joins && last?.kind === "demo") {
				last.scene = { take: last.scene.take, keys: [...last.scene.keys, ...keys] }
				last.segments.push(segment)
				last.durationInFrames = end - last.from
				return
			}
			runs.push({
				kind: "demo",
				scene: { take: entry.demo.take, keys },
				segments: [segment],
				from: segment.from,
				durationInFrames: segment.durationInFrames,
				start: position === 0 ? firstWord : 0,
			})
			return
		}
		if (last?.kind === "stage" && last.Scene === entry) {
			last.segments.push(segment)
			last.durationInFrames = end - last.from
			return
		}
		runs.push({
			kind: "stage",
			Scene: entry,
			segments: [segment],
			from: segment.from,
			durationInFrames: segment.durationInFrames,
			start: position === 0 ? firstWord : 0,
		})
	})
	return runs
}

/** The words of every beat in a run, timed from the run's start. */
function RunCues({ run, children }: { run: Run; children: ReactNode }) {
	const words: string[] = []
	const frames: number[] = []
	for (const segment of run.segments) {
		words.push(...wordsOf(segment))
		frames.push(...(cueMap[segment.audio] ?? []).map(frame => frame + segment.from - run.from))
	}
	return <Cues.Provider value={{ words, frames }}>{children}</Cues.Provider>
}

const Tint = createContext<string>(color.statement)

/** The picture of a run: an illustrated stage on the right, or the filmed app. */
function Picture({ run }: { run: Run }) {
	const style = useLayer(run.durationInFrames)
	const visible = useProgress(run.start - 6, 16)
	const [stage, setStage] = useState<HTMLDivElement | null>(null)
	const tint = useContext(Tint)
	return (
		<AbsoluteFill style={{ ...style, opacity: style.opacity * visible }}>
			{run.kind === "demo" ? (
				<div
					style={{
						position: "absolute",
						left: (layout.width - demoFrame.width) / 2,
						top: layout.demoTop,
					}}
				>
					<UiDemo scene={run.scene} tint={tint} until={run.durationInFrames} />
				</div>
			) : (
				<RunCues run={run}>
					<BeatStart.Provider value={run.start}>
						<div
							ref={setStage}
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
							<StageRoot.Provider value={stage}>
								<run.Scene />
							</StageRoot.Provider>
						</div>
					</BeatStart.Provider>
				</RunCues>
			)}
		</AbsoluteFill>
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
	const runs = runsOf(chapter, firstWord)
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
			<Tint.Provider value={tint}>
				{runs.map(run => (
					<Sequence
						key={`${run.from}-picture`}
						from={run.from}
						durationInFrames={run.durationInFrames + OVERLAP}
						premountFor={15}
					>
						<Picture run={run} />
					</Sequence>
				))}
				{runs.flatMap(run =>
					run.segments.map(segment => (
						<Sequence
							key={`${segment.audio}-narration`}
							from={segment.from}
							durationInFrames={segment.durationInFrames + OVERLAP}
						>
							<SegmentCues segment={segment}>
								<Narration
									segment={segment}
									kind={run.kind}
									tint={tint}
									start={segment === run.segments[0] ? run.start : 0}
								/>
							</SegmentCues>
						</Sequence>
					)),
				)}
			</Tint.Provider>
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
