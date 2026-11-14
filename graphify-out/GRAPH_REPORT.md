# Graph Report - t3-6b4fc13c-8de3ddf0f021ed8e  (2026-11-14)

## Corpus Check
- 261 files · ~238,771 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1980 nodes · 7832 edges · 90 communities (80 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `093875d1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard.ts
- record-editor.tsx
- auto-sync.test.ts
- Tests README
- importer/page.tsx
- cn
- auth-vault.ts
- pending/page.tsx
- @playwright/test
- luxon
- lib/motion.ts
- compilerOptions
- editors.ts
- app-sidebar.tsx
- Validator
- export-import.ts
- dependencies
- budgets/[id]/page.tsx
- workflows.e2e.ts
- utils.ts
- react
- app.tsx
- snapshot-hash.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- auto-sync.ts
- support/motion.ts
- fixtures.ts
- UI layer (app pages + components)
- test-data.ts
- components.json
- icon.tsx
- date-range.tsx
- types.d.ts
- STYLE.md
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- statement-rules.ts
- budgets/page.tsx
- tests_support_fixtures_expect
- formatter
- devDependencies
- lucide-react
- records.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- src/components/*
- spending-calendar.tsx
- biome.json
- rules
- manifest.json
- Button
- scripts
- (month)/page.tsx
- formatter
- Records
- Validation rule (ValidationError + Validator)
- Domain docs (single-context layout)
- optionalDependencies
- MonthlyBudgetBadge
- tsconfig.e2e.json
- style
- duplicates/page.tsx
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
- db.ts
- trend-chart.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 123 edges
4. `react` - 100 edges
5. `formatCurrency()` - 74 edges
6. `RecordEditorDialog()` - 62 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 45 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `DataSettingsPage()` --indirect_call--> `syncDrive()`  [INFERRED]
  app/sync/page.tsx → src/logic/drive-sync.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx

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

## Communities (90 total, 10 thin omitted)

### Community 0 - "dashboard.ts"
Cohesion: 0.09
Nodes (49): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+41 more)

### Community 1 - "record-editor.tsx"
Cohesion: 0.11
Nodes (75): SECTIONS, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues (+67 more)

### Community 2 - "auto-sync.test.ts"
Cohesion: 0.08
Nodes (13): dexie, fake-indexeddb, xlsx, drive, listeners, nav, realDrive, realSync (+5 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "importer/page.tsx"
Cohesion: 0.08
Nodes (64): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, COUNT_ROWS (+56 more)

### Community 5 - "cn"
Cohesion: 0.05
Nodes (120): class-variance-authority, radix-ui, DriveOverwriteConfirmation(), Props, AppHeader(), CategoryFilter(), CategoryFilterItem(), AlertAction() (+112 more)

### Community 6 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 7 - "pending/page.tsx"
Cohesion: 0.17
Nodes (34): DuplicateGroupCard(), GroupHeader(), AllocatorPendingPage(), CandidatePage, CandidateResults(), PendingCard(), DuplicateReviewDialog(), StatementTile() (+26 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "luxon"
Cohesion: 0.15
Nodes (15): MonthLayout(), luxon, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), MonthHeaderPortal(), MonthHeaderSlot, MonthHeaderSlotProvider (+7 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.15
Nodes (33): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal() (+25 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.12
Nodes (21): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+13 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.06
Nodes (70): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, preloadCategoryIcons() (+62 more)

### Community 14 - "Validator"
Cohesion: 0.14
Nodes (33): updateAccount(), createBudget(), validateBudget(), cleanInput(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup (+25 more)

### Community 15 - "export-import.ts"
Cohesion: 0.13
Nodes (26): db, withoutActionModes(), clearAllData(), downloadExport(), exportData(), importData(), monthlyBudgetFields(), parseImportFile() (+18 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "budgets/[id]/page.tsx"
Cohesion: 0.18
Nodes (24): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), Icon(), RecordOption(), formatRowTime(), PendingBadge() (+16 more)

### Community 18 - "workflows.e2e.ts"
Cohesion: 0.15
Nodes (4): DBS_VALID, buildPopulated(), learnedCoffee(), statementRules()

### Community 19 - "utils.ts"
Cohesion: 0.14
Nodes (16): AccountCard(), AccountRow, AccountsPage(), CategoriesPage(), CategoryDialogState, CategoryTile(), nextConfig, next (+8 more)

### Community 20 - "react"
Cohesion: 0.27
Nodes (8): react, Field(), FieldContent(), FieldLegend(), FieldSet(), FieldTitle(), fieldVariants, Label()

### Community 21 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 22 - "snapshot-hash.ts"
Cohesion: 0.67
Nodes (3): digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "suggestions.ts"
Cohesion: 0.11
Nodes (36): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+28 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "auto-sync.ts"
Cohesion: 0.10
Nodes (53): SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+45 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.16
Nodes (21): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectModalEntrance(), expectModalExit() (+13 more)

### Community 31 - "fixtures.ts"
Cohesion: 0.13
Nodes (23): Child, october, september, PREMATURE, routeReady, titles, getScenario(), IDS (+15 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "test-data.ts"
Cohesion: 0.15
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "icon.tsx"
Cohesion: 0.14
Nodes (26): RecordPage(), Rule, RuleSentence(), StatementRulesPage(), StatementPage(), AllocateBar(), Sparkline(), DetailSummary() (+18 more)

### Community 37 - "date-range.tsx"
Cohesion: 0.10
Nodes (39): @base-ui/react, react-day-picker, Props, ComboboxField(), Props, DateField(), Props, DateRange() (+31 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 42 - "statement-rules.ts"
Cohesion: 0.15
Nodes (19): CategoryInput, checkReferences(), createCategory(), deleteCategory(), updateCategory(), TREATMENT_VALUES, byCreation(), conditionPattern() (+11 more)

### Community 43 - "budgets/page.tsx"
Cohesion: 0.20
Nodes (15): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), amountTone(), StatementActions(), StatementActionsCell() (+7 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "lucide-react"
Cohesion: 0.19
Nodes (18): lucide-react, pageHref(), pageWindow(), PaginationFooter(), ButtonVariant, Month, MonthCal(), MonthCalProps (+10 more)

### Community 50 - "records.ts"
Cohesion: 0.10
Nodes (30): useRecordEditor(), round2(), AccountActivity, NO_ACTIVITY, duplicateStatementIds(), inferRecordDatetime(), analyticsValues(), budgetCovers() (+22 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

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

### Community 58 - "Button"
Cohesion: 0.21
Nodes (26): NotFound(), dexie-react-hooks, PendingStatementConfirmationSheet(), RecordSearchSheet(), byRecordDay, RecordsSheet(), StatementSearchSheet(), AmountFilter() (+18 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "(month)/page.tsx"
Cohesion: 0.14
Nodes (24): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+16 more)

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "MonthlyBudgetBadge"
Cohesion: 0.25
Nodes (12): CashflowChart(), CashflowPoint, DailySpendingChart(), MonthlyBudgetLine, SurplusPoint, TotalSpendingChart(), TrendChart(), MonthlyBudgetBadge() (+4 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "duplicates/page.tsx"
Cohesion: 0.19
Nodes (40): AccountPage(), CARD_MOTION, FixDuplicatesPage(), highlightDifferences(), VIEWS, AllocatorPage(), ScopeSelect(), RecordCreatorHost() (+32 more)

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

### Community 99 - "db.ts"
Cohesion: 0.08
Nodes (34): AccountRow, AllocationRow, AnalyticsMonthRow, asPending(), BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+26 more)

### Community 100 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (17): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), arc() (+9 more)

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 609 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `MonthlyBudgetBadge`, `importer/page.tsx`, `icon.tsx`, `duplicates/page.tsx`, `pending/page.tsx`, `trend-chart.tsx`, `date-range.tsx`, `lib/motion.ts`, `budgets/page.tsx`, `app-sidebar.tsx`, `budgets/[id]/page.tsx`, `lucide-react`, `utils.ts`, `react`, `spending-calendar.tsx`, `Button`, `(month)/page.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08821548821548822 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer (app pages + components)`, `app-sidebar.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11096491228070175 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `record-editor.tsx`, `importer/page.tsx`, `cn`, `pending/page.tsx`, `luxon`, `lib/motion.ts`, `app-sidebar.tsx`, `budgets/[id]/page.tsx`, `utils.ts`, `app.tsx`, `package.json`, `icon.tsx`, `date-range.tsx`, `budgets/page.tsx`, `lucide-react`, `records.ts`, `spending-calendar.tsx`, `Button`, `(month)/page.tsx`, `duplicates/page.tsx`, `trend-chart.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `auto-sync.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08253968253968254 - nodes in this community are weakly interconnected._