# Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)

Reviewer: Claude Opus 5.5, medium effort. Read-only review, 2026-10-23. Only this report was written.
The user authorized this round explicitly on 2026-10-23. The older "ONE Opus, never repeat" notes in
`.scratch/ui-regression/REVIEW-PENDING.md` (lines 176, 192, 197, 250, 274) are **overridden** by
that authorization. They do not bind this round.

Diff reviewed: `git diff cf72d4c..a364cb8`. The four `graphify-out/*` artifacts are regenerated
outputs, so I did not review them line by line.

## Summary table

| # | Item | Verdict |
|---|------|---------|
| 1a | `latestParams` ref used as the debounce base | **OBJECTION, Medium.** It fixes the stale-closure resurrection, but it adds a stale-*forward* base for navigation that does not go through `pushParams`. |
| 1b | `pushParams` skips identical-URL pushes | **OBJECTION, Low–Medium.** It compares against the *committed* URL, not the last intent, so a fast revert during a slow commit is lost. |
| 1c | No per-keystroke `selectPending` push; clearing is folded into the debounced commit | **PASS with a Low note.** The extra `setCandidateQuery("")` on each keystroke still allows one mid-typing push. |
| 2a | chart-motion tall viewport narrowing | **PASS** |
| 2b | navigation-motion bounded Back tap | **PASS** (Low note) |
| 2c | pending-search settled waits (mobile step 4) | **PASS with a Low note.** The 30s timeout is generous, and the mobile run no longer exercises typing that overlaps a commit. |
| 2d | pending-search force-click (step 3) | **PASS** |
| 3 | Verification evidence | **Partly supported.** The test-fix claims have logs. The product-fix and gate claims have **no surviving logs**, so rerun before certifying. |
| 4a–c | Residual risks | (a) is under-bounded: its mechanism is broader than "panel exit". (b) and (c) are honestly bounded. |
| — | Layering (AGENTS.md) | **PASS.** UI only, no `@/data` imports, no change to a shared helper API. |
| — | Minimality | **PASS.** The product change is in one file, +32/−7. |

## 1. Product fix — `app/allocator/pending/page.tsx`

### What the commit closes (confirmed)

- **Queue resurrection (the original P1).** The old `onChange` at cf72d4c pushed `selectPending(null, queueQueryParam)` on every keystroke. The queue timer then rebuilt its URL from a render-scope `searchParams` that had not committed yet, so it restored `pending_statement_id`. In the new code (`page.tsx:290-296`), typing pushes nothing. The single debounced commit (`page.tsx:115-131`) clears `pending_statement_id`, `candidate_page` and `candidate_query` itself. With one push and nothing earlier to overwrite, the queue path has no ordering race left. Closed.
- **Symmetric candidate-timer resurrection.** `selectPending(next)` calls `setCandidateQuery("")`. When the URL still holds a committed `candidate_query`, that re-arms the candidate effect (`page.tsx:137-148`), because the param is still the old value until the commit lands. Before this commit, the timer then rebuilt from stale `searchParams` and restored the *previous* `pending_statement_id`. It now builds from `latestParams.current`, the params of the `selectPending` push. Closed. This also answers whether the ref is needed: change (c) alone would not close this path.
- **Late RSC overwrite.** The number of pushes per typing burst drops from "one per keystroke until the commit lands" to at most two (see 1c). Fewer pushes in flight means less exposure. I see no remaining ordering inversion in the queue path.
- **N3 (deleted selection not cleared by queue search).** It is still cleared, now through the debounced commit (`page.tsx:124`) instead of the per-keystroke push. Step 1 of the test covers this. The only behaviour change is timing: the alert now clears 300ms + commit after the last keystroke instead of after the first one. This is acceptable, because the alert copy asks the user to choose another Statement, and the queue list itself only refilters at the same commit.
- **Alert and candidate flows after removing the per-keystroke push.** These are safe. Clicking a row inside the debounce window still runs `selectPending(statement, queueQuery)`, which clears both timers and commits the typed query together with the new selection (`page.tsx:211-223`). On desktop, the old selection's candidate panel now stays visible until the debounce fires. This matches the queue list, which also updates only at that commit. It is consistent, not a regression.
- **Reading `window.location` inside `pushParams`.** No Suspense, SSR or StrictMode hazard. `pushParams` runs only from event handlers, timers and `afterReplacement`, never during render. StrictMode double-invokes effects, and the timer effects clean up their own timers. `next.config.ts` sets no `basePath`, so `pathname + location.search` is comparable. A `%20` versus `+` encoding mismatch at worst causes one redundant push, which is the old behaviour.

### 1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`

