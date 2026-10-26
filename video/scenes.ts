// Which illustrated scene shows which beats. A beat recorded in a take (`video/takes.json`) needs
// no entry here; every other beat should be listed, or the film shows a placeholder card for it.
//
// A scene is a HyperFrames sub-composition in `compositions/scenes/<scene>.html`. It reads
// `cues` (a JSON object of seconds into the scene) from its variables and reveals each part as
// the narration names it, so rewording a beat only needs its cue words updated here.

/** A spoken word: `[beat, word or phrase, which occurrence]`. Without a word, the beat's start. */
export type CueRef = [beat: string, word?: string, nth?: number]

export type SceneUse = {
	/** Consecutive beats this scene shows, continuously. */
	beats: string[]
	scene: string
	/** Named moments the scene animates on. */
	cues?: Record<string, CueRef>
	/** Other variables the scene declares. */
	values?: Record<string, string | number | boolean>
}

export const scenes: Record<string, SceneUse[]> = {}
