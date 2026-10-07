import timeline from "./guide-video-timeline.json"

export function getVideoChapter(id: string | null | undefined) {
	const chapter = timeline.chapters.find(item => item.id === id) ?? timeline.chapters[0]
	if (!chapter) throw new Error("The beginner video needs a start chapter.")
	return chapter
}
