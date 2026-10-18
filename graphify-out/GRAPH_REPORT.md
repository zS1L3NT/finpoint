# Graph Report - t3-e5df8507  (2026-10-18)

## Corpus Check
- 197 files · ~122,098 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1592 nodes · 6331 edges · 74 communities (67 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 97 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07fc1c15`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- Button
- total-spending-chart.tsx
- (month)/page.tsx
- cn
- sync/page.tsx
- luxon
- amount-filter.tsx
- Validator
- dashboard.ts
- round2
- compilerOptions
- db.ts
- package.json
- dependencies
- Project Shape
- duplicates/page.tsx
- paginated-data-table.tsx
- suspicious
- statements.ts
- monthpicker.tsx
- correctness
- export-import.ts
- drive-sync.ts
- records.ts
- components.json
- Commands
- combobox.tsx
- test-data.ts
- STYLE.md
- Validation rule (ValidationError + Validator)
- auto-sync.ts
- sidebar.tsx
- Monthly Budget
- auth-vault.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- AGENTS.md
- utils.ts
- types.d.ts
- google-drive.ts
- formatter
- biome.json
- rules
- devDependencies
- manifest.json
- Next.js agent rules block ("This is NOT the Next.js you know")
- Project Graph
- formatter
- Commit Guide
- Records
- snapshot-hash.ts
- optionalDependencies
- scripts
- style
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Finpoint
- Local Markdown Issue Tracker
- Google Drive sync
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Domain Documentation Conflicts
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- Issue tracker: Local Markdown
- Domain docs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 313 edges
2. `Button()` - 118 edges
3. `react` - 89 edges
4. `formatCurrency()` - 81 edges
5. `RecordEditorDialog()` - 63 edges
6. `UiIcon()` - 54 edges
7. `RecordCreatorDialog()` - 52 edges
8. `round2()` - 46 edges
9. `PageContent()` - 42 edges
10. `next` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `MonthLayout()` --calls--> `PageContent()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/layout/page-content.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (74 total, 7 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.10
Nodes (80): SECTIONS, react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+72 more)

### Community 1 - "Button"
Cohesion: 0.07
Nodes (104): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), AllocatorPendingPage(), CandidatePage, BUDGET_STATES (+96 more)

### Community 2 - "total-spending-chart.tsx"
Cohesion: 0.07
Nodes (61): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart(), CashflowPoint (+53 more)

### Community 3 - "(month)/page.tsx"
Cohesion: 0.05
Nodes (107): CandidateResults(), PendingCard(), BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), ImporterPage(), Step() (+99 more)

### Community 4 - "cn"
Cohesion: 0.07
Nodes (39): radix-ui, AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem(), DropdownMenuContent() (+31 more)

### Community 5 - "sync/page.tsx"
Cohesion: 0.16
Nodes (23): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+15 more)

### Community 6 - "luxon"
Cohesion: 0.16
Nodes (24): BudgetState, luxon, react-day-picker, DateField(), Props, DateRange(), DateRangeValue, formatRange() (+16 more)

### Community 7 - "amount-filter.tsx"
Cohesion: 0.25
Nodes (21): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe(), Draft (+13 more)

### Community 8 - "Validator"
Cohesion: 0.27
Nodes (16): updateAccount(), validateBudget(), cleanInput(), fixDuplicates(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS, PACE_KINDS, setMonthlyBudgetAmount() (+8 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.12
Nodes (39): AllocationRow, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+31 more)

### Community 10 - "round2"
Cohesion: 0.12
Nodes (37): asPending(), round2(), AccountActivity, ensureAccount(), NO_ACTIVITY, CategoryInput, createCategory(), deleteCategory() (+29 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "db.ts"
Cohesion: 0.08
Nodes (30): dexie, fake-indexeddb, AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+22 more)

### Community 13 - "package.json"
Cohesion: 0.06
Nodes (31): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+23 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "Project Shape"
Cohesion: 0.18
Nodes (9): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), URL search params (filters and pagination) (+1 more)

### Community 16 - "duplicates/page.tsx"
Cohesion: 0.12
Nodes (35): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, pageHref(), pageWindow() (+27 more)

### Community 17 - "paginated-data-table.tsx"
Cohesion: 0.21
Nodes (25): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), MOBILE_LIST_CLASS (+17 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "statements.ts"
Cohesion: 0.19
Nodes (21): countSuggestions(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+13 more)

### Community 20 - "monthpicker.tsx"
Cohesion: 0.33
Nodes (6): ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.18
Nodes (19): clearAllData(), downloadExport(), exportData(), importData(), parseImportFile(), tableCounts(), TableName, TABLES (+11 more)

### Community 23 - "drive-sync.ts"
Cohesion: 0.26
Nodes (22): downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile(), hashSnapshot() (+14 more)

### Community 25 - "records.ts"
Cohesion: 0.12
Nodes (20): db, BudgetDetail, BudgetFilters, createBudget(), getBudget(), listBudgets(), updateBudget(), getMonthlyRecords() (+12 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 29 - "combobox.tsx"
Cohesion: 0.14
Nodes (17): ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty() (+9 more)

### Community 30 - "test-data.ts"
Cohesion: 0.16
Nodes (16): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+8 more)

### Community 32 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 33 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 34 - "auto-sync.ts"
Cohesion: 0.14
Nodes (18): SYNC_TABLES, useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), sameSnapshot(), set() (+10 more)

### Community 35 - "sidebar.tsx"
Cohesion: 0.05
Nodes (85): metadata, RootLayout(), viewport, MonthLayout(), ReviewLinks(), Boot(), Providers(), Template() (+77 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 41 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 42 - "AGENTS.md"
Cohesion: 0.18
Nodes (12): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+4 more)

### Community 43 - "utils.ts"
Cohesion: 0.19
Nodes (17): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+9 more)

### Community 44 - "types.d.ts"
Cohesion: 0.09
Nodes (21): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+13 more)

### Community 46 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse (+2 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "snapshot-hash.ts"
Cohesion: 0.40
Nodes (4): FinpointDB, digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 79 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 80 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 81 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 82 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 83 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 91 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 92 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

## Knowledge Gaps
- **73 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 496 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `Button`, `total-spending-chart.tsx`, `(month)/page.tsx`, `sidebar.tsx`, `sync/page.tsx`, `luxon`, `amount-filter.tsx`, `utils.ts`, `duplicates/page.tsx`, `paginated-data-table.tsx`, `monthpicker.tsx`, `combobox.tsx`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09853479853479853 - nodes in this community are weakly interconnected._
- **Why does `Copy` connect `STYLE.md` to `Button`, `Monthly Budget`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06808510638297872 - nodes in this community are weakly interconnected._
- **Why does `pluralize()` connect `Button` to `record-editor.tsx`, `STYLE.md`, `(month)/page.tsx`, `amount-filter.tsx`, `utils.ts`, `duplicates/page.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `total-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06846846846846846 - nodes in this community are weakly interconnected._