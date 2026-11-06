# Visual proof handoff

Rebuilt `model-diagram`, `pending-reasons` and `dashboard-source`. Filenames, composition ids and cue keys are preserved. The model now animates split, merge and one-to-one Allocations; Pending compares its two reasons; the Dashboard totals Records and stays unchanged when an unexplained Statement arrives.

See [VISUALS.md](VISUALS.md) for the visual direction, reference links, one-line component APIs, cue guidance and suggested treatments for the other 16 scenes. Source: `scripts/visual-scenes.ts`; components: `compositions/components/kit.ts`, `kit.css`, `motion.js`. Regenerate with `bun video/scripts/visual-scenes.ts` from the repository root.

## Snapshot evidence

Paths are relative to `video/`; snapshots remain local and ignored.

| Scene | Before | After |
| --- | --- | --- |
| Model | `.hyperframes/visual-review/before/model-diagram/contact-sheet.jpg` | `.hyperframes/visual-review/after/model-diagram/contact-sheet.jpg` |
| Pending | `.hyperframes/visual-review/before/pending-reasons/contact-sheet.jpg` | `.hyperframes/visual-review/after/pending-reasons/contact-sheet.jpg` |
| Dashboard | `.hyperframes/visual-review/before/dashboard-source/contact-sheet.jpg` | `.hyperframes/visual-review/after/dashboard-source/contact-sheet.jpg` |

Allocation motion: `.hyperframes/visual-review/motion/model-diagram/contact-sheet.jpg`. Phone review: `.hyperframes/visual-review/phone/model-diagram/review-phone.jpg`. Final label timing: `.hyperframes/visual-review/final-label-fix/contact-sheet.jpg`; inspected at 37.586, 38.3, 54.569 and 55.4 seconds. Labels wait until the moving chip has passed.

## Verification and limits

- HyperFrames 0.8.203 isolated scene checks pass for lint, runtime, layout and contrast. Final model check also passes at the four label-timing timestamps. Retained craft warnings concern silent fixtures, first-cue entrances and narration holds.
- Earlier verification passed repository lint and type checks, plus a separate type check for the video TypeScript. Domain tests reported 101 passes and one existing failure: `tests/domain/duplicates.test.ts:211` expects database version 6 while HEAD declares version 7.
- Full-project lint is blocked by 23 absent ignored `assets/takes/*.mp4` files. No full-film render, sound review or publish pass was performed.
- Detailed metadata needs landscape/full-screen playback on a phone. A portrait master needs a different layout.
- Budget cards and Duplicate? badges are available in the APIs but are not exercised by these three proofs.
- No new narration is required. Optional future cue words and all remaining scene treatments are listed in VISUALS.md.
- Structural graph refresh completed. Semantic documentation refresh was deferred for the fast handoff; graphify also reported 21 code files without symbols and renamed 27 communities by their hubs after clustering changed.
