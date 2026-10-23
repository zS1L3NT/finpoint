# Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)

Reviewer: Claude Opus 5.5. Read-only review, 2026-10-23. Only this report was written.
Diff reviewed: `git diff 4866e1c..d1ba358`. For `graphify-out/*` I checked health warnings only.
No browser was launched. The only commands I ran were list-only discovery commands
(`bunx playwright test --list`, with `PLAYWRIGHT_EXTERNAL_SERVERS=1` and a stdout reporter). They
created no files: the `test-results/` mtime was unchanged and `git status` still shows only `next-env.d.ts`.

## Summary table

| # | Item | Verdict |
|---|------|---------|
| 1 | Restructure fidelity | **PASS.** Two Low doc notes. |
| 2 | Gate integrity (`[UI-INVENTORY-PROJECTS]`, parser, ledger maps) | **PASS.** One Low–Medium objection and three Low notes. |
| 3 | Sidebar hardening | **OBJECTION, Medium.** The hydration gate is vacuous, so the bounded retry does all the work. Two Low notes. |
| 4 | Evidence audit | **CONDITIONAL.** Every one of the 11 R1 failures has the exact signature. 3 non-R1 mobile failures: 2 are resolved by d1ba358 with a post-fix run. **1 has no root cause** and is the only certification blocker. |
| — | Prior round (`opus-pending-race-oct23.md`) | **No regression.** `app/` and `src/` are untouched by this diff. The 1a/1b repairs from 4866e1c are intact. |

## 1. Restructure fidelity — PASS

I measured these myself with `--list` on d1ba358:

| Project | Listed | Plan (Opus §f) | Δ explained |
|---|---:|---:|---|
| chromium | 163 | 161 | +2: `[UI-INVENTORY-PARSER-TAGS]` and `[UI-INVENTORY-PROJECTS]`, both in `coverage.e2e.ts` |
| mobile | 144 | 144 | — (coverage is file-ignored on mobile, so the +2 does not reach it) |
| tall-desktop | 17 | 17 | — |
| light | 12 | 12 | — |
| reduced-motion | 26 | 26 | — |
| **Total** | **362** | 360 | +2, both static gate tests |
| `PLAYWRIGHT_FULL_MATRIX=1` | **749** | 747 | +2 (163+144+148+147+147) |

So the 362 and 749 figures are consistent with the plan, and the README and AGENTS.md counts are
correct. The difference is not a selection regression.

- **Tag placement matches Opus §(a) row by row.** I checked the piggyback listings directly:
  - tall-desktop: 17, including `tall-budget-motion`.
  - light: 12, including `route sweep core` only, as the plan specified.
  - reduced-motion: 26, including both looped `duplicate review exit` cases and `entrance motion` (`@desktop-only` + `@motion`).
  - chromium minus mobile: exactly the 4 `@desktop-only` tests plus the 3 file-ignored files. Mobile minus chromium: exactly the 1 `@mobile-only` touch test.
- **Reconciliation decisions are honoured.**
  - Project names are kept as `chromium`/`mobile`/`tall-desktop`/`light`/`reduced-motion`, with no `desktop` rename (`playwright.config.ts:38`).
  - Dark is the default (`playwright.config.ts:30`). `light` replaces `dark`. There is no 6th project.
  - The `FULL_MATRIX` escape hatch is present (`playwright.config.ts:5,14`).
  - No files were moved. Option B is **not** applied: the five `table.motion` sentences keep their full claims (`component-inventory.ts:2203-2211`) and still map to all four projects.
- **The `route-contracts.e2e.ts:67` theme check** now keys on `project.use.colorScheme`, as required.
- **Non-tag edits are formatting only.** The large `modal-regressions` diff is −w 22/12 lines and is purely Biome reflow from the loop tag. The `route-contracts` loop cast changed from `as const` to `as [string, string[], string[]][]`. That is acceptable, and the parser's `unwrap()` handles it.
- **Low (doc):** plan §(b) required the README to state that a CLI `--grep` is ANDed with the project grep. Because of that, an ad-hoc `--project=light`/`reduced-motion` run of an *untagged* test needs `PLAYWRIGHT_FULL_MATRIX=1`. `tests/web/README.md:37-40,75` does not say this. Add one sentence.
- **Low (doc):** `README.md:25`, "Changed layout: add `--project=tall-desktop`", now runs only the 17 `@tall` tests. A layout change on a non-`@tall` route gets no tall coverage. Add "(tagged `@tall` only; use `PLAYWRIGHT_FULL_MATRIX=1` for the rest)".

## 2. Gate integrity — PASS with notes

