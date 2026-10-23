# Graph Report - t3-9755e75b  (2026-10-23)

## Corpus Check
- 238 files · ~198,200 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1832 nodes · 7133 edges · 101 communities (92 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edc67d09`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- sync/page.tsx
- total-spending-chart.tsx
- pending/page.tsx
- importer.ts
- sidebar.tsx
- record-columns.tsx
- records.ts
- Validator
- dashboard.ts
- budgets/[id]/page.tsx
- compilerOptions
- primitives.tsx
- package.json
- dependencies
- Project Shape
- category-filter.tsx
- budgets/page.tsx
- suspicious
- Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)
- duplicates/page.tsx
- correctness
- export-import.ts
- auto-sync.ts
- (month)/page.tsx
- use-appearance.tsx
- components.json
- Commands
- app-sidebar.tsx
- input-group.tsx
- test-data.ts
- assertions.ts
- @playwright/test
- icon.tsx
- coverage.e2e.ts
- utils.ts
- statements.ts
- accounts/page.tsx
- STYLE.md
- auth-vault.ts
- allocator/page.tsx
- duplicates.ts
- AGENTS.md
- cn
- types.d.ts
- Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)
- db.ts
- formatter
- editors.e2e.ts
- Validation rule (ValidationError + Validator)
- pagination.tsx
- biome.json
- rules
- workflows.e2e.ts
- devDependencies
- manifest.json
- next
- Next.js agent rules block ("This is NOT the Next.js you know")
- category-history-chart.tsx
- Project Graph
- Separator
- formatter
- Commit Guide
- Records
- drive-sync.ts
- optionalDependencies
- scripts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- style
- sheet-loading.e2e.ts
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- fixtures.ts
- vite.config.ts
- Finpoint
- Local Markdown Issue Tracker
- Google Drive sync
- tsconfig.web.json
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
- collectTests
- What to run
- history.tsx
- widgets.e2e.ts
- monthly-budget-usage.tsx
- spending-calendar.tsx
- playwright.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 119 edges
4. `react` - 93 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 49 edges
8. `RecordCreatorDialog()` - 47 edges
9. `round2()` - 46 edges
10. `next` - 41 edges

## Surprising Connections (you probably didn't know these)
- `2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS` --references--> `PageContent()`  [INFERRED]
  reviews/opus-pending-race-oct23.md → src/components/layout/page-content.tsx
- `1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`` --references--> `PaginationFooter()`  [INFERRED]
  reviews/opus-pending-race-oct23.md → src/components/table/pagination-footer.tsx
- `1. Restructure fidelity — PASS` --references--> `unwrap()`  [INFERRED]
  reviews/opus-restructure-oct23.md → tests/web/coverage.e2e.ts
- `Verdict` --references--> `seedWorkspace()`  [INFERRED]
  reviews/opus-restructure-oct23.md → tests/web/support/fixtures.ts
- `What to run` --references--> `SelectItem()`  [INFERRED]
  tests/web/README.md → src/components/ui/select.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (101 total, 9 thin omitted)

### Community 0 - "Button"
Cohesion: 0.08
Nodes (99): react-dom, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues (+91 more)

### Community 1 - "sync/page.tsx"
Cohesion: 0.16
Nodes (25): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+17 more)

### Community 2 - "total-spending-chart.tsx"
Cohesion: 0.10
Nodes (43): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart(), CashflowPoint (+35 more)

### Community 3 - "pending/page.tsx"
Cohesion: 0.23
Nodes (26): AllocatorPendingPage(), CandidatePage, CandidateResults(), PendingCard(), DuplicateReviewDialog(), StatementTile(), Amount(), dateDifferenceLabel() (+18 more)

### Community 4 - "importer.ts"
Cohesion: 0.25
Nodes (19): asPending(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+11 more)

