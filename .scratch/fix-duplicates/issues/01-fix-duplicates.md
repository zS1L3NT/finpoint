# 01: Review and fix duplicate bank statements in Workflows

**What to build:** the complete Fix Duplicates workflow described in ../spec.md: grouped suggestions, manual selection behind a toggle, pair dismissal/restore, and explicit preservation/deletion with the agreed allocation rules.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] Workflows naming and third tab appear, with existing workflows preserved.
- [x] Conservative groups include spacing and PayNow word reordering examples and exclude conflicting identities.
- [x] All modes enforce same account, day, signed amount and imported/non-pending status.
- [x] User explicitly chooses survivor and deletion targets; survivor fields remain unchanged.
- [x] Allocation source behavior covers one allocated side, allocated survivor and multiple sources.
- [x] Records remain, allocation deficits become pending, and affected records are linked after confirmation.
- [x] Pair-only dismissals persist, can be restored, and are cleaned when statements disappear.
- [x] One minimal table is included in migration, backup compatibility, reset and Drive sync.
- [x] Meaningful domain tests, lint, types, build and browser smoke verification pass.
- [x] Standards and spec reviews complete and findings are resolved.
- [x] Final project graph refresh completes before reporting completion.

## Completion evidence

- Implementation commits: `1f67b81`, `3385377`, `cea93fa` on `ai/bank-statement-duplicate-detection`.
- 31 tests / 87 assertions passed; test files pass individually, together in either order, and in isolated parallel execution. Importer tests now use real IndexedDB instead of leaking global module mocks.
- `bun lint:check`, `bun types:check`, and `bun run build` passed; Fix Duplicates remains a static route.
- `npm run dev` browser smoke checks passed for both existing workflow tabs, suggested groups, manual selection, pending exclusion, pair dismissal/restore across reload, allocated-survivor preservation, allocation movement, and multiple-source selection. Affected record verified Pending in its details. Mobile page and confirmation dialog fit the viewport. Dev server stopped afterward.
- Standards review: no material findings. Spec review: two matcher findings fixed and independently verified (numeric reference order and meaningful recipient words); no remaining findings.
- Final graph refresh includes implementation, setup instructions, spec, and ticket. No PR or remote issue created.

## PR preparation

- Integrated current main, preserving its monthly-budget migrations. Duplicate dismissals now use database version 5 and backup version 4; earlier backups receive an empty dismissal table.
- Rechecked migration from database versions 2 and 4, financial-data preservation, and clean/unsynced Drive baselines: 33 tests and 93 assertions pass. Lint, TypeScript, and production build pass after integration.
