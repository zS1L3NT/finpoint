import { Audio } from "@remotion/media"
import { type LucideIcon, TriangleAlert } from "lucide-react"
import type { ReactNode } from "react"
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion"
import cueFile from "../../lib/guide-video-cues.json"
import timeline from "../../lib/guide-video-timeline.json"
import { Spoken } from "./film/captions"
import { Backdrop, Header, labelTint, SegmentLabel, TitleCard } from "./film/chrome"
import { Card, CheckMark, IconTile, useWobble } from "./film/kit"
import { Cues, ReducedMotion, Rise, useLayer, useProgress, useReduced } from "./film/motion"
import { type Beat, BeatStart, scenes } from "./film/scenes"
import { accentFor, alpha, color, font, layout } from "./film/theme"

type Chapter = (typeof timeline.chapters)[number]
type Segment = Chapter["segments"][number]

const cueMap = cueFile as Record<string, number[]>
/** Frames a finished segment lingers under the next one, so cuts read as soft crossfades. */
const OVERLAP = 12

const wordsOf = (segment: Segment) => segment.text.split(/\s+/).filter(Boolean)

function SegmentCues({
	segment,
	shift = 0,
	children,
}: {
	segment: Segment
	shift?: number
	children: ReactNode
}) {
	const frames = (cueMap[segment.audio] ?? []).map(frame => frame + shift)
	return <Cues.Provider value={{ words: wordsOf(segment), frames }}>{children}</Cues.Provider>
}

function Stage({ children }: { children: ReactNode }) {
	return (
		<div
			style={{
				position: "absolute",
				left: layout.gutter,
				top: layout.stageTop,
				width: layout.size - layout.gutter * 2,
				height: layout.stageHeight,
			}}
		>
			{children}
		</div>
	)
}

function Caption({ children }: { children: ReactNode }) {
	return (
		<div
			style={{
				position: "absolute",
				left: layout.gutter,
				right: layout.gutter,
				top: layout.captionTop,
			}}
		>
			{children}
		</div>
	)
}

/** Problem, explanation, example and (when a chapter has one) result: a scene plus live caption. */
function SceneLayer({
	segment,
	beat: Scene,
	tint,
	start = 0,
}: {
	segment: Segment
	beat: Beat
	tint: string
	start?: number
}) {
	const style = useLayer(segment.durationInFrames)
	const visible = useProgress(start - 6, 16)
	return (
		<SegmentCues segment={segment}>
			<BeatStart.Provider value={start}>
				<AbsoluteFill style={{ ...style, opacity: style.opacity * visible }}>
					<SegmentLabel
						label={segment.label}
						tint={labelTint(segment.label, tint)}
						at={start}
					/>
					<Stage>
						<Scene />
					</Stage>
					<Caption>
						<Spoken />
					</Caption>
				</AbsoluteFill>
			</BeatStart.Provider>
		</SegmentCues>
	)
}

/** The result and fix moments without a bespoke visual: a big sign, then the words themselves. */
function NoticeLayer({ segment, tint }: { segment: Segment; tint: string }) {
	const style = useLayer(segment.durationInFrames)
	const check = segment.label === "Check your result"
	const wobble = useWobble(10)
	const tone = labelTint(segment.label, tint)
	const glow = useProgress(4, 30)
	return (
		<SegmentCues segment={segment}>
			<AbsoluteFill style={style}>
				<AbsoluteFill
					style={{
						background: `radial-gradient(50% 40% at 50% 40%, ${alpha(tone, 0.16 * glow)}, transparent 70%)`,
					}}
				/>
				<SegmentLabel label={segment.label} tint={tone} />
				<div
					style={{
						position: "absolute",
						left: layout.gutter,
						right: layout.gutter,
						top: 250,
						bottom: 90,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						gap: 44,
					}}
				>
					<div style={{ transform: `rotate(${wobble}deg)`, width: "fit-content" }}>
						{check ? (
							<CheckMark at={6} size={150} />
						) : (
							<Rise at={4} from={0.6} y={0}>
								<IconTile icon={TriangleAlert} tint={tone} size={150} />
							</Rise>
						)}
					</div>
					<Spoken
						size={segment.text.length > 170 ? 46 : 54}
						maxChars={150}
						weight={650}
						lineHeight={1.24}
					/>
				</div>
			</AbsoluteFill>
		</SegmentCues>
	)
}

