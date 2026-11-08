> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 22 design fixes, round 3

Status: resolved
Blocked by: —
Spec: ../spec.md · Screenshots: ../review/21-*-{main,branch}-{dark,light}-{1440,390}.png, 21-sidebar-branch-light-1280.png

Review of head 1c9c3ce. All Opus and Sonnet findings from ticket 21 are visibly fixed: full-width forecast and trend charts, short month ticks, three summary metrics in one row beside the dock, left-aligned wrapping Biggest changes, natural card heights, muted allocation captions, one-row desktop filters, matching mobile Sort cell, grab handle on the mobile sheet, sidebar/dock no overlap at 1280, colours/icons/sparklines/delta chips retained. What is left is below.

## Findings

1. **degraded** — `21-panel-branch-dark-1440`, `21-panel-branch-light-1440`: with the dock open the "Left over" delta chip ("↑ $1,118") wraps onto its own row above the value, pushing the value and sparkline down ~25px so Left over no longer lines up with Spent and Income. Also "$1,044.19 less than usual" wraps to two lines. Fix: in `app/(month)/page.tsx` (~line 541) / `src/components/metric.tsx`, keep label and chip on one row (`flex-nowrap`, label `min-w-0 truncate`, chip `shrink-0`), and hide the sparkline below a container width (e.g. `@max-[720px]:hidden`) so the value row has room.

2. **degraded** — `21-panel-branch-light-1440`, `21-panel-branch-dark-390`, `21-sidebar-branch-light-1280`: in the drill panel rows the Category label touches the budget chip with no gap ("Groceries[Daily]", "Dining Out[Daily]"). Fix: `src/components/drill/panel.tsx`, add `gap-x-2` (or `ml-2` on the chip) in the meta line and let it wrap rather than butt against the text.

3. **degraded** — `21-dashboard-branch-light-1440`, `-dark-1440`, `-light-390`: Biggest changes sentences break at the hyphen ("less than your 2-" / "month average") in 5 of 6 rows, while Entertainment keeps "2-month" whole. Looks like a bug and is inconsistent. Fix: `src/components/charts/category-movers.tsx:70`, use a non-breaking hyphen (`{comparisonCount}‑month`) or wrap "{n}-month average" in `whitespace-nowrap`.

4. **polish** — `21-dashboard-branch-light-1440`, `-dark-1440`, `-light-390`: chart caption reads "cumulative spending.Hover or focus a day…" (missing space; Opus already noted). Fix: `src/components/charts/cashflow-chart.tsx:134-139`, the JSX line break swallows the space; add `{" "}` after "spending." (and keep the leading/trailing spaces in the projection string consistent so there is exactly one space in both branches).

5. **polish** — `21-dashboard-branch-light-1440`, `-dark-1440`: Largest Records header: "See all" sits ~13px lower than the title and the description wraps to three lines, so the card is the shortest of the bottom row and the three bottom cards have ragged bottom edges. Fix: `src/components/charts/largest-records.tsx`, align "See all" with the title row (`items-center` on the title row, description outside the flex), and shorten the description to "Top five Spending Records by amount" (scope and refund detail can go to a `title`/Term).

6. **polish** — `21-dashboard-branch-light-1440`, `-dark-1440`: "Categories this month" stretches to the height of Category trend, leaving ~50px of empty space below "… 3 more categories", while elsewhere cards size naturally. Fix: either `items-start` on that two-card grid or keep stretch but pin "… 3 more categories" to the bottom (`mt-auto`) so it reads intentional. Pick one rule for both card rows.

7. **polish** — `21-sidebar-branch-light-1280`: with the dock open at 1280 the main column is ~470px, so the three summary metrics stack to three tall rows and the filter chips wrap to three rows, pushing the forecast below the fold. Acceptable at this width, but the stacked metrics could drop the sparkline row height. Fix (optional): in the stacked layout use a compact two-column cell (`@max-[599px]:grid-cols-[1fr_auto]`) so each metric is ≤ 64px tall.

8. **polish** — `21-records-branch-light-1440` vs `21-records-main-light-1440`: filter controls now have visibly uneven widths ("Any date" is narrower than its neighbours, Sort is the narrowest). Main had the same unevenness, so not a regression. Fix (optional): `app/records/page.tsx` give filter triggers a common `min-w-[8.5rem]`.

No lost colours, truncation of numbers, or layout breakage found against main in dashboard, panel or records views.

## Comments

- Opus fixed 1–4 directly: metric label row no longer wraps (chip `shrink-0`, sparkline shown by metric container width ≥240px instead of `xl:`), panel row meta line uses `flex gap-x-2` so the budget chip has a gap, "{n}-month average" is `whitespace-nowrap`, forecast caption space restored. Verified: lint, types, build, `tests/core/charts.e2e.ts` + `drilldown.e2e.ts` desktop+mobile on production server (48 passed, 2 skipped by design). Screenshots not yet retaken — next screenshot pass must include 21/22 panel-open 1440 dark+light.
- Look for: Left over chip on the label row with the dock open; "Groceries · Daily" chip spacing; "2-month average" never split.

