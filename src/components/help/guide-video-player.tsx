"use client"

import { Player, type PlayerRef, Thumbnail } from "@remotion/player"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { GuideFilm } from "@/components/help/guide-film"
import { getVideoChapter } from "@/lib/guide-video"
import timeline from "@/lib/guide-video-timeline.json"
import { saveVideoPosition } from "@/logic/learning"

export default function GuideVideoPlayer({
	startFrame,
	seekVersion,
	onChapterChange,
}: {
	startFrame: number
	seekVersion: number
	onChapterChange: (id: string) => void
}) {
	const player = useRef<PlayerRef>(null)
	const [reducedMotion, setReducedMotion] = useState(false)
	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)")
		const update = () => setReducedMotion(media.matches)
		update()
		media.addEventListener("change", update)
		return () => media.removeEventListener("change", update)
	}, [])
	useEffect(() => {
		if (seekVersion >= 0) {
			player.current?.pause()
			player.current?.seekTo(startFrame)
		}
	}, [startFrame, seekVersion])
	useEffect(() => {
		const instance = player.current
		if (!instance) return
		let previous = ""
		const update = () => {
			const frame = instance.getCurrentFrame()
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
			void saveVideoPosition(instance.getCurrentFrame()).catch(() =>
				toast.error(
					"Could not remember the video position. You can still choose a chapter.",
				),
			)
		}
		instance.addEventListener("frameupdate", update)
		instance.addEventListener("pause", remember)
		update()
		return () => {
			instance.removeEventListener("frameupdate", update)
			instance.removeEventListener("pause", remember)
		}
	}, [onChapterChange])
	return (
		<Player
			ref={player}
			component={GuideFilm}
			inputProps={{ reducedMotion }}
			durationInFrames={timeline.durationInFrames}
			fps={timeline.fps}
			compositionWidth={timeline.width}
			compositionHeight={timeline.height}
			initialFrame={startFrame}
			controls
			showVolumeControls
			showPosterWhenUnplayed
			renderPoster={() => (
				// Before the first play, hold on the chapter's finished title card instead of its
				// empty opening frame.
				<Thumbnail
					component={GuideFilm}
					inputProps={{ reducedMotion: true }}
					frameToDisplay={
						timeline.chapters.some(chapter => chapter.startFrame === startFrame)
							? startFrame + 60
							: startFrame
					}
					durationInFrames={timeline.durationInFrames}
					fps={timeline.fps}
					compositionWidth={timeline.width}
					compositionHeight={timeline.height}
					style={{ width: "100%", height: "100%", pointerEvents: "none" }}
				/>
			)}
			style={{ width: "100%", height: "100%" }}
			acknowledgeRemotionLicense
		/>
	)
}
