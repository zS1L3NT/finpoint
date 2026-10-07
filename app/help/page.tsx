"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { ArrowRight, Check, Search } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { GuideArticle } from "@/components/help/guide-article"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getGuideTopic, guideTopics } from "@/lib/guide-content"
import { getLearningOverview, markGuideReviewed } from "@/logic/learning"
import { practiceLessons } from "@/logic/practice"
import { pathHelp, pathHelpPractice, pathHelpVideo } from "@/routes"

export default function HelpPage() {
	const params = useSearchParams()
	const topicId = params.get("topic")
	const topic = topicId ? getGuideTopic(topicId) : null
	const [search, setSearch] = useState("")
	const overview = useLiveQuery(getLearningOverview, [])
	const query = search.trim().toLowerCase()
	const matches = guideTopics.filter(item =>
		`${item.title} ${item.keywords} ${item.problem} ${item.explanation} ${item.fix}`
			.toLowerCase()
			.includes(query),
	)
	const nextLesson = practiceLessons.find(
		lesson => !overview?.learning.completed.includes(lesson.id),
	)
	return (
		<PageContent>
			<PageHeader
				title={topic?.title ?? "Help & guides"}
				description={topic?.group ?? "Learn Finpoint"}
				icon="lucide:circle-help"
				subtitle={
					topic
						? "One question, concrete steps, and a way to check the result."
						: "Start with one purchase. Learn at your own pace, and come back whenever you need help."
				}
				actions={
					<Button asChild variant="outline" size="lg" className="min-h-11">
						<Link href={pathHelpVideo()}>Watch the video guide</Link>
					</Button>
				}
			/>
			{topic ? (
				<div className="flex max-w-3xl flex-col gap-6">
					<Button asChild variant="outline" size="lg" className="min-h-11 w-fit">
						<Link href={pathHelp()}>Back to all questions</Link>
					</Button>
					<GuideArticle topic={topic} />
					<div className="flex flex-col items-start gap-2 border-t pt-5">
						<Button
							size="lg"
							className="min-h-11"
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
								"Mark this guide as reviewed"
							)}
						</Button>
						<p className="text-sm text-muted-foreground">
							This remembers that you read the guide. It does not certify your
							financial data.
						</p>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<div className="max-w-3xl">
						<label htmlFor="guide-search" className="mb-2 block text-sm font-medium">
							What are you trying to do?
						</label>
						<div className="relative">
							<Search className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground" />
							<Input
								id="guide-search"
								type="search"
								value={search}
								onChange={event => setSearch(event.target.value)}
								placeholder="Search: Pending, import, refund, backup…"
								className="min-h-11 pl-10 text-sm"
							/>
						</div>
					</div>
					{!query && (
						<>
							<Card>
								<CardHeader>
									<CardTitle>
										{nextLesson
											? "Your next practice lesson"
											: "You’ve completed all four practice lessons"}
									</CardTitle>
									<CardDescription className="text-sm leading-6">
										Sample lessons keep your financial data separate. You can
										pause, resume, or replay them.
									</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<p className="text-sm">
										{nextLesson?.title ??
											"Revisit a lesson below whenever you want a refresher."}
									</p>
									<Button asChild size="lg" className="min-h-11">
										<Link href={pathHelpPractice(nextLesson?.id ?? "lunch")}>
											{nextLesson
												? "Start or resume practice"
												: "Replay lunch"}
											<ArrowRight />
										</Link>
									</Button>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Your starting checklist</CardTitle>
									<CardDescription className="text-sm leading-6">
										Saved results, your confirmations, and reading progress are
										separate. Existing data does not automatically complete this
										checklist.
									</CardDescription>
								</CardHeader>
								<CardContent>
									{!overview ? (
										<Skeleton className="h-32 w-full" />
									) : (
										<ul className="divide-y text-sm">
											{[
												{
													label: "Bring in bank activity",
													value:
														overview.learning.lastImportAt &&
														overview.statements > 0
															? "Import completed · Statements are present"
															: `${overview.statements} Statements present · no guided import recorded`,
													href: pathHelp("import"),
												},
												{
													label: "Explain your activity",
													value:
														overview.recordStatus === "complete"
															? "Your saved Record still tallies"
															: overview.recordStatus === "pending"
																? "Your saved Record needs an Allocation check"
																: overview.recordStatus ===
																		"missing"
																	? "Your earlier Record is missing · choose another"
																	: `${overview.records} Records present · save one to track this step`,
													href: pathHelp("lunch"),
												},
												{
													label: "Review your month",
													value: overview.learning.reviewedMonth
														? overview.learning.reviewedMonth +
															" review (confirmed by you)"
														: "Review Dashboard and Monthly Records, then confirm",
													href: pathHelp("dashboard"),
												},
												{
													label: "Practice the core workflow",
													value: `${overview.learning.completed.length} of 4 sample lessons completed`,
													href: pathHelpPractice(
														nextLesson?.id ?? "lunch",
													),
												},
												{
													label: "Protect your data",
													value: overview.learning.backupLocatedAt
														? "File located (confirmed by you)"
														: overview.learning.backupRequestedAt
															? "Download requested · confirm you located the file"
															: "Request a backup, then locate your exported file",
													href: pathHelp("backup-first"),
												},
											].map(item => (
												<li
													key={item.label}
													className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-4"
												>
													<Link
														href={item.href}
														className="font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
													>
														{item.label}
													</Link>
													<span className="text-muted-foreground">
														{item.value}
													</span>
												</li>
											))}
										</ul>
									)}
								</CardContent>
							</Card>
						</>
					)}
					<div className="grid gap-6 lg:grid-cols-2" aria-live="polite">
						{[...new Set(matches.map(item => item.group))].map(group => (
							<section key={group} className="min-w-0">
								<h3 className="mb-2 text-base font-semibold">{group}</h3>
								<ul className="divide-y rounded-lg border bg-card px-4">
									{matches
										.filter(item => item.group === group)
										.map(item => (
											<li key={item.id}>
												<Link
													href={pathHelp(item.id)}
													className="flex min-h-14 items-center justify-between gap-3 py-3 text-sm hover:underline"
												>
													<span>{item.title}</span>
													{overview?.learning.reviewed.includes(
														item.id,
													) ? (
														<Check
															className="size-4 shrink-0"
															aria-label="Reviewed"
														/>
													) : (
														<ArrowRight className="size-4 shrink-0 text-muted-foreground" />
													)}
												</Link>
											</li>
										))}
								</ul>
							</section>
						))}
						{!matches.length && (
							<p className="text-sm text-muted-foreground">
								No matching guide. Try “amount”, “Pending”, “import”, or “backup”.
							</p>
						)}
					</div>
					{!query && (
						<section>
							<h3 className="mb-3 text-base font-semibold">
								Try it with sample data
							</h3>
							<div className="grid gap-3 sm:grid-cols-2">
								{practiceLessons.map(lesson => (
									<Link
										key={lesson.id}
										href={pathHelpPractice(lesson.id)}
										className="flex min-h-14 items-center justify-between gap-3 rounded-lg border p-4 text-sm hover:bg-muted/50"
									>
										<span>{lesson.title}</span>
										<Badge variant="outline">
											{overview?.learning.completed.includes(lesson.id)
												? "Completed"
												: "Practice"}
										</Badge>
									</Link>
								))}
							</div>
						</section>
					)}
					<p className="text-sm text-muted-foreground">
						Learning progress stays in this browser. It is not included in financial
						backups or Google Drive sync.
					</p>
				</div>
			)}
		</PageContent>
	)
}
