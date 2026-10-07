"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { ArrowRight, Captions, FileText, GraduationCap } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { accentFor, color } from "@/components/help/film/theme"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { getVideoChapter } from "@/lib/guide-video"
import timeline from "@/lib/guide-video-timeline.json"
import { cn } from "@/lib/utils"
import { getLearning } from "@/logic/learning"
import { pathHelp, pathHelpPractice, pathHelpVideo } from "@/routes"

const VideoPlayer = dynamic(() => import("@/components/help/guide-video-player"), { ssr: false })

const practiced = ["lunch", "pending", "split", "repayment"]

function clock(frame: number) {
	const seconds = Math.floor(frame / timeline.fps)
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

const labelTone = (label: string) =>
	label === "Check your result" ? color.record : label === "Watch out" ? color.pending : undefined

export default function GuideVideoPage() {
	const params = useSearchParams()
	const requested = timeline.chapters.find(item => item.id === params.get("chapter"))
	const learning = useLiveQuery(getLearning, [])
	const [seekVersion, setSeekVersion] = useState(0)
	const [activeId, setActiveId] = useState(requested?.id ?? "start")
	const active = getVideoChapter(activeId)
	const activeNumber = timeline.chapters.indexOf(active) + 1
	const accent = accentFor(active.group)
	const startFrame =
		requested?.startFrame ?? Math.min(learning?.videoFrame ?? 0, timeline.durationInFrames - 1)
	return (
		<PageContent>
			<PageHeader
				title="Finpoint, from the beginning"
				description="Narrated video guide"
				icon="lucide:video"
				subtitle={`17 chapters · ${clock(timeline.durationInFrames)} total · pick a chapter or resume where you paused. Nothing plays until you press play.`}
				actions={
					<Button asChild variant="outline" size="lg" className="min-h-11">
						<Link href={pathHelp()}>All help topics</Link>
					</Button>
				}
			/>
			<div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
				<div className="flex min-w-0 flex-col gap-5">
					<div
						className="mx-auto w-full max-w-5xl rounded-2xl p-1.5 shadow-2xl ring-1 ring-border transition-[background] duration-500"
						style={{
							background: `linear-gradient(140deg, ${accent}55, ${color.night} 45%, ${color.night})`,
						}}
					>
						<div className="aspect-video w-full overflow-hidden rounded-xl bg-[#08080a]">
							{learning && (
								<VideoPlayer
									seekVersion={seekVersion}
									startFrame={startFrame}
									onChapterChange={setActiveId}
								/>
							)}
						</div>
					</div>
					<div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="min-w-0">
							<p
								className="text-xs font-semibold tracking-[0.16em] uppercase"
								style={{ color: accent }}
							>
								Chapter {activeNumber} · {active.group}
							</p>
							<h3 className="mt-1 text-lg font-semibold text-balance">
								{active.title}
							</h3>
						</div>
						<div className="flex shrink-0 flex-wrap gap-2">
							<Button asChild size="lg" className="min-h-11">
								<Link
									href={pathHelpPractice(
										practiced.includes(activeId) ? activeId : "lunch",
										pathHelpVideo(activeId),
									)}
								>
									<GraduationCap /> Practice
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg" className="min-h-11">
								<Link href={pathHelp(activeId)}>
									Article <ArrowRight />
								</Link>
							</Button>
						</div>
					</div>
					<section
						className="mx-auto w-full max-w-5xl rounded-2xl border bg-card p-5 sm:p-7"
						aria-label="Current chapter transcript"
					>
						<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
							<p className="text-sm font-medium text-muted-foreground">
								Transcript · starts at {clock(active.startFrame)}
							</p>
							<div className="flex gap-2">
								<Button asChild variant="ghost" size="sm">
									<a href="/finpoint-guide-transcript.txt" download>
										<FileText /> Full transcript
									</a>
								</Button>
								<Button asChild variant="ghost" size="sm">
									<a href="/finpoint-guide.vtt" download>
										<Captions /> Captions
									</a>
								</Button>
							</div>
						</div>
						<ol className="flex flex-col gap-5 text-sm leading-6">
							{active.segments.map(segment => (
								<li
									key={segment.audio}
									className="border-l-2 pl-4"
									style={{
										borderColor: labelTone(segment.label) ?? "var(--border)",
									}}
								>
									<h4
										className="mb-1 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase"
										style={{ color: labelTone(segment.label) }}
									>
										{segment.label}
									</h4>
									<p>{segment.text}</p>
								</li>
							))}
						</ol>
						<p className="mt-6 text-xs leading-5 text-muted-foreground">
							Illustrated explanations with sample amounts and a synthetic voice.
							These are teaching diagrams, not recordings of your workspace.
						</p>
					</section>
				</div>
				<nav
					aria-label="Video chapters"
					className="min-w-0 rounded-2xl border bg-card p-2 xl:sticky xl:top-4"
				>
					<h3 className="px-3 pt-3 pb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
						Chapters
					</h3>
					<ol>
						{timeline.chapters.map((chapter, index) => {
							const current = chapter.id === activeId
							const tint = accentFor(chapter.group)
							return (
								<li key={chapter.id}>
									<Link
										href={pathHelpVideo(chapter.id)}
										onClick={() => setSeekVersion(value => value + 1)}
										scroll={false}
										aria-current={current ? "true" : undefined}
										className={cn(
											"relative flex min-h-12 items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150 hover:bg-muted",
											current && "bg-muted font-medium",
										)}
									>
										{current && (
											<span
												className="absolute top-2.5 bottom-2.5 left-0 w-1 rounded-full"
												style={{ background: tint }}
											/>
										)}
										<span className="mt-px flex w-8 shrink-0 items-center gap-1.5 text-muted-foreground tabular-nums">
											<span
												className="size-1.5 rounded-full"
												style={{ background: tint }}
											/>
											{String(index + 1).padStart(2, "0")}
										</span>
										<span className="flex-1 leading-5">
											{chapter.title}
											<span className="mt-0.5 block text-xs font-normal text-muted-foreground">
												{chapter.group}
											</span>
										</span>
										<span className="mt-px shrink-0 text-xs text-muted-foreground tabular-nums">
											{clock(chapter.durationInFrames)}
										</span>
									</Link>
								</li>
							)
						})}
					</ol>
				</nav>
			</div>
		</PageContent>
	)
}
