# Graph Report - t3-9755e75b  (2026-10-24)

## Corpus Check
- 247 files · ~222,975 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1936 nodes · 7630 edges · 99 communities (89 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 132 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fd46fac6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- importer/page.tsx
- category-history-chart.tsx
- statements.ts
- sidebar.tsx
- combobox.tsx
- sync/page.tsx
- lib/motion.ts
- Validator
- dashboard.ts
- ValidationError
- compilerOptions
- accounts/page.tsx
- package.json
- dependencies
- Project Shape
- routes.ts
- paginated-data-table.tsx
- suspicious
- primitives.tsx
- pending/page.tsx
- correctness
- export-import.ts
- drive-sync.ts
- monthly-budget-usage.tsx
- records.ts
- components.json
- Commands
- test-web.ts
- providers.tsx
- test-data.ts
- react
- PaginationFooter
- statement-rules.ts
- auto-sync.ts
- budgets/page.tsx
- Validation rule (ValidationError + Validator)
- (month)/page.tsx
- Monthly Budget
- auth-vault.ts
- motion/components.e2e.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- AGENTS.md
- amount-filter.tsx
- types.d.ts
- fixtures.ts
- gate/sheets.e2e.ts
- formatter
- db.ts
- ledger.e2e.ts
- support/motion.ts
- biome.json
- rules
- icon.tsx
- devDependencies
- manifest.json
- gate/components.e2e.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- utils.ts
- Project Graph
- budgets/[id]/page.tsx
- formatter
- Commit Guide
- Records
- Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)
- optionalDependencies
- scripts
- workflows.e2e.ts
- style
- importer.test.ts
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- gate/routes.e2e.ts
- Separator
- Finpoint
- Local Markdown Issue Tracker
- Google Drive sync
- google-drive.ts
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
- next
- Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)
- total-spending-chart.tsx
- spending-calendar.tsx
- tsconfig.web.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 124 edges
4. `react` - 96 edges
5. `formatCurrency()` - 81 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 56 edges
8. `RecordCreatorDialog()` - 52 edges
9. `round2()` - 44 edges
10. `PageContent()` - 43 edges

## Surprising Connections (you probably didn't know these)
- `2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS` --references--> `PageContent()`  [INFERRED]
  reviews/opus-pending-race-oct23.md → src/components/layout/page-content.tsx