`latestParams.current` is written only in `pushParams` (`page.tsx:59`). The timers prefer it over the committed `searchParams` (`page.tsx:129, 143`). Several in-page navigations bypass `pushParams`, so the ref becomes stale *forward* and the timers then overwrite newer committed state:

1. **Queue pagination (a regression introduced by this commit).** `PaginationFooter` (`page.tsx:384-388`) navigates through `<Link href={pageHref(searchParams, …)}>` (`src/components/table/pagination-footer.tsx:14-20, 65-88`).
   Steps:
   - Select Pending P on page 1. `latest` becomes `{pending_statement_id:P}`.
   - Click queue page 2. The URL becomes `…&page=2`; `latest` does not change.
   - Type in the candidate search.

   After 300ms, the candidate commit builds from `{pending_statement_id:P}` and **drops `page=2`**, so the queue jumps back to page 1 while the selection stays. At cf72d4c the base was `searchParams`, which was correct here. No test covers this.
2. **Browser Back/Forward (popstate).**
   Steps:
   - Choose Account X. `latest` becomes `{account_id:X}`.
   - Press browser Back, so the URL has no `account_id`.
   - Type a queue query.

   The commit restores `account_id=X` together with the query. Forward-then-type and Back-across-a-selection both resurrect params in the same way.
3. Any other future Link or `router.*` call on this route inherits the same hazard silently.

**Required follow-up:** invalidate the mirror when the committed params catch up with it or diverge from it externally. Either option below is about one line and keeps the fix:

- `useEffect(() => { if (latestParams.current?.toString() === searchParams.toString()) latestParams.current = null }, [searchParams])`. This catches up after the app's own commits. It also needs a `popstate` reset, or a check that treats any committed `searchParams` that no pending intent explains as authoritative.
- Alternatively, keep a "pending intent" flag that is set in `pushParams` and cleared when `searchParams` changes. Use `latest` only while a push is pending.

Then add a regression step: select → paginate the queue with the footer Link → type a candidate query → assert `page=2` survives. Add a Back variant as well: account filter → Back → type → assert no `account_id`.

### 1b. OBJECTION (Low–Medium): the identical-URL skip compares against the committed URL, not the last intent

The check is `page.tsx:63`: `target !== pathname + window.location.search`. During a slow commit (the exact condition this fix targets), `location.search` is still the *previous* committed URL.

- **Scenario:** the URL is O. Choose Account X, which pushes A while the commit is still pending. Quickly choose All Accounts. The target is O, which equals `location`, so the push is **skipped**. A then commits, and the UI shows Account X even though the user's last choice was All.
- Before this commit, O was pushed after A, and the router processes pushes in order, so the final state was O.
- The skip saves very little. I could not find a common path that issues a truly identical push after the commit has landed. The duplicate candidate-timer push described in 1a happens *before* the commit, so this check does not catch it either.

**Required follow-up (pick one):** remove the skip, or dedupe against the last intent: `const previous = (latestParams.current ?? searchParams).toString(); latestParams.current = next; if (next.toString() !== previous) router.push(…)`. That version is correct whether or not the commit has landed. It depends on 1a's invalidation so that it does not compare against a stale-forward mirror.

### 1c. PASS (Low note): `setCandidateQuery("")` per keystroke still allows one mid-typing push

`page.tsx:295` resets the candidate buffer on every queue keystroke. When `candidate_query` is committed (steps 1 and 2 seed `candidate_query=stale`), the first keystroke makes `candidateQuery ("") !== candidateQueryParam ("stale")`. That arms the candidate timer, and later keystrokes do **not** re-arm it, because its dependencies do not change. It therefore fires 300ms after the *first* keystroke, usually while the user is still typing. The result is a separate navigation `{candidate_query:null, candidate_page:null}`, followed later by the queue commit.

- This is why history growth reaches 2. The `<= 2` bound (`pending-search.e2e.ts:51, 134`) still holds, and there is no resurrection, because the queue commit uses `latest`.
- Downsides:
  - It leaves an odd intermediate history entry: selection kept, candidate search gone.
  - It is one RSC navigation during typing, which is the push-storm class the commit comment says it avoids.
- **Suggested (non-blocking):** replace the per-keystroke `setCandidateQuery("")` with `window.clearTimeout(candidateTimer.current)`. That cancels an in-flight candidate debounce, which seems to be the intent. The queue timer's own `setCandidateQuery("")` (`page.tsx:131`) and the URL sync effect then reset the buffer at the single commit. After this change, step 2 should reach history growth 1. Keep the `<= 2` assertion unchanged anyway.

### Style nits (non-blocking)

- `pushParams` (`page.tsx:58-65`) references `latestParams`, which is declared 26 lines later (`page.tsx:91`). It works at runtime, but it reads backwards against STYLE.md's dependency order. Declare the ref before `pushParams`.
- The positional `false` placeholders in `updateParams(…, false, latestParams.current)` are a little noisy. Acceptable as is.

