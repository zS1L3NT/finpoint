"use client"

import { Play } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { GuideCheckActions } from "@/components/help/guide-check-actions"
import { Button } from "@/components/ui/button"
import { type GuideBeat, type GuideChapter, practiceFor, stepOf } from "@/lib/guide"
import { cn } from "@/lib/utils"
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
	pathStatements,
} from "@/routes"

const destinations = {
	importer: { href: pathImporter(), label: "Open Importer" },
	allocator: { href: pathAllocator(), label: "Open Allocator" },
	records: { href: pathRecords(), label: "Open Records" },
	statements: { href: pathStatements(), label: "Open Statements" },
	categories: { href: pathCategories(), label: "Open Categories" },
	budgets: { href: pathBudgets(), label: "Open Budgets" },
	sync: { href: pathDataSettings(), label: "Open Data" },
	dashboard: { href: pathDashboard(), label: "Open Dashboard" },
}

// Pictures render in the browser from the video's own scenes; nothing to show before then.
const Figure = dynamic(() => import("@/components/help/guide-figure"), { ssr: false })

function Beat({
	chapter,
	beat,
	compact,
}: {
	chapter: GuideChapter
	beat: GuideBeat
	compact: boolean
}) {
	return (
		<div className="flex flex-col gap-2.5">
			<Figure topic={chapter.id} beat={beat.id} />
			<p className={cn(compact ? "text-sm leading-6" : "text-[0.9375rem] leading-7")}>
				{beat.say}
			</p>
			{beat.detail && (
				<p className="text-sm leading-6 text-muted-foreground">{beat.detail}</p>
			)}
		</div>
	)
}

/** Groups a chapter's beats so consecutive tutorial steps read as one numbered list. */
function sections(beats: GuideBeat[]) {
	const result: { steps: boolean; beats: GuideBeat[] }[] = []
	for (const beat of beats) {
		const last = result[result.length - 1]
		if (last && last.steps === Boolean(beat.step)) last.beats.push(beat)
		else result.push({ steps: Boolean(beat.step), beats: [beat] })
	}
	return result
}

/**
 * A guide chapter as a picture-led article: each beat of the video becomes a still from that
 * moment with its narration underneath, and tutorial steps are numbered.
 */
export function GuideArticle({
	chapter,
	compact = false,
}: {
	chapter: GuideChapter
	compact?: boolean
}) {
	const destination = chapter.destination ? destinations[chapter.destination] : null
	const practice = practiceFor[chapter.id]
	return (
		<div className={cn("flex max-w-3xl flex-col", compact ? "gap-6" : "gap-9")}>
			{sections(chapter.beats).map(section =>
				section.steps ? (
					<ol key={section.beats[0]?.id} className="flex flex-col gap-6">
						{section.beats.map(beat => (
							<li key={beat.id} className="flex gap-3">
								<span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background tabular-nums">
									{stepOf(chapter, beat.id)?.number}
								</span>
								<div className="min-w-0 flex-1">
									<Beat chapter={chapter} beat={beat} compact={compact} />
								</div>
							</li>
						))}
					</ol>
				) : (
					section.beats.map(beat => (
						<Beat key={beat.id} chapter={chapter} beat={beat} compact={compact} />
					))
				),
			)}
			{!compact && (
				<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
					{destination && (
						<Button asChild size="lg" className="min-h-11">
							<Link href={destination.href}>{destination.label}</Link>
						</Button>
					)}
					<Button asChild variant="outline" size="lg" className="min-h-11">
						<Link href={pathHelpVideo(chapter.id)}>
							<Play /> Watch this chapter
						</Link>
					</Button>
					{practice && (
						<Button asChild variant="outline" size="lg" className="min-h-11">
							<Link href={pathHelpPractice(practice, pathHelp(chapter.id))}>
								Try with sample data
							</Link>
						</Button>
					)}
				</div>
			)}
			<GuideCheckActions topic={chapter.id} />
		</div>
	)
}
