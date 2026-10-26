# Finpoint beginner video

A HyperFrames project (HTML rendered to video). The film is generated from the guide's text, so it follows the app after any UI, theme or copy change. Viewers get the rendered MP4 at `/help/video`; Help articles show stills taken from it.

## How it fits together

- `../src/lib/guide.ts`: the guide itself. Chapters in four levels, each a sequence of beats. A beat's `say` is narrated and captioned in the video and becomes an illustrated paragraph in the Help article; `detail` is article-only.
- **Narration is the clock.** `scripts/narrate.ts` speaks each beat with Kokoro into `assets/narration/` and writes the timeline and word cues (`../src/lib/guide-video-*.json`), the captions and the transcript (`../public/guide/`).
- **Real-app takes.** `scripts/record.ts` films the app through a stage page (`scripts/stage.ts`) that frames it in an iframe. The camera (zoom and pan) and the highlight rings live on the stage, outside the app, and follow its elements live, so nothing about positions is stored. The story (`scripts/story.ts`) is a list of takes; each names the beats it shows and acts on spoken words: `await t.at("create", "Create Record")` waits for that word, then the next action lands on it. A take is one continuous recording across its beats, so there is no cutting, holding or speeding up afterwards. Takes land in `assets/takes/` (ignored by Git) and `takes.json`.
- **Illustrated scenes.** Every beat without a take is shown by a scene: a sub-composition in `compositions/scenes/`, registered in `scenes.ts` with the words it animates on. A beat with neither shows a placeholder card, and compose warns.
- **Composition.** `scripts/compose.ts` writes `index.html`: a title card per chapter, then runs of beats (a take or a scene stays on screen across all its beats; only a change of take or scene crossfades), narration on two alternating lanes, and captions per chapter. `look.css` holds the palette shared with the Help pages (`../src/lib/guide-theme.ts`).
- **Publishing.** `scripts/publish.ts` re-encodes the render into `../public/guide/finpoint-guide.mp4` with chapter marks, a poster and one still per beat.

## Rebuild everything

From the repository root:

```sh
bun run video:build                          # app, narrate, record, compose, render, publish
bun run video:build --skip=app,narrate       # skip any of those steps
```

Needs a system font with the ⌘ glyph (DejaVu Sans or Noto Sans Symbols 2; check with `fc-list ':charset=2318'`), or the sidebar's shortcut hint films as a box. Also needs FFmpeg on `PATH` (HyperFrames uses it too; `FFMPEG=` overrides the scripts' copy), Chromium (Playwright's, a system install, or `CHROMIUM=`), `bun install` here and in the root, and the Kokoro setup below. Record serves the production build on port 5174 (`FINPOINT_URL=` to film a running app).

## Author a take

```sh
bun run build && bun video/scripts/record.ts --headed lunch    # watch one take being filmed
bun video/scripts/compose.ts && (cd video && npm run dev)      # preview the film in HyperFrames Studio
```

Only the named takes are recorded; earlier takes still play through, without waiting, to build the data they depend on. Find controls by role and visible label, never by position or class. A take warns when an action lands late for its word; move the `t.at` earlier or trim what happens before it.

## Author a scene

Scenes follow the HyperFrames contract (read `.agents/skills/hyperframes/SKILL.md`). A scene declares a `cues` variable, reads it with `window.__hyperframes.getVariables()` (per-mount values don't reach `data-var-text`), and places each reveal at its cue. Its file name, root `data-composition-id` and timeline key match. Check with `npx hyperframes lint`, `check --json` and `snapshot` from this folder.

## Narration setup

One-time setup into `video/.kokoro` (ignored by Git):

```sh
mkdir -p video/.kokoro && cd video/.kokoro
uv venv && uv pip install kokoro-onnx soundfile
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

Set `KOKORO_DIR` (or `KOKORO_PYTHON`) to use a setup elsewhere. Voice, speed and pauses are at the top of `scripts/narrate.ts`; changing them regenerates every clip, otherwise only changed beats are re-spoken. After rewording a beat, re-record the takes that act on its words and recompose.
