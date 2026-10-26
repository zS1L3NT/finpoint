# Finpoint illustrated scenes

Make the relationship move. A Statement stays on the left, its explanation stays on the right, and a named amount travels between them. Each spoken example gets room to be understood before the next replaces it.

## References and decisions

Research checked on 27 October 2026. These are design references, not imported artwork or claims that their exact timing has been measured.

- [ByteByteGo: How does HTTPS work?](https://bytebytego.com/guides/how-does-https-work/) and its [diagram](https://assets.bytebytego.com/diagrams/0220-how-does-https-work.png): stable endpoints, numbered stages and labelled messages make an invisible exchange legible. Apply that structure to Statement → Allocation → Record. ByteByteGo's [animation walkthrough](https://www.youtube.com/watch?v=p-88GN1WVs8) identifies Illustrator and After Effects as its tools; our implementation uses SVG paths and a seekable GSAP timeline. The page and diagram informed this pass; the video was not played for frame-by-frame timing analysis.
- [Stripe: Harbor](https://stripe.dev/blog/harbor-stripes-ai-assisted-prototyping-tool): the article shows a product composition moving from prototype to shipped page. Borrow its discipline of checking the animated idea in its final context. Finpoint uses real-app takes for controls; these diagrams explain relationships rather than pretending to be screenshots.
- [Linear: A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh): secondary navigation recedes while the task remains prominent. Keep the three-pattern rail quiet and give the current money flow the contrast.
- [Kurzgesagt: What we do](https://kurzgesagt.org/what-we-do?visit=videos): its explanation process joins research, illustration and animation. Our application is to give an abstract rule a concrete object and a visible consequence. Do not copy its characters or add decorative motion that competes with the narration.

The local reference is `e4ac61f^:src/components/help/film/kit.tsx` and `scenes.tsx`. The old `StatementCard`, `RecordCard`, `AllocationTag`, `Flow`, `Link`, `Meter`, `SplitFlow` and `RepaymentFlow` had recognisable icons, non-shrinking money, edge-connected curves and travelling pulses. Those are restored in the new system. Continuous pulses become one finite transfer per cue; large examples replace the former small simultaneous diagrams.

Registry search: `catalog --query 'flow diagram cards connectors' --json`. Inspected `flowchart` and `onboarding-stepper-flow` with CLI 0.8.203. Their SVG draw-on and milestone structure fit; their sticky-note/cursor and onboarding-button visuals do not fit financial explanation. The components here are purpose-built using those established patterns and the old Finpoint kit. No unused registry files or dependencies remain.

## Frame and typography

The master is 1920 × 1080. The content columns start at x=192 and x=1168, each 560 wide; the 416px middle channel belongs to connectors. A two-reason comparison uses 720px columns at x=192 and x=1008. Use an 8px spacing rhythm, 24–32px card padding and at least 16px between card edges. A page heading starts at y=112. Diagrams occupy y=300–784, the short takeaway starts at y=800, and the bottom area remains available for film captions.

| Role | Size at 1080p | Use |
| --- | --- | --- |
| Scene heading | 64px / 1.1 | One short claim |
| Hero total | 100px / 1 | Dashboard result |
| Card amount | 48px | Fixed, signed, tabular figures |
| Card title | 44px / 1.15 | Full-width row, never beside the amount |
| Reason heading | 38px / 1.2 | One question per comparison column |
| Takeaway / amount chip | 36px | One sentence / one amount |
| Object label, meta, badge, rail | 28px | Supporting identification |

Inter is a bundled HyperFrames font. Money has a Unicode minus, an explicit plus for positive flow, and no line break. Titles get their own row; metadata and money share the row below. A long merchant name may wrap naturally, but must never push into money or a connector. Do not shrink text to repair a crowded layout: shorten supporting copy or give the example its own stage.

Review the same scene at 1080p and in the CLI's 360px phone sheet. On a narrow portrait phone, metadata is secondary and full-frame 16:9 text cannot all be comfortably read; the title, amount, direction and colour should carry the gist. Full-screen landscape is the reading target for the detailed labels. A portrait-specific film would need a separate stacked layout, not a scaled-down desktop diagram. Do not claim that a 28px label remains reading-size when reduced to 5px.

## Colour and object anatomy

`look.css` is the colour authority; `src/lib/guide-theme.ts` shares its core colours with Help. The scene builder copies those variables into each scene's scoped root. The app palette is unchanged.

| Role | Token | Meaning |
| --- | --- | --- |
| Statement | `--statement`, blue | Imported account activity; bank icon and explicit label |
| Record | `--record`, green | User explanation; receipt icon and explicit label |
| Allocation | `--allocation`, lavender | The signed amount linking a Statement to a Record |
| Pending / possible duplicate | `--pending`, amber | Requires attention; always include a status word or symbol |
| Budget | `--allocation`, lavender | Date-defined plan; calendar icon and Budget label distinguish it from a link |
| Monthly Budget | `--neutral` frame, named plan | Calendar-month comparison; never depict cash held in a container |
| Income / Spending / Saving | `--income` / `--spending` / `--saving` | Accounting treatment; separate from an object's colour |
| Transfer / excluded | `--neutral` | No contribution to the totals |
| Destructive action | `--danger` | Removal or error, not every negative amount |

A negative amount stays white. Positive cash movement carries a plus sign; its surrounding object's identity colour remains stable. Colour alone never communicates status. A card has a subtle tinted surface, 2px border, 24px radius, type icon, object label, title, fixed amount row and optional badge. Shadows separate layers without a glowing background wash.

## Motion grammar

| Event | Motion | Timing |
| --- | --- | --- |
| Object named | Fade and rise 22px, or slide 32px from its side | 0.55s, `power3.out` |
| Relationship named | Draw cubic SVG path from source edge to destination edge | 0.65s, `power2.inOut` |
| Amount assigned | Chip moves to the path midpoint; a white pulse continues to the destination | 1.1s, `power2.inOut`, starts cue + 0.12s |
| Destination receives | Small 1 → 1.035 → 1 emphasis | 0.44s total, `sine.inOut` |
| Total calculated | Count from zero and fill the supporting meter | 0.8s, `power2.out` |
| Next example | Previous stage fades and moves up 16px | 0.3s, `power2.in`; finish before next cue |
| Two related arrivals | Stagger the second card | 0.2–0.25s |

The amount chip remains after motion, so a still frame explains the link. The white pulse is a visual guide, not additional money. Split means one source port branches into two destinations; merge means two signed amounts reach one Record. Keep −$90 + $60 = −$30 visible as the result, so reimbursement is not mistaken for new spending. Never animate bank money disappearing because an Allocation was created: it changes explanation, not the imported Statement.

No idle loops, timers, random movement, media seeking or CSS transform competing with GSAP. One paused timeline per composition, registered last. Every move uses an absolute scene-local cue time. The scene's artwork is inside an authored timed `clip`; its children carry the animation. Declared holds are intentional while the narration explains the current state.

## Cue integration

Scenes still declare `cues` and parse `window.__hyperframes.getVariables().cues`. `T(key, fallback)` uses the per-mount narration cue, including zero. Fallbacks exist for standalone authoring, not film timing. File names, composition ids, beat registration and cue keys in `scenes.ts` are unchanged.

The model's vocabulary appears at `three`, `wS`, `wR`, `wA`; the example grows through `stmt`, `rec`, `rec2`, `alloc`, `alloc2`, `pat`; the stage changes at `comb` and `simp`. The merge's second flow lands on `share`, and lunch connects on `lunch`.

The Dashboard appears on `dash`, before the transfer at `calc` in the current narration. Its −$80 total remains unchanged when the unexplained −$12 Statement arrives at `imp`. The takeaway appears early enough to read; `expl` emphasises the result. Pending uses `two`, `tally`, `stmts`, `conf` without implying that both reasons must occur together.

No new narration is required for these proofs. Useful additional cues for a later pass: “link” before the first allocated amount, “nothing left” for a remaining-allocation meter, “back” for the repayment, “difference” for Pending mismatch, and “not counted” for the unexplained Statement. Add these only when those words actually occur in the revised script, then register them in `scenes.ts`. Current pauses between `rec2` and `alloc`, and `pat` and `comb`, are long; keep a readable hold or add a cue for the intervening explanation, rather than inventing a second financial event.

## Component APIs

The functions in `compositions/components/kit.ts` are build-time HTML components. They produce literal editable markup, not runtime-generated timed elements. `kit.css` and `motion.js` are embedded by `scene()` so sub-compositions remain self-contained and do not depend on script-loading order.

| API | Purpose |
| --- | --- |
| `card(id, kind, title, value, x, y, meta?, footer?)` | Statement, Record or Budget card; `kind` controls icon and colour; footer accepts authored component HTML. |
| `amount(value, chip?)` | Signed money; `chip=true` adds the pill used on a connector. |
| `badge(text, tone?)` | Explicit Pending, Duplicate?, or other status; default amber. |
| `connector(id, from, to, value, tone?)` | Cubic edge-to-edge SVG, arrow, port, travelling amount and pulse. |
| `split(id, [first, second])` | Two connectors sharing the standard left source port; ids end in `-1`, `-2`. |
| `merge(id, [first, second])` | Two connectors entering the standard right destination port. |
| `steps(id, labels)` | Quiet numbered rail; runtime `steps(selector, cueTimes)` advances emphasis. |
| `meter(id, tone?)` | Labelled-by-caller comparison bar; runtime `meter(selector, fraction, at)` fills it. |
| `dashboard(id, x, y, title, note)` | Hero total and meter; runtime `count('#id-value', signedValue, at)` updates the total. |
| `callout(id, text, tone?)` | Short takeaway in the lower safe zone. |
| `scene(id, duration, kicker, title, body, animation)` | Scoped template, palette, literal clip and paused timeline; append scene-local animation calls. |

Runtime helpers: `enter(selector, at, x?)`, `leave(selector, at)`, `emphasis(selector, at)`, `flow(idSelector, at)`, `meter(selector, fraction, at)`, `count(selector, value, at)`, and `steps(selector, cueTimes)`. They all add to the host's paused `tl`; none plays it.

`split` and `merge` target the documented standard ports. For other layouts call `connector` with the actual card edges. Components accept trusted authored HTML only in `footer` and `body`; text parameters are escaped. Put colour roles in `look.css`, layout in `kit.css`, and scene copy/cues in `scripts/visual-scenes.ts`.

## Build and verify

From the repository root:

```sh
bun video/scripts/visual-scenes.ts
bun video/scripts/visual-proof.ts
```

The first command writes only the three rebuilt scene files. The second copies those files and local GSAP into ignored `.hyperframes/visual-proof/<scene>/` projects with the exact cues and mount durations from the current `index.html`. It needs `bun install` in `video/`, but no takes or narration audio. Re-run it after composing a changed script. If narration exceeds the scene's declared envelope (90s for model, 24s for the other proofs), extend the duration passed to `scene()` before regeneration.

From `video/`:

```sh
npx --yes hyperframes@0.8.203 lint .hyperframes/visual-proof/model-diagram
npx --yes hyperframes@0.8.203 check .hyperframes/visual-proof/model-diagram --at 7.5,15.5,24,35.3,41.5,51.5,61,65,69 --json
npx --yes hyperframes@0.8.203 snapshot .hyperframes/visual-proof/model-diagram --at 7.5,35.3,41.5,61,69 --no-end --output .hyperframes/visual-review/after/model-diagram
```

Repeat for `pending-reasons` at 6,10,14 and `dashboard-source` at 5,7.3,9,17. Use `--review` for phone sheets and `--range 34.8,36.2 --frames 8 --no-end` for the Allocation motion. Snapshot times are scene-local in these fixtures. The full film adds its host start time.

## Remaining scenes

| Scene | Suggested treatment |
| --- | --- |
| `start-problem` | Keep the imported payments fixed while two meanings unfold beside the supermarket purchase; net the dinner repayment last. |
| `start-explain` | Reuse those objects and settle them into the bring → explain → see sequence. |
| `import-banks` | Move one export file from bank to Finpoint, then separate Statements into labelled Account lanes. |
| `import-download` | Zoom to the file extension; distinguish CSV/Excel from PDF with a clear accepted/rejected state. |
| `split-done` | Reuse the split flow, then drain a clearly labelled “Left to allocate” meter to $0. |
| `pending-when` | Place a Record on a date rail before the delayed Statement arrives. |
| `pending-statement` | Swap the Pending card for the confirmed Statement while its Allocation stays visibly connected. |
| `duplicate-export` | Keep account/day/amount aligned; change only the description, then reveal Duplicate? as a question. |
| `rule-recurring` | Pass repeated phone Statements through one rule and show Suggest versus Autofill as distinct outcomes. |
| `treatments` | Route a Record to the appropriate total; show a refund reducing Spending and Transfer contributing to none. |
| `treatment-override` | Preserve the Category while a single Record's treatment badge changes, making the exception explicit. |
| `monthly-budgets` | Advance a calendar-month selector over the same named plans; animate comparison amounts, not stored cash. |
| `budget-period` | Draw a date range across October and November into a Budget card and its own small dashboard. |
| `sync-local` | Put the data visibly inside the browser boundary; introduce backup destinations only when spoken. |
| `sync-conflict` | Compare two complete copies and move one whole copy into the chosen state without blending rows. |
| `routine-loop` | Use the step rail in two groups of three; finish with one return path to Import and Drive's backup badge. |

`card.html` is the fallback placeholder, not one of the 19 illustrated scenes. Keep it visibly diagnostic; do not decorate it into a plausible missing scene.
