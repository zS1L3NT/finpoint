# Finpoint beginner video

Keep this editable Remotion project for the next design/animation pass. The in-app player and exported film use the same 16:9 composition and local narration: 16 short chapters mixing illustrations with real Finpoint screens, fictional sample data and a synthetic voice.

## Sources

- `../src/lib/guide.ts`: the guide itself. Chapters in four levels (The basics, Going further, Advanced, Your data), each a sequence of beats. A beat's `say` is narrated and captioned in the video and becomes an illustrated paragraph in the Help article; `detail` is article-only; `step` beats form a numbered tutorial. Introduce one idea per chapter, in the order a new user meets it.
- `../src/components/help/guide-film.tsx`: chapter structure. Each chapter opens on its title, then plays its beats: an illustrated **stage** (narration left, scene right) or a filmed **demo** (real Finpoint screen, narration as subtitles). Consecutive beats on the same take, or mapped to the same scene component, form one **run**: the picture stays mounted and continuous while only the narration changes, so a walkthrough never fades, restarts or jumps between instructions. Pictures crossfade only where the run changes.
- `../src/components/help/film/`: the motion system.
    - `scenes.tsx`: the registry of every beat's picture, keyed by chapter and beat id, plus the illustrated scenes. A demo is a list of moments in a take: play on to a marker or hold on one, where the camera looks (`focus`), what is highlighted, each starting on a spoken word. To keep a diagram on screen across beats, map those beats to the same component; its cues then span all of their words.
  - `demo.tsx`: plays those moments over the recorded take. A clip that would overrun the next spoken cue is sped up (to 2.5×) so re-recorded takes stay in sync with the narration; a hold without its own `focus` keeps the camera where it is.
  - `theme.ts`, `motion.tsx`, `kit.tsx`, `captions.tsx`, `chrome.tsx`: colours and geometry, word cues and animation helpers, cards and connectors, word-by-word captions, title cards and header.
  - `scene-still.tsx`: a beat's finished picture, used as the Help article illustrations.
- `../src/lib/guide-video-timeline.json`, `../src/lib/guide-video-cues.json`: generated narration and word timings.
- `../src/lib/guide-video-takes.json`, `../public/guide-takes/`: generated recordings of the real app (one MP4 per take, a poster per marker) and, per marker, the boxes of the controls the demos point at.
- `../public/guide-audio/`: narration clips, one per beat. `narration.json` caches their settings and sentence positions.
- `src/root.tsx`: the `FinpointGuide` composition.

Install dependencies with `bun install` in both the repository root and this folder. Run `npm run dev` here for Remotion Studio; run it in the root for Finpoint on port 5173.

## Rebuild everything

The film is generated, so it can follow the app after any UI, theme or copy change. From the repository root:

```sh
bun run video:build                   # build the app, film the takes, narrate, render
bun run video:build --skip=narrate    # skip any of: app, capture, narrate, render
```

Nothing beyond `bun install` and the Kokoro setup below is needed: FFmpeg falls back to the copy Remotion ships (`FFMPEG=` to override), Chromium to a system install (`CHROMIUM=`), and capture serves the production build itself on port 5174 (`FINPOINT_URL=` to film a running app).

## Recapture the real UI

`bun run video:capture` (after `bun run build`) drives a fresh dark-mode workspace through the guide's story in `scripts/capture.ts`, recording each flow as one continuous take with a smooth on-screen cursor. Only the story's own Statements are ever on screen: each chapter's bank rows are imported off camera just before its take, and a September history plus the salary and a savings transfer are explained off camera so the Dashboard has real comparisons and a savings section.

It rewrites `public/guide-takes/` and `src/lib/guide-video-takes.json`. Marker and box names (`creator`, `saved`, `allocation`, …) are what `scenes.tsx` refers to, so keep them stable; the script warns when a box can't be found. Boxes are clipped to the visible screen. Check the affected chapters in Remotion Studio afterwards.

## Regenerate narration

From the repository root:

```sh
bun video/scripts/narrate.ts
```

Uses [Kokoro](https://github.com/thewh1teagle/kokoro-onnx) (voice `af_heart`, speed 0.95). One-time setup into `video/.kokoro` (ignored by Git):

```sh
mkdir -p video/.kokoro && cd video/.kokoro
uv venv && uv pip install kokoro-onnx soundfile
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

Set `KOKORO_DIR` (or `KOKORO_PYTHON`) to use a setup elsewhere. Each beat is spoken in one breath, so its sentences flow with the voice's own rhythm; sentence positions (for captions and word cues) are recovered from the pauses the voice takes. Fixed pauses go only after the title and between beats and chapters, all set at the top of `scripts/narrate.ts`. Changing the voice, speed or pauses regenerates every clip; otherwise only changed sections are re-spoken. The script writes the timeline, word cues, transcript and sentence-level WebVTT captions together.

Re-render after changing copy or audio. Visuals and camera moves start on words in the narration and fall back to fixed delays when a word disappears, so check the affected chapter in Remotion Studio after rewording.

## Export

From this folder:

```sh
npx remotion render FinpointGuide out/finpoint-beginner-guide.mp4 --codec=h264 --crf=20
```

Exports 1920 × 1080 H.264 with audio (`bun run video:build` does the same). Don't pass a fractional `--scale` such as 0.667: Remotion rejects the non-integer frame size. `out/` is ignored by Git; preserve or copy the rendered file separately. The app renders the composition directly and does not need the MP4 hosted.

Captions and transcript are `../public/finpoint-guide.vtt` and `../public/finpoint-guide-transcript.txt`, downloadable in the app. The MP4 has visible instructional text but no separate selectable subtitle track.

Run `npx tsc --noEmit` here and app lint/types/build in the root. Preview long titles, signed amounts, chapter seeking, pause/resume, phone widths, and reduced motion. See `../docs/finpoint-guide-implementation.md` for the integration and review boundary.
