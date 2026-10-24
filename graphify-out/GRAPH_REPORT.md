# Graph Report - t3-9755e75b  (2026-10-24)

## Corpus Check
- 247 files · ~220,071 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1933 nodes · 7596 edges · 94 communities (85 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 131 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `caad5c78`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- Button
- total-spending-chart.tsx
- statements.ts
- cn
- combobox.tsx
- sync/page.tsx
- utils.ts
- Validator
- dashboard.ts
- ValidationError
- compilerOptions
- history.tsx
- package.json
- dependencies
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- accounts/[id]/page.tsx
- budgets/page.tsx
- suspicious
- primitives.tsx
- allocator/page.tsx
- correctness
- export-import.ts
- drive-sync.ts
- STYLE.md
- records.ts
- components.json
- Commands
- test-web.ts
- app-sidebar.tsx
- test-data.ts
- (month)/layout.tsx
- PaginationFooter
- statement-rules.ts
- auto-sync.ts
- record-editor.tsx
- fixtures.ts
- (month)/page.tsx
- Monthly Budget
- auth-vault.ts
- duplicates/page.tsx
- validate.ts
- AGENTS.md
- amount-filter.tsx
- types.d.ts
- @playwright/test
- gate/sheets.e2e.ts
- formatter
- db.ts
- ledger.e2e.ts
- support/motion.ts
- biome.json
- rules
- app.tsx
- devDependencies
- manifest.json
- gate/components.e2e.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- budgets/[id]/page.tsx
- Project Graph
- icon.tsx
- formatter
- Commit Guide
- Records
- Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)
- optionalDependencies
- scripts
- workflows.e2e.ts
- style
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- gate/routes.e2e.ts
- category-filter.tsx
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
- navigation.e2e.ts
- tsconfig.web.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 124 edges
4. `react` - 94 edges
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

## Communities (94 total, 9 thin omitted)

### Community 0 - "react"
Cohesion: 0.14
Nodes (54): react, sonner, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues, EMPTY_FORM_VALUES (+46 more)

### Community 1 - "Button"
Cohesion: 0.20
Nodes (34): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), EmptyRecords(), NotFound(), metadata, PrivacyPage() (+26 more)

### Community 2 - "total-spending-chart.tsx"
Cohesion: 0.08
Nodes (52): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart(), CashflowPoint (+44 more)

### Community 3 - "statements.ts"
Cohesion: 0.14
Nodes (27): asPending(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+19 more)

### Community 4 - "cn"
Cohesion: 0.12
Nodes (33): AppHeader(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+25 more)

### Community 5 - "combobox.tsx"
Cohesion: 0.15
Nodes (19): ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+11 more)

### Community 6 - "sync/page.tsx"
Cohesion: 0.16
Nodes (25): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+17 more)

### Community 7 - "utils.ts"
Cohesion: 0.24
Nodes (12): AllocateBar(), Sparkline(), DetailSummaryItem(), Metric(), MonthlyBudgetBadge(), RecordAmount(), ValueSwap(), classForCurrency() (+4 more)

### Community 8 - "Validator"
Cohesion: 0.26
Nodes (17): updateAccount(), validateBudget(), cleanInput(), fixDuplicates(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS, PACE_KINDS, setMonthlyBudgetAmount() (+9 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.12
Nodes (40): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+32 more)

### Community 10 - "ValidationError"
Cohesion: 0.26
Nodes (20): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+12 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+18 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.14
Nodes (18): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+10 more)

### Community 16 - "accounts/[id]/page.tsx"
Cohesion: 0.15
Nodes (22): AccountPage(), AccountCard(), AccountRow, AccountsPage(), amountTone(), formatRowTime(), dayLabel(), StatementActions() (+14 more)

### Community 17 - "budgets/page.tsx"
Cohesion: 0.16
Nodes (31): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), @tanstack/react-table, DataTable(), PaginatedDataTable() (+23 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "primitives.tsx"
Cohesion: 0.09
Nodes (51): class-variance-authority, radix-ui, AlertAction(), AlertDialogTrigger(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+43 more)

### Community 20 - "allocator/page.tsx"
Cohesion: 0.20
Nodes (33): FixDuplicatesPage(), AllocatorPage(), ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters(), RecordCreatorHost() (+25 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.17
Nodes (18): clearAllData(), downloadExport(), EXPORT_VERSION, FinpointExport, importData(), parseImportFile(), SYNC_TABLES, tableCounts() (+10 more)

### Community 23 - "drive-sync.ts"
Cohesion: 0.18
Nodes (30): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+22 more)

### Community 24 - "STYLE.md"
Cohesion: 0.13
Nodes (17): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator, APIs, Arguments, And Props, Code Style, Consistency, Copy (+9 more)

### Community 25 - "records.ts"
Cohesion: 0.15
Nodes (16): AllocationTally, pendingStatementIds(), tallyAllocations(), analyticsValues(), budgetCovers(), ConflictError, createRecord(), enrichRecords() (+8 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "test-web.ts"
Cohesion: 0.09
Nodes (35): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), flags, paths (+27 more)

### Community 29 - "app-sidebar.tsx"
Cohesion: 0.08
Nodes (53): metadata, RootLayout(), viewport, Boot(), Providers(), Template(), @vercel/analytics, @vercel/speed-insights (+45 more)

### Community 30 - "test-data.ts"
Cohesion: 0.18
Nodes (15): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData(), Meal (+7 more)

### Community 31 - "(month)/layout.tsx"
Cohesion: 0.12
Nodes (32): MonthLayout(), lucide-react, react-day-picker, DateField(), Props, DateRange(), DateRangeValue, formatRange() (+24 more)

### Community 32 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 33 - "statement-rules.ts"
Cohesion: 0.10
Nodes (17): dexie, fake-indexeddb, xlsx, StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules() (+9 more)

### Community 34 - "auto-sync.ts"
Cohesion: 0.13
Nodes (22): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), markDirty(), refreshSyncDisplay() (+14 more)

