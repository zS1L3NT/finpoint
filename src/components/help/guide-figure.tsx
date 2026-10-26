import { Play } from "lucide-react"
import Link from "next/link"
import { color } from "@/lib/guide-theme"
import { cn } from "@/lib/utils"
import { pathHelpVideo } from "@/routes"

/**
 * A picture for a Help article: the matching moment of the video guide, taken from the rendered
 * film, so the articles and the film always show the same thing. Links to that chapter of the video.
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
	return (
		<figure className={cn("flex flex-col gap-2", className)}>
			<Link
				href={pathHelpVideo(topic)}
				className="group relative block aspect-video overflow-hidden rounded-xl ring-1 ring-border"
				style={{ background: color.night }}
				aria-label="Watch this in the video guide"
			>
				<img
					src={`/guide/stills/${topic}-${beat}.jpg`}
					alt=""
					loading="lazy"
					className="size-full object-cover"
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