Ticket 11 screenshot review: inspected all eight `review/11-{dashboard,panel}-branch-{dark,light}-{1440,390}.png`. The Left over delta chip stays beside its label with the dock open, but the label itself wraps onto two lines, moving the value down slightly; further label polish remains. Drill-row Category/budget gaps look correct in dark/light desktop and mobile. “2-month average” stays together in Biggest changes. No ticket-22 source edits made here.

## Opus findings (from review/11-panel-branch-dark-1440)

9. **degraded** — panel open at 1440: Biggest changes is orphaned alone on the last row (Largest Records + Spending calendar fill the row above). Ticket 20 rule: no orphaned card. Rebalance the bottom grid under the `@container` rules (e.g. 3 cards → 3 columns when width allows, else 2+1 with the single card spanning both columns or Largest Records/Biggest changes paired).
10. **degraded** — panel open at 1440: Categories this month squeezed to ~140px; names truncate ("Dining Out ...", "Bills & Utiliti..."). Give it a minimum width or stack it above Category trend when the main column is narrow.
11. **polish** — panel open: "Left over" label wraps onto two lines ("Left / over"). Label should be `whitespace-nowrap`; hide the chevron or the icon before the label wraps.

## Sonnet findings (ticket 11)

Reviewed `review/11-{dashboard,panel}-branch-{dark,light}-{1440,390}.png` against `21-dashboard-main-*`. Colours, icons, sparklines and delta chips are retained (green Left over top bar, green/orange sparklines, amber attention icons). Ticket-22 items 1–4: 2, 3 and 4 look fixed (budget chip gap, "2-month average" intact, forecast caption spacing); item 1 is only half-fixed (chip stays on the label row, but the label wraps; see Opus 11). No truncated numbers.

12. **degraded** — `11-dashboard-branch-dark-1440`, `-light-1440`, `11-dashboard-branch-*-390`: a $2.50 unbudgeted Record raises a full-weight Attention row ("1 unbudgeted spending Record"). Trivial amounts make the list feel noisy, so it no longer reads as "needs attention". Fix: `buildAttention` in `src/logic/dashboard.ts` (~line 1290): only emit the unbudgeted row above a materiality floor (e.g. ≥2% of month spending or ≥$20), and say the amount ("$2.50 spent without a Monthly Budget").

13. **polish** — `11-dashboard-branch-dark-1440`, `-light-1440`, `-390`: the headline is `text-sm` in the same colour and weight as the Attention row titles directly beneath it, so the month's key message has no hierarchy and the three 14px row titles compete with it. Fix: `app/(month)/page.tsx:140`, use `text-base font-medium` (keep `text-pretty`), with muted numbers unchanged, and add `mb-4`. At 390 this also avoids the sentence reading as a caption.

14. **polish** — `11-dashboard-branch-*-1440`: the Attention list is three ~50px rows (~150px) and the first row says "32 unallocated Statements" in the same amber as the other two. Three equal amber icons give no ranking, and the list pushes the Spent/Income/Left over metrics ~190px down versus main, where the chips cost ~30px. Fix: `AttentionList` in `app/(month)/page.tsx:646`, use `py-2` rows (≈40px) and make only the top-ranked row's icon amber with the rest `text-muted-foreground`. Only the first row should look urgent.

15. **polish** — all eight: Attention row copy uses jargon: "Not fully allocated or linked to a Pending Statement." and the panel header "Pending Records counted". Fix: `buildAttention` in `src/logic/dashboard.ts`, use "Not yet matched to a Statement." (or "Waiting for a Statement to confirm."), and in `src/components/drill/panel.tsx` the header sub-line, "Includes Pending Records" (keep the `Term` underline on Pending).

16. **polish** — `11-panel-branch-dark-1440`, `-light-1440`: with the dock open, Spending forecast (~280px wide chart) ends ~100px above Monthly budgets, leaving a dead block under the forecast legend and a ragged row bottom. This is the same rule problem as item 6: card rows should either stretch or sit naturally everywhere. Fix: `app/(month)/page.tsx` forecast/budget grid, `items-stretch`, and `mt-auto` on the forecast caption so the empty space reads as padding, or move Monthly budgets below the forecast when the container is narrower than ~720px.

17. **polish** — `11-panel-branch-dark-390`, `-light-390`: drill rows are inconsistent: the budget chip sits inline for "CS Fresh Fri 9 Oct · Groceries [Daily]" but wraps to its own line for "Utilities Bill" and "Sheng Siong Top-up" (which also wraps its title and stacks a Pending chip), so row heights vary 55–110px. Fix: `src/components/drill/panel.tsx`, always put the budget chip on its own line under the date·category line at narrow width (`flex-col items-start` below `@sm`), so every row has the same shape.

