# Graph Report - t3-9755e75b  (2026-10-24)

## Corpus Check
- 238 files · ~207,678 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1903 nodes · 7303 edges · 100 communities (90 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 120 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e716cc13`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pending/page.tsx
- Button
- app-sidebar.tsx
- paginated-data-table.tsx
- ledger.e2e.ts
- primitives.tsx
- dashboard.ts
- react
- data.ts
- STYLE.md
- gate/sheets.e2e.ts
- compilerOptions
- @playwright/test
- amount-filter.tsx
- input-group.tsx
- (month)/page.tsx
- dependencies
- records.ts
- suspicious
- package.json
- item.tsx
- test-web.ts
- correctness
- auto-sync.ts
- sync/page.tsx
- drive-sync.ts
- Project Shape
- duplicates.ts
- category-history-chart.tsx
- Validator
- components.json
- importer.ts
- allocator/page.tsx
- support/motion.ts
- test-data.ts
- gate/components.e2e.ts
- Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)
- total-spending-chart.tsx
- export-import.ts
- auth-vault.ts
- scripts
- Browser regression tests
- types.d.ts
- gate/routes.e2e.ts
- formatter
- devDependencies
- fixtures.ts
- PaginationFooter
- displays.tsx
- Commands
- Opus review: browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)
- Opus review: pending queue race fix (a364cb8 vs cf72d4c)
- biome.json
- rules
- icon.tsx
- cn
- AGENTS.md project instructions
- manifest.json
- workflows.e2e.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- spending-calendar.tsx
- utils.ts
- Domain Language
- Project Graph
- formatter
- Commit Guide
- Records
- optionalDependencies
- tsconfig.web.json
- navigation.e2e.ts
- style
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
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
- budgets/[id]/page.tsx
- monthly/page.tsx
- (month)/layout.tsx
- db.ts
- hashSnapshot
- shared.ts
- formatCurrency

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
- `What to run` --references--> `SelectItem()`  [INFERRED]
  tests/web/README.md → src/components/ui/select.tsx
- `3. Sidebar hardening (d1ba358) — OBJECTION, Medium` --references--> `HistoryProvider()`  [INFERRED]
  reviews/opus-restructure-oct23.md → src/history.tsx
- `3. Sidebar hardening (d1ba358) — OBJECTION, Medium` --references--> `useIsMobile()`  [INFERRED]
  reviews/opus-restructure-oct23.md → src/hooks/use-mobile.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Motion frame-sampling assertions** — tests_web_support_motion_samplevisiblerowanimations, tests_web_support_motion_expectvisiblerowcascade, tests_web_support_motion_expectreducedrowmovement, tests_web_support_motion_expectpopupentrance [EXTRACTED 1.00]
- **Pending queue URL push race and repairs** — reviews_opus_pending_race_oct23_pushparams, reviews_opus_pending_race_oct23_latestparams_ref, reviews_opus_pending_race_oct23_debounced_commit, reviews_opus_pending_race_oct23_stale_forward_base, reviews_opus_pending_race_oct23_identical_url_skip [EXTRACTED 1.00]
- **Browser suite project/tag selection model** — tests_web_readme_projects_and_tags, agents_playwright_full_matrix, reviews_opus_restructure_oct23_project_tags, reviews_opus_restructure_oct23_full_matrix_env_delete, tests_web_readme_behaviour_ledger [INFERRED 0.85]

## Communities (100 total, 10 thin omitted)

### Community 0 - "pending/page.tsx"
Cohesion: 0.18
Nodes (36): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+28 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (132): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS (+124 more)

### Community 2 - "app-sidebar.tsx"
Cohesion: 0.07
Nodes (55): metadata, RootLayout(), viewport, NotFound(), Boot(), Providers(), Template(), react-dom (+47 more)

### Community 3 - "paginated-data-table.tsx"
Cohesion: 0.22
Nodes (25): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), MOBILE_LIST_CLASS (+17 more)

### Community 4 - "ledger.e2e.ts"
Cohesion: 0.05
Nodes (54): typescript, vite, @vitejs/plugin-react, 1. Restructure fidelity — PASS, 2. Gate integrity — PASS with notes, 3. Sidebar hardening (d1ba358) — OBJECTION, Medium, 4. Evidence audit — CONDITIONAL, Graph (+46 more)

### Community 5 - "primitives.tsx"
Cohesion: 0.09
Nodes (49): @base-ui/react, AlertAction(), AlertDialogTrigger(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent() (+41 more)

### Community 6 - "dashboard.ts"
Cohesion: 0.14
Nodes (32): AnalyticsRecord, avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection(), buildSeries() (+24 more)

### Community 7 - "react"
Cohesion: 0.12
Nodes (18): lucide-react, radix-ui, react, buttonVariants, Calendar(), CalendarDayButton(), Label(), ButtonVariant (+10 more)

### Community 8 - "data.ts"
Cohesion: 0.18
Nodes (16): AllocationRow, BudgetRow, buildDense(), buildEmpty(), buildPopulated(), cycle(), DEFAULT_SETTINGS, emptyTables() (+8 more)

### Community 9 - "STYLE.md"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 10 - "gate/sheets.e2e.ts"
Cohesion: 0.13
Nodes (18): editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), editors, account, budget (+10 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "@playwright/test"
Cohesion: 0.26
Nodes (5): @playwright/test, cardTitles, card(), overview, overviewCharts

### Community 13 - "amount-filter.tsx"
Cohesion: 0.22
Nodes (26): dexie-react-hooks, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange (+18 more)

### Community 14 - "input-group.tsx"
Cohesion: 0.24
Nodes (11): ComboboxClear(), ComboboxInput(), ComboboxTrigger(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput() (+3 more)

### Community 15 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (26): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+18 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "records.ts"
Cohesion: 0.14
Nodes (20): db, canUseMonthlyBudget(), getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), AllocationTally, pendingStatementIds(), tallyAllocations() (+12 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 20 - "item.tsx"
Cohesion: 0.11
Nodes (22): class-variance-authority, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), Item() (+14 more)

### Community 21 - "test-web.ts"
Cohesion: 0.13
Nodes (24): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), flags, paths (+16 more)

### Community 22 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.13
Nodes (23): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), ingestManualResult(), markDirty(), refreshSyncDisplay() (+15 more)

### Community 24 - "sync/page.tsx"
Cohesion: 0.18
Nodes (22): COUNT_ROWS, DataSettingsPage(), MethodHeader(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog() (+14 more)

### Community 25 - "drive-sync.ts"
Cohesion: 0.18
Nodes (30): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+22 more)

### Community 26 - "Project Shape"
Cohesion: 0.14
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell, Pages take no props (+9 more)

### Community 27 - "duplicates.ts"
Cohesion: 0.27
Nodes (11): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC, pairIds() (+3 more)

### Community 28 - "category-history-chart.tsx"
Cohesion: 0.11
Nodes (36): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, colorChange(), aggregateSeries(), CategoryHistoryChart(), ChartMonth (+28 more)

### Community 29 - "Validator"
Cohesion: 0.22
Nodes (20): MonthlyBudgetDefaultRow, updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair() (+12 more)

### Community 30 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 31 - "importer.ts"
Cohesion: 0.26
Nodes (18): asPending(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+10 more)

### Community 32 - "allocator/page.tsx"
Cohesion: 0.19
Nodes (29): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), RecordCreatorHost(), RecordsPage(), StatementsPage() (+21 more)

### Community 33 - "support/motion.ts"
Cohesion: 0.33
Nodes (11): expectConsumerEntrance(), Rendered assertions, expectVisibleBackdrop(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade(), MotionFrame (+3 more)

### Community 34 - "test-data.ts"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 35 - "gate/components.e2e.ts"
Cohesion: 0.15
Nodes (8): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), APP_URL, HARNESS_URL

### Community 36 - "Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)"
Cohesion: 0.11
Nodes (18): 1. Product fix — `app/allocator/pending/page.tsx`, 1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`, 1b. OBJECTION (Low–Medium): the identical-URL skip compares against the committed URL, not the last intent, 1c. PASS (Low note): `setCandidateQuery("")` per keystroke still allows one mid-typing push, 2. Test fixes, 2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS, 2b. `tests/web/navigation-motion.e2e.ts:123-130` — PASS (Low note), 2c. `tests/web/pending-search.e2e.ts:112-120` (mobile settled wait) — PASS with a Low note (+10 more)

### Community 37 - "total-spending-chart.tsx"
Cohesion: 0.18
Nodes (18): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+10 more)