### Community 35 - "record-editor.tsx"
Cohesion: 0.11
Nodes (46): AllocatorPendingPage(), CandidatePage, CandidateResults(), countSuggestions(), PendingCard(), framer-motion, @tanstack/react-form, RecordCreatorDialog() (+38 more)

### Community 36 - "fixtures.ts"
Cohesion: 0.30
Nodes (10): getScenario(), assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace(), STORE_NAMES, test (+2 more)

### Community 37 - "(month)/page.tsx"
Cohesion: 0.08
Nodes (49): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+41 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "duplicates/page.tsx"
Cohesion: 0.14
Nodes (28): CARD_MOTION, DuplicateGroupCard(), GroupHeader(), highlightDifferences(), VIEWS, DuplicateReviewDialog(), StatementTile(), ToggleGroup() (+20 more)

### Community 41 - "validate.ts"
Cohesion: 0.25
Nodes (6): BudgetDetail, BudgetFilters, createBudget(), deleteBudget(), updateBudget(), FieldErrors

### Community 42 - "AGENTS.md"
Cohesion: 0.19
Nodes (11): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+3 more)

### Community 43 - "amount-filter.tsx"
Cohesion: 0.21
Nodes (27): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS (+19 more)

### Community 44 - "types.d.ts"
Cohesion: 0.08
Nodes (28): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+20 more)

### Community 45 - "@playwright/test"
Cohesion: 0.17
Nodes (11): @playwright/test, cardTitles, Child, october, september, card(), overview, overviewCharts (+3 more)

### Community 46 - "gate/sheets.e2e.ts"
Cohesion: 0.13
Nodes (20): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), editors, expectVisibleBackdrop() (+12 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "db.ts"
Cohesion: 0.09
Nodes (32): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+24 more)

### Community 49 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, 2. Gate integrity — PASS with notes, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry (+38 more)

### Community 50 - "support/motion.ts"
Cohesion: 0.16
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, statementRules(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 53 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 54 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "gate/components.e2e.ts"
Cohesion: 0.14
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "budgets/[id]/page.tsx"
Cohesion: 0.20
Nodes (21): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MonthlyRecordsPage(), Icon(), PendingBadge(), pendingReason() (+13 more)

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 60 - "icon.tsx"
Cohesion: 0.14
Nodes (23): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, Rule, RuleCard(), StatementRulesPage(), dexie-react-hooks (+15 more)

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

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "gate/routes.e2e.ts"
Cohesion: 0.24
Nodes (8): PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows(), statementRow()

### Community 73 - "category-filter.tsx"
Cohesion: 0.19
Nodes (17): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+9 more)

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

### Community 94 - "navigation.e2e.ts"
Cohesion: 0.14
Nodes (11): 1. Restructure fidelity — PASS, 3. Sidebar hardening (d1ba358) — OBJECTION, Medium, 4. Evidence audit — CONDITIONAL, Graph, Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358), Required follow-ups (in order), Summary table, Verdict (+3 more)

### Community 98 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

## Knowledge Gaps
- **72 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 606 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `Button`, `total-spending-chart.tsx`, `combobox.tsx`, `sync/page.tsx`, `utils.ts`, `accounts/[id]/page.tsx`, `budgets/page.tsx`, `primitives.tsx`, `allocator/page.tsx`, `app-sidebar.tsx`, `(month)/layout.tsx`, `PaginationFooter`, `record-editor.tsx`, `(month)/page.tsx`, `duplicates/page.tsx`, `amount-filter.tsx`, `budgets/[id]/page.tsx`, `icon.tsx`, `category-filter.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.14202898550724638 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `@playwright/test` to `workflows.e2e.ts`, `fixtures.ts`, `gate/routes.e2e.ts`, `package.json`, `gate/sheets.e2e.ts`, `ledger.e2e.ts`, `support/motion.ts`, `gate/components.e2e.ts`, `navigation.e2e.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `total-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07985193019566367 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `total-spending-chart.tsx`, `cn`, `combobox.tsx`, `sync/page.tsx`, `utils.ts`, `history.tsx`, `package.json`, `accounts/[id]/page.tsx`, `budgets/page.tsx`, `primitives.tsx`, `allocator/page.tsx`, `app-sidebar.tsx`, `(month)/layout.tsx`, `PaginationFooter`, `auto-sync.ts`, `record-editor.tsx`, `(month)/page.tsx`, `duplicates/page.tsx`, `amount-filter.tsx`, `app.tsx`, `budgets/[id]/page.tsx`, `icon.tsx`, `category-filter.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `statements.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14482758620689656 - nodes in this community are weakly interconnected._