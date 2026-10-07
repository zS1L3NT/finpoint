import { Composition } from "remotion"
import { GuideFilm } from "../../src/components/help/guide-film"
import timeline from "../../src/lib/guide-video-timeline.json"

export function RemotionRoot() {
	return (
		<Composition
			id="FinpointGuide"
			component={GuideFilm}
			durationInFrames={timeline.durationInFrames}
			fps={timeline.fps}
			width={timeline.width}
			height={timeline.height}
			defaultProps={{ reducedMotion: false }}
		/>
	)
}