### Community 38 - "export-import.ts"
Cohesion: 0.18
Nodes (18): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+10 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, dev, lint, lint:check, start, test:web, test:web:full (+9 more)

### Community 41 - "Browser regression tests"
Cohesion: 0.14
Nodes (13): Gate integrity (UI-INVENTORY-PROJECTS, parser, ledger maps), Finpoint display harness page (TEST ONLY), Finpoint widget harness page (TEST ONLY), Test areas (routes, tables, editors, sheets, modals, navigation, keyboard, workflows, charts, components, helpers, ledger), Behaviour ledger (component-inventory.ts + gate/ledger.e2e.ts), Browser regression tests, Vite component harness (port 5174/5274), Fixtures (+5 more)

### Community 42 - "types.d.ts"
Cohesion: 0.13
Nodes (14): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+6 more)

### Community 43 - "gate/routes.e2e.ts"
Cohesion: 0.22
Nodes (9): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows() (+1 more)

### Community 44 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 46 - "fixtures.ts"
Cohesion: 0.15
Nodes (20): Child, october, september, denseCardConsumers, denseRowConsumers, populatedConsumers, installDateOnly(), revisions (+12 more)

### Community 47 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 48 - "displays.tsx"
Cohesion: 0.21
Nodes (13): framer-motion, AllocateBar(), Sparkline(), DetailSummaryItem(), Delta, Metric(), MonthlyBudgetBadge(), ValueSwap() (+5 more)

