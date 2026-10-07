# Finpoint beginner video

Keep this editable Remotion project for the next design/animation pass. The in-app player and exported film use the same 16:9 composition and local narration: 16 short chapters mixing illustrations with real Finpoint screens, fictional sample data and a synthetic voice.

## Sources

- `../src/lib/guide.ts`: the guide itself. Chapters in four levels (The basics, Going further, Advanced, Your data), each a sequence of beats. A beat's `say` is narrated and captioned in the video and becomes an illustrated paragraph in the Help article; `detail` is article-only; `step` beats form a numbered tutorial. Introduce one idea per chapter, in the order a new user meets it.
- `../src/components/help/guide-film.tsx`: chapter structure. Each chapter opens on its title, then plays its beats as crossfading layers: an illustrated **stage** (narration left, scene right) or a filmed **demo** (real Finpoint screen, narration as subtitles).
- `../src/components/help/film/`: the motion system.
  - `scenes.tsx`: the registry of every beat's picture, keyed by chapter and beat id, plus the illustrated scenes. A demo is a list of moments: which screenshot, where the camera looks, where the cursor goes and clicks, what is highlighted, each starting on a spoken word.
  - `demo.tsx`: plays those moments over the real screenshots (camera, cursor, click ripples, highlight rings, notes).
  - `theme.ts`, `motion.tsx`, `kit.tsx`, `captions.tsx`, `chrome.tsx`: colours and geometry, word cues and animation helpers, cards and connectors, word-by-word captions, title cards and header.
  - `scene-still.tsx`: a beat's finished picture, used as the Help article illustrations.
- `../src/lib/guide-video-timeline.json`, `../src/lib/guide-video-cues.json`: generated narration and word timings.
- `../src/lib/guide-video-shots.json`, `../public/guide-shots/`: generated real-UI screenshots and the boxes of the controls the demos point at.
- `../public/guide-audio/`: narration clips, one per beat. `narration.json` caches their settings and sentence positions.
- `src/root.tsx`: the `FinpointGuide` composition.

Install dependencies with `bun install` in both the repository root and this folder. Run `npm run dev` here for Remotion Studio; run it in the root for Finpoint on port 5173.

## Recapture the real UI

The demos use screenshots of a real Finpoint workspace, filled by importing fictional bank exports through the Importer and then following the guide's story (lunch, the split supermarket trip, the shared dinner, the concert repayment, a pending statement and its replacement, a bucket target, …). Recapture after UI changes:

```sh
bun run build && npx next start --port 5174   # in another terminal
bun video/scripts/capture.ts                  # CHROMIUM=/path/to/chrome to use a specific browser
```

It rewrites `public/guide-shots/` and `src/lib/guide-video-shots.json`. Box names (`lunch`, `create`, `allocation`, …) are what `scenes.tsx` refers to, so keep them stable; the script warns when a box can't be found. Check the affected chapters in Remotion Studio afterwards.

## Regenerate narration

From the repository root:

```sh
bun video/scripts/narrate.ts
```

Uses [Kokoro](https://github.com/thewh1teagle/kokoro-onnx) (voice `af_heart`, speed 0.95) and FFmpeg on `PATH`. One-time setup into `video/.kokoro` (ignored by Git):

```sh
mkdir -p video/.kokoro && cd video/.kokoro
uv venv && uv pip install kokoro-onnx soundfile
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

Set `KOKORO_DIR` (or `KOKORO_PYTHON`) to use a setup elsewhere. Each sentence is spoken separately and laid out with fixed pauses (after the title, after each section label, between sentences, sections and chapters), all set at the top of `scripts/narrate.ts`. Changing the voice, speed or pauses regenerates every clip; otherwise only changed sections are re-spoken. The script writes the timeline, word cues, transcript and sentence-level WebVTT captions together.

Re-render after changing copy or audio. Visuals and camera moves start on words in the narration and fall back to fixed delays when a word disappears, so check the affected chapter in Remotion Studio after rewording.

## Export

From this folder:

```sh
npx remotion render FinpointGuide out/finpoint-beginner-guide.mp4 --scale=0.6666666667 --concurrency=4 --codec=h264 --crf=20
```

Exports 1280 × 720 H.264 with audio. Omit `--scale` for 1920 × 1080. `out/` is ignored by Git; preserve or copy the rendered file separately. The app renders the composition directly and does not need the MP4 hosted.

Captions and transcript are `../public/finpoint-guide.vtt` and `../public/finpoint-guide-transcript.txt`, downloadable in the app. The MP4 has visible instructional text but no separate selectable subtitle track.

Run `npx tsc --noEmit` here and app lint/types/build in the root. Preview long titles, signed amounts, chapter seeking, pause/resume, phone widths, and reduced motion. See `../docs/finpoint-guide-implementation.md` for the integration and review boundary.
