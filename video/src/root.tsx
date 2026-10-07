import { useEffect, useState } from "react"
import { Composition, continueRender, delayRender } from "remotion"
import { GuideFilm } from "../../src/components/help/guide-film"
import timeline from "../../src/lib/guide-video-timeline.json"

/** Holds the first frame until Inter has loaded, so renders never fall back to a system font. */
function FilmWithFonts(props: { reducedMotion: boolean }) {
	const [handle] = useState(() => delayRender("Loading Inter"))
	useEffect(() => {
		void document.fonts
			.load(`700 40px "Inter Variable"`)
			.then(() => document.fonts.ready)
			.then(() => continueRender(handle))
	}, [handle])
	return <GuideFilm {...props} />
}

export function RemotionRoot() {
	return (
		<Composition
			id="FinpointGuide"
			component={FilmWithFonts}
			durationInFrames={timeline.durationInFrames}
			fps={timeline.fps}
			width={timeline.width}
			height={timeline.height}
			defaultProps={{ reducedMotion: false }}
		/>
	)
}
