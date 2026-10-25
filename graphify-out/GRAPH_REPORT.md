# Graph Report - ai-revolut-style-charts  (2026-10-26)

## Corpus Check
- 243 files · ~216,475 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1890 nodes · 7552 edges · 96 communities (84 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7419c4d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pending/page.tsx
- Button
- budgets/[id]/page.tsx
- Tests README
- primitives.tsx
- dashboard.ts
- cn
- providers.tsx
- @playwright/test
- category-history-chart.tsx
- budgets/page.tsx
- compilerOptions
- editors.ts
- statement-rules.ts
- round2
- (month)/page.tsx
- dependencies
- db.ts
- Validator
- records.ts
- calendar.tsx
- statements.ts
- importer.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- sync/page.tsx
- core/components.e2e.ts
- amount-filter.tsx
- support/motion.ts
- app-sidebar.tsx
- drive-sync.ts
- UI layer (app pages + components)
- export-import.ts
- components.json
- test-data.ts
- history.tsx
- auto-sync.ts
- types.d.ts
- STYLE.md
- auth-vault.ts
- records/[id]/page.tsx
- collectTests
- Card
- trend-chart.tsx
- google-drive.ts
- formatter
- devDependencies
- pagination.tsx
- utils.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- icon.tsx
- fixtures.ts
- biome.json
- rules
- manifest.json
- workflows.e2e.ts
- scripts
- spending-calendar.tsx
- statement-columns.tsx
- formatter
- Records
- tests_support_fixtures_expect
- Domain docs (single-context layout)
- optionalDependencies
- vite.config.ts
- tsconfig.e2e.json
- style
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
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
- Conventions
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- src/components/*
- main.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 322 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 125 edges
4. `react` - 96 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 56 edges
8. `RecordCreatorDialog()` - 52 edges
9. `round2()` - 44 edges
10. `PageContent()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `SECTIONS` --calls--> `treatmentLabel()`  [EXTRACTED]
  app/categories/page.tsx → src/lib/analytics.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Change-scoped required checks that always report** — github_workflows_ci_changes, github_workflows_ci_checks, github_workflows_ci_domain, github_workflows_ci_core, github_workflows_ci_animations [EXTRACTED 0.95]
- **Group matrix to gate and merged HTML report flow** — github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_blob_report_merge, github_workflows_ci_core, github_workflows_ci_animations [EXTRACTED 0.95]
- **Test file to CI group membership enforced by the ledger** — tests_readme_behaviour_ledger, tests_readme_ci_groups, tests_readme_areas, github_workflows_ci_ci [EXTRACTED 0.95]
- **CI browser test pipeline: setup, grouped runs, gated report merge** — github_actions_setup_action_setup, github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_core, github_workflows_ci_animations, _github_workflows_ci_blob_report_merge [EXTRACTED 1.00]
- **Change-scoped job skipping with required checks still reporting** — github_workflows_ci_changes, github_workflows_ci_checks, github_workflows_ci_domain, github_workflows_ci_core, github_workflows_ci_animations, github_workflows_ci_required_checks [EXTRACTED 1.00]
- **Test group to gate to merged report flow** — github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_core, github_workflows_ci_animations, github_workflows_ci_blob_report_merge [EXTRACTED 1.00]
- **Every browser test file joins exactly one CI group, enforced by the ledger** — tests_readme_behaviour_ledger, tests_readme_ci_groups, github_workflows_ci_core_group, github_workflows_ci_animations_group, agents_verification_rules [INFERRED 0.95]

## Communities (96 total, 12 thin omitted)

### Community 0 - "pending/page.tsx"
Cohesion: 0.11
Nodes (73): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+65 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (129): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, Rule, RuleCard(), StatementRulesPage(), react, sonner, @tanstack/react-form (+121 more)

### Community 2 - "budgets/[id]/page.tsx"
Cohesion: 0.15
Nodes (25): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MonthlyRecordsPage(), StatementPage(), AllocateBar(), Icon() (+17 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "primitives.tsx"
Cohesion: 0.08
Nodes (55): AlertAction(), AlertDialogTrigger(), ChartLegendContent(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent() (+47 more)

### Community 5 - "dashboard.ts"
Cohesion: 0.15
Nodes (34): contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection() (+26 more)

### Community 6 - "cn"
Cohesion: 0.09
Nodes (45): class-variance-authority, radix-ui, AppHeader(), AppearanceSwitch(), SelectionBar(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText() (+37 more)

### Community 7 - "providers.tsx"
Cohesion: 0.14
Nodes (23): metadata, RootLayout(), viewport, Boot(), Providers(), Toaster(), Appearance, applyAppearance() (+15 more)

### Community 8 - "@playwright/test"
Cohesion: 0.16
Nodes (12): @playwright/test, cardTitles, Child, october, september, card(), chartTooltip, overview (+4 more)

### Community 9 - "category-history-chart.tsx"
Cohesion: 0.12
Nodes (31): recharts, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths() (+23 more)

### Community 10 - "budgets/page.tsx"
Cohesion: 0.15
Nodes (35): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, @tanstack/react-table, DataTable() (+27 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.12
Nodes (21): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+13 more)

### Community 13 - "statement-rules.ts"
Cohesion: 0.12
Nodes (15): dexie, fake-indexeddb, xlsx, StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules() (+7 more)

### Community 14 - "round2"
Cohesion: 0.30
Nodes (21): PendingCard(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Badge(), badgeVariants (+13 more)

### Community 15 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (31): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+23 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "db.ts"
Cohesion: 0.11
Nodes (28): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+20 more)

### Community 18 - "Validator"
Cohesion: 0.23
Nodes (19): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), restoreDuplicatePair(), amountFor(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS (+11 more)

### Community 19 - "records.ts"
Cohesion: 0.12
Nodes (21): db, AnalyticsRecord, AnalyticsSummary, BudgetDetail, BudgetFilters, createBudget(), getMonthlyRecords(), MonthlyFilters (+13 more)

### Community 20 - "calendar.tsx"
Cohesion: 0.23
Nodes (10): react-day-picker, buttonVariants, Calendar(), CalendarDayButton(), ButtonVariant, Month, MonthCal(), MonthCalProps (+2 more)

### Community 21 - "statements.ts"
Cohesion: 0.11
Nodes (35): countSuggestions(), asPending(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds() (+27 more)

### Community 22 - "importer.ts"
Cohesion: 0.23
Nodes (20): papaparse, ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles() (+12 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+21 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (24): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry, routeInventory (+16 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "sync/page.tsx"
Cohesion: 0.19
Nodes (21): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+13 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "amount-filter.tsx"
Cohesion: 0.13
Nodes (30): DateField(), Props, AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange() (+22 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 31 - "app-sidebar.tsx"
Cohesion: 0.16
Nodes (30): MonthLayout(), ReviewLinks(), NotFound(), Template(), luxon, AppearanceOption, APPEARANCES, AppSidebar() (+22 more)

### Community 32 - "drive-sync.ts"
Cohesion: 0.22
Nodes (23): FinpointDB, exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured() (+15 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "export-import.ts"
Cohesion: 0.19
Nodes (16): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS (+8 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "test-data.ts"
Cohesion: 0.14
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, tableCounts(), SEED_HASH_KEY, seedIfEmpty(), BANK_BLURB (+12 more)

### Community 37 - "history.tsx"
Cohesion: 0.17
Nodes (16): CashflowChart(), CashflowPoint, currencyOrDash(), LegendItem(), LegendItem(), SurplusPoint, TotalSpendingChart(), getStoredHistory() (+8 more)

### Community 38 - "auto-sync.ts"
Cohesion: 0.13
Nodes (24): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult(), markDirty() (+16 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (19): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+11 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 42 - "records/[id]/page.tsx"
Cohesion: 0.20
Nodes (14): CategoryDialogState, CategoryTile(), SECTIONS, Sparkline(), DetailSummary(), DetailSummaryItem(), Delta, Metric() (+6 more)

### Community 43 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 44 - "Card"
Cohesion: 0.27
Nodes (18): ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), MethodHeader() (+10 more)

### Community 45 - "trend-chart.tsx"
Cohesion: 0.12
Nodes (20): BudgetProgressChart(), BudgetProgressPoint, buildSeries(), CHART_INTRO_MS, arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem (+12 more)

### Community 46 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "utils.ts"
Cohesion: 0.20
Nodes (10): ComboboxClear(), ComboboxInput(), ComboboxTrigger(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupText(), InputGroupTextarea() (+2 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "icon.tsx"
Cohesion: 0.24
Nodes (10): lucide-react, DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon(), loadingIcons, normalize() (+2 more)

### Community 54 - "fixtures.ts"
Cohesion: 0.17
Nodes (17): PREMATURE, routeReady, titles, getScenario(), IDS, assertSeeded(), checkSeededMarker(), countStore() (+9 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 61 - "statement-columns.tsx"
Cohesion: 0.33
Nodes (11): amountTone(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges(), StatementRow, StatementTableOptions (+3 more)

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 71 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 72 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 75 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 77 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 79 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 80 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 81 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 82 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 83 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 85 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 94 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 577 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `pending/page.tsx`, `Button`, `budgets/[id]/page.tsx`, `primitives.tsx`, `category-history-chart.tsx`, `budgets/page.tsx`, `round2`, `(month)/page.tsx`, `calendar.tsx`, `sync/page.tsx`, `amount-filter.tsx`, `app-sidebar.tsx`, `history.tsx`, `records/[id]/page.tsx`, `Card`, `trend-chart.tsx`, `pagination.tsx`, `utils.ts`, `icon.tsx`, `spending-calendar.tsx`, `statement-columns.tsx`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pending/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10593505039193729 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `pending/page.tsx`, `budgets/[id]/page.tsx`, `primitives.tsx`, `cn`, `providers.tsx`, `category-history-chart.tsx`, `budgets/page.tsx`, `round2`, `(month)/page.tsx`, `calendar.tsx`, `package.json`, `sync/page.tsx`, `amount-filter.tsx`, `app-sidebar.tsx`, `history.tsx`, `auto-sync.ts`, `records/[id]/page.tsx`, `Card`, `trend-chart.tsx`, `pagination.tsx`, `utils.ts`, `icon.tsx`, `statement-columns.tsx`, `main.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06187950496396029 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer (app pages + components)`, `providers.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._