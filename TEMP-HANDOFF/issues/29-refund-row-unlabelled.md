> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 29 a refund shows as a plain amount in the Spending list

Status: resolved
Blocked by: —
Spec: ../spec.md §5.2, Sol goal 9 (refund)

**Severity: polish**

## Evidence

Goal 9 had no refund in demo data, so I edited Hawker Dinner (31 Oct) to Money in via the Record editor. Totals reconcile ($2,017.04 expenses − $34.72 refunds = $1,982.32 on the dashboard and in the drill header), but in the "Spent in October" panel the row reads "Hawker Dinner Pending … $34.72 · $34.72 of $34.72 allocated": no "+" sign, no "Refund" tag, same colour family as the spend rows around it, and Pending with no reason (see 25). The header says only "refunds subtracted", with no refund total.

## Fix

`src/components/drill/panel.tsx` + `src/components/record-amount.tsx`: render a refund as `+$34.72` in the income green with a small "Refund" chip; add "$2,017.04 spent − $34.72 refunds" to the meta line when the measure has refunds. `src/logic/drilldown.ts` exposes `refund_total`.

## Acceptance

- [x] Refund rows are visibly signed and labelled in every spending drill.
- [x] Meta line shows the refund total when non-zero.
- [x] Domain test with one refund Record checks the total reconciles to the cent.

## Comments

Refunds are signed, green and labelled in ordinary and comparison drill rows. Domain reads expose gross_spending and refund_total; the header reconciles them. The Drill-down renders amounts directly, so the actual row renderers changed; the unused shared RecordAmount component retains its existing API/behaviour. README documents refund identity.

TDD: new “spending drill reconciles gross spending and a cent-exact refund” failed on missing refund_total, then passed. Its full-suite fixture work exceeded Bun’s default 5s, so this new test uses 30s like nearby demo tests; all cent assertions remain. Final bun test: 181 passed. bun lint, bun lint:check, bun types:check, bun run build passed. PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/drilldown.e2e.ts --grep 'refund|Pending drill|Biggest changes|drill pivot' --project=desktop --project=mobile: 8 passed. Added browser test “Spending drill labels and signs refunds and reconciles its caption” checks Refund, +$20, creative colour and gross/refund caption. No existing test assertions changed.

Production demo October 2026: edited 31 Oct Hawker Dinner through the Record editor to Money in (original allocation retained). Screenshots opened: review/29-refund-branch-{dark,light}-{1440,390}.png and review/29-refund-compare-branch-{dark,light}-{1440,390}.png. Browser closed and server killed by PID. graphify update . plus README semantic refresh/clustering passed (symbol-free config/test warning only).

Look for: green +$34.72 and Refund chip, explicit opposite-sign pending reason, and $2,015.27 spent − $34.72 refunds = $1,980.55.

Signed commit: aefc14f; pushed origin ai/insight-drilldown.

Graph health review (supplement): this commit’s report lists 128 degree-0/1 nodes (graphify labels them isolated) and 17 thin communities omitted from the report. These are non-fatal notices; the refresh succeeded. The starting graph reported 129 and 18 respectively.

Mutation proof after the fixture timeout adjustment: forcing refund_total to 0 makes “spending drill reconciles gross spending and a cent-exact refund” fail (Received: 0, expected 34.72) under its 30s timeout. Source restored byte-for-byte; log /tmp/t29-mutation-proof.log.
