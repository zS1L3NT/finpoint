"use client"

import { useLiveQuery } from "dexie-react-hooks"
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Gift,
	type LucideIcon,
	Play,
	Search,
	TriangleAlert,
	Users,
	Utensils,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { accentFor, color } from "@/components/help/film/theme"
import { GuideArticle } from "@/components/help/guide-article"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getGuideTopic, guideTopics } from "@/lib/guide-content"
import timeline from "@/lib/guide-video-timeline.json"
import { cn } from "@/lib/utils"
import { getLearningOverview, markGuideReviewed } from "@/logic/learning"
import { practiceLessons } from "@/logic/practice"
import { pathHelp, pathHelpPractice, pathHelpVideo } from "@/routes"

type Overview = Awaited<ReturnType<typeof getLearningOverview>>

const lessonIcons: Record<string, LucideIcon> = {
	lunch: Utensils,
	pending: TriangleAlert,
	split: Gift,
	repayment: Users,
}

const minutes = Math.round(timeline.durationInFrames / timeline.fps / 60)

/** The five things a new workspace needs, read from saved data and the user's own confirmations. */
function milestones(overview: Overview) {
	const { learning } = overview
	const nextLesson = practiceLessons.find(lesson => !learning.completed.includes(lesson.id))
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
			label: "Practice the core workflow",
			done: learning.completed.length >= practiceLessons.length,
			value: `${learning.completed.length} of ${practiceLessons.length} sample lessons`,
			href: pathHelpPractice(nextLesson?.id ?? "lunch"),
		},
		{
			label: "Protect your data",
			done: Boolean(learning.backupLocatedAt),
			value: learning.backupLocatedAt
				? "Backup located (confirmed by you)"
				: learning.backupRequestedAt
					? "Downloaded · confirm you found the file"
					: "Download a backup and find the file",
			href: pathHelp("backup-first"),
		},
	]
}

function VideoCard() {
	return (
		<Link
			href={pathHelpVideo()}
			className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl p-6 text-white ring-1 ring-border transition-shadow duration-200 ease-out hover:shadow-xl"
			style={{
				background: `radial-gradient(90% 110% at 0% 0%, ${accentFor("Start here")}66, transparent 60%), radial-gradient(80% 100% at 100% 100%, ${color.allocation}55, transparent 60%), ${color.night}`,
			}}
		>
			<span
				aria-hidden
				className="absolute inset-0 opacity-40"
				style={{
					backgroundImage:
						"radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1.2px)",
					backgroundSize: "22px 22px",
					maskImage: "radial-gradient(70% 70% at 70% 30%, black, transparent)",
				}}
			/>
			<span className="absolute top-6 right-6 grid size-14 place-items-center rounded-full bg-white text-black shadow-lg transition-transform duration-200 ease-out group-hover:scale-105">
				<Play className="size-6 translate-x-0.5 fill-current" />
			</span>
			<span className="relative text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
				Video guide · {timeline.chapters.length} chapters · {minutes} min
			</span>
			<span className="relative mt-1.5 text-2xl font-semibold tracking-tight">
				Finpoint, from the beginning
			</span>
			<span className="relative mt-1 max-w-md text-sm text-white/70">
				Watch a $12 lunch become a Record, then follow Alex through splits, refunds, Pending
				fixes and backups.
			</span>
		</Link>
	)
}

function Progress({ overview }: { overview: Overview }) {
	const items = milestones(overview)
	const done = items.filter(item => item.done).length
	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-baseline justify-between gap-4">
				<h3 className="text-base font-semibold">Your first steps</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{done} of {items.length} done
				</span>
			</div>
			<ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
				{items.map((item, index) => (
					<li key={item.label}>
						<Link
							href={item.href}
							className={cn(
								"flex h-full flex-col gap-3 rounded-xl border bg-card p-4 transition-colors duration-150 hover:bg-muted/50",
								item.done && "border-transparent bg-muted/40",
							)}
						>
							<span
								className={cn(
									"grid size-7 place-items-center rounded-full border text-xs font-semibold tabular-nums",
									item.done && "border-transparent bg-creative text-white",
								)}
							>
								{item.done ? <Check className="size-4" /> : index + 1}
							</span>
							<span className="flex flex-col gap-1">
								<span className="text-sm font-medium">{item.label}</span>
								<span className="text-xs leading-5 text-muted-foreground">
									{item.value}
								</span>
							</span>
						</Link>
					</li>
				))}
			</ol>
			<p className="text-xs text-muted-foreground">
				Saved data and your own confirmations are tracked separately. Existing data doesn’t
				tick these off on its own.
			</p>
		</section>
	)
}