### Community 49 - "Commands"
Cohesion: 0.22
Nodes (10): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands, Generated / Ignored Files (+2 more)

### Community 50 - "Opus review: browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)"
Cohesion: 0.24
Nodes (10): PLAYWRIGHT_FULL_MATRIX release run, Verification evidence audit (runtime not certified), 2a delete PLAYWRIGHT_FULL_MATRIX likely ineffective, Certification blocker: mobile Statements Back fallback failure, Project tag selection (@tall, @light, @desktop-only, @mobile-only), Restructure fidelity (362 listed, 749 full matrix), Opus review: browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358), 3d pre-effect tap writes desktop sidebar cookie (+2 more)

### Community 51 - "Opus review: pending queue race fix (a364cb8 vs cf72d4c)"
Cohesion: 0.25
Nodes (10): Single debounced queue commit, 1b pushParams identical-URL skip objection, latestParams ref as debounce base, pushParams (app/allocator/pending/page.tsx), Queue resurrection bug (pending_statement_id restored), Residual (b): dense cascade frame starvation on GPU-less hosts, Opus review: pending queue race fix (a364cb8 vs cf72d4c), 1a stale-forward latestParams objection (+2 more)

### Community 52 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 53 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "icon.tsx"
Cohesion: 0.12
Nodes (25): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), react-day-picker, DateRange(), DateRangeValue (+17 more)

### Community 55 - "cn"
Cohesion: 0.13
Nodes (30): AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+22 more)