### Community 5 - "sidebar.tsx"
Cohesion: 0.08
Nodes (35): metadata, RootLayout(), viewport, Providers(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps (+27 more)

### Community 6 - "record-columns.tsx"
Cohesion: 0.18
Nodes (22): MonthlyRecordsPage(), amountTone(), formatRowTime(), PendingBadge(), pendingReason(), RecordActions(), RecordActionsCell(), RecordAmountCell() (+14 more)

### Community 7 - "records.ts"
Cohesion: 0.11
Nodes (28): AllocationRow, db, round2(), BudgetDetail, BudgetFilters, createBudget(), getBudget(), getMonthlyRecords() (+20 more)

### Community 8 - "Validator"
Cohesion: 0.24
Nodes (18): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), fixDuplicates(), pairIds(), restoreDuplicatePair(), createMonthlyBudget() (+10 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.14
Nodes (34): contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection() (+26 more)

### Community 10 - "budgets/[id]/page.tsx"
Cohesion: 0.21
Nodes (28): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step() (+20 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "primitives.tsx"
Cohesion: 0.11
Nodes (42): AlertDialogTrigger(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxEmpty(), ComboboxGroup(), ComboboxLabel() (+34 more)

### Community 13 - "package.json"
Cohesion: 0.06
Nodes (30): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+22 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "Project Shape"
Cohesion: 0.16
Nodes (10): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), String primary keys (not auto-increment) (+2 more)

### Community 16 - "category-filter.tsx"
Cohesion: 0.19
Nodes (18): @base-ui/react, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+10 more)

### Community 17 - "budgets/page.tsx"
Cohesion: 0.15
Nodes (33): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), @tanstack/react-table, DataTable(), PaginatedDataTable() (+25 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)"
Cohesion: 0.11
Nodes (18): 1. Product fix — `app/allocator/pending/page.tsx`, 1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`, 1b. OBJECTION (Low–Medium): the identical-URL skip compares against the committed URL, not the last intent, 1c. PASS (Low note): `setCandidateQuery("")` per keystroke still allows one mid-typing push, 2. Test fixes, 2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS, 2b. `tests/web/navigation-motion.e2e.ts:123-130` — PASS (Low note), 2c. `tests/web/pending-search.e2e.ts:112-120` (mobile settled wait) — PASS with a Low note (+10 more)

### Community 20 - "duplicates/page.tsx"
Cohesion: 0.23
Nodes (16): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, dexie-react-hooks, WorkflowTabs() (+8 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.18
Nodes (18): clearAllData(), downloadExport(), EXPORT_VERSION, exportData(), FinpointExport, importData(), parseImportFile(), SYNC_TABLES (+10 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.13
Nodes (21): useSyncStatus(), useSyncToasts(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), markDirty(), refreshSyncDisplay() (+13 more)

### Community 24 - "(month)/page.tsx"
Cohesion: 0.15
Nodes (27): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+19 more)

### Community 25 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "app-sidebar.tsx"
Cohesion: 0.20
Nodes (24): NotFound(), Template(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+16 more)

### Community 29 - "input-group.tsx"
Cohesion: 0.26
Nodes (10): ComboboxClear(), ComboboxInput(), ComboboxTrigger(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupText() (+2 more)

### Community 30 - "test-data.ts"
Cohesion: 0.15
Nodes (18): Boot(), DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, seedIfEmpty(), BANK_BLURB, between(), CATEGORIES, DAILY (+10 more)

### Community 31 - "assertions.ts"
Cohesion: 0.18
Nodes (11): ready, titles, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleBackdrop(), expectVisibleRowCascade(), MotionFrame (+3 more)

### Community 32 - "@playwright/test"
Cohesion: 0.13
Nodes (11): @playwright/test, cardTitles, denseConsumers, MotionConsumer, populatedConsumers, Child, october, september (+3 more)

### Community 33 - "icon.tsx"
Cohesion: 0.10
Nodes (35): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, RecordPage(), framer-motion, AllocateBar(), Sparkline() (+27 more)

### Community 34 - "coverage.e2e.ts"
Cohesion: 0.11
Nodes (25): 2. Gate integrity — PASS with notes, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry (+17 more)

### Community 35 - "utils.ts"
Cohesion: 0.22
Nodes (25): react, PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe() (+17 more)

### Community 36 - "statements.ts"
Cohesion: 0.15
Nodes (24): countSuggestions(), AnalyticsRecord, AnalyticsSummary, removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation (+16 more)

### Community 37 - "accounts/page.tsx"
Cohesion: 0.24
Nodes (11): AccountCard(), AccountRow, AccountsPage(), dayLabel(), bankMeta(), BANKS, cardEnter(), AccountActivity (+3 more)

### Community 38 - "STYLE.md"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 40 - "allocator/page.tsx"
Cohesion: 0.17
Nodes (39): AccountPage(), AllocatorPage(), ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters(), RecordCreatorHost() (+31 more)

### Community 41 - "duplicates.ts"
Cohesion: 0.24
Nodes (10): StatementRow, descriptionAnchors(), descriptionIdentity(), DuplicateGroup, DuplicateStatement, eligible(), FixDuplicatesInput, GENERIC (+2 more)

### Community 42 - "AGENTS.md"
Cohesion: 0.19
Nodes (11): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+3 more)

### Community 43 - "cn"
Cohesion: 0.11
Nodes (24): lucide-react, radix-ui, react-day-picker, AlertAction(), buttonVariants, Calendar(), CalendarDayButton(), FieldContent() (+16 more)

### Community 44 - "types.d.ts"
Cohesion: 0.13
Nodes (14): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+6 more)

### Community 45 - "Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)"
Cohesion: 0.24
Nodes (9): 1. Restructure fidelity — PASS, 3. Sidebar hardening (d1ba358) — OBJECTION, Medium, 4. Evidence audit — CONDITIONAL, Graph, Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358), Required follow-ups (in order), Summary table, Verdict (+1 more)

### Community 46 - "db.ts"
Cohesion: 0.07
Nodes (34): dexie, fake-indexeddb, AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+26 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "editors.e2e.ts"
Cohesion: 0.12
Nodes (10): account, budget, deleted, editors, imported, kept, longText, openEditor() (+2 more)

### Community 49 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 50 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 53 - "workflows.e2e.ts"
Cohesion: 0.12
Nodes (4): expectBackAboveHeading(), keyboardBack(), IDS, DBS_VALID

### Community 54 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "next"
Cohesion: 0.22
Nodes (10): MonthLayout(), nextConfig, luxon, next, SearchInit, useMonthParams(), armMonthTransition(), STALE_MONTH_CLASS (+2 more)

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 60 - "Separator"
Cohesion: 0.23
Nodes (10): class-variance-authority, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), Separator() (+2 more)

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "drive-sync.ts"
Cohesion: 0.16
Nodes (32): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+24 more)

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, lint, lint:check, start, test:web, test:web:harness (+6 more)

### Community 67 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 69 - "sheet-loading.e2e.ts"
Cohesion: 0.28
Nodes (3): expectHeldRead(), expectRetainedRows(), expectSilentSheet()

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "fixtures.ts"
Cohesion: 0.12
Nodes (20): overviewCharts, bounds(), contained(), containedFooter(), longName, PREMATURE, first, next (+12 more)

### Community 73 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 74 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

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

### Community 93 - "collectTests"
Cohesion: 0.37
Nodes (12): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), tagValues(), titleOf() (+4 more)

### Community 94 - "What to run"
Cohesion: 0.22
Nodes (8): Browser regression tests, Static behaviour coverage ledger, Fixtures, Shared-fixture test step groups, Native motion frames and zero retries, Rendered assertions, Scoped affected browser checks, What to run

### Community 96 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 97 - "widgets.e2e.ts"
Cohesion: 0.28
Nodes (3): expectDropdownPreservesScroll(), scrollWithInput(), expectWheelScrollsPageWhileOpen()

### Community 98 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 99 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

## Knowledge Gaps
- **76 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 604 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@playwright/test` connect `@playwright/test` to `widgets.e2e.ts`, `coverage.e2e.ts`, `playwright.config.ts`, `sheet-loading.e2e.ts`, `fixtures.ts`, `package.json`, `editors.e2e.ts`, `workflows.e2e.ts`, `assertions.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07598355842630652 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Button`, `sync/page.tsx`, `total-spending-chart.tsx`, `pending/page.tsx`, `sidebar.tsx`, `record-columns.tsx`, `budgets/[id]/page.tsx`, `primitives.tsx`, `category-filter.tsx`, `budgets/page.tsx`, `duplicates/page.tsx`, `(month)/page.tsx`, `input-group.tsx`, `icon.tsx`, `utils.ts`, `accounts/page.tsx`, `allocator/page.tsx`, `pagination.tsx`, `next`, `Separator`, `monthly-budget-usage.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `total-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10087082728592163 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `Button`, `sync/page.tsx`, `total-spending-chart.tsx`, `pending/page.tsx`, `sidebar.tsx`, `record-columns.tsx`, `budgets/[id]/page.tsx`, `primitives.tsx`, `package.json`, `category-filter.tsx`, `budgets/page.tsx`, `duplicates/page.tsx`, `auto-sync.ts`, `(month)/page.tsx`, `use-appearance.tsx`, `app-sidebar.tsx`, `input-group.tsx`, `icon.tsx`, `accounts/page.tsx`, `allocator/page.tsx`, `cn`, `pagination.tsx`, `next`, `Separator`, `history.tsx`, `monthly-budget-usage.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07665505226480836 - nodes in this community are weakly interconnected._