function PracticeLessons({ overview }: { overview: Overview }) {
	const next = practiceLessons.find(lesson => !overview.learning.completed.includes(lesson.id))
	return (
		<section className="flex flex-col gap-3">
			<div>
				<h3 className="text-base font-semibold">Practice with sample data</h3>
				<p className="text-sm text-muted-foreground">
					Lessons use sample values only. Your financial data stays untouched.
				</p>
			</div>
			<div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
				{practiceLessons.map(lesson => {
					const Icon = lessonIcons[lesson.id] ?? Utensils
					const completed = overview.learning.completed.includes(lesson.id)
					const upNext = lesson.id === next?.id
					return (
						<Link
							key={lesson.id}
							href={pathHelpPractice(lesson.id)}
							className={cn(
								"group flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors duration-150 hover:bg-muted/50",
								upNext && "ring-2 ring-foreground/10",
							)}
						>
							<span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted">
								<Icon className="size-5" />
							</span>
							<span className="flex min-w-0 flex-1 flex-col">
								<span className="text-sm font-medium">{lesson.title}</span>
								<span className="text-xs text-muted-foreground">
									{completed
										? "Completed · replay any time"
										: upNext
											? "Up next"
											: "Not started"}
								</span>
							</span>
							{completed ? (
								<Check className="size-4 shrink-0 text-creative" />
							) : (
								<ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
							)}
						</Link>
					)
				})}
			</div>
		</section>
	)
}

function Questions({ overview, query }: { overview?: Overview; query: string }) {
	const matches = guideTopics.filter(item =>
		`${item.title} ${item.keywords} ${item.problem} ${item.explanation} ${item.fix}`
			.toLowerCase()
			.includes(query),
	)
	if (!matches.length)
		return (
			<p className="text-sm text-muted-foreground" aria-live="polite">
				No matching guide. Try “amount”, “Pending”, “import”, or “backup”.
			</p>
		)
	return (
		<section className="flex flex-col gap-3" aria-live="polite">
			{!query && <h3 className="text-base font-semibold">Browse by question</h3>}
			<div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
				{[...new Set(matches.map(item => item.group))].map(group => (
					<div key={group} className="min-w-0">
						<h4 className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
							<span
								className="size-1.5 rounded-full"
								style={{ background: accentFor(group) }}
							/>
							{group}
						</h4>
						<ul className="divide-y">
							{matches
								.filter(item => item.group === group)
								.map(item => (
									<li key={item.id}>
										<Link
											href={pathHelp(item.id)}
											className="group flex min-h-12 items-center justify-between gap-3 py-2.5 text-sm"
										>
											<span className="group-hover:underline group-hover:underline-offset-4">
												{item.title}
											</span>
											{overview?.learning.reviewed.includes(item.id) ? (
												<Check
													className="size-4 shrink-0 text-creative"
													aria-label="Reviewed"
												/>
											) : (
												<ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
											)}
										</Link>
									</li>
								))}
						</ul>
					</div>
				))}
			</div>
		</section>
	)
}

export default function HelpPage() {
	const params = useSearchParams()
	const topicId = params.get("topic")
	const topic = topicId ? getGuideTopic(topicId) : null
	const [search, setSearch] = useState("")
	const overview = useLiveQuery(getLearningOverview, [])
	const query = search.trim().toLowerCase()

	if (topic)
		return (
			<PageContent>
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="-mb-2 w-fit text-muted-foreground"
				>
					<Link href={pathHelp()}>
						<ArrowLeft /> All questions
					</Link>
				</Button>
				<PageHeader
					title={topic.title}
					description={topic.group}
					icon="lucide:circle-help"
					subtitle="One question, concrete steps, and a way to check the result."
				/>
				<div className="flex max-w-3xl flex-col gap-6">
					<GuideArticle topic={topic} />
					<div className="flex flex-col items-start gap-2 border-t pt-5">
						<Button
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
									<Check /> Reviewed
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
			<div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
				<div className="flex flex-col justify-center gap-6">
					<PageHeader
						title="How can we help?"
						description="Help & guides"
						icon="lucide:circle-help"
						subtitle="Start with one purchase. Learn at your own pace, and come back whenever something looks off."
					/>
					<div className="relative max-w-xl">
						<label htmlFor="guide-search" className="sr-only">
							Search the guides
						</label>
						<Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							id="guide-search"
							type="search"
							value={search}
							onChange={event => setSearch(event.target.value)}
							placeholder="Search: Pending, import, refund, backup…"
							className="h-12 rounded-xl pl-11 text-base md:text-sm"
						/>
					</div>
				</div>
				{!query && <VideoCard />}
			</div>
			{query ? (
				<Questions overview={overview} query={query} />
			) : (
				<>
					{overview && <Progress overview={overview} />}
					<div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
						<Questions overview={overview} query="" />
						{overview && <PracticeLessons overview={overview} />}
					</div>
					<p className="text-xs text-muted-foreground">
						Learning progress stays in this browser. It isn’t included in financial
						backups or Google Drive sync.
					</p>
				</>
			)}
		</PageContent>
	)
}
