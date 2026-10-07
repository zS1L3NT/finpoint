# Finpoint beginner video

Keep this editable Remotion project for the next design/animation pass. The in-app player and exported film use the same composition and local narration: 17 chapters, about 25 minutes, with illustrated fictional examples and a synthetic voice.

## Sources

- `../src/lib/guide-content.ts`: shared teaching copy for articles and narration.
- `../src/components/help/guide-film.tsx`: scene layout, diagrams, and motion. Restyle here while preserving domain meaning.
- `../src/lib/guide-video-timeline.json`: generated narration timings.
- `../public/guide-audio/`: 153 local narration clips.
- `src/root.tsx`: editable `FinpointGuide` composition.

Install dependencies with `bun install` in both the repository root and this folder. Run `npm run dev` here for Remotion Studio; run it in the root for Finpoint on port 5173.

## Regenerate narration

From the repository root:

```sh
bun video/scripts/narrate.ts
```

Uses macOS `say` (Samantha, 155 words/minute) and FFmpeg/FFprobe at `/opt/homebrew/bin`. Adjust those paths for another environment. Unchanged clips are reused; remove the audio clips before regenerating every clip with a different voice. The script updates the timeline, transcript, and WebVTT captions together. Re-render after changing copy or audio.

## Export

From this folder:

```sh
npx remotion render FinpointGuide out/finpoint-beginner-guide.mp4 --scale=0.6666666667 --concurrency=4 --codec=h264 --crf=20
```

Exports 720 × 720 H.264 with audio. Omit `--scale` for 1080 × 1080. `out/` is ignored by Git; preserve or copy the rendered file separately. The app renders the composition directly and does not need the MP4 hosted.

Captions and transcript are `../public/finpoint-guide.vtt` and `../public/finpoint-guide-transcript.txt`, downloadable in the app. The MP4 has visible instructional text but no separate selectable subtitle track.

Run `npx tsc --noEmit` here and app lint/types/build in the root. Preview long titles, signed amounts, chapter seeking, pause/resume, phone widths, and reduced motion. See `../docs/finpoint-guide-implementation.md` for the integration and review boundary.