**Project-name adaptation is complete.**
- `coverage.e2e.ts:845` requires all five names. `:851` reads `chromium`, and the mobile-claim message at `:945` says "chromium".
- The `scenarioProjects` type (`component-inventory.ts:4176`) never names the desktop project, because desktop is implicit.
- The motion rule keys on the `reduced-motion` project object, not on a name string.
- `grep '"desktop"'` across `coverage.e2e.ts` and `component-inventory.ts` returns nothing. No other name assumptions remain.

**The parser still rejects bad tags.**
- Unresolved, numeric and half-resolved conditional tags throw (`[UI-INVENTORY-PARSER-TAGS]`).
- Unknown literals fail the vocabulary check (`:860-865`). That covers near-misses such as `@tall-desktop`, which the `/@tall\b/` project grep *would* otherwise select.
- Tag details never change IDs: the fixture asserts the declaration list, and `declarations` semantics are untouched.

**The orphan rule is sound in effect.** `:878-898` accepts selection by *any* project. A piggyback project only selects tagged tests that are outside `desktopOnly` and not `@mobile-only`, and chromium already selects every such test except those in `tallOnly`. So today the only test that relies on the relaxation is the tall-only file, which matches the design.

Objections and notes:

- **2a. OBJECTION, Low–Medium (plausible, not run).** The `delete process.env.PLAYWRIGHT_FULL_MATRIX` at `coverage.e2e.ts:839-841` probably has no effect.
  - **Why:** the Playwright 1.64 worker loads the config before it runs any test (`workerProcessEntry.js:1480` → `deserializeConfig` → `requireOrImport`). The dynamic `import("../../playwright.config")` then most likely returns that cached module.
  - **Effect:** under `PLAYWRIGHT_FULL_MATRIX=1`, the gate evaluates the tag-free release selection. The claim and motion rules then pass whatever the tags are.
  - **When it matters:** this is harmless in the release run itself. But a developer who runs the gate with the env var still set gets a false green for the default selection.
  - **Fix (one line):** after the import, assert `projects.get("light")?.grep` is defined, with a message like "run the gate without PLAYWRIGHT_FULL_MATRIX". This fails loudly instead of passing vacuously.
- **2b. Low.** The lexicon check (`:955-965`) proves only that a claiming description *has* a `scenarioProjects` entry. It does not prove the entry lists every configuration that the prose names. For example, `["mobile"]` against "tall/mobile" prose would pass. The entries I spot-checked are complete: `table.motion`, `route.viewport`, `chart.motion` "All five projects" and `chart.responsive`. Accept for now, and note the limit in the doc comment at `component-inventory.ts:4169`.
- **2c. Low (inherited semantics).** `disabled()` (`:326-335`) treats a test as unrecorded if *any* `test.skip` appears in its body. As a result, `buttons` "sidebar rail" and `widgets` "long list … on touch" never enter `selections`, and their `@desktop-only`/`@mobile-only` tags are invisible to the vocabulary and both-exclusions checks. This is conservative for coverage and correct for both tests today, but a typo in either tag would go undetected. Low.
- **2d. Info.** `selectedBy()` matches against `"<title> <tags>"`. Playwright's `_grepTitleWithTags` also prepends the file name and the describe titles (`common/index.js:2623-2854`). No title, describe or file name contains `@` today, so the results agree. This is worth one comment line in `selectedBy`.

## 3. Sidebar hardening (d1ba358) — OBJECTION, Medium

What is correct:
- The diagnosis is correct. `useIsMobile()` starts `false` and flips in a mount effect (`src/hooks/use-mobile.ts`). A tap before that effect has committed calls `setOpen` (the desktop state), not `setOpenMobile` (`src/components/ui/sidebar.tsx:91-93`).
- The visible-dialog proof (`consumer-motion.e2e.ts:25`) is strict. A sheet that never opens still fails.
- There is no shared-helper API change. Two file-local copies are added, nothing in `support/` changed, and this follows the `resetHistory` precedent in `navigation-motion.e2e.ts:12`.

- **3a. OBJECTION (Medium): the hydration gate is vacuous on every call site.**
  - **The gate:** `expect.poll(localStorage.getItem("history")).not.toBeNull()` (`consumer-motion.e2e.ts:18`, `table-updates.e2e.ts:16`).
  - **Why it proves nothing:** localStorage persists across `page.goto` within a context. `seedWorkspace` already loads `/` and reloads it (`support/fixtures.ts:73-76`), and `HistoryProvider` writes `history` on that load (`src/history.tsx:93-95`). So the marker is already non-null *before* the `page.goto(origin)` that precedes every `openMobileSidebar` call, and the poll returns immediately.
  - **The precedent this copies does it right:** `resetHistory` calls `localStorage.clear()` before `goto` precisely so that the marker reflects the new document.
  - **Consequences:**
    1. The 3 × 500ms retry loop is the *only* mechanism, so the code comment and commit message overclaim ("wait for its localStorage marker first").
    2. The test can no longer tell a pre-hydration tap from a **post-hydration first tap that is swallowed**, which is a real regression class (for example, a first tap that only moves focus). In these two files that regression would pass on attempt 2.
    3. The masking is bounded. The unhardened single-tap sites (`chart-motion.e2e.ts:119,212`, `navigation-motion.e2e.ts:165`) would still catch it on mobile. They are also exposed to the same pre-effect race, though, so they are latent flakes.
  - **Required fix:** make the gate real by clearing the key before navigating, or by gating on a signal the new document produces. Then require the **first** post-gate tap to open the sheet, or keep at most one retry and `test.info().annotations.push` the attempt count so a swallowed first tap stays visible.
