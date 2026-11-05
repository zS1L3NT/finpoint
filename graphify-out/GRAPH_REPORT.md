# Graph Report - t3-001ff1de  (2026-11-05)

## Corpus Check
- 251 files · ~232,067 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1940 nodes · 7763 edges · 92 communities (82 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1c90e3be`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- record-editor.tsx
- db.ts
- Tests README
- auto-sync.ts
- dashboard.ts
- primitives.tsx
- categories/page.tsx
- @playwright/test
- export-import.ts
- lib/motion.ts
- compilerOptions
- editors.ts
- app-sidebar.tsx
- Validator
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- dependencies
- data.ts
- statements.ts
- src/components/*
- Validation rule (ValidationError + Validator)
- app.tsx
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- drive-sync.ts
- animations/tables.e2e.ts
- core/routes.e2e.ts
- UI layer (app pages + components)
- test-data.ts
- components.json
- fixtures.ts
- next
- types.d.ts
- STYLE.md
- auth-vault.ts
- accounts/page.tsx
- round2
- duplicates.ts
- tests_support_fixtures_expect
- formatter
- devDependencies
- pagination.tsx
- records.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- button.tsx
- spending-calendar.tsx
- biome.json
- rules
- manifest.json
- providers.tsx
- scripts
- formatCurrency
- budgets/[id]/page.tsx
- formatter
- Records
- Domain docs (single-context layout)
- optionalDependencies
- (month)/page.tsx
- tsconfig.e2e.json
- style
- Button
- utils.ts
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
- workflows.e2e.ts
- trend-chart.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 126 edges
4. `react` - 97 edges
5. `formatCurrency()` - 74 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 57 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 45 edges
10. `next` - 43 edges

## Surprising Connections (you probably didn't know these)
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
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

## Communities (92 total, 10 thin omitted)

### Community 0 - "cn"
Cohesion: 0.10
Nodes (41): class-variance-authority, AppHeader(), AppearanceSwitch(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+33 more)

### Community 1 - "record-editor.tsx"
Cohesion: 0.07
Nodes (118): CandidateResults(), @base-ui/react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+110 more)

### Community 2 - "db.ts"
Cohesion: 0.10
Nodes (17): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, FinpointDB, MetaRow, SettingsRow (+9 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "auto-sync.ts"
Cohesion: 0.14
Nodes (21): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), ingestManualResult(), refreshSyncDisplay(), refreshTimes() (+13 more)

### Community 5 - "dashboard.ts"
Cohesion: 0.15
Nodes (33): contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection() (+25 more)

### Community 6 - "primitives.tsx"
Cohesion: 0.07
Nodes (65): AlertAction(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+57 more)

### Community 7 - "categories/page.tsx"
Cohesion: 0.23
Nodes (13): CategoryDialogState, CategoryTile(), SECTIONS, luxon, CashflowChart(), CashflowPoint, DailySpendingChart(), MonthlyBudgetLine (+5 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "export-import.ts"
Cohesion: 0.16
Nodes (19): clearAllData(), downloadExport(), importData(), monthlyBudgetFields(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName (+11 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.13
Nodes (35): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal() (+27 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.13
Nodes (18): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), account, budget (+10 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.09
Nodes (47): metadata, RootLayout(), viewport, NotFound(), Providers(), Template(), AppearanceOption, APPEARANCES (+39 more)

### Community 14 - "Validator"
Cohesion: 0.26
Nodes (17): updateAccount(), validateBudget(), cleanInput(), fixDuplicates(), restoreDuplicatePair(), importFiles(), readFile(), createMonthlyBudget() (+9 more)

### Community 15 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "data.ts"
Cohesion: 0.12
Nodes (24): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow, MonthlyBudgetRow (+16 more)

### Community 18 - "statements.ts"
Cohesion: 0.14
Nodes (26): asPending(), AnalyticsRecord, AnalyticsSummary, removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation (+18 more)

### Community 19 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 20 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 21 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "suggestions.ts"
Cohesion: 0.10
Nodes (37): AllocationRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel() (+29 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.23
Nodes (7): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectVisibleBackdrop(), scrollWithInput(), settledOverlayAlpha()

### Community 29 - "drive-sync.ts"
Cohesion: 0.16
Nodes (34): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+26 more)

### Community 30 - "animations/tables.e2e.ts"
Cohesion: 0.13
Nodes (25): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, Child, october, september, installDateOnly() (+17 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.20
Nodes (10): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), IDS, openEditor(), fits() (+2 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "test-data.ts"
Cohesion: 0.14
Nodes (19): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+11 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "fixtures.ts"
Cohesion: 0.36
Nodes (8): assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace(), STORE_NAMES, waitForBoot(), WorkspaceFixtures

### Community 38 - "next"
Cohesion: 0.12
Nodes (25): nextConfig, next, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick() (+17 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "accounts/page.tsx"
Cohesion: 0.39
Nodes (6): AccountCard(), AccountRow, dayLabel(), bankMeta(), BANKS, pathAccount()

### Community 44 - "round2"
Cohesion: 0.33
Nodes (18): PendingCard(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Sheet(), SheetContent() (+10 more)

### Community 45 - "duplicates.ts"
Cohesion: 0.24
Nodes (14): descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+6 more)

### Community 46 - "tests_support_fixtures_expect"
Cohesion: 0.15
Nodes (5): desktopOnly, expectBackAboveHeadingFromKeyboardNavigation(), keyboardBack(), APP_URL, HARNESS_URL

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "records.ts"
Cohesion: 0.13
Nodes (25): CategoryRow, RecordRow, canUseMonthlyBudget(), createBudget(), upsertIndexed(), AllocationTally, pendingStatementIds(), tallyAllocations() (+17 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "button.tsx"
Cohesion: 0.10
Nodes (35): MonthLayout(), lucide-react, react-day-picker, DateField(), Props, DateRangeValue, formatRange(), Props (+27 more)

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
Cohesion: 0.29
Nodes (9): Boot(), db, seedIfEmpty(), useSyncToasts(), markDirty(), startAutoSync(), subscribeSyncEvents(), CategoryInput (+1 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "formatCurrency"
Cohesion: 0.20
Nodes (14): AllocateBar(), arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, Sparkline(), Delta, Metric() (+6 more)

### Community 61 - "budgets/[id]/page.tsx"
Cohesion: 0.14
Nodes (25): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), Icon(), amountTone(), formatRowTime(), PendingBadge() (+17 more)

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

### Community 67 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (25): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+17 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Button"
Cohesion: 0.06
Nodes (141): AccountPage(), AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS (+133 more)

### Community 71 - "utils.ts"
Cohesion: 0.11
Nodes (27): radix-ui, react, AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange() (+19 more)

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
Cohesion: 0.17
Nodes (15): StatementRow, byCreation(), conditionPattern(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), RULE_OPERATORS (+7 more)

### Community 100 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (18): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), ChartFrame() (+10 more)

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 591 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `(month)/page.tsx`, `trend-chart.tsx`, `Button`, `next`, `categories/page.tsx`, `utils.ts`, `accounts/page.tsx`, `lib/motion.ts`, `round2`, `primitives.tsx`, `app-sidebar.tsx`, `pagination.tsx`, `button.tsx`, `spending-calendar.tsx`, `formatCurrency`, `budgets/[id]/page.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.09805735430157261 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer (app pages + components)`, `providers.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06763796909492274 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `cn`, `record-editor.tsx`, `auto-sync.ts`, `primitives.tsx`, `categories/page.tsx`, `lib/motion.ts`, `app-sidebar.tsx`, `app.tsx`, `package.json`, `next`, `accounts/page.tsx`, `round2`, `pagination.tsx`, `button.tsx`, `spending-calendar.tsx`, `providers.tsx`, `formatCurrency`, `budgets/[id]/page.tsx`, `(month)/page.tsx`, `Button`, `trend-chart.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10416666666666667 - nodes in this community are weakly interconnected._