18. **polish** — `11-dashboard-branch-dark-1440`, `-light-1440`: the bottom row (Largest Records, Spending calendar, Biggest changes) is ragged: Biggest changes is ~110px taller than its two neighbours, which leave empty tails. Fix: tied to Opus 9 and item 5; when rebalancing under `@container`, pair Largest Records and Biggest changes in one column, or let the shorter cards `self-start` with equal gaps, so no card has an unexplained empty tail.


Implementation pass: items 5–6, 9–18 use natural card heights throughout; pairs stack below 860px of main-column width and the bottom three cards use three columns only above that width, otherwise one column. Largest Records title/action align with the shorter description. Item 7 uses compact two-column metrics with reduced vertical padding. Item 8 deliberately skipped to preserve the dense single-row filter layout. Small unbudgeted amounts remain visible in last priority with their amount; no threshold. First Attention icon amber, subsequent icons muted; row padding reduced. Pending copy simplified and mobile budget badges get a separate metadata line. README documents the visible behaviour.

Edited test: `tests/domain/headline-attention.test.ts` / “Attention ranks budgets first and caps the list at three”: supplies $2.50 of unbudgeted spending and expects the amount label below Pending Statements. It failed before the implementation and passed afterwards. Browser test edited intentionally: `tests/core/charts.e2e.ts` / “category cards: cap five rows and keep natural heights when expanding” replaces the equal-height requirement with natural-height bottom-padding and aligned-top checks, while retaining expansion/count assertions. Mutation check: forcing the category row to stretch with a fixed height failed the new gap assertion (588.625px received; <32px required), then the mutation was removed.

Verification: `bun test` — 177 passed, 0 failed (2,267 assertions); `bun lint`, `bun lint:check`, `bun types:check`, `bun run build` — passed. `PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/charts.e2e.ts tests/core/drilldown.e2e.ts --project=desktop --project=mobile --workers=2` — clean final run 50 passed, 2 designed skips. `PLAYWRIGHT_SERVER=production PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- tests/animations/drilldown.e2e.ts --project=desktop --project=mobile --workers=1` — 5 passed. Initial failures were the corrected shared metric markup regression and the intentionally superseded equal-height assertion; neither was called flaky.

Graph: final `graphify update .` passed. README semantic extraction refreshed inline using the graphify skill, cached and merged, then `graphify cluster-only .` regenerated the report and labels. Coverage warnings reviewed: 17 code files yield no symbols, 9 unsupported files skipped, 126 isolated symbols and 11 thin communities. These are graph coverage warnings, not a refresh failure. Four required graph artifacts included.

Screenshots: production build on port 5180, `npx -y agent-browser@0.27.0 --session t22`, after clicking “Try demo data”, October 2026. Required paths: `review/22-{dashboard,panel,records}-branch-{dark,light}-{1440,390}.png` and `review/22-panel-branch-light-1280.png`; additional `review/22-panel-lower-branch-light-1440.png` shows stacked category and bottom cards with the dock open. Ordinary viewport screenshots are used because full-page capture temporarily altered Framer layout/graphs. Theme is selected with the visible Light/Dark controls.

Look for: aligned Largest Records heading and See all; natural card bottoms with no empty tails; single-column cards beside the dock with no orphan; full category names; Left over on one line; compact narrow metrics; one amber Attention icon and $2.50 without a Monthly Budget last; Includes Pending Records; mobile budget badges consistently below the date/category line; all semantic money colours and chart colours retained. Optional item 8 skipped to keep the desktop filters on one row.

Final visual inspection: opened all 13 required screenshots and both supplemental panel screenshots. Confirmed items 5–7 and 9–18 visibly fixed, no orphaned card in the inspected layouts, colours/delta chips/money colours retained; responsive sparklines remain at roomy widths and are suppressed only for compact cells. No required item left unresolved. Optional 8 omitted. Browser closed; production server stopped by PID 1628377; no servers left listening.

- [x] Required items 5–6 and 9–18 implemented and inspected.
- [x] Optional 7 compact metrics implemented; optional 8 omitted to preserve the filter row.
- [x] Domain, lint, types, production build, core and animation checks passed.
- [x] Screenshot matrix opened and reviewed; ticket evidence and README updated.
- [x] Graph refreshed, semantic README update included, health warnings reviewed.

- [x] Signed commit `c4712806b929c00141f351d559dc860d0985df49` (`git log %G?` = G), pushed to `origin ai/insight-drilldown`. Working tree clean; `next-env.d.ts` never staged. No PR opened.

Final server check: no listeners on 5180, 5273 or 5274. Supplemental bottom screenshot `review/22-panel-bottom-branch-light-1440.png` also opened and inspected.