- **3b. TOCTOU (check-then-click) is benign.** A trigger click is a discrete React event, so a handler that runs commits the sheet synchronously and `getByRole("dialog")` is present long before the 500ms check.
  - **Double-toggle:** that would need the handler to run *and* the dialog to stay absent for 500ms, which cannot happen.
  - **Late hydration:** if attempt 2 or 3 lands just after hydration while an earlier tap toggled the desktop state, the result is still "mobile sheet open".
  - **Overlay case:** if a sheet ever were open and a retry clicked through its overlay, Playwright's actionability wait would hit the test timeout. That is a loud failure, not a pass.
- **3c. Low.** The `table-updates` copy has no final `expect(dialog).toBeVisible()`. It relies on the sampler's reveal click on a visible "Records" link. A closed sheet therefore surfaces as a 45s test timeout inside `sampleVisibleRowAnimations`: this happened in `accept-mobile.json` and `rerun-table-updates-mobile.json`, with the error "Target page … closed" at `assertions.ts:392`. That is loud but hard to diagnose. Add the same final assertion as `consumer-motion`.
- **3d. Low (product, tracked-issue candidate).** The commit message says "No product change". However, a real phone tap in the pre-effect window does nothing visible *and* persists `sidebar_state=false` through `setOpen` → `document.cookie` (`sidebar.tsx:85`). That silently collapses the desktop sidebar for a later desktop visit on the same origin.
  - **Fix:** `toggleSidebar` could read `window.matchMedia` at click time without any SSR mismatch.
  - **Scope:** this is not a blocker, and `ui/**` is upstream shadcn, but file it under `.scratch/ui-regression/issues/` instead of declaring it intended.
- **Nit.** Two byte-identical helpers, plus three unhardened sites. If 3a is fixed, moving the helper into `support/` is purely additive and changes no existing API. STYLE.md's "one implementation per shared rule" favours that move.

## 4. Evidence audit — CONDITIONAL

**Timing.** Source mtimes show that only `consumer-motion` and `table-updates` changed after the
chromium acceptance started (15:04 local). Both were edited at 18:40, and `rerun-sidebar-mobile.json`
started at 18:41, so the 5/5 run is on the final helper. The five `accept-*.json` files therefore ran
on the c45b246 tree, with the d1ba358 delta covered by that rerun.

| File | Pass / fail | Non-green cases and disposition |
|---|---|---|
| `accept-chromium.json` | 159 / 4 | consumer dense, nav `entrance motion`, route refilter, `table.groups`. **All exact R1** (`undersampled; isConnected=true; frames=2`). |
| `accept-mobile.json` | 140 / 4 | route refilter **R1**. consumer dense: `getByRole('dialog')` not found, which is the **sidebar** (resolved by d1ba358). `table.groups`: **timedOut 45s** in the sampler, consistent with the sheet not opening (resolved by d1ba358). nav `navigation history journeys`: **not R1** (see below). |
| `accept-tall-desktop.json` | 15 / 2 | consumer dense, route refilter. **R1.** |
| `accept-light.json` | 11 / 1 | consumer dense. **R1.** |
| `accept-reduced-motion.json` | 23 / 3 | consumer dense, route refilter, `table.groups`. **R1.** |
| `rerun-consumer-motion-mobile` / `rerun-table-updates-mobile` (18:30/18:32) | 1/1, 2/1 | Pre-fix reproductions of the sidebar failures. They are diagnostic evidence, not acceptance. |
| `rerun-sidebar-mobile.json` (18:41, final helper) | 5 / 0 | All 5 mobile `openMobileSidebar` callers are green. |
| `rerun-navigation-motion-mobile.json` (18:31) | 3 / 0 | The nav-history case is green on an unchanged file. |
| `gate-new-config.json` (07:18) | 7 / 0 | Same tree as the coverage file (07:18 mtime). Also re-passed inside `accept-chromium` (7/7) at 15:04. |
| `rerun-pending-search*.json`, `rerun-workflows/keyboard.json`, `rerun-neighbors2.json` | 1/0, 5/0, 34/0, 10/0, 18/2 | Prior round. The 2 `neighbors2` failures are exact R1. |
| `prefix-check*.json` | 0 / 1 ×3 | Intentional pre-fix discriminator runs. Each fails with the predicted symptom (`account_id` restored; `page=2` dropped), as documented in `fix-workers-oct23.md`. |

