import { Audio } from "@remotion/media"
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion"
import { getVideoChapter } from "../../lib/guide-video"
import timeline from "../../lib/guide-video-timeline.json"

type Chapter = (typeof timeline.chapters)[number]
type Segment = Chapter["segments"][number]

const ink = "#172f2b"
const green = "#235c4e"
const paper = "#f5f7f3"

function AmountDiagram({
	id,
	label,
	reducedMotion,
}: {
	id: string
	label: string
	reducedMotion: boolean
}) {
	const frame = useCurrentFrame()
	const sets: Record<string, { labels: string[]; amounts: string[]; footer: string }> = {
		model: {
			labels: ["Statement", "Allocation", "Record"],
			amounts: ["−$12", "−$12", "−$12"],
			footer: "Bank activity → assigned amount → your explanation",
		},
		lunch: {
			labels: ["Lunch payment", "Allocation", "Lunch Record"],
			amounts: ["−$12", "−$12", "−$12"],
			footer: "$0 remaining · $0 difference",
		},
		split: {
			labels: ["Supermarket", "Groceries", "Gift"],
			amounts: ["−$80", "−$60", "−$20"],
			footer: "−$60 + −$20 = −$80",
		},
		repayment: {
			labels: ["Paid", "Received back", "Your share"],
			amounts: ["−$90", "+$60", "−$30"],
			footer: "−$90 + $60 = −$30",
		},
		pending: {
			labels: ["Record", "Allocation", "Difference"],
			amounts: [
				label === "Check your result" ? "−$12" : "−$10",
				"−$12",
				label === "Check your result" ? "$0" : "$2",
			],
			footer:
				label === "Check your result"
					? "After correction: the Record tallies"
					: "Before correction: saved, but Pending",
		},
		treatments: {
			labels: ["Contributions", "Withdrawals", "Cash net"],
			amounts: ["$300", "$50", "−$250"],
			footer: "Money moved to savings · not a portfolio return",
		},
		targets: {
			labels: ["Monthly target", "Spending", "Remaining"],
			amounts: ["$500", "$127", "$373"],
			footer: "A planning comparison · not reserved cash",
		},
		dashboard: {
			labels: ["Income", "Net spending", "Surplus"],
			amounts: ["$3,000", "$127", "$2,873"],
			footer: "$147 gross − $20 refunds = $127 spending",
		},
	}
	const diagram = id === "dashboard" && label === "Example" ? sets.treatments : sets[id]
	if (!diagram) return null
	return (
		<div style={{ position: "absolute", left: 64, right: 64, bottom: 102 }}>
			<div style={{ display: "flex", gap: 16 }}>
				{diagram.labels.map((name, index) => (
					<div
						key={name}
						style={{
							flex: 1,
							minWidth: 0,
							border: "1px solid #c9d5cf",
							borderRadius: 18,
							background: "#ffffff",
							padding: "23px 16px",
							opacity: reducedMotion
								? 1
								: interpolate(frame, [index * 14, index * 14 + 15], [0, 1], {
										extrapolateLeft: "clamp",
										extrapolateRight: "clamp",
									}),
							transform: reducedMotion
								? "none"
								: `translateY(${interpolate(frame, [index * 14, index * 14 + 15], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
						}}
					>
						<div
							style={{
								fontSize: 44,
								lineHeight: 1.15,
								marginBottom: 12,
								color: green,
								overflowWrap: "anywhere",
							}}
						>
							{name}
						</div>
						<div
							style={{
								fontSize: 56,
								fontWeight: 650,
								fontVariantNumeric: "tabular-nums",
								whiteSpace: "nowrap",
							}}
						>
							{diagram.amounts[index]}
						</div>
					</div>
				))}
			</div>
			<div
				style={{
					marginTop: 20,
					fontSize: 44,
					lineHeight: 1.2,
					color: green,
					textAlign: "center",
				}}
			>
				{diagram.footer}
			</div>
		</div>
	)
}

function TeachingPanel({
	chapter,
	segment,
	number,
	sectionNumber,
	reducedMotion,
}: {
	chapter: Chapter
	segment: Segment
	number: number
	sectionNumber: number
	reducedMotion: boolean
}) {
	const frame = useCurrentFrame()
	const opacity = 1
	const hasDiagram =
		[
			"model",
			"lunch",
			"split",
			"repayment",
			"pending",
			"treatments",
			"targets",
			"dashboard",
		].includes(chapter.id) && ["Example", "Check your result"].includes(segment.label)
	return (
		<AbsoluteFill
			style={{
				background: paper,
				color: ink,
				fontFamily: "Inter, system-ui, sans-serif",
				padding: 64,
			}}
		>
			<Audio src={staticFile(segment.audio)} />
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					fontSize: 24,
					fontWeight: 600,
					color: green,
				}}
			>
				<span>FINPOINT / BEGINNER GUIDE</span>
				<span>{String(number).padStart(2, "0")} / 17</span>
			</div>
			<div
				style={{
					marginTop: 35,
					paddingBottom: 30,
					borderBottom: "2px solid #d7dfd9",
					fontSize: 48,
					fontWeight: 650,
					letterSpacing: -1.2,
					lineHeight: 1.18,
				}}
			>
				{chapter.title}
			</div>
			<div style={{ opacity, marginTop: 38 }}>
				<div style={{ fontSize: 27, color: green, marginBottom: 20, fontWeight: 600 }}>
					{segment.label}
				</div>
				<div
					style={{
						fontSize: segment.text.length > 370 ? 39 : 44,
						lineHeight: 1.38,
						letterSpacing: -0.5,
						maxWidth: 952,
					}}
				>
					{segment.text.split(/([−+]?\$[\d,]+(?:\.\d+)?)/g).map((part, index) =>
						/^[−+]?\$/.test(part) ? (
							<span key={`${index}-${part}`} style={{ whiteSpace: "nowrap" }}>
								{part}
							</span>
						) : (
							part
						),
					)}
				</div>
			</div>
			{hasDiagram && (
				<AmountDiagram
					id={chapter.id}
					label={segment.label}
					reducedMotion={reducedMotion}
				/>
			)}
			<div
				style={{
					position: "absolute",
					bottom: 40,
					left: 64,
					right: 64,
					display: "flex",
					justifyContent: "space-between",
					fontSize: 22,
					color: green,
				}}
			>
				<span>Illustrated guide · fictional examples</span>
				<span>
					{sectionNumber + 1} / {chapter.segments.length}
				</span>
			</div>
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					width: `${((sectionNumber + Math.min(1, frame / segment.durationInFrames)) / chapter.segments.length) * 100}%`,
					height: 8,
					background: green,
				}}
			/>
		</AbsoluteFill>
	)
}

export function GuideChapter({
	id,
	reducedMotion = false,
}: {
	id: string
	reducedMotion?: boolean
}) {
	const chapter = getVideoChapter(id)
	const number = timeline.chapters.indexOf(chapter) + 1
	return (
		<AbsoluteFill>
			{chapter.segments.map((segment, index) => (
				<Sequence
					key={segment.audio}
					from={segment.from}
					durationInFrames={segment.durationInFrames}
					premountFor={timeline.fps}
				>
					<TeachingPanel
						chapter={chapter}
						segment={segment}
						number={number}
						sectionNumber={index}
						reducedMotion={reducedMotion}
					/>
				</Sequence>
			))}
		</AbsoluteFill>
	)
}

// Chapters have independent timeline nodes so another designer can replace their visuals.
export function GuideFilm({ reducedMotion = false }: { reducedMotion?: boolean }) {
	const chapter = (id: string) => getVideoChapter(id)
	return (
		<AbsoluteFill>
			<Sequence
				from={chapter("start").startFrame}
				durationInFrames={chapter("start").durationInFrames}
			>
				<GuideChapter id="start" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("model").startFrame}
				durationInFrames={chapter("model").durationInFrames}
			>
				<GuideChapter id="model" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("workspace").startFrame}
				durationInFrames={chapter("workspace").durationInFrames}
			>
				<GuideChapter id="workspace" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("import").startFrame}
				durationInFrames={chapter("import").durationInFrames}
			>
				<GuideChapter id="import" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("lunch").startFrame}
				durationInFrames={chapter("lunch").durationInFrames}
			>
				<GuideChapter id="lunch" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("backup-first").startFrame}
				durationInFrames={chapter("backup-first").durationInFrames}
			>
				<GuideChapter id="backup-first" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("split").startFrame}
				durationInFrames={chapter("split").durationInFrames}
			>
				<GuideChapter id="split" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("repayment").startFrame}
				durationInFrames={chapter("repayment").durationInFrames}
			>
				<GuideChapter id="repayment" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("treatments").startFrame}
				durationInFrames={chapter("treatments").durationInFrames}
			>
				<GuideChapter id="treatments" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("pending").startFrame}
				durationInFrames={chapter("pending").durationInFrames}
			>
				<GuideChapter id="pending" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("find").startFrame}
				durationInFrames={chapter("find").durationInFrames}
			>
				<GuideChapter id="find" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("categories").startFrame}
				durationInFrames={chapter("categories").durationInFrames}
			>
				<GuideChapter id="categories" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("targets").startFrame}
				durationInFrames={chapter("targets").durationInFrames}
			>
				<GuideChapter id="targets" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("budgets").startFrame}
				durationInFrames={chapter("budgets").durationInFrames}
			>
				<GuideChapter id="budgets" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("dashboard").startFrame}
				durationInFrames={chapter("dashboard").durationInFrames}
			>
				<GuideChapter id="dashboard" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("sync").startFrame}
				durationInFrames={chapter("sync").durationInFrames}
			>
				<GuideChapter id="sync" reducedMotion={reducedMotion} />
			</Sequence>
			<Sequence
				from={chapter("routine").startFrame}
				durationInFrames={chapter("routine").durationInFrames}
			>
				<GuideChapter id="routine" reducedMotion={reducedMotion} />
			</Sequence>
		</AbsoluteFill>
	)
}
