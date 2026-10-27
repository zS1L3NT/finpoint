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
import timeline from "@/lib/guide-video-timeline.json"
import { cn } from "@/lib/utils"
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
		},
		{
			label: "Review your month",
			done: Boolean(learning.reviewedMonth),
			value: learning.reviewedMonth
				? `${learning.reviewedMonth} reviewed (confirmed by you)`
				: "Check Dashboard and Monthly Records",
			href: pathHelp("dashboard"),
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
		},
	]
}

function VideoCard() {
	return (
		<Card className="gap-0 py-0">
			<div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
				<Link
					href={pathHelpVideo()}
					className="relative block aspect-video w-full shrink-0 overflow-hidden rounded-lg border sm:w-56"
				>
					<img src="/guide/poster.jpg" alt="" className="size-full object-cover" />
					<span className="absolute inset-0 grid place-items-center bg-black/30">
						<span className="grid size-10 place-items-center rounded-full bg-background/90 text-foreground">
							<IconifyIcon icon="lucide:play" className="size-4 translate-x-px" />
						</span>
					</span>
				</Link>
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<IconifyIcon icon="lucide:video" className="size-3.5" />
						Video guide · {timeline.chapters.length} chapters · {minutes} min
					</p>
					<h3 className="text-sm font-semibold">Finpoint, from the beginning</h3>
					<p className="max-w-xl text-xs text-muted-foreground">
						Real Finpoint screens, step by step: import your bank, explain a purchase,
						split a payment and keep your data safe.
					</p>
				</div>
				<Button size="sm" asChild className="self-start sm:self-center">
					<Link href={pathHelpVideo()}>
						<IconifyIcon icon="lucide:circle-play" />
						Watch
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
			<CardHeader className="flex flex-row items-start justify-between gap-3 border-b py-4">
				<div className="grid gap-1">
					<CardTitle>Your first steps</CardTitle>
					<CardDescription>
						Saved data and your own confirmations are tracked separately.
					</CardDescription>
				</div>
				<Badge variant="secondary" className="tabular-nums">
					{done} of {items.length} done
				</Badge>
			</CardHeader>
			<ol className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
				{items.map((item, index) => (
					<li key={item.label} className="bg-card">
						<Link
							href={item.href}
							className="flex h-full items-start gap-3 px-4 py-3 transition-colors duration-150 hover:bg-muted/50"
						>
							<span
								className={cn(
									"grid size-6 shrink-0 place-items-center rounded-full border text-xs font-medium tabular-nums",
									item.done && "border-transparent bg-foreground text-background",
								)}
							>
								{item.done ? (
									<IconifyIcon icon="lucide:check" className="size-3.5" />
								) : (
									index + 1
								)}
							</span>
							<span className="grid min-w-0 gap-0.5">
								<span className="text-sm font-medium">{item.label}</span>
								<span className="text-xs text-muted-foreground">{item.value}</span>
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
				.map(group => (
					<Card key={group} className="gap-0 py-0">
						<CardHeader className="border-b py-4">
							<CardTitle>{group}</CardTitle>
						</CardHeader>
						<ul>
							{matches
								.filter(item => item.level === group)
								.map(item => (
									<li key={item.id} className="border-b last:border-b-0">
										<Link
											href={pathHelp(item.id)}
											className="group flex items-start gap-3 px-4 py-3 transition-colors duration-150 hover:bg-muted/50"
										>
											<span className="w-5 shrink-0 text-xs leading-5 text-muted-foreground tabular-nums">
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
													icon="lucide:check"
													className="size-4 shrink-0 text-muted-foreground"
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
				))}
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
					<VideoCard />
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
