"use client"

import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { GuideArticle } from "@/components/help/guide-article"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getGuideChapter, guideChapters, guideLevels } from "@/lib/guide"
import { color, levelStyle, lookFor } from "@/lib/guide-theme"
import { clock } from "@/lib/guide-video"
import timeline from "@/lib/guide-video-timeline.json"
import { cn, pluralize } from "@/lib/utils"
import { getLearningOverview, markGuideReviewed } from "@/logic/learning"
import { pathHelp, pathHelpVideo } from "@/routes"

type Overview = Awaited<ReturnType<typeof getLearningOverview>>

const minutes = Math.round(timeline.durationInFrames / timeline.fps / 60)

/** The four things a new workspace needs, read from saved data and the user's own confirmations. */
function milestones(overview: Overview) {
	const { learning } = overview
	return [
		{
			label: "Bring in bank activity",
			done: Boolean(learning.lastImportAt && overview.statements > 0),
			value:
				learning.lastImportAt && overview.statements > 0
					? "Imported · Statements are present"
					: `${overview.statements} Statements · no guided import yet`,
			href: pathHelp("import"),
			icon: "lucide:landmark",
			color: color.statement,
		},
		{
			label: "Explain your activity",
			done: overview.recordStatus === "complete",
			value:
				overview.recordStatus === "complete"
					? "Your saved Record still tallies"
					: overview.recordStatus === "pending"
						? "Your Record needs an Allocation check"
						: overview.recordStatus === "missing"
							? "Your earlier Record is missing"
							: `${overview.records} Records · save one to track this`,
			href: pathHelp("lunch"),
			icon: "lucide:receipt-text",
			color: color.record,
		},
		{
			label: "Review your month",
			done: Boolean(learning.reviewedMonth),
			value: learning.reviewedMonth
				? `${learning.reviewedMonth} reviewed (confirmed by you)`
				: "Check Dashboard and Monthly Records",
			href: pathHelp("dashboard"),
			icon: "lucide:calendar-check",
			color: color.allocation,
		},
		{
			label: "Protect your data",
			done: Boolean(learning.backupLocatedAt),
			value: learning.backupLocatedAt
				? "Backup located (confirmed by you)"
				: learning.backupRequestedAt
					? "Downloaded · confirm you found the file"
					: "Download a backup and find the file",
			href: pathHelp("sync"),
			icon: "lucide:shield-check",
			color: color.pending,
		},
	]
}

function VideoCard({ frame }: { frame?: number }) {
	return (
		<Card className="gap-0 py-0">
			<div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
				<Link
					href={pathHelpVideo()}
					className="group relative block aspect-video w-full shrink-0 overflow-hidden rounded-lg border sm:w-64"
				>
					<img src="/guide/poster.jpg" alt="" className="size-full object-cover" />
					<span
						className="absolute inset-0 grid place-items-center"
						style={{
							background: `radial-gradient(120% 90% at 0% 100%, ${color.statement}66, transparent 60%), radial-gradient(90% 90% at 100% 0%, ${color.allocation}55, transparent 60%), rgb(0 0 0 / 0.25)`,
						}}
					>
						<span className="grid size-11 place-items-center rounded-full bg-white text-black shadow-lg transition-transform duration-150 ease-out group-hover:scale-105 motion-reduce:transition-none">
							<IconifyIcon
								icon="lucide:play"
								className="size-4 translate-x-px fill-current"
							/>
						</span>
					</span>
					{frame ? (
						<span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[0.6875rem] font-medium text-white tabular-nums">
							Paused at {clock(frame)}
						</span>
					) : null}
				</Link>
				<div className="flex min-w-0 flex-1 flex-col gap-3">
					<div className="grid gap-1">
						<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<IconifyIcon icon="lucide:video" className="size-3.5" />
							Video guide · {timeline.chapters.length} chapters · {minutes} min
						</p>
						<h3 className="text-base font-semibold">Finpoint, from the beginning</h3>
						<p className="max-w-xl text-xs text-muted-foreground">
							Real Finpoint screens, step by step: import your bank, explain a
							purchase, split a payment and keep your data safe.
						</p>
					</div>
					{/* The film's chapters to scale, coloured by level, with the paused point marked. */}
					<div className="relative max-w-md" aria-hidden>
						<div className="flex h-1.5 gap-px overflow-hidden rounded-full">
							{timeline.chapters.map(chapter => (
								<span
									key={chapter.id}
									className="bg-(--level)"
									style={{
										...lookFor(chapter.group).style,
										flexGrow: chapter.durationInFrames,
									}}
								/>
							))}
						</div>
						{frame ? (
							<span
								className="absolute -top-1 h-3.5 w-0.5 rounded-full bg-foreground ring-2 ring-card"
								style={{ left: `${(frame / timeline.durationInFrames) * 100}%` }}
							/>
						) : null}
					</div>
					<ul className="flex flex-wrap gap-1.5">
						{guideLevels.map(level => (
							<li
								key={level}
								className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs"
								style={lookFor(level).style}
							>
								<span className="size-2 shrink-0 rounded-full bg-(--level)" />
								{level}
								<span className="text-muted-foreground tabular-nums">
									{timeline.chapters.filter(item => item.group === level).length}
								</span>
							</li>
						))}
					</ul>
				</div>
				<Button size="sm" asChild className="self-start sm:self-center">
					<Link href={pathHelpVideo()}>
						<IconifyIcon icon="lucide:circle-play" />
						{frame ? "Resume" : "Watch"}
					</Link>
				</Button>
			</div>
		</Card>
	)
}

