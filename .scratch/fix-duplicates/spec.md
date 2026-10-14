# Fix duplicate bank statements

## Problem Statement

Banks change descriptions between exports of the same account activity. Finpoint imports the changed description as another statement. Users need to find these duplicates and preserve the correct imported statement without corrupting allocations or removing records.

## Solution

Rename the visible Allocator navigation and page titles to Workflows. Add a Fix Duplicates tab alongside Allocate to Records and Replace Pending. Keep existing routes compatible. Show conservative suggestions in groups; users explicitly choose one statement to preserve and which others to delete. Manual selection is hidden behind a toggle. False positives can be dismissed per pair and restored.

## User Stories

1. As a user, I want allocation and cleanup together under Workflows.
2. As a user, I want existing allocation and pending replacement views to keep working.
3. As a user, I want a Fix Duplicates tab showing suggested groups.
4. As a user, I want suggestions restricted to the same account, calendar day, and signed amount.
5. As a user, I want Pending Statements excluded in all modes without a toggle.
6. As a user, I want spacing-only description changes suggested.
7. As a user, I want reordered PayNow method and recipient wording suggested when identifying details agree.
8. As a user, I want conflicting recipients and reference numbers to prevent strong suggestions.
9. As a user, I want generic bank wording alone to be insufficient for suggestions.
10. As a user, I want all matching statements presented in groups rather than repeated pairs.
11. As a user, I want to select the correct statement without editing its description.
12. As a user, I want to explicitly choose which other statements to delete and leave the rest intact.
13. As a user, I want manual selection behind a Select statements manually toggle for changes the matcher misses.
14. As a user, I want manual selections to obey the same account, day, amount, and pending constraints.
15. As a user, I want to review allocations and affected records before confirming deletion.
16. As a user, I want the correct statement's allocations preserved when it already has any.
17. As a user, I want allocations moved when only one selected statement has them and the survivor has none.
18. As a user, I want to choose one allocation source when the survivor is unallocated and multiple selected duplicates are allocated.
19. As a user, I want other deleted statements' allocations removed without deleting their records.
20. As a user, I want records with amounts that no longer tally to become pending through the existing rules.
21. As a user, I want to see affected records after confirmation so I can reconcile them.
22. As a user, I want deleted statements and all references to their descriptions wiped, with no aliases or deletion history.
23. As a user, I accept that reimporting an old description can recreate a deleted statement.
24. As a user, I want to dismiss a selected pair as These are separate, without dismissing either statement against a third one.
25. As a user, I want dismissals to survive reloads, backup restores, and Drive sync.
26. As a user, I want to undo a pair dismissal.
27. As a user, I want stale dismissals removed when either statement is deleted.
28. As a user, I want filters and pagination represented in URL search parameters.

## Implementation Decisions

- Add one minimal dismissal table containing two statement IDs, stored in canonical order with a compound primary key and indexes for deletion cleanup. No candidate, score, alias, or deletion-history tables.
- Add a versioned Dexie migration with an upgrade block; preserve previous migrations. Backups include the dismissal table and accept earlier backup versions with that table empty. Include it in existing sync and reset surfaces.
- Keep UI free of direct Dexie imports. Domain operations read statements, accounts, allocations, and records, compute groups, and validate through Validator with Laravel-shaped errors.
- Suggestions require non-pending statements, same account, calendar day, and amount in integer cents. Identical repeated purchases are not automatically deleted. No suggestion ever triggers deletion without explicit user selection.
- Matcher normalizes spacing and punctuation without erasing numeric identifiers. It supports token reordering in the PayNow examples. Shared generic banking tokens alone are insufficient. Conflicting meaningful text or numeric identifiers must fail; a permissive percentage threshold alone is insufficient. Tests document the actual matcher boundary.
- Group related suggestion pairs for display but retain the eligible pair edges; transitive connectivity is not proof that all statements duplicate each other. Dismissed pairs remain separate even within a group connected by another pair.
- Manual selection can bypass description similarity and prior dismissals after explicit user selection; it cannot bypass account/day/signed amount/non-pending eligibility.
- The survivor's imported fields remain untouched. If it has allocations, preserve those. Otherwise move one selected duplicate's allocations; if several have allocations require an explicit source. Remove every other deleted statement's allocations. Preserve all records, budgets, categories, and record fields.
- Validate source allocation amounts/signs/capacity and current eligibility again inside the deletion transaction. Delete statements, obsolete allocations, and dismissal references atomically. Return affected record IDs for review links; pending status remains derived by existing logic.
- Use a confirmation dialog explaining the allocation outcome and affected records. Avoid retaining deleted descriptions in success results or history.
- Provide a dismissed-pair view with restore actions. Pair IDs alone are stored. Clean dismissal references during account deletion and all statement deletion paths.
- Render nothing for unresolved live-query data, reveal content once available, and use established UI primitives and motion. Keep filters/pagination in search params and temporary review choices in component state.

## Testing Decisions

- Test public domain operations against meaningful database behavior: candidate groups, pair dismiss/restore, and atomic deletion outcomes. Prefer realistic IndexedDB behavior to mocks mirroring implementation.
- Use the existing Bun testing convention. Cover spacing examples and reordered PayNow examples from screenshots, unrelated NETS text, conflicting recipients/references, repeated purchases, date/account/amount/pending exclusions, and pair-specific dismissal within groups.
- Cover no allocations, one allocated side, allocated survivor, multiple possible sources, partial allocations, common-record allocation collisions, invalid/stale inputs, and retention of record fields.
- Verify migration and old/new backup compatibility, export/import persistence, dismissal cleanup, and sync table inclusion.
- Run read-only lint, TypeScript, relevant tests, and build. Run npm run dev directly, smoke-test Workflows/Fix Duplicates and existing tabs, and stop the server afterwards.

## Out of Scope

- Pending Statement deduplication, cross-day matches, cross-account matches, automatic deletion, description editing, merchant alias rules, deleted-description retention, deletion history, and automatic record deletion or merging.
- GitHub Issues and PR creation.

## Further Notes

- Screenshots show Sheng Siong descriptions differing by spacing and PayNow recipient/method reordering. The third example is truncated; matching must not assume its invisible suffix. Retain full text when inspecting statements in the UI.
- User approved proceeding with implementation after the design interview and local tracker setup. Use one complete vertical ticket to deliver this feature; no separate layer-only tickets.
