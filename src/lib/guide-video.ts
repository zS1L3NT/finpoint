import timeline from "./guide-video-timeline.json"

export function getVideoChapter(id: string | null | undefined) {
	const chapter = timeline.chapters.find(item => item.id === id) ?? timeline.chapters[0]
	if (!chapter) throw new Error("The beginner video needs a start chapter.")
	return chapter
}

/** A frame count as the film's m:ss clock. */
export function clock(frame: number) {
	const seconds = Math.floor(frame / timeline.fps)
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}