- `1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`` --references--> `PaginationFooter()`  [INFERRED]
  reviews/opus-pending-race-oct23.md → src/components/table/pagination-footer.tsx
- `Rendered assertions` --references--> `SelectItem()`  [INFERRED]
  tests/web/README.md → src/components/ui/select.tsx
- `1. Restructure fidelity — PASS` --references--> `unwrap()`  [INFERRED]
  reviews/opus-restructure-oct23.md → tests/web/gate/ledger.e2e.ts
- `Verdict` --references--> `seedWorkspace()`  [INFERRED]
  reviews/opus-restructure-oct23.md → tests/web/support/fixtures.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (99 total, 10 thin omitted)

### Community 0 - "Button"
Cohesion: 0.06
Nodes (128): CandidateResults(), BudgetState, MonthLayout(), @base-ui/react, luxon, react-day-picker, sonner, @tanstack/react-form (+120 more)

### Community 1 - "importer/page.tsx"
Cohesion: 0.26
Nodes (24): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS (+16 more)

### Community 2 - "category-history-chart.tsx"
Cohesion: 0.10
Nodes (37): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), aggregateSeries(), CategoryHistoryChart() (+29 more)

### Community 3 - "statements.ts"
Cohesion: 0.14
Nodes (25): countSuggestions(), asPending(), removeStatementDismissals(), upsertIndexed(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation (+17 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.11
Nodes (35): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), Sidebar() (+27 more)

### Community 5 - "combobox.tsx"
Cohesion: 0.14
Nodes (33): CategoryFilter(), CategoryFilterItem(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty() (+25 more)

### Community 6 - "sync/page.tsx"
Cohesion: 0.18
Nodes (22): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+14 more)

### Community 7 - "lib/motion.ts"
Cohesion: 0.20
Nodes (16): framer-motion, AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), Metric(), RecordAmount(), ValueSwap() (+8 more)

### Community 8 - "Validator"
Cohesion: 0.25
Nodes (18): updateAccount(), validateBudget(), cleanInput(), fixDuplicates(), importFiles(), readFile(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS (+10 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.11
Nodes (40): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+32 more)

### Community 10 - "ValidationError"
Cohesion: 0.29
Nodes (16): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+8 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "accounts/page.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "Project Shape"
Cohesion: 0.16
Nodes (10): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), String primary keys (not auto-increment) (+2 more)

### Community 16 - "routes.ts"
Cohesion: 0.25
Nodes (16): NotFound(), TITLES, pathAccounts(), pathAllocator(), pathBudgets(), pathCategories(), pathDashboard(), pathDataSettings() (+8 more)

### Community 17 - "paginated-data-table.tsx"
Cohesion: 0.23
Nodes (24): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+16 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "primitives.tsx"
Cohesion: 0.09
Nodes (47): AlertAction(), AlertDialogTrigger(), ChartLegendContent(), ComboboxCollection(), ComboboxValue(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+39 more)

### Community 20 - "pending/page.tsx"
Cohesion: 0.07
Nodes (107): AccountPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage() (+99 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.21
Nodes (15): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+7 more)

### Community 23 - "drive-sync.ts"
Cohesion: 0.21
Nodes (19): FinpointDB, exportData(), disconnectDrive(), downloadBackupFile(), driveFetch(), findBackupFile(), getFileMeta(), uploadBackupFile() (+11 more)

### Community 24 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 25 - "records.ts"
Cohesion: 0.11
Nodes (24): BudgetDetail, BudgetFilters, createBudget(), updateBudget(), loadDashboardTables(), duplicateStatementIds(), AllocationTally, pendingStatementIds() (+16 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "test-web.ts"
Cohesion: 0.09
Nodes (35): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), flags, paths (+27 more)

### Community 29 - "providers.tsx"
Cohesion: 0.13
Nodes (26): metadata, RootLayout(), viewport, Boot(), Providers(), ShellHeader(), SidebarInset(), SidebarProvider() (+18 more)

### Community 30 - "test-data.ts"
Cohesion: 0.15
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, seedIfEmpty(), BANK_BLURB, between(), CATEGORIES (+10 more)

### Community 31 - "react"
Cohesion: 0.15
Nodes (13): lucide-react, radix-ui, react, Label(), ButtonVariant, Month, MonthCal(), MonthCalProps (+5 more)

### Community 32 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 33 - "statement-rules.ts"
Cohesion: 0.19
Nodes (15): StatementRow, TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), previewStatementRule() (+7 more)

### Community 34 - "auto-sync.ts"
Cohesion: 0.14
Nodes (28): getClockSkewMs(), isDriveConfigured(), useSyncStatus(), cycle(), emit(), eventListeners, finishCycle(), flushOnHide() (+20 more)

### Community 35 - "budgets/page.tsx"
Cohesion: 0.18
Nodes (15): AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), formatBudgetDateWindow(), dayLabel() (+7 more)

### Community 36 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 37 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (31): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+23 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "motion/components.e2e.ts"
Cohesion: 0.38
Nodes (3): desktopOnly, APP_URL, HARNESS_URL

### Community 41 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 42 - "AGENTS.md"
Cohesion: 0.19
Nodes (11): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+3 more)

### Community 44 - "types.d.ts"
Cohesion: 0.08
Nodes (28): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+20 more)

### Community 45 - "fixtures.ts"
Cohesion: 0.11
Nodes (24): @playwright/test, cardTitles, Child, october, september, denseCardConsumers, card(), overview (+16 more)

### Community 46 - "gate/sheets.e2e.ts"
Cohesion: 0.13
Nodes (21): editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), editors, IDS, statementRules() (+13 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "db.ts"
Cohesion: 0.12
Nodes (26): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+18 more)

### Community 49 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, 2. Gate integrity — PASS with notes, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry (+38 more)

### Community 50 - "support/motion.ts"
Cohesion: 0.18
Nodes (17): denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade(), matrixIsIdentity() (+9 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 53 - "icon.tsx"
Cohesion: 0.23
Nodes (9): DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon(), loadingIcons, normalize(), preloadCategoryIcons() (+1 more)

### Community 54 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "gate/components.e2e.ts"
Cohesion: 0.23
Nodes (7): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectVisibleBackdrop(), scrollWithInput(), settledOverlayAlpha()

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "utils.ts"
Cohesion: 0.16
Nodes (19): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, Rule, RuleCard(), StatementRulesPage(), RuleSuggestions() (+11 more)

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 60 - "budgets/[id]/page.tsx"
Cohesion: 0.23
Nodes (18): BudgetPage(), Legend(), Icon(), amountTone(), formatRowTime(), PendingBadge(), pendingReason(), RecordActions() (+10 more)

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)"
Cohesion: 0.11
Nodes (18): 1. Product fix — `app/allocator/pending/page.tsx`, 1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`, 1b. OBJECTION (Low–Medium): the identical-URL skip compares against the committed URL, not the last intent, 1c. PASS (Low note): `setCandidateQuery("")` per keystroke still allows one mid-typing push, 2. Test fixes, 2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS, 2b. `tests/web/navigation-motion.e2e.ts:123-130` — PASS (Low note), 2c. `tests/web/pending-search.e2e.ts:112-120` (mobile settled wait) — PASS with a Low note (+10 more)

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, dev, lint, lint:check, start, test:web, test:web:full (+9 more)

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 69 - "importer.test.ts"
Cohesion: 0.15
Nodes (4): dexie, fake-indexeddb, xlsx, inferRecordDatetime()

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "gate/routes.e2e.ts"
Cohesion: 0.22
Nodes (8): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), fits(), patchRows(), statementRow()