### Community 56 - "AGENTS.md project instructions"
Cohesion: 0.20
Nodes (10): Agent Behavior, AGENTS.md project instructions, bun test, Conventions, Domain and importer tests (Dexie with in-memory IndexedDB), Next.js breaking-changes notice, Verification, openMobileSidebar helper (file-local copies) (+2 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 60 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 61 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 62 - "utils.ts"
Cohesion: 0.16
Nodes (16): ReviewLinks(), nextConfig, next, CategoryMovers(), Mover, CategorySpendingMix(), getStoredHistory(), getValidHistory() (+8 more)

### Community 63 - "Domain Language"
Cohesion: 0.29
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 64 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 65 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 66 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 67 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 68 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 69 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 71 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 72 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 73 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 76 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 77 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 78 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 80 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 81 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 82 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 83 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 84 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 85 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 86 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 94 - "budgets/[id]/page.tsx"
Cohesion: 0.12
Nodes (35): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MonthlyRecordsPage(), buildSeries(), Icon(), amountTone() (+27 more)

### Community 95 - "monthly/page.tsx"
Cohesion: 0.21
Nodes (11): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, byRecordDay, FILTER_KEYS, Filters, canUseDefaultMonthlyBudget() (+3 more)

### Community 97 - "(month)/layout.tsx"
Cohesion: 0.25
Nodes (16): MonthLayout(), DateField(), Props, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup() (+8 more)

### Community 98 - "db.ts"
Cohesion: 0.10
Nodes (15): dexie, fake-indexeddb, AccountRow, AnalyticsMonthRow, BudgetRecordRow, CategoryRow, DB_NAME, DB_VERSION (+7 more)

### Community 99 - "hashSnapshot"
Cohesion: 0.43
Nodes (5): FinpointDB, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 100 - "shared.ts"
Cohesion: 0.22
Nodes (15): countSuggestions(), AnalyticsSummary, contribution(), summarize(), dayDifference(), ensureCanReplace(), ReplacementAllocation, replacementComparison() (+7 more)

### Community 101 - "formatCurrency"
Cohesion: 0.31
Nodes (8): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, RecordAmount(), compactAmount, formatChartCurrency(), formatCurrency()

## Knowledge Gaps
- **80 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 600 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@playwright/test` connect `@playwright/test` to `support/motion.ts`, `gate/components.e2e.ts`, `ledger.e2e.ts`, `navigation.e2e.ts`, `gate/sheets.e2e.ts`, `gate/routes.e2e.ts`, `fixtures.ts`, `package.json`, `workflows.e2e.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06318681318681318 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `pending/page.tsx`, `Button`, `app-sidebar.tsx`, `paginated-data-table.tsx`, `primitives.tsx`, `react`, `amount-filter.tsx`, `input-group.tsx`, `(month)/page.tsx`, `item.tsx`, `sync/page.tsx`, `category-history-chart.tsx`, `allocator/page.tsx`, `total-spending-chart.tsx`, `PaginationFooter`, `displays.tsx`, `icon.tsx`, `spending-calendar.tsx`, `utils.ts`, `budgets/[id]/page.tsx`, `monthly/page.tsx`, `(month)/layout.tsx`, `formatCurrency`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Should `app-sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07161125319693094 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `pending/page.tsx`, `Button`, `app-sidebar.tsx`, `paginated-data-table.tsx`, `primitives.tsx`, `amount-filter.tsx`, `input-group.tsx`, `(month)/page.tsx`, `package.json`, `item.tsx`, `auto-sync.ts`, `sync/page.tsx`, `category-history-chart.tsx`, `allocator/page.tsx`, `total-spending-chart.tsx`, `PaginationFooter`, `displays.tsx`, `icon.tsx`, `cn`, `utils.ts`, `budgets/[id]/page.tsx`, `monthly/page.tsx`, `(month)/layout.tsx`, `formatCurrency`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `ledger.e2e.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05427547363031234 - nodes in this community are weakly interconnected._