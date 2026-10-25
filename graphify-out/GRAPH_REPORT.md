# Graph Report - ai-revolut-style-charts  (2026-10-26)

## Corpus Check
- 243 files · ~215,479 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1878 nodes · 7501 edges · 87 communities (76 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8507e50d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pending/page.tsx
- Button
- db.ts
- Tests README
- cn
- dashboard.ts
- lib/motion.ts
- providers.tsx
- fixtures.ts
- paginated-data-table.tsx
- compilerOptions
- editors.ts
- statement-rules.ts
- utils.ts
- (month)/page.tsx
- dependencies
- data.ts
- Validator
- records.ts
- date-range.tsx
- statements.ts
- ValidationError
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- sync/page.tsx
- core/components.e2e.ts
- category-filter.tsx
- support/motion.ts
- app-sidebar.tsx
- auto-sync.ts
- UI layer (app pages + components)
- export-import.ts
- components.json
- test-data.ts
- next
- types.d.ts
- STYLE.md
- auth-vault.ts
- (month)/layout.tsx
- formatCurrency
- formatter
- devDependencies
- pagination.tsx
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- record-defaults.ts
- core/routes.e2e.ts
- biome.json
- rules
- manifest.json
- workflows.e2e.ts
- scripts
- spending-calendar.tsx
- formatter
- Records
- tests_support_fixtures_expect
- Domain docs (single-context layout)
- optionalDependencies
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 318 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 125 edges
4. `react` - 96 edges
5. `formatCurrency()` - 77 edges
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

## Communities (87 total, 11 thin omitted)

### Community 0 - "pending/page.tsx"
Cohesion: 0.06
Nodes (106): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+98 more)

### Community 1 - "Button"
Cohesion: 0.05
Nodes (172): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS (+164 more)

### Community 2 - "db.ts"
Cohesion: 0.10
Nodes (18): dexie, fake-indexeddb, xlsx, asPending(), BudgetRecordRow, BudgetRow, DB_NAME, DB_VERSION (+10 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "cn"
Cohesion: 0.07
Nodes (88): class-variance-authority, radix-ui, ComboboxField(), Props, AppHeader(), AlertAction(), ButtonGroupSeparator(), ButtonGroupText() (+80 more)

### Community 5 - "dashboard.ts"
Cohesion: 0.12
Nodes (40): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+32 more)

### Community 6 - "lib/motion.ts"
Cohesion: 0.18
Nodes (13): framer-motion, ChartFrame(), AUTOPOPULATED_BORDER, FieldErrorItem, FormFieldProps, MotionFieldDescription, Props, cascadeDelay() (+5 more)

### Community 7 - "providers.tsx"
Cohesion: 0.12
Nodes (28): metadata, RootLayout(), viewport, Boot(), Providers(), lucide-react, preloadCategoryIcons(), SidebarInset() (+20 more)

### Community 8 - "fixtures.ts"
Cohesion: 0.13
Nodes (21): @playwright/test, cardTitles, Child, october, september, card(), chartTooltip, overview (+13 more)

### Community 10 - "paginated-data-table.tsx"
Cohesion: 0.23
Nodes (24): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+16 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.12
Nodes (20): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+12 more)

### Community 13 - "statement-rules.ts"
Cohesion: 0.28
Nodes (11): StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), previewStatementRule(), recommendationAutofill() (+3 more)

### Community 14 - "utils.ts"
Cohesion: 0.17
Nodes (30): BudgetProgressChart(), BudgetProgressPoint, buildSeries(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet() (+22 more)

### Community 15 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (25): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+17 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+21 more)

### Community 17 - "data.ts"
Cohesion: 0.13
Nodes (21): AccountRow, AllocationRow, AnalyticsMonthRow, CategoryRow, MonthlyBudgetDefaultRow, MonthlyBudgetRow, buildDense(), buildEmpty() (+13 more)

### Community 18 - "Validator"
Cohesion: 0.24
Nodes (18): updateAccount(), validateBudget(), cleanInput(), fixDuplicates(), amountFor(), createMonthlyBudget(), defaultAmountFor(), MONTHLY_BUDGET_GROUPS (+10 more)

### Community 19 - "records.ts"
Cohesion: 0.12
Nodes (29): round2(), AccountActivity, NO_ACTIVITY, BudgetDetail, BudgetFilters, createBudget(), getBudget(), updateBudget() (+21 more)

### Community 20 - "date-range.tsx"
Cohesion: 0.12
Nodes (24): react-day-picker, DateRangeValue, formatRange(), Props, rangeFromValue(), DatetimeField(), parseValue(), Props (+16 more)

### Community 21 - "statements.ts"
Cohesion: 0.16
Nodes (24): countSuggestions(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+16 more)

### Community 22 - "ValidationError"
Cohesion: 0.26
Nodes (20): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+12 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+20 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "sync/page.tsx"
Cohesion: 0.11
Nodes (33): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+25 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.23
Nodes (7): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectVisibleBackdrop(), scrollWithInput(), settledOverlayAlpha()

### Community 29 - "category-filter.tsx"
Cohesion: 0.18
Nodes (17): Props, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+9 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 31 - "app-sidebar.tsx"
Cohesion: 0.14
Nodes (35): ReviewLinks(), NotFound(), Template(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot() (+27 more)

### Community 32 - "auto-sync.ts"
Cohesion: 0.11
Nodes (48): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+40 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "export-import.ts"
Cohesion: 0.25
Nodes (12): exportData(), importData(), parseImportFile(), SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings (+4 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "test-data.ts"
Cohesion: 0.13
Nodes (19): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, tableCounts(), SEED_HASH_KEY, seedIfEmpty(), BANK_BLURB (+11 more)

### Community 37 - "next"
Cohesion: 0.12
Nodes (24): nextConfig, next, CashflowChart(), CashflowPoint, CategoryMovers(), Mover, CategorySpendingMix(), DailySpendingChart() (+16 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (19): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+11 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "(month)/layout.tsx"
Cohesion: 0.36
Nodes (7): MonthLayout(), luxon, ButtonGroup(), buttonGroupVariants, SearchInit, useMonthParams(), armMonthTransition()

### Community 45 - "formatCurrency"
Cohesion: 0.11
Nodes (31): bar(), BarChart(), BarSeries, PAD, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries (+23 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 54 - "core/routes.e2e.ts"
Cohesion: 0.26
Nodes (7): PREMATURE, routeReady, titles, openEditor(), fits(), patchRows(), statementRow()

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

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "tests_support_fixtures_expect"
Cohesion: 0.15
Nodes (5): desktopOnly, expectBackAboveHeadingFromKeyboardNavigation(), keyboardBack(), APP_URL, HARNESS_URL

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 571 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Button` to `pending/page.tsx`, `cn`, `next`, `lib/motion.ts`, `providers.tsx`, `(month)/layout.tsx`, `paginated-data-table.tsx`, `formatCurrency`, `utils.ts`, `(month)/page.tsx`, `pagination.tsx`, `date-range.tsx`, `package.json`, `sync/page.tsx`, `category-filter.tsx`, `app-sidebar.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pending/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06463923673225999 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `pending/page.tsx`, `Button`, `next`, `lib/motion.ts`, `providers.tsx`, `(month)/layout.tsx`, `paginated-data-table.tsx`, `formatCurrency`, `utils.ts`, `(month)/page.tsx`, `pagination.tsx`, `date-range.tsx`, `sync/page.tsx`, `spending-calendar.tsx`, `category-filter.tsx`, `app-sidebar.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05070092514038702 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer (app pages + components)`, `providers.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._