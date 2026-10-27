"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { getVideoChapter } from "@/lib/guide-video"
import timeline from "@/lib/guide-video-timeline.json"
import { saveVideoPosition } from "@/logic/learning"

/** The rendered guide film (`bun run video:build`), with its captions and chapter marks. */
export default function GuideVideoPlayer({
	initialFrame,
	chapterFrame,
	seekVersion,
	onChapterChange,
}: {
	initialFrame: number
	chapterFrame: number | null
	seekVersion: number
	onChapterChange: (id: string) => void
}) {
	const video = useRef<HTMLVideoElement>(null)
	const [resumeFrame] = useState(initialFrame)
	// iPhone Safari rejects the whole video when it can't read a text track, so play without them.
	const [tracks, setTracks] = useState(true)
	useEffect(() => {
		if (!tracks) video.current?.load()
	}, [tracks])
	useEffect(() => {
		const element = video.current
		if (!element) return
		const seek = () => {
			if (chapterFrame !== null) element.pause()
			element.currentTime = (chapterFrame ?? resumeFrame) / timeline.fps
		}
		if (element.readyState >= 1) seek()
		else element.addEventListener("loadedmetadata", seek, { once: true })
		return () => element.removeEventListener("loadedmetadata", seek)
	}, [resumeFrame, chapterFrame, seekVersion])
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
			src="/guide/finpoint-guide.mp4"
			poster="/guide/poster.jpg"
			controls
			preload="metadata"
			playsInline
			onError={() => setTracks(false)}
		>
			{tracks && (
				<>
					<track
						kind="captions"
						src="/guide/finpoint-guide.vtt"
						srcLang="en"
						label="English"
					/>
					<track
						kind="chapters"
						src="/guide/chapters.vtt"
						srcLang="en"
						label="Chapters"
						default
					/>
				</>
			)}
		</video>
	)
}