## 2. Test fixes

### 2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS

- **Root cause is correct.** `PageContent` uses `container mx-auto` (`src/components/layout/page-content.tsx:7`). At 1920px, both sidebar states exceed the 1536px cap, so the chart cannot resize. The old poll measured layout, not behaviour.
- **The test is stronger, not weaker.** The MutationObserver replay watcher was installed before the hover. It now observes three geometry changes: narrowing, the sidebar toggle, and the restore. The `.not.toBe(width)` poll remains a real proof that the chart resized.
- The 1440px projects are untouched (`> 1600` gate). Evidence: `/tmp/workerA-chartmotion-tall3.log`, 3/3.
- Nit: `narrowed && viewport` repeats the narrowing check only for the type system. It is fine.

### 2b. `tests/web/navigation-motion.e2e.ts:123-130` — PASS (Low note)

- **False-pass analysis.** The catch swallows every click error, but the strict `toHaveURL(/\/sync$/)` follows it. No other path could move the page from `/privacy` to `/sync`, because nothing navigates automatically and history is reset per step. If the button is missing, not interactive, or disconnected from history, the URL stays at `/privacy` and the test fails. The earlier taps at lines 118, 120 and 121 already prove that the controls respond to real taps.
- **Low note.** The root cause ("tap hangs on its own detached target") is inferred from a trace with no completion event. It has not been explained mechanically, for example as Playwright waiting after the action versus retrying actionability. Add a one-line TODO, or file a local `.scratch` issue, so that a real mobile Back defect cannot hide behind the catch later. Not blocking. Evidence: `/tmp/workerA-navmotion-mobile-full.log`, 4/4.

### 2c. `tests/web/pending-search.e2e.ts:112-120` (mobile settled wait) — PASS with a Low note

- **Determinism or masking?** Mostly determinism. On mobile, the queue section is `hidden md:flex` while a selection exists (`page.tsx:274`), so typing before the Back commit lands targets an input that is changing visibility. That interaction is ill-defined, and the step is not designed to test it.
- **What was lost.** On mobile, step 4 now types into an *already deselected* queue. As a result, `not.toHaveURL(/pending_statement_id=/)` at line 128 is trivially true there, and the step title's "while clearing the old selection" holds only on the desktop projects. The mobile run still proves the character-retention and history-bound claims. Selection clearing during typing is still proven on chromium, tall-desktop, dark and reduced-motion. Acceptable, but state it in the step's comment.
- **The `{ timeout: 30000 }`** at line 118 triples the default expect timeout. If a Back commit really takes more than 10s on the dev server, that is a cold-compile cost, not product behaviour. Prefer the default timeout once the route is warm, or comment why 30s is needed. Low.

### 2d. `tests/web/pending-search.e2e.ts:88-92` (force-click) — PASS

`force: true` skips only actionability checks. It does not create a vacuous pass:

- **The measured gap still guards the setup.** If the forced click lands on the wrong target, `__selectedAt` is never set. The gap becomes `NaN`, and `NaN < 300` fails at line 98. If the click is slow, the gap is ≥ 300 and the step also fails.
- **The outcome assertions are unchanged:**
  - URL = `next.id` (line 99)
  - candidate heading visible (line 100)
  - search empty immediately and after 650ms (lines 103, 106)
  - no `candidate_query` (line 107)

  A click that missed, or one that was absorbed by an overlay, fails these.
- On mobile, `__selectedAt` is set by the earlier non-forced Back click, so forcing does not change what the gap measures there.

## 3. Verification evidence audit

| Claim | Evidence found | Assessment |
|---|---|---|
| chart-motion tall 3/3, nav-motion mobile 4/4 (test fixes) | `/tmp/workerA-chartmotion-tall3.log`, `/tmp/workerA-navmotion-mobile-full.log` | Supported. |
| Worker B: workflows, keyboard and editors files green | Report only. Pre-fix source (cf72d4c) | Supported for cf72d4c. **Not evidence for a364cb8**, because the pending page changed afterwards. |
| pending-search 5/5 on final source | **No log or results found** in `/tmp` or `.scratch/` | Unverifiable. **Rerun all 5 projects** and keep the log. |
| workflows + keyboard-navigation chromium green after the fix | No log found | Unverifiable. Rerun chromium, plus `--project=mobile` for workflows, because its pending replacement flow touches this page. |
| charts 6/6 chromium | Coordinator note only | Plausible. This commit has no chart product change, so it is low risk. |
| Full chromium gate 156/5/1 | No log or JSON found | 162 total matches about 811/5, so the count is internally consistent. Four failures match R1, but **their signatures are not inspectable**. Persist the JSON and rerun. |
| editors popup fade 10/10 isolated | No log found | Unverifiable. This commit does not touch editors, so it is low risk to the diff, but one cited log is needed. |

