# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 257 files · ~236,611 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1961 nodes · 7851 edges · 97 communities (87 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf2f415d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- record-creator.tsx
- suggestions.test.ts
- Tests README
- suggestions.ts
- app.tsx
- primitives.tsx
- importer.ts
- @playwright/test
- animations/tables.e2e.ts
- lib/motion.ts
- compilerOptions
- editors.ts
- app-sidebar.tsx
- category-history-chart.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- dependencies
- db.ts
- statements.ts
- use-appearance.tsx
- Validation rule (ValidationError + Validator)
- records.ts
- Validator
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- dashboard.ts
- core/components.e2e.ts
- auto-sync.ts
- support/motion.ts
- core/routes.e2e.ts
- alert-dialog.tsx
- UI layer (app pages + components)
- export-import.ts
- components.json
- fixtures.ts
- panel.tsx
- useHistory
- types.d.ts
- STYLE.md
- auth-vault.ts
- history.tsx
- src/components/*
- duplicates.ts
- navigation.e2e.ts
- formatter
- devDependencies
- lucide-react
- amount-filter.tsx
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- luxon
- spending-calendar.tsx
- biome.json
- rules
- manifest.json
- providers.tsx
- scripts
- 0002 Forecast pacing
- formatter
- Records
- workspace.ts
- Domain docs (single-context layout)
- optionalDependencies
- (month)/page.tsx
- tsconfig.e2e.json
- style
- Button
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
- statement-rules.ts
- category-filter.tsx
- workflows.e2e.ts
- trend-chart.tsx
- use-sync-status.ts
- Forecast pacing decision

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 75 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `next` - 45 edges
10. `round2()` - 45 edges

## Surprising Connections (you probably didn't know these)
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx
- `setup composite action` --implements--> `frozen production bundles (app 5273, harness 5274)`  [INFERRED]
  .github/actions/setup/action.yml → tests/README.md

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

## Communities (97 total, 10 thin omitted)

### Community 0 - "cn"
Cohesion: 0.09
Nodes (45): Providers(), class-variance-authority, radix-ui, AppHeader(), AppearanceSwitch(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText() (+37 more)

### Community 1 - "record-creator.tsx"
Cohesion: 0.07
Nodes (119): CandidateResults(), SECTIONS, @base-ui/react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+111 more)

### Community 2 - "suggestions.test.ts"
Cohesion: 0.14
Nodes (8): dexie, fake-indexeddb, xlsx, decided(), live(), record(), statement(), input

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "suggestions.ts"
Cohesion: 0.11
Nodes (31): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+23 more)

### Community 5 - "app.tsx"
Cohesion: 0.20
Nodes (8): metadata, RootLayout(), viewport, react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 6 - "primitives.tsx"
Cohesion: 0.08
Nodes (53): AlertAction(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup() (+45 more)

### Community 7 - "importer.ts"
Cohesion: 0.23
Nodes (20): papaparse, ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles() (+12 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "animations/tables.e2e.ts"
Cohesion: 0.18
Nodes (16): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, Child, october, september, installDateOnly() (+8 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.14
Nodes (35): framer-motion, @tanstack/react-table, Sparkline(), Delta, Metric(), DataTable(), PaginatedDataTable(), GroupHeaderRow() (+27 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.13
Nodes (19): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+11 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.16
Nodes (25): ReviewLinks(), Template(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+17 more)

### Community 14 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 15 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "db.ts"
Cohesion: 0.11
Nodes (27): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+19 more)

### Community 18 - "statements.ts"
Cohesion: 0.17
Nodes (22): asPending(), duplicateStatementIds(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+14 more)

### Community 19 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 20 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 21 - "records.ts"
Cohesion: 0.12
Nodes (25): round2(), BudgetDetail, BudgetFilters, createBudget(), getBudget(), listBudgets(), AllocationTally, tallyAllocations() (+17 more)

### Community 22 - "Validator"
Cohesion: 0.26
Nodes (17): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+9 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.08
Nodes (25): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+17 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "dashboard.ts"
Cohesion: 0.13
Nodes (37): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+29 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "auto-sync.ts"
Cohesion: 0.10
Nodes (51): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+43 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.27
Nodes (12): attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance(), matrixIsIdentity(), MotionFrame, MotionPose, poseIsIdentity() (+4 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.22
Nodes (9): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows() (+1 more)

### Community 32 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "export-import.ts"
Cohesion: 0.11
Nodes (24): EXPORT_VERSION, FinpointExport, SYNC_TABLES, TableName, TABLES, migrateRecordChoices(), DEFAULT_SETTINGS, FinpointSettings (+16 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "fixtures.ts"
Cohesion: 0.33
Nodes (9): getScenario(), assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace(), STORE_NAMES, waitForBoot() (+1 more)

### Community 37 - "panel.tsx"
Cohesion: 0.50
Nodes (6): DrillPanel(), getDrilldown(), getDrillStatement(), Selection, getRecord(), getStatement()

### Community 38 - "useHistory"
Cohesion: 0.22
Nodes (16): CashflowChart(), CashflowPoint, CategoryMovers(), Mover, CategorySpendingMix(), DailySpendingChart(), MonthlyBudgetLine, SurplusPoint (+8 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 44 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 45 - "duplicates.ts"
Cohesion: 0.22
Nodes (13): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC (+5 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "lucide-react"
Cohesion: 0.28
Nodes (13): lucide-react, pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem() (+5 more)

### Community 50 - "amount-filter.tsx"
Cohesion: 0.17
Nodes (25): PendingStatementConfirmationSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange() (+17 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "luxon"
Cohesion: 0.12
Nodes (31): BudgetState, MonthLayout(), luxon, react-day-picker, DateField(), Props, DateRange(), DateRangeValue (+23 more)

### Community 54 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "providers.tsx"
Cohesion: 0.36
Nodes (7): Boot(), @vercel/analytics, @vercel/speed-insights, preloadCategoryIcons(), useSyncToasts(), subscribeSyncEvents(), listCategoryIconNames()

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 61 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "workspace.ts"
Cohesion: 0.13
Nodes (24): FinpointDB, withoutActionModes(), DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, clearAllData(), downloadExport(), exportData(), importData() (+16 more)

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (23): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+15 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Button"
Cohesion: 0.05
Nodes (172): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+164 more)

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

### Community 94 - "statement-rules.ts"
Cohesion: 0.21
Nodes (14): StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+6 more)

### Community 96 - "category-filter.tsx"
Cohesion: 0.16
Nodes (21): CategoryFilter(), CategoryFilterItem(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), Command(), CommandEmpty(), CommandGroup() (+13 more)

### Community 99 - "workflows.e2e.ts"
Cohesion: 0.15
Nodes (4): DBS_VALID, buildPopulated(), learnedCoffee(), statementRules()

### Community 100 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (19): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), arc() (+11 more)

### Community 101 - "use-sync-status.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

### Community 102 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

## Knowledge Gaps
- **85 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 598 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `category-filter.tsx`, `record-creator.tsx`, `alert-dialog.tsx`, `(month)/page.tsx`, `trend-chart.tsx`, `Button`, `useHistory`, `primitives.tsx`, `lib/motion.ts`, `category-history-chart.tsx`, `lucide-react`, `amount-filter.tsx`, `luxon`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.0889894419306184 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `cn`, `record-creator.tsx`, `app.tsx`, `primitives.tsx`, `lib/motion.ts`, `app-sidebar.tsx`, `category-history-chart.tsx`, `use-appearance.tsx`, `package.json`, `alert-dialog.tsx`, `panel.tsx`, `history.tsx`, `lucide-react`, `amount-filter.tsx`, `luxon`, `spending-calendar.tsx`, `providers.tsx`, `(month)/page.tsx`, `category-filter.tsx`, `trend-chart.tsx`, `use-sync-status.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `record-creator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06649006622516557 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer (app pages + components)`, `providers.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `suggestions.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13852813852813853 - nodes in this community are weakly interconnected._