"use client"

import { ChevronDown, CircleCheck, TriangleAlert } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { GuideCheckActions } from "@/components/help/guide-check-actions"
import { Button } from "@/components/ui/button"
import { type GuideTopic } from "@/lib/guide-content"
import { filmChapters } from "@/lib/guide-video-script"
import {
	pathAllocator,
	pathBudgets,
	pathCategories,
	pathDashboard,
	pathDataSettings,
	pathHelp,
	pathHelpPractice,
	pathHelpVideo,
	pathImporter,
	pathRecords,
	pathSettings,
} from "@/routes"

const destinations = {
	importer: { href: pathImporter(), label: "Open Importer" },
	allocator: { href: pathAllocator(), label: "Open Allocator" },
	records: { href: pathRecords(), label: "Open Records" },
	categories: { href: pathCategories(), label: "Open Categories" },
	budgets: { href: pathBudgets(), label: "Open Budgets" },
	sync: { href: pathDataSettings(), label: "Open Sync" },
	dashboard: { href: pathDashboard(), label: "Open Dashboard" },
	settings: { href: pathSettings(), label: "Open Settings" },
}

// Pictures render in the browser from the film's own scenes; nothing to show before then.
const Figure = dynamic(() => import("@/components/help/guide-figure"), { ssr: false })

/** Chapters whose film reuses the example picture for its idea; their articles open on the problem. */
const sameAsExample = new Set(["split", "repayment", "targets", "routine"])

export function GuideArticle({ topic, compact = false }: { topic: GuideTopic; compact?: boolean }) {
	const destination = destinations[topic.destination]
	const film = filmChapters.find(chapter => chapter.id === topic.id)
	return (
		<div className="flex max-w-3xl flex-col gap-6 text-sm leading-6">
			<p className="text-base leading-7 text-muted-foreground">{topic.problem}</p>
			<section className="flex flex-col gap-2">
				<Figure
					topic={topic.id}
					beat={sameAsExample.has(topic.id) ? "problem" : "idea"}
					caption={film?.idea}
				/>
				<details className="group text-muted-foreground">
					<summary className="w-fit cursor-pointer list-none text-xs font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground [&::-webkit-details-marker]:hidden">
						<span className="group-open:hidden">More detail</span>
						<span className="hidden group-open:inline">Less detail</span>
					</summary>
					<p className="mt-2">{topic.explanation}</p>
				</details>
			</section>
			<section>
				<h3 className="mb-3 font-semibold">Try it</h3>
				<ol className="flex flex-col gap-2.5">
					{topic.steps.map((step, index) => (
						<li key={step} className="flex gap-3">
							<span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold tabular-nums">
								{index + 1}
							</span>
							<span>{step}</span>
						</li>
					))}
				</ol>
			</section>
			<section>
				<h3 className="mb-3 font-semibold">Example</h3>
				<Figure topic={topic.id} beat="example" caption={film?.example ?? topic.example} />
			</section>
			<section>
				<h3 className="mb-3 flex items-center gap-2 font-semibold">
					<CircleCheck className="size-4 text-creative" /> Check your result
				</h3>
				<Figure topic={topic.id} beat="check" className="mb-2" />
				<p>{topic.check}</p>
			</section>
			<details className="group rounded-lg border px-4 py-3">
				<summary className="flex cursor-pointer list-none items-center gap-2 font-medium [&::-webkit-details-marker]:hidden">
					<TriangleAlert className="size-4 text-warning" />
					If something looks wrong
					<ChevronDown className="ml-auto size-4 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-180" />
				</summary>
				<p className="mt-2 text-muted-foreground">{topic.fix}</p>
			</details>
			{!compact && (
				<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
					<Button asChild size="lg" className="min-h-11">
						<Link href={destination.href}>{destination.label}</Link>
					</Button>
					<Button asChild variant="outline" size="lg" className="min-h-11">
						<Link href={pathHelpVideo(topic.id)}>Watch this chapter</Link>
					</Button>
					{["lunch", "pending", "split", "repayment"].includes(topic.id) && (
						<Button asChild variant="outline" size="lg" className="min-h-11">
							<Link href={pathHelpPractice(topic.id, pathHelp(topic.id))}>
								Try with sample data
							</Link>
						</Button>
					)}
				</div>
			)}
			<GuideCheckActions topic={topic.id} />
		</div>
	)
}