Required: **one serial rerun under `browser.lock`** of `pending-search.e2e.ts` (all 5 projects), `workflows.e2e.ts` and `keyboard-navigation.e2e.ts` (chromium + mobile), on a364cb8 or later, with stdout and `--reporter=json` saved under `.scratch/ui-regression/`. Do this **after** the 1a and 1b repairs, together with the new pagination and Back regression steps. Until then, runtime for the product fix is **not certified**. This matches the prior Opus round's "runtime NOT certified" stance.

## 4. Residual risks

- **(a) "Fast typing during mobile panel exit may drop characters": under-bounded.** The mechanism is wider than panel exit, and it is pre-existing rather than new.
  - **How it happens:** `useEffect(() => setQueueQuery(queueQueryParam), [queueQueryParam])` (`page.tsx:110`) overwrites the local buffer whenever a committed query arrives. Say the user pauses for more than 300ms, the debounced push of "abc" goes out, and the user types "d" before that commit lands. The commit then resets the input to "abc" and the "d" is lost. The `queueQuery === queueQueryParam` early return (`page.tsx:114`) means no timer re-arms.
  - **Where it occurs:** any viewport where commit latency is longer than the user's next pause. Mobile panel exit is only one trigger.
  - **Not a blocker for this commit**, because cf72d4c had the same sync effect.
  - **Track it as a real issue:** skip the URL→state sync when the incoming param equals the last pushed intent while local state has moved on. This can reuse the 1a mirror. Add a test that types, pauses 350ms under a held RSC response, types again, then asserts the full value.
- **(b) Dense cascade frame starvation on GPU-less hosts: honestly bounded.** It is environmental: an exact `frames=2` signature, no failures on the Mac GPU, and no threshold changes. It must stay documented as host-specific and must not be waived on a GPU runner.
- **(c) The step-3 `<300ms` assertion measures test dispatch speed: honestly bounded.** It is a precondition guard, not a product claim. If it fails, the step fails rather than passing falsely (see 2d). Acceptable.

## Interaction with prior findings N1–N3

- **N1 (history self-target):** no interaction. `src/history.tsx` is untouched.
- **N2 (duplicate exit):** no interaction.
- **N3 (deleted selection not cleared by queue search):** still fixed, now through the debounced commit. Step 1 covers it. It is slightly delayed (see section 1). However, the 1a stale-forward base could restore a cleared `pending_statement_id` after a browser Back across a selection. Step 1 does not cover that variant.

## Required follow-ups (in order)

1. **1a:** invalidate `latestParams` after commits catch up or after external navigation (pagination Link, popstate). Add tests for queue pagination → candidate typing, and for Back → queue typing.
2. **1b:** dedupe against the last intent instead of `window.location`, or drop the skip.
3. Rerun pending-search (all 5 projects), and workflows plus keyboard-navigation (chromium and mobile), serially, keeping logs and JSON in `.scratch/ui-regression/`.
4. (Non-blocking) 1c: replace the per-keystroke `setCandidateQuery("")` with clearing `candidateTimer`.
5. (Non-blocking) Open a tracked issue for residual (a) with the corrected mechanism. Comment on the 2c mobile scope and the 30s timeout, and add the 2b TODO.
6. Refresh the graph after the source changes, per AGENTS.md.

## Verdict

**CONDITIONAL — product fix OBJECTION (Medium); test fixes PASS; runtime NOT certified.**

Commit a364cb8 does close the bug it targets. Queue typing can no longer resurrect a cleared `pending_statement_id`, and basing the debounce timers on the latest intent also closes the symmetric candidate-timer path. The three test edits are sound and do not weaken any outcome assertion. The force-click and the bounded Back tap both stay guarded by strict URL and state checks.

However, the new `latestParams` mirror is never invalidated by navigation that bypasses `pushParams`. That causes a new lost-update regression: queue pagination Links followed by candidate typing silently reset `page`, and browser Back followed by typing restores newer params. The identical-URL skip compares against the committed URL instead of the last intent, so a fast revert during a slow commit is dropped. Both repairs are small and stay inside `page.tsx`.

The product-side verification claims (pending-search 5/5, neighbour suites, the 156/5/1 gate) have no surviving logs. Rerun them, with logs kept, after the repairs and before certifying. Residual (a) is pre-existing but under-bounded: it comes from the URL→state sync effect at `page.tsx:110` and is not specific to panel exit. Track it as an issue. Residuals (b) and (c) are honestly bounded.

Report: `reviews/opus-pending-race-oct23.md`
