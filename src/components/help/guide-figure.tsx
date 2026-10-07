"use client"

import { Thumbnail } from "@remotion/player"
import { Play } from "lucide-react"
import Link from "next/link"
import { SceneStill, stillFrame } from "@/components/help/film/scene-still"
import { color } from "@/components/help/film/theme"
import timeline from "@/lib/guide-video-timeline.json"
import { cn } from "@/lib/utils"
import { pathHelpVideo } from "@/routes"

/**
 * A picture for a Help article, drawn live from the matching scene of the video guide, so the
 * articles and the film always show the same thing. Links to that chapter of the video.
 */
export default function GuideFigure({
	topic,
	beat,
	caption,
	className,
}: {
	topic: string
	beat: string
	caption?: React.ReactNode
	className?: string
}) {
	const found = stillFrame(topic, beat)
	if (!found) return null
	return (
		<figure className={cn("flex flex-col gap-2", className)}>
			<Link
				href={pathHelpVideo(topic)}
				className="group relative block overflow-hidden rounded-xl ring-1 ring-border"
				style={{ aspectRatio: `${found.width} / ${found.height}`, background: color.night }}
				aria-label="Watch this in the video guide"
			>
				<Thumbnail
					component={SceneStill}
					inputProps={{ chapterId: topic, beatId: beat }}
					compositionWidth={found.width}
					compositionHeight={found.height}
					frameToDisplay={found.frame}
					durationInFrames={found.segment.durationInFrames}
					fps={timeline.fps}
					style={{ width: "100%", height: "100%", pointerEvents: "none" }}
				/>
				<span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-black opacity-0 shadow-md transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
					<Play className="size-3 fill-current" /> Watch
				</span>
			</Link>
			{caption && (
				<figcaption className="text-sm leading-6 text-muted-foreground">
					{caption}
				</figcaption>
			)}
		</figure>
	)
}
