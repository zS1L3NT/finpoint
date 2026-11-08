> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 40 Closing the full-page drill leaves it in Back history

Status: resolved
Blocked by: —
Spec: ../spec.md §6, ticket 33 · Evidence: ../acceptance-2/margaret/report.md (N2), ../acceptance-2/margaret/07-after-esc.png, 08-after-back.png

## Bug (reproduced by Opus with Playwright on the production build)
Dashboard → Spent → Open as → Full page (/drill?drill=metric:spent) → Esc (returns to /) → browser Back → /drill?drill=metric:spent reopens. The user has to press Back twice to leave a drill they already closed.

## Fix
Closing from the full page should step back to the Dashboard entry it came from (history back when the previous entry is that Dashboard state; otherwise replace, never push). The same rule applies to "← Back to Dashboard" and Esc. Peek modes stay as they are: Back closes the peek, and Jen and Dana's flows must keep working.

## Acceptance
- [ ] e2e: full page → Esc → Back leaves the drill (it does not reopen it); the same for the back link; a deep link straight to /drill → close → lands on the Dashboard with no dead Back entry.
- [ ] The existing "Escape and Back restore scroll and focus in every mode" test still passes.

## Comments
- Fix in src/hooks/use-drill.ts: on the full page, close steps back over the history entries it pushed (counted in the sessionStorage return record); a deep link has no Dashboard entry, so it replaces. Peek modes unchanged.
- Tests added: "closing the full-page drill leaves it out of Back history" (Esc and back link), "closing a deep-linked full-page drill replaces it with the Dashboard". tests/core/drilldown.e2e.ts: 41 passed, 1 skipped (production build, desktop+mobile).
- Look for: none visual.
