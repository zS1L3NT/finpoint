"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { getVideoChapter } from "@/lib/guide-video"
import timeline from "@/lib/guide-video-timeline.json"
import { saveVideoPosition } from "@/logic/learning"

/** The rendered guide film (`bun run video:build`), with its captions and chapter marks. */
export default function GuideVideoPlayer({
	startFrame,
	seekVersion,
	onChapterChange,
}: {
	startFrame: number
	seekVersion: number
	onChapterChange: (id: string) => void
}) {
	const video = useRef<HTMLVideoElement>(null)
	useEffect(() => {
		const element = video.current
		if (!element || seekVersion < 0) return
		element.pause()
		element.currentTime = startFrame / timeline.fps
	}, [startFrame, seekVersion])
	useEffect(() => {
		const element = video.current
		if (!element) return
		let previous = ""
		const update = () => {
			const frame = element.currentTime * timeline.fps
			const chapter =
				timeline.chapters.find(
					item =>
						frame >= item.startFrame && frame < item.startFrame + item.durationInFrames,
				) ?? getVideoChapter("start")
			if (previous !== chapter.id) {
				previous = chapter.id
				onChapterChange(chapter.id)
			}
		}
		const remember = () => {
			void saveVideoPosition(Math.round(element.currentTime * timeline.fps)).catch(() =>
				toast.error(
					"Could not remember the video position. You can still choose a chapter.",
				),
			)
		}
		element.addEventListener("timeupdate", update)
		element.addEventListener("pause", remember)
		update()
		return () => {
			element.removeEventListener("timeupdate", update)
			element.removeEventListener("pause", remember)
		}
	}, [onChapterChange])
	return (
		<video
			ref={video}
			className="size-full"
			src={`/guide/finpoint-guide.mp4#t=${(startFrame / timeline.fps).toFixed(2)}`}
			poster="/guide/poster.jpg"
			controls
			preload="metadata"
			playsInline
		>
			<track kind="captions" src="/guide/finpoint-guide.vtt" srcLang="en" label="English" />
			<track
				kind="chapters"
				src="/guide/chapters.vtt"
				srcLang="en"
				label="Chapters"
				default
			/>
		</video>
	)
}
