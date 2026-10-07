"use client"

import Link from "next/link"
import { GuideCheckActions } from "@/components/help/guide-check-actions"
import { Button } from "@/components/ui/button"
import { type GuideTopic } from "@/lib/guide-content"
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

export function GuideArticle({ topic, compact = false }: { topic: GuideTopic; compact?: boolean }) {
	const destination = destinations[topic.destination]
	return (
		<div className="flex max-w-3xl flex-col gap-5 text-sm leading-6">
			<p className="text-muted-foreground">{topic.problem}</p>
			<p>{topic.explanation}</p>
			<div className="rounded-lg border bg-muted/30 p-4">
				<p className="mb-1 font-medium">A concrete example</p>
				<p>{topic.example}</p>
			</div>
			<div>
				<h3 className="mb-3 font-semibold">Try it step by step</h3>
				<ol className="list-decimal space-y-3 pl-5">
					{topic.steps.map(step => (
						<li key={step} className="pl-1">
							{step}
						</li>
					))}
				</ol>
			</div>
			<div>
				<h3 className="mb-1 font-semibold">Check your result</h3>
				<p>{topic.check}</p>
			</div>
			<div className="rounded-lg border p-4">
				<h3 className="mb-1 font-semibold">If something looks wrong</h3>
				<p>{topic.fix}</p>
			</div>
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
