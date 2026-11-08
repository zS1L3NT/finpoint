# ⚠️ TEMPORARY HANDOFF: DELETE THIS WHOLE `TEMP-HANDOFF/` FOLDER BEFORE THE PR LEAVES DRAFT

> **This folder is temporary scaffolding, not part of the product.**
> It exists only so a new thread on another device can take over branch `ai/insight-drilldown` (draft PR #48).
> The original working notes lived in `.scratch/`, which is gitignored and not on the new device, so the parts that still matter were copied here.
>
> **Before PR #48 is marked ready for review, run `git rm -r TEMP-HANDOFF` and commit.** Leave no trace of it in `main`.
> Do not link to it from README, docs or code, and do not add it to graphify. If this file is still here when the PR is "done", the PR is not done.

Written 2026-11-09 by the Opus thread that ran this branch.

---

## 1. Where things stand

- **Branch:** `ai/insight-drilldown`. **PR:** https://github.com/zS1L3NT/finpoint/pull/48 (draft; every commit carries `[skip ci]`).
- **Head:** `303568a` plus the commit that adds this folder. The working tree is clean.
- **The user is reviewing the current design now.** Wait for their verdict before starting new design work.
- **On hold until the user approves the current design:** ticket 43, the "unslop" pass (`issues/43-unslop-pass.md`). It comes from a reel the user sent; the frames are in `reel/`.

### Open items

1. **The user's design review.** Act on what they say.
2. **The month-picker fix (`303568a`) is not fully verified.** Its own test was checked in both directions: it fails without the fix and passed 6/6 runs with it. The full `tests/core` production run was stopped halfway at the user's request. Run it again.
3. **One flake on this branch:** `tests/core/drilldown.e2e.ts` "Escape and Back restore scroll and focus in every mode" failed once in a full run, then passed 6/6 repeats. The test exists only on this branch, so it can't be compared on main. Watch it.
4. **Priya's persona never produced a usable report.** Three runs, all broken by tool and server problems. Rerun her only if the user wants persona coverage complete.
5. **Before the PR leaves draft:**
   - delete `TEMP-HANDOFF/`
   - run the full CI-equivalent suite locally (see §2)
   - drop `[skip ci]` only when the user says so
   - update the PR body (use the `pr` skill)
6. **Decisions still open for the user** (raised earlier, unanswered):
   - **Forecast outlier.** One $1.2M Record makes the forecast ~$619k, because ADR 0002 averages the comparison months. Recommendation: use the median, or cap single Records far above plan.
   - **Field length limits.** Recommendation: 200 characters for Record titles, 120 for Category and Monthly Budget names.
   - **Dragging the phone sheet (D8).** Waiting for the user to try the tap-to-expand version first.

---

## 2. Every standing instruction from the user (follow all of these)

### Git, PRs and CI
- Work on **one branch**, `ai/insight-drilldown`. Keep **draft PR #48** with `[skip ci]` on commits.
- **Never merge. Never open another PR. Never rebase or force-push** without an explicit go-ahead.
- Commits are **signed** (`git commit -S`), formatted `<gitmoji>🤖 lowercase message [skip ci]`, with no co-author line.
- Stage only your own files, by path. Never `git add -A` or `git add .`. **Never commit `next-env.d.ts`.**
- Commit and push finished work promptly; the user reviews on Vercel previews.
- Before a PR goes live in CI: run the full production suite locally and get it green, then push.

### Tests
- **A failure your change wasn't meant to cause is a regression: fix the code, not the test.**
- Edit a test only where the behaviour changed on purpose, and **name every edited test** in your report.
- A test you loosen must still go red when the feature is broken on purpose. Check this.
- Before calling anything flaky, **repeat it on the branch and on `main` and report both counts.**
- Browser tests on a production build:
  1. `bun run build`
  2. `bunx vite build --config tests/harness/vite.config.ts`, needed once per fresh checkout or the harness server times out
  3. `PLAYWRIGHT_SERVER=production bun run test:e2e -- <files> --project=desktop --project=mobile`
- **The test clock is frozen at October 2026.** Future months redirect. Month URL params use full names, e.g. `?month=September&year=2026`.
- The component ledger (`tests/component-inventory.ts`, `tests/core/ledger.e2e.ts`) must list every new component, file or export and every renamed test ID. It fails otherwise.

### Process and models
- **Opus (you, the lead thread) judges and designs.** Delegates implement, then you review their work yourself, including an **overall design consistency check**.
- **Model order for implementation:**
  1. **Sol 6.1 medium on Codex** first (School or Personal plan; check `codex-usage` / `codex-pace`).
  2. **Sonnet 5.5 medium** only as the fallback.
  - Sol tends to **remove designs**. After each Sol ticket, compare its UI diff with the approved design and restore anything it dropped.
- **Usage guards:**
  - If Claude's 5h window has under 25% left (`claude-usage`), start **no** agents until it resets.
  - If both Codex plans have under 10% left, pause.
- **Run one heavy agent at a time.** The machine is RAM-limited: two agents with builds and browsers in parallel (plus other sessions) pushed load to 40–60 and made everything time out. Use one production server at a time, kill servers by PID (never `pkill -f`), and leave nothing running.
- Don't spawn agents unless it's worth it. Start background runs with a timeout and record their output.
- **Persona/usability runs use OpenCode MiMo: `opencode-go/mimo-v2.6-flash`.** The user said "mimo 2.5", but v2.5 is deprecated, and the provider points to v2.6-flash. Not big-pickle; its free limit is used up.
- **Weigh persona findings; don't chase every complaint.** The user's words: "you can't make everybody happy but you can make the general user happy".
  - Reproducible bugs get fixed regardless of count.
  - Design or feature changes need several personas, or a core task blocked for a typical user.
  - One persona's wish gets noted and dropped. Never bring it to the user as a decision.
- Ask the user with the **question tool** (AskUserQuestion), not inline text, when a decision is genuinely theirs.
- **Document every feature:** new terms go in `CONTEXT.md`, hard choices get an ADR in `docs/adr/`, and user-visible behaviour goes in the README or in-app copy. Don't ask, just do it.
- Refresh graphify (`graphify update .`) after code changes and include the four `graphify-out/` files.
- **Screenshots in dark mode** at 1440×900 and 390×844 when showing UI work.
- Install non-sudo tooling yourself (bun is the package manager). For anything needing sudo, hand the user a script.

### Design direction the user has set on this branch
- **Drill-down:** Notion-style "Open as": **Side peek / Center peek / Full page**, chosen by the user and remembered (ticket 33).
  - The old docked panel that pushed the dashboard sideways is gone and must not come back.
  - On phones it's a bottom sheet, with "Peek / Full page".
- Drill-down rows need proper hover, press and focus states. Only clickable rows react (ticket 34).
- **Filter controls are the same width on every page** (Records, Statements, Allocate) (ticket 35).
- **Active filters are visible at a glance**, with a per-filter reset ✕ sitting where the chevron was; the Clear count equals the number of highlighted controls (ticket 36).
- **Cards in the same dashboard row are the same height** (ticket 38).
- **Plain words.** Keep the canonical domain terms from `CONTEXT.md` (Statement, Record, Allocation, Pending, Monthly Budget), but define them in place with `<Term>` and keep the sentences around them plain (ticket 42).

---

## 3. What was done in this stretch (tickets 33–42 and fixes)

| Ticket | What | Commit(s) |
| --- | --- | --- |
| 33 | Side / center / full-page drill modes; no Dashboard reflow; mode persisted in settings | 265fe6d, ab4420f, 6aa41da |
| 34 | Drill row hover/press/focus polish | d89cabf |
| 38 | Equal card heights per dashboard row | 89731cd |
| 37 | Category names left-aligned in the Categories card (the rows had become buttons, which centre text) | 27d6ed5 |
| 35 + 36 | Shared filter widths; active-filter highlight with per-filter reset | cf2bc7d |
| — | Filter reset ✕ moved into the chevron slot; badge spacing in drill rows; thin drill scrollbar; pending-search test pointed at `/statements/pending` | d0665c2 |
| — | Component ledger and core tests brought up to date (amount text "$x of $y allocated" from ticket 03, badge selectors, flake settle-wait) | a8a2f24 |
| 40 | Closing the full-page drill steps back in history (Back no longer reopens it) | 1025346 |
| 41 | Each metric drill has its own caption; Income with no income shows "None yet / Usually ~$X arrives by day N" | 1fe8c07 |
| 42 | Plain-words pass (before/after table in `issues/42-plain-words-pass.md`); "Left over" shows "Not yet" | 29ff8d0 |
| — | Month picker closes after choosing a month (Dashboard and Records); new navigation test | 303568a |

Last full `tests/core` production run before `303568a`: **440 passed, 4 skipped**, desktop and mobile.

---

## 4. Findings worth knowing

- **agent-browser 0.27 does not scroll an element into view before clicking.** Any click below the fold silently misses. Five personas reported "calendar day does nothing", and all of those reports were this tool artifact. Playwright clicks work at 1440 and 390. The persona prompt (`persona-runner/prompt.txt`) now tells agents to run `scrollintoview @ref` first.
- **Never rebuild `.next` while a `next start` server is serving it.** The old server breaks with "This page couldn't load", and that ruined persona runs. Stop the server, build, then restart it.
- **The pending-queue Back test failure** (branch red, main green) traced back to commit 7489483 (ticket 18). It moved `/allocator/pending` to `/statements/pending` with a server redirect, and the redirect rewrites `+` as `%20`. The fix was to point the test at the new route. That was a deliberate route change, not an app bug.
- **Persona round 2** (`persona-reports/`; method and prompt in `persona-runner/`):
  - **Confirmed fixed:** F5 (Income "None yet"), F12 (every total reconciles to the cent), F3 (biggest expenses), F21 (no "Workflows"), F13b ("New Monthly Budget"), F13c ("no plan"), F15 (Pending explained), F10 (one empty-month notice), F4/F8 (neutral arrows); filters readable and clearable; the three drill modes work; Esc returns to the same spot.
  - **Real bugs found and fixed:** tickets 40 and 41, plus the month picker staying open.
  - **Dropped (tool artifacts, intended behaviour, or single-persona wishes):**
    - calendar "does nothing" (tool)
    - Back leaving the peek open (not reproducible)
    - theme resetting (not reproducible)
    - stale month numbers after a switch (not reproducible)
    - URL not storing the Open-as mode (it's a preference)
    - category picker staying open (it's a multi-select)
    - Records filter row wrapping
    - the Records sidebar link opening "All months" (deliberate since ticket 31)
    - a "Yesterday" shortcut (single persona; the user rejected it)
  - **Still true but not acted on:** the Dashboard is long on phones (F9 "partly", Margaret and Aiden). If the user approves, ticket 43 covers trimming it.

---

## 5. Files in this folder (all temporary)

- `spec.md`: the insight/drill-down spec, with the findings ledger (§3) and the ticket list.
- `AGENT-BRIEF.md`: the brief every ticket agent followed. Its `.scratch/...` paths refer to the old device; on the new device keep tickets and screenshots somewhere gitignored (create a local `.scratch/`).
- `issues/`: all tickets 00–43 with statuses and evidence comments. Ticket 39 (persona acceptance) is effectively done; Priya's run is still missing.
- `final-review.md`: the earlier Opus review (code review, apple-design, break-ui, ui-taste) with the decisions listed in §1.
- `design-review-REPORT.md`: an earlier design review.
- `persona-reports/`: round-2 persona reports. Their screenshot paths point into the old `.scratch/` and won't resolve here.
- `persona-runner/`: `prompt.txt`, `personas.tsv`, `run.sh` to rerun personas. Start `next start -p 5180` on a fresh build first. `run.sh` writes into its own folder, so copy it somewhere gitignored before running.
- `reel/`: contact sheets of the user's "20 Ways to Unslop AI Designs" reel, the source for ticket 43 (on hold).

**Reminder: `git rm -r TEMP-HANDOFF` before the PR leaves draft.**