function StepRow({
	index,
	segment,
	shift,
	icon,
	tint,
	state,
	size,
}: {
	index: number
	segment: Segment
	shift: number
	icon: LucideIcon
	tint: string
	state: number
	size: number
}) {
	// state: <0 upcoming, 0..1 becoming active, 1 active, >1 done (1 → 2 while settling).
	const active = Math.max(0, Math.min(state, 2 - state, 1))
	const done = state > 1
	const reduced = useReduced()
	return (
		<div style={{ display: "flex", gap: 26, alignItems: "stretch" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: 56,
				}}
			>
				<div
					style={{
						width: 56,
						height: 56,
						borderRadius: 99,
						display: "grid",
						placeItems: "center",
						fontSize: 24,
						fontWeight: 750,
						color: active > 0.5 || done ? color.night : color.dim,
						background: done
							? color.record
							: active > 0
								? tint
								: "rgba(255,255,255,0.06)",
						boxShadow:
							active > 0
								? `0 0 ${36 * active}px ${alpha(tint, 0.6)}`
								: `inset 0 0 0 1.5px ${color.line}`,
						transform: reduced ? undefined : `scale(${1 + active * 0.12})`,
						...font.numbers,
					}}
				>
					{done ? "✓" : index + 1}
				</div>
				<div
					style={{
						flex: 1,
						width: 3,
						marginTop: 8,
						borderRadius: 3,
						background: done ? alpha(color.record, 0.5) : color.line,
						minHeight: 18,
					}}
				/>
			</div>
			<Card
				tint={active > 0 ? tint : undefined}
				glow={active * 0.4}
				style={{
					flex: 1,
					padding: "22px 28px",
					marginBottom: 18,
					display: "flex",
					gap: 24,
					alignItems: "center",
					...(active > 0 ? {} : { background: "transparent", boxShadow: "none" }),
					opacity: 0.4 + 0.6 * active + (done ? 0.12 : 0),
					transform: reduced ? undefined : `translateX(${active * 8}px)`,
				}}
			>
				<div style={{ flex: 1 }}>
					{active > 0 ? (
						<SegmentCues segment={segment} shift={shift}>
							<Spoken size={size} maxChars={400} lineHeight={1.3} />
						</SegmentCues>
					) : (
						<p
							style={{
								margin: 0,
								fontSize: size,
								fontWeight: 600,
								lineHeight: 1.3,
								letterSpacing: "-0.015em",
								color: done ? color.dim : color.ink,
							}}
						>
							{segment.text}
						</p>
					)}
				</div>
				{active > 0 && (
					<div
						style={{
							opacity: active,
							transform: reduced
								? undefined
								: `scale(${0.6 + 0.4 * active}) rotate(${(1 - active) * -20}deg)`,
						}}
					>
						<IconTile icon={icon} tint={tint} size={84} />
					</div>
				)}
			</Card>
		</div>
	)
}

/** All four steps stay on screen; the one being read lifts forward while finished ones tick off. */
function StepsLayer({
	steps,
	icons,
	tint,
}: {
	steps: Segment[]
	icons: LucideIcon[]
	tint: string
}) {
	const frame = useCurrentFrame()
	const first = steps[0]?.from ?? 0
	const last = steps[steps.length - 1]
	const end = last ? last.from + last.durationInFrames - first : 0
	const style = useLayer(end)
	const total = steps.reduce((sum, step) => sum + step.text.length, 0)
	const size = total > 380 ? 29 : total > 260 ? 32 : 36
	return (
		<AbsoluteFill style={style}>
			<SegmentLabel label="Steps" tint={tint} />
			<div
				style={{
					position: "absolute",
					left: layout.gutter,
					right: layout.gutter,
					top: 236,
					bottom: 60,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				{steps.map((step, index) => {
					const from = step.from - first
					const until = from + step.durationInFrames
					const state =
						frame < from - 8
							? -1
							: frame < until - 6
								? interpolate(frame, [from - 8, from + 6], [0, 1], {
										extrapolateRight: "clamp",
									})
								: index === steps.length - 1
									? 1
									: interpolate(frame, [until - 6, until + 8], [1, 2], {
											extrapolateRight: "clamp",
										})
					return (
						<StepRow
							key={step.audio}
							index={index}
							segment={step}
							shift={from}
							icon={icons[index] ?? TriangleAlert}
							tint={tint}
							state={state}
							size={size}
						/>
					)
				})}
			</div>
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
	const scene = scenes[chapter.id]
	const segments = chapter.segments
	const [problem, helps, s1, s2, s3, s4, check, wrong, example] = segments
	const firstWord = (problem && cueMap[problem.audio]?.[0]) ?? 60
	const index = Math.max(
		0,
		segments.findIndex(item => frame >= item.from && frame < item.from + item.durationInFrames),
	)
	const current = segments[index]
	const segmentProgress = current ? (frame - current.from) / current.durationInFrames : 0
	const steps = [s1, s2, s3, s4].filter((step): step is Segment => Boolean(step))
	const layer = (segment: Segment | undefined, content: ReactNode, length?: number) =>
		segment && (
			<Sequence
				key={segment.audio}
				from={segment.from}
				durationInFrames={(length ?? segment.durationInFrames) + OVERLAP}
				premountFor={15}
			>
				{content}
			</Sequence>
		)
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
			{scene &&
				problem &&
				layer(
					problem,
					<SceneLayer
						segment={problem}
						beat={scene.problem}
						tint={tint}
						start={firstWord}
					/>,
				)}
			{scene &&
				helps &&
				layer(helps, <SceneLayer segment={helps} beat={scene.helps} tint={tint} />)}
			{scene &&
				s1 &&
				layer(
					s1,
					<StepsLayer steps={steps} icons={scene.steps} tint={tint} />,
					steps.reduce((sum, step) => sum + step.durationInFrames, 0),
				)}
			{check &&
				layer(
					check,
					scene?.check ? (
						<SceneLayer segment={check} beat={scene.check} tint={tint} />
					) : (
						<NoticeLayer segment={check} tint={tint} />
					),
				)}
			{wrong && layer(wrong, <NoticeLayer segment={wrong} tint={tint} />)}
			{scene &&
				example &&
				layer(example, <SceneLayer segment={example} beat={scene.example} tint={tint} />)}
			<Header
				number={number}
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
