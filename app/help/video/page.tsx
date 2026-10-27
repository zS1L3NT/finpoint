"use client"

import { useLiveQuery } from "dexie-react-hooks"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getVideoChapter } from "@/lib/guide-video"
import timeline from "@/lib/guide-video-timeline.json"
import { cn } from "@/lib/utils"
import { getLearning } from "@/logic/learning"
import { pathHelp, pathHelpVideo } from "@/routes"

const VideoPlayer = dynamic(() => import("@/components/help/guide-video-player"), { ssr: false })

function clock(frame: number) {
	const seconds = Math.floor(frame / timeline.fps)
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

export default function GuideVideoPage() {
	const params = useSearchParams()
	const requested = timeline.chapters.find(item => item.id === params.get("chapter"))
	const learning = useLiveQuery(getLearning, [])
	const [seekVersion, setSeekVersion] = useState(0)
	const [activeId, setActiveId] = useState(requested?.id ?? "start")
	const active = getVideoChapter(activeId)
	const activeNumber = timeline.chapters.indexOf(active) + 1
	const startFrame =
		requested?.startFrame ?? Math.min(learning?.videoFrame ?? 0, timeline.durationInFrames - 1)
	return (
		<PageContent>
			<PageHeader
				title="Finpoint, from the beginning"
				description="Narrated video guide"
				icon="lucide:video"
				subtitle={`${timeline.chapters.length} chapters · ${clock(timeline.durationInFrames)} total · pick a chapter or resume where you paused. Nothing plays until you press play.`}
				actions={
					<Button asChild variant="outline" size="sm">
						<Link href={pathHelp()}>
							<IconifyIcon icon="lucide:list" /> All help topics
						</Link>
					</Button>
				}
			/>
			<div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
				<div className="flex min-w-0 flex-col gap-6">
					<div className="aspect-video w-full overflow-hidden rounded-xl border bg-black">
						{learning && (
							<VideoPlayer
								seekVersion={seekVersion}
								initialFrame={startFrame}
								chapterFrame={requested?.startFrame ?? null}
								onChapterChange={setActiveId}
							/>
						)}
					</div>
					<Card className="gap-0 py-0">
						<CardHeader className="flex flex-row items-start justify-between gap-3 border-b py-4">
							<div className="grid min-w-0 gap-1">
								<CardTitle>{active.title}</CardTitle>
								<CardDescription>
									Chapter {activeNumber} · {active.group} · starts at{" "}
									{clock(active.startFrame)}
								</CardDescription>
							</div>
							<Button asChild variant="outline" size="sm">
								<Link href={pathHelp(activeId)}>
									<IconifyIcon icon="lucide:book-open" /> Read article
								</Link>
							</Button>
						</CardHeader>
						<CardContent className="grid gap-4 py-4">
							<ol className="grid gap-3 text-sm leading-6">
								{active.segments.map(segment => (
									<li key={segment.audio} className="flex gap-3">
										{segment.step ? (
											<span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border text-xs font-medium tabular-nums">
												{segment.step}
											</span>
										) : null}
										<p>{segment.text}</p>
									</li>
								))}
							</ol>
							<p className="text-xs text-muted-foreground">
								Illustrations and real Finpoint screens filled with fictional sample
								data, narrated by a synthetic voice. They are not recordings of your
								workspace.
							</p>
						</CardContent>
						<div className="flex flex-wrap gap-2 border-t px-4 py-3">
							<Button asChild variant="outline" size="sm">
								<a href="/guide/transcript.txt" download>
									<IconifyIcon icon="lucide:file-text" /> Full transcript
								</a>
							</Button>
							<Button asChild variant="outline" size="sm">
								<a href="/guide/finpoint-guide.vtt" download>
									<IconifyIcon icon="lucide:captions" /> Captions
								</a>
							</Button>
						</div>
					</Card>
				</div>
				<Card className="min-w-0 gap-0 py-0 xl:sticky xl:top-4">
					<CardHeader className="border-b py-4">
						<CardTitle>Chapters</CardTitle>
						<CardDescription>
							{timeline.chapters.length} chapters · {clock(timeline.durationInFrames)}
						</CardDescription>
					</CardHeader>
					<nav aria-label="Video chapters">
						<ol>
							{timeline.chapters.map((chapter, index) => {
								const current = chapter.id === activeId
								return (
									<li key={chapter.id} className="border-b last:border-b-0">
										<Link
											href={pathHelpVideo(chapter.id)}
											onClick={() =>
												chapter.id === requested?.id &&
												setSeekVersion(value => value + 1)
											}
											scroll={false}
											aria-current={current ? "true" : undefined}
											className={cn(
												"flex items-start gap-3 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-muted/50",
												current && "bg-muted font-medium",
											)}
										>
											<span className="w-5 shrink-0 text-xs leading-5 text-muted-foreground tabular-nums">
												{String(index + 1).padStart(2, "0")}
											</span>
											<span className="grid min-w-0 flex-1 gap-0.5">
												<span>{chapter.title}</span>
												<span className="text-xs font-normal text-muted-foreground">
													{chapter.group}
												</span>
											</span>
											<span className="shrink-0 text-xs leading-5 text-muted-foreground tabular-nums">
												{clock(chapter.durationInFrames)}
											</span>
										</Link>
									</li>
								)
							})}
						</ol>
					</nav>
				</Card>
			</div>
		</PageContent>
	)
}