function Progress({ overview }: { overview: Overview }) {
	const items = milestones(overview)
	const done = items.filter(item => item.done).length
	return (
		<Card className="gap-0 py-0">
			<CardHeader className="gap-3 border-b py-4">
				<div className="flex items-start justify-between gap-3">
					<div className="grid gap-1">
						<CardTitle>Your first steps</CardTitle>
						<CardDescription>
							Saved data and your own confirmations are tracked separately.
						</CardDescription>
					</div>
					<Badge
						variant="secondary"
						className={cn(
							"tabular-nums",
							done === items.length && "bg-creative/10 text-creative",
						)}
					>
						{done === items.length && <IconifyIcon icon="lucide:party-popper" />}
						{done} of {items.length} done
					</Badge>
				</div>
				<div className="flex gap-1" aria-hidden>
					{items.map(item => (
						<span
							key={item.label}
							className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
							style={levelStyle(item.color)}
						>
							<span
								className={cn(
									"block h-full origin-left bg-(--level) transition-transform duration-300 ease-out motion-reduce:transition-none",
									!item.done && "scale-x-0",
								)}
							/>
						</span>
					))}
				</div>
			</CardHeader>
			<ol className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
				{items.map(item => (
					<li key={item.label} className="bg-card" style={levelStyle(item.color)}>
						<Link
							href={item.href}
							className="flex h-full items-start gap-3 px-4 py-3 transition-colors duration-150 hover:bg-muted/50"
						>
							<span
								className={cn(
									"grid size-8 shrink-0 place-items-center rounded-lg transition-colors duration-150",
									item.done
										? "bg-(--level) text-white"
										: "bg-(--level)/10 text-(--level)",
								)}
							>
								<IconifyIcon
									icon={item.done ? "lucide:check" : item.icon}
									className="size-4"
									aria-label={item.done ? "Done" : undefined}
								/>
							</span>
							<span className="grid min-w-0 gap-0.5">
								<span className="text-sm font-medium">{item.label}</span>
								<span
									className={cn(
										"text-xs text-muted-foreground",
										item.done && "text-creative",
									)}
								>
									{item.value}
								</span>
							</span>
						</Link>
					</li>
				))}
			</ol>
		</Card>
	)
}

