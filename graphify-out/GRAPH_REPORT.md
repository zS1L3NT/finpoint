# Graph Report - t3-5de3660e  (2026-10-25)

## Corpus Check
- 252 files · ~219,616 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1938 nodes · 7693 edges · 94 communities (85 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 119 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `62a5a795`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ui/field.tsx
- core/routes.e2e.ts
- total-spending-chart.tsx
- record-columns.tsx
- round2
- amount-filter.tsx
- sync/page.tsx
- statements.ts
- Validator
- dashboard.ts
- app.tsx
- compilerOptions
- utils.ts
- package.json
- dependencies
- Project Shape
- app-sidebar.tsx
- lib/motion.ts
- suspicious
- cn
- Button
- correctness
- export-import.ts
- auto-sync.ts
- Validation rule (ValidationError + Validator)
- checks.ts
- components.json
- Commands
- runner.ts
- records.ts
- test-data.ts
- ValidationError
- pagination.tsx
- statement-rules.ts
- use-sync-status.ts
- google-drive.ts
- STYLE.md
- (month)/page.tsx
- Monthly Budget
- auth-vault.ts
- duplicates.ts
- tests_web_support_fixtures_expect
- AGENTS.md
- category-filter.tsx
- types.d.ts
- workflows.e2e.ts
- editors.ts
- formatter
- data.ts
- ledger.e2e.ts
- support/motion.ts
- biome.json
- rules
- category-history-chart.tsx
- devDependencies
- manifest.json
- core/components.e2e.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- monthly-budget-usage.tsx
- Project Graph
- summary.ts
- formatter
- Commit Guide
- Records
- providers.tsx
- optionalDependencies
- scripts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- style
- Browser regression tests
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- core/routes.e2e.ts
- pending/page.tsx
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
- tsconfig.web.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 125 edges
4. `react` - 96 edges
5. `formatCurrency()` - 81 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 56 edges
8. `RecordCreatorDialog()` - 52 edges
9. `round2()` - 44 edges
10. `PageContent()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Rendered assertions` --references--> `SelectItem()`  [INFERRED]
  tests/web/README.md → src/components/ui/select.tsx
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Titles and tags` --references--> `Account`  [INFERRED]
  tests/web/README.md → src/types.d.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (94 total, 9 thin omitted)

### Community 0 - "ui/field.tsx"
Cohesion: 0.08
Nodes (44): @base-ui/react, react-day-picker, ComboboxField(), Props, DateField(), Props, DateRangeValue, formatRange() (+36 more)

### Community 1 - "core/routes.e2e.ts"
Cohesion: 0.12
Nodes (19): @playwright/test, cardTitles, Child, october, september, PREMATURE, routeReady, titles (+11 more)

### Community 2 - "total-spending-chart.tsx"
Cohesion: 0.10
Nodes (43): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, colorChange(), CashflowChart(), CashflowPoint, colorChange() (+35 more)

### Community 3 - "record-columns.tsx"
Cohesion: 0.15
Nodes (16): MonthlyBudgetBadge(), amountTone(), PendingBadge(), pendingReason(), RecordActions(), RecordActionsCell(), RecordAmountCell(), RecordEditButton() (+8 more)

### Community 4 - "round2"
Cohesion: 0.18
Nodes (26): PendingCard(), getBudgetAnalytics(), getCategoryData(), buildSeries(), Amount(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet() (+18 more)

### Community 5 - "amount-filter.tsx"
Cohesion: 0.14
Nodes (22): Props, AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound() (+14 more)

### Community 6 - "sync/page.tsx"
Cohesion: 0.15
Nodes (26): COUNT_ROWS, DataSettingsPage(), MethodHeader(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog() (+18 more)

### Community 7 - "statements.ts"
Cohesion: 0.13
Nodes (29): countSuggestions(), asPending(), StatementRow, duplicateStatementIds(), removeStatementDismissals(), getRecord(), dayDifference(), ensureCanReplace() (+21 more)

### Community 8 - "Validator"
Cohesion: 0.23
Nodes (20): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+12 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.07
Nodes (58): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, db, DB_NAME (+50 more)

### Community 10 - "app.tsx"
Cohesion: 0.38
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "utils.ts"
Cohesion: 0.14
Nodes (20): MonthLayout(), nextConfig, luxon, next, CategoryMovers(), Mover, CategorySpendingMix(), getStoredHistory() (+12 more)

### Community 13 - "package.json"
Cohesion: 0.08
Nodes (24): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+16 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "Project Shape"
Cohesion: 0.18
Nodes (9): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), URL search params (filters and pagination) (+1 more)

### Community 16 - "app-sidebar.tsx"
Cohesion: 0.18
Nodes (28): ReviewLinks(), Template(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+20 more)

### Community 17 - "lib/motion.ts"
Cohesion: 0.10
Nodes (42): framer-motion, @tanstack/react-table, AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), Delta, Metric() (+34 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "cn"
Cohesion: 0.07
Nodes (87): radix-ui, AppHeader(), AppearanceSwitch(), AlertDialogTrigger(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+79 more)

### Community 20 - "Button"
Cohesion: 0.06
Nodes (170): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BudgetPage(), Legend(), BUDGET_STATES (+162 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.18
Nodes (17): clearAllData(), downloadExport(), EXPORT_VERSION, FinpointExport, importData(), parseImportFile(), SYNC_TABLES, TableName (+9 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.16
Nodes (34): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+26 more)

### Community 24 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 25 - "checks.ts"
Cohesion: 0.16
Nodes (22): appJwt(), call(), Check, Checks, Client, Conclusion, CONFIG, configProblems() (+14 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "runner.ts"
Cohesion: 0.13
Nodes (20): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), wasSignaled(), ALL_PROJECTS (+12 more)

### Community 29 - "records.ts"
Cohesion: 0.13
Nodes (20): BudgetDetail, BudgetFilters, createBudget(), getBudget(), updateBudget(), isPendingRecord(), analyticsValues(), budgetCovers() (+12 more)

### Community 30 - "test-data.ts"
Cohesion: 0.12
Nodes (23): FinpointDB, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, tableCounts(), SEED_HASH_KEY, seedIfEmpty(), digestSnapshot(), hashLegacySnapshot() (+15 more)

### Community 31 - "ValidationError"
Cohesion: 0.24
Nodes (21): papaparse, ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles() (+13 more)

### Community 32 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 33 - "statement-rules.ts"
Cohesion: 0.14
Nodes (13): dexie, fake-indexeddb, xlsx, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement() (+5 more)

### Community 34 - "use-sync-status.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

### Community 35 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 36 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 37 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (33): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+25 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "duplicates.ts"
Cohesion: 0.22
Nodes (13): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), dismissedDuplicatePairs(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput (+5 more)

### Community 41 - "tests_web_support_fixtures_expect"
Cohesion: 0.15
Nodes (5): desktopOnly, expectBackAboveHeadingFromKeyboardNavigation(), keyboardBack(), APP_URL, HARNESS_URL

### Community 42 - "AGENTS.md"
Cohesion: 0.18
Nodes (12): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+4 more)

### Community 43 - "category-filter.tsx"
Cohesion: 0.17
Nodes (17): lucide-react, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+9 more)

### Community 44 - "types.d.ts"
Cohesion: 0.11
Nodes (21): describe(), Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category (+13 more)

### Community 46 - "editors.ts"
Cohesion: 0.12
Nodes (20): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), editors, expectPointerCursor() (+12 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "data.ts"
Cohesion: 0.13
Nodes (23): buildDense(), buildEmpty(), buildPopulated(), cycle(), DEFAULT_SETTINGS, emptyTables(), getScenario(), IDS (+15 more)

### Community 49 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 50 - "support/motion.ts"
Cohesion: 0.17
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 53 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 54 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "core/components.e2e.ts"
Cohesion: 0.23
Nodes (7): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectVisibleBackdrop(), scrollWithInput(), settledOverlayAlpha()

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 60 - "summary.ts"
Cohesion: 0.20
Nodes (10): Annotation, Outcome, ANSI, PhaseSummary, Report, Result, Spec, specs() (+2 more)

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "providers.tsx"
Cohesion: 0.11
Nodes (28): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, preloadCategoryIcons() (+20 more)

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, lint:check, start, test:web, test:web:core (+5 more)

### Community 67 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 69 - "Browser regression tests"
Cohesion: 0.22
Nodes (8): Areas, Browser regression tests, Fixtures, Projects and tags, Rendered assertions, Sign-off, Two tiers: core and extra, What to run

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "core/routes.e2e.ts"
Cohesion: 0.38
Nodes (4): awaitGroupExit(), groupAlive(), runAsync(), runTier()

### Community 73 - "pending/page.tsx"
Cohesion: 0.14
Nodes (41): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+33 more)

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

### Community 98 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

## Knowledge Gaps
- **72 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 590 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `ui/field.tsx`, `pagination.tsx`, `total-spending-chart.tsx`, `record-columns.tsx`, `round2`, `(month)/page.tsx`, `sync/page.tsx`, `amount-filter.tsx`, `pending/page.tsx`, `category-filter.tsx`, `utils.ts`, `app-sidebar.tsx`, `lib/motion.ts`, `Button`, `monthly-budget-usage.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ui/field.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08311688311688312 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `core/routes.e2e.ts` to `tests_web_support_fixtures_expect`, `package.json`, `editors.ts`, `workflows.e2e.ts`, `data.ts`, `ledger.e2e.ts`, `support/motion.ts`, `core/components.e2e.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `core/routes.e2e.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12299465240641712 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `ui/field.tsx`, `total-spending-chart.tsx`, `record-columns.tsx`, `round2`, `amount-filter.tsx`, `sync/page.tsx`, `app.tsx`, `utils.ts`, `package.json`, `app-sidebar.tsx`, `lib/motion.ts`, `cn`, `pagination.tsx`, `use-sync-status.ts`, `(month)/page.tsx`, `category-filter.tsx`, `monthly-budget-usage.tsx`, `providers.tsx`, `pending/page.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `total-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10014513788098693 - nodes in this community are weakly interconnected._