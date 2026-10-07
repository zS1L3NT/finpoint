# Finpoint beginner video

Keep this editable Remotion project for the next design/animation pass. The in-app player and exported film use the same 16:9 composition and local narration: 17 short chapters with illustrated fictional examples and a synthetic voice.

## Sources

- `../src/lib/guide-video-script.ts`: the narration. Written to be heard, so it is shorter than the Help articles in `../src/lib/guide-content.ts` but covers the same chapters (same ids). Scenes time visuals to words in this copy.
- `../src/components/help/guide-film.tsx`: chapter structure. Each chapter opens on a title card, then plays problem → idea → steps → check → watch out (optional) → example layers that crossfade into one another.
- `../src/components/help/film/`: the motion system.
  - `theme.ts`: colours, easing and frame geometry. Every domain object keeps one colour for the whole film: Statement blue, Allocation violet, Record green, Pending amber.
  - `motion.tsx`: `useCue` (the frame a word is spoken), `Rise`, `Pop`, `CountUp`, `Roll`, and segment crossfades.
  - `kit.tsx`: Statement, Record and Allocation cards, flow connectors, tiles, files and windows.
  - `captions.tsx`: word-by-word narration captions, with domain terms in their colours.
  - `chrome.tsx`: backdrop, header, segment labels and title cards.
  - `scenes.tsx`: bespoke problem, explanation, example and (some) result visuals for each chapter, plus step icons. Restyle here while preserving domain meaning.
- `../src/lib/guide-video-timeline.json`: generated narration timings.
- `../src/lib/guide-video-cues.json`: generated word timings, so visuals land on the word that introduces them.
- `../public/guide-audio/`: local narration clips, one per section.
- `narration.json`: cache of each clip's settings and measured sentence positions, so unchanged clips are reused.
- `src/root.tsx`: editable `FinpointGuide` composition.

Install dependencies with `bun install` in both the repository root and this folder. Run `npm run dev` here for Remotion Studio; run it in the root for Finpoint on port 5173.

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

Re-render after changing copy or audio. Scenes fall back to fixed delays when a cued word disappears from the copy, so check the affected chapter in Remotion Studio.

## Export

From this folder:

```sh
npx remotion render FinpointGuide out/finpoint-beginner-guide.mp4 --scale=0.6666666667 --concurrency=4 --codec=h264 --crf=20
```

Exports 1280 × 720 H.264 with audio. Omit `--scale` for 1920 × 1080. `out/` is ignored by Git; preserve or copy the rendered file separately. The app renders the composition directly and does not need the MP4 hosted.

Captions and transcript are `../public/finpoint-guide.vtt` and `../public/finpoint-guide-transcript.txt`, downloadable in the app. The MP4 has visible instructional text but no separate selectable subtitle track.

Run `npx tsc --noEmit` here and app lint/types/build in the root. Preview long titles, signed amounts, chapter seeking, pause/resume, phone widths, and reduced motion. See `../docs/finpoint-guide-implementation.md` for the integration and review boundary.