function Questions({ overview, query }: { overview?: Overview; query: string }) {
	const matches = guideChapters.filter(item =>
		`${item.title} ${item.keywords} ${item.summary} ${item.beats.map(beat => `${beat.say} ${beat.detail ?? ""}`).join(" ")}`
			.toLowerCase()
			.includes(query),
	)
	if (!matches.length)
		return (
			<p className="text-sm text-muted-foreground" aria-live="polite">
				No matching chapter. Try “split”, “Pending”, “import”, or “backup”.
			</p>
		)
	return (
		<section
			className="grid items-start gap-6 lg:grid-cols-2"
			aria-label="Guide chapters"
			aria-live="polite"
		>
			{guideLevels
				.filter(level => matches.some(item => item.level === level))
				.map(group => {
					const items = matches.filter(item => item.level === group)
					const reviewed = items.filter(item =>
						overview?.learning.reviewed.includes(item.id),
					).length
					const look = lookFor(group)
					return (
						<Card key={group} className="gap-0 py-0" style={look.style}>
							<CardHeader className="flex flex-row items-center gap-3 border-b py-4">
								<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-(--level) text-white">
									<IconifyIcon icon={look.icon} className="size-4" />
								</span>
								<div className="grid min-w-0 flex-1 gap-1">
									<CardTitle>{group}</CardTitle>
									<CardDescription className="tabular-nums">
										{pluralize(items.length, "chapter")}
										{overview ? ` · ${reviewed} reviewed` : ""}
									</CardDescription>
								</div>
								{overview ? (
									<span
										className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted"
										aria-hidden
									>
										<span
											className="block h-full origin-left bg-(--level) transition-transform duration-300 ease-out motion-reduce:transition-none"
											style={{
												transform: `scaleX(${reviewed / items.length})`,
											}}
										/>
									</span>
								) : null}
							</CardHeader>
							<ul>
								{items.map(item => (
									<li key={item.id} className="border-b last:border-b-0">
										<Link
											href={pathHelp(item.id)}
											className="group flex items-start gap-3 px-4 py-3 transition-colors duration-150 hover:bg-muted/50"
										>
											<span className="w-5 shrink-0 text-xs leading-5 font-medium text-(--level) tabular-nums">
												{String(guideChapters.indexOf(item) + 1).padStart(
													2,
													"0",
												)}
											</span>
											<span className="grid min-w-0 flex-1 gap-0.5">
												<span className="text-sm font-medium">
													{item.title}
												</span>
												<span className="text-xs text-muted-foreground">
													{item.summary}
												</span>
											</span>
											{overview?.learning.reviewed.includes(item.id) ? (
												<IconifyIcon
													icon="lucide:circle-check"
													className="size-4 shrink-0 text-creative"
													aria-label="Reviewed"
												/>
											) : (
												<IconifyIcon
													icon="lucide:chevron-right"
													className="size-4 shrink-0 text-muted-foreground"
												/>
											)}
										</Link>
									</li>
								))}
							</ul>
						</Card>
					)
				})}
		</section>
	)
}

export default function HelpPage() {
	const params = useSearchParams()
	const topicId = params.get("topic")
	const topic = topicId ? getGuideChapter(topicId) : null
	const [search, setSearch] = useState("")
	const overview = useLiveQuery(getLearningOverview, [])
	const query = search.trim().toLowerCase()

	if (topic)
		return (
			<PageContent>
				<PageHeader
					title={topic.title}
					description={topic.level}
					icon="lucide:circle-help"
					subtitle={topic.summary}
					actions={
						<Button variant="outline" size="sm" asChild>
							<Link href={pathHelp()}>
								<IconifyIcon icon="lucide:list" /> All chapters
							</Link>
						</Button>
					}
				/>
				<div className="flex max-w-3xl flex-col gap-6">
					<GuideArticle chapter={topic} />
					<div className="flex flex-col items-start gap-2 border-t pt-5">
						<Button
							size="sm"
							variant={
								overview?.learning.reviewed.includes(topic.id)
									? "outline"
									: "default"
							}
							disabled={!overview || overview.learning.reviewed.includes(topic.id)}
							onClick={() =>
								void markGuideReviewed(topic.id).catch(() =>
									toast.error("Could not save reading progress. Try again."),
								)
							}
						>
							{overview?.learning.reviewed.includes(topic.id) ? (
								<>
									<IconifyIcon icon="lucide:check" /> Reviewed
								</>
							) : (
								"Mark as reviewed"
							)}
						</Button>
						<p className="text-xs text-muted-foreground">
							This remembers that you read the guide. It doesn’t check your financial
							data.
						</p>
					</div>
				</div>
			</PageContent>
		)

	return (
		<PageContent>
			<PageHeader
				title="How can we help?"
				description="Help & guides"
				icon="lucide:circle-help"
				subtitle="Learn at your own pace, and come back whenever something looks off."
			/>
			<div className="relative max-w-sm">
				<IconifyIcon
					icon="lucide:search"
					className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					type="search"
					aria-label="Search the guides"
					placeholder="Search: Pending, import, refund, backup..."
					className="pl-8"
					value={search}
					onChange={event => setSearch(event.target.value)}
				/>
			</div>
			{query ? (
				<Questions overview={overview} query={query} />
			) : (
				<>
					<VideoCard frame={overview?.learning.videoFrame} />
					{overview && <Progress overview={overview} />}
					<Questions overview={overview} query="" />
					<p className="text-xs text-muted-foreground">
						Learning progress stays in this browser. It isn’t included in financial
						backups or Google Drive sync.
					</p>
				</>
			)}
		</PageContent>
	)
}
