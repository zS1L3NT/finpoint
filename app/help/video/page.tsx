"use client"

import { useLiveQuery } from "dexie-react-hooks"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getVideoChapter } from "@/lib/guide-video"
import timeline from "@/lib/guide-video-timeline.json"
import { getLearning } from "@/logic/learning"
import { pathHelp, pathHelpPractice, pathHelpVideo } from "@/routes"

const VideoPlayer = dynamic(() => import("@/components/help/guide-video-player"), {
	ssr: false,
	loading: () => <Skeleton className="aspect-square w-full" />,
})

function clock(frame: number) {
	const seconds = Math.floor(frame / timeline.fps)
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

export default function GuideVideoPage() {
	const router = useRouter()
	const params = useSearchParams()
	const requested = timeline.chapters.find(item => item.id === params.get("chapter"))
	const learning = useLiveQuery(getLearning, [])
	const [seekVersion, setSeekVersion] = useState(0)
	const [activeId, setActiveId] = useState(requested?.id ?? "start")
	const active = getVideoChapter(activeId)
	const startFrame =
		requested?.startFrame ?? Math.min(learning?.videoFrame ?? 0, timeline.durationInFrames - 1)
	return (
		<PageContent>
			<PageHeader
				title="Finpoint, from the beginning"
				description="Narrated video guide"
				icon="lucide:video"
				subtitle={`17 chapters · ${clock(timeline.durationInFrames)} total · choose a chapter or resume where you paused. No autoplay.`}
				actions={
					<Button asChild variant="outline" size="lg" className="min-h-11">
						<Link href={pathHelp()}>All help topics</Link>
					</Button>
				}
			/>
			<div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
				<div className="flex min-w-0 flex-col gap-4">
					<label className="mx-auto flex w-full max-w-2xl flex-col gap-2 text-sm">
						<span className="font-medium">Jump to a chapter</span>
						<select
							className="min-h-11 w-full rounded-md border bg-background px-3 text-sm"
							value={activeId}
							onChange={event => {
								setSeekVersion(value => value + 1)
								router.push(pathHelpVideo(event.target.value), { scroll: false })
							}}
						>
							{timeline.chapters.map((chapter, index) => (
								<option key={chapter.id} value={chapter.id}>
									{index + 1}. {chapter.title}
								</option>
							))}
						</select>
					</label>
					<div className="mx-auto w-full max-w-2xl">
						{learning ? (
							<VideoPlayer
								seekVersion={seekVersion}
								startFrame={startFrame}
								onChapterChange={setActiveId}
							/>
						) : (
							<Skeleton className="aspect-square w-full" />
						)}
					</div>
					<p className="text-sm leading-6 text-muted-foreground">
						Illustrated explanations with sample amounts and a synthetic voice. These
						are teaching diagrams, not recordings of your workspace. All spoken guidance
						is available in the transcript.
					</p>
					<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
						<Button asChild variant="outline" size="lg" className="min-h-11">
							<a href="/finpoint-guide-transcript.txt" download>
								Download transcript
							</a>
						</Button>
						<Button asChild variant="outline" size="lg" className="min-h-11">
							<a href="/finpoint-guide.vtt" download>
								Download captions
							</a>
						</Button>
						<Button asChild size="lg" className="min-h-11">
							<Link
								href={pathHelpPractice(
									["lunch", "pending", "split", "repayment"].includes(activeId)
										? activeId
										: "lunch",
									pathHelpVideo(activeId),
								)}
							>
								Try sample practice
							</Link>
						</Button>
					</div>
					<section
						className="max-w-3xl rounded-lg border bg-card p-4 sm:p-6"
						aria-label="Current chapter transcript"
					>
						<p className="mb-2 text-sm text-muted-foreground">
							Current chapter · {clock(active.startFrame)}
						</p>
						<h3 className="mb-5 text-xl font-semibold">{active.title}</h3>
						<div className="space-y-5 text-sm leading-6">
							{active.segments.map(segment => (
								<div key={segment.audio}>
									<h4 className="mb-1 font-semibold">{segment.label}</h4>
									<p>{segment.text}</p>
								</div>
							))}
						</div>
						<Button asChild variant="outline" size="lg" className="mt-5 min-h-11">
							<Link href={pathHelp(activeId)}>Open step-by-step article</Link>
						</Button>
					</section>
				</div>
				<nav aria-label="Video chapters" className="min-w-0 rounded-lg border bg-card p-3">
					<h3 className="px-3 py-2 text-base font-semibold">Choose a chapter</h3>
					<ol>
						{timeline.chapters.map((chapter, index) => (
							<li key={chapter.id}>
								<Link
									href={pathHelpVideo(chapter.id)}
									onClick={() => setSeekVersion(value => value + 1)}
									scroll={false}
									aria-current={activeId === chapter.id ? "true" : undefined}
									className="flex min-h-14 gap-3 rounded-md px-3 py-3 text-sm hover:bg-muted aria-[current=true]:bg-muted"
								>
									<span className="mt-0.5 w-5 shrink-0 text-muted-foreground">
										{index + 1}
									</span>
									<span className="flex-1 leading-5">
										{chapter.title}
										<span className="mt-1 block text-xs text-muted-foreground">
											{clock(chapter.startFrame)} ·{" "}
											{clock(chapter.durationInFrames)}
										</span>
									</span>
								</Link>
							</li>
						))}
					</ol>
				</nav>
			</div>
		</PageContent>
	)
}