### Community 73 - "Separator"
Cohesion: 0.21
Nodes (11): class-variance-authority, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), ItemSeparator() (+3 more)

### Community 74 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "google-drive.ts"
Cohesion: 0.27
Nodes (11): AuthNeededError, cacheToken(), CodeResponse, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId(), hasFreshDriveToken() (+3 more)

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

### Community 93 - "next"
Cohesion: 0.18
Nodes (14): ReviewLinks(), Template(), nextConfig, next, CashflowChart(), CashflowPoint, colorChange(), currencyOrDash() (+6 more)

### Community 94 - "Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)"
Cohesion: 0.14
Nodes (11): 1. Restructure fidelity — PASS, 3. Sidebar hardening (d1ba358) — OBJECTION, Medium, 4. Evidence audit — CONDITIONAL, Graph, Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358), Required follow-ups (in order), Summary table, Verdict (+3 more)

### Community 95 - "total-spending-chart.tsx"
Cohesion: 0.36
Nodes (8): LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart(), dayTicks()

### Community 96 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 98 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

## Knowledge Gaps
- **72 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 606 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `combobox.tsx` to `Button`, `importer/page.tsx`, `category-history-chart.tsx`, `sidebar.tsx`, `sync/page.tsx`, `lib/motion.ts`, `paginated-data-table.tsx`, `primitives.tsx`, `pending/page.tsx`, `monthly-budget-usage.tsx`, `providers.tsx`, `react`, `PaginationFooter`, `budgets/page.tsx`, `(month)/page.tsx`, `icon.tsx`, `utils.ts`, `budgets/[id]/page.tsx`, `Separator`, `total-spending-chart.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06341463414634146 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `fixtures.ts` to `workflows.e2e.ts`, `motion/components.e2e.ts`, `gate/routes.e2e.ts`, `package.json`, `gate/sheets.e2e.ts`, `ledger.e2e.ts`, `support/motion.ts`, `gate/components.e2e.ts`, `Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `category-history-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10404040404040404 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `importer/page.tsx`, `category-history-chart.tsx`, `sidebar.tsx`, `combobox.tsx`, `sync/page.tsx`, `lib/motion.ts`, `accounts/page.tsx`, `package.json`, `routes.ts`, `paginated-data-table.tsx`, `primitives.tsx`, `pending/page.tsx`, `monthly-budget-usage.tsx`, `providers.tsx`, `PaginationFooter`, `auto-sync.ts`, `budgets/page.tsx`, `(month)/page.tsx`, `amount-filter.tsx`, `icon.tsx`, `utils.ts`, `budgets/[id]/page.tsx`, `Separator`, `total-spending-chart.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `statements.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14482758620689656 - nodes in this community are weakly interconnected._