**Totals.** There are 11 R1 failures (4+1+2+1+3) and 3 non-R1 failures, all on mobile.
`status-briefing.md:42-52` says "12 of the 14 … the other 2". That is miscounted: it omits the
`table.groups` mobile timeout from the non-R1 set. Correct the briefing so it does not imply that the
timeout carries the R1 signature.

**Certification blocker (the only one).** In `accept-mobile.json`, `navigation history journeys`
step "direct Statements detail has a working fallback" failed at `navigation-motion.e2e.ts:115`. After
the "Back to Statements" tap, the URL stayed at `/statements/t1-s-pending` for 10s.
- **Why it is not covered by R1 or the sidebar fix:** `resetHistory` *does* gate on a cleared marker, so this is not the sidebar's pre-hydration race, and it has no R1 signature.
- **The only disposition is one green rerun** with no code change, and the trace is gone because `test-results/` was overwritten. Under the zero-retry policy, a green rerun alone is not a disposition.
- **Candidate causes (none proven):** a cold `/statements` RSC compile on the dev server exceeding 10s, or a mobile Back tap lost in the same way as the 2b note from the prior round.

The 0-byte `acceptance-matrix.json` (07:18) is a stale artifact. Delete it, or mark it as not being evidence.

## Graph

`GRAPH_REPORT.md` reports no health warnings. It records "Built from commit `c45b2469`" because it
was refreshed from the working tree before d1ba358 was committed, and d1ba358 does include the
regenerated outputs. No absolute machine paths appear in `graph.json` or `manifest.json`. There are
9 unclassified files ((none) ×5, `.example`, `.lock`), which is informational.

## Required follow-ups (in order)

1. **Certification blocker:** disposition the mobile `navigation history journeys` "direct Statements detail" failure.
   - Rerun `navigation-motion.e2e.ts --project=mobile --repeat-each=5` under `browser.lock` with traces kept.
   - If it reproduces, root-cause it. If it does not, file a `.scratch/ui-regression/issues/` entry with the error text and the cold-compile hypothesis, so it is tracked rather than waived.
2. **3a:** make `openMobileSidebar` gate on the current document by clearing `history` before `goto`, as `resetHistory` does, or by gating on another new-document signal. Then fail or annotate on a swallowed post-gate first tap. Fix the comment and stop claiming the gate in the commit trail.
   - Rerun both files on mobile with `--repeat-each=3`. A retry-based fix for an intermittent failure currently rests on one green run.
3. **2a:** add a post-import assertion that the piggyback projects carry `grep`, so the gate cannot pass vacuously under `PLAYWRIGHT_FULL_MATRIX=1`.
4. **3c:** add the final `toBeVisible()` dialog assertion to the `table-updates` helper.
5. **Docs (Low):** add the README sentence on CLI grep ANDing and `FULL_MATRIX` for ad-hoc piggyback runs, and qualify the tall-desktop layout advice. Correct the 12/2 → 11/3 miscount in `status-briefing.md:42-52`. Remove or mark the empty `acceptance-matrix.json`.
6. **Non-blocking:** file 3d (pre-effect tap writes the desktop sidebar cookie). Consider hardening or sharing the three remaining bare mobile trigger taps. Add a doc line for 2b/2c and a comment for 2d.
7. Refresh the graph after any source changes, per AGENTS.md.

## Verdict

**CONDITIONAL.** The restructure is a faithful implementation of the reconciled plan:
- **Counts:** 163/144/17/12/26 = 362 and 749 in the full matrix. Both are independently re-measured, and the +2 over the plan is exactly the two new static gate tests.
- **Selection:** tag placement matches the per-test table row by row.
- **Reconciliation:** the `chromium` name is kept, dark is the default, `light` replaces `dark`, there is no 6th project, and Option B is not applied.
- **Gate:** the `chromium` adaptation is complete, with no remaining `desktop` name assumptions. Bad tags are rejected, and the orphan rule is sound in effect.

The sidebar hardening is safe against a genuinely broken sheet: it still fails, and the check-then-click race is benign. However, its hydration gate is vacuous because the `history` marker persists from `seedWorkspace`, so a bounded retry alone carries the fix and could hide a swallowed first tap in those two files.

The evidence supports the restructure. All 11 R1 failures have the exact `frames=2` signature, and the two sidebar failures have a post-fix 5/5 run on the final helper. One non-R1 mobile failure (the Statements Back fallback) has no root cause and no retained trace, and that is the only blocker to certification. Fix 3a and 2a, and disposition that failure, before calling this certified.

Report: `reviews/opus-restructure-oct23.md`
