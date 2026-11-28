# Graph Report - t3-e119a59d-13c0e3f8b4746372  (2026-11-28)

## Corpus Check
- 286 files · ~258,589 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2110 nodes · 8372 edges · 94 communities (82 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 136 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b1537547`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard.ts
- Button
- data.ts
- Tests README
- (month)/page.tsx
- duplicates/page.tsx
- export-import.ts
- budgets/[id]/page.tsx
- @playwright/test
- db.ts
- row-groups.tsx
- compilerOptions
- core/editors.e2e.ts
- ValidationError
- duplicates.ts
- icon.tsx
- dependencies
- collectTests
- react
- allocator/page.tsx
- vite.config.ts
- formatCurrency
- records.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- statement-rules/page.tsx
- support/motion.ts
- providers.tsx
- primitives.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- sync/page.tsx
- components.json
- use-appearance.tsx
- statement-rules.ts
- transaction-checks.test.ts
- types.d.ts
- STYLE.md
- routes.ts
- scripts
- utils.ts
- workflows.e2e.ts
- amount-filter.tsx
- fixtures.ts
- formatter
- devDependencies
- pagination.tsx
- statements.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- src/components/*
- optionalDependencies
- biome.json
- rules
- manifest.json
- cn
- (month)/layout.tsx
- alert.tsx
- main.tsx
- formatter
- Records
- Validation rule (ValidationError + Validator)
- IndexedDB (Dexie)
- tsconfig.e2e.json
- style
- navigation.e2e.ts
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
- alert-dialog.tsx
- radix-ui
- playwright.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 326 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 117 edges
4. `react` - 100 edges
5. `formatCurrency()` - 81 edges
6. `UiIcon()` - 58 edges
7. `RecordCreatorDialog()` - 57 edges
8. `round2()` - 46 edges
9. `ValidationError` - 46 edges
10. `pluralize()` - 44 edges

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

## Communities (94 total, 12 thin omitted)

### Community 0 - "dashboard.ts"
Cohesion: 0.08
Nodes (53): luxon, CategoryRow, RecordRow, AnalyticsRecord, AnalyticsSummary, compareRecords(), contribution(), summarize() (+45 more)

### Community 1 - "Button"
Cohesion: 0.07
Nodes (113): BudgetState, formatBudgetDateWindow(), react-day-picker, sonner, @tanstack/react-form, AllocationMismatch(), AccountDialog(), BudgetCreatorDialog() (+105 more)

### Community 2 - "data.ts"
Cohesion: 0.16
Nodes (18): AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow, buildDense(), buildEmpty() (+10 more)

### Community 3 - "Tests README"
Cohesion: 0.05
Nodes (45): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+37 more)

### Community 4 - "(month)/page.tsx"
Cohesion: 0.05
Nodes (70): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+62 more)

### Community 5 - "duplicates/page.tsx"
Cohesion: 0.19
Nodes (35): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+27 more)

### Community 6 - "export-import.ts"
Cohesion: 0.07
Nodes (48): db, FinpointDB, withoutActionModes(), DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, brokenReferences(), clearAllData(), downloadExport() (+40 more)

### Community 7 - "budgets/[id]/page.tsx"
Cohesion: 0.17
Nodes (33): BudgetPage(), getCategoryData(), Legend(), outsideKey(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step() (+25 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "db.ts"
Cohesion: 0.06
Nodes (23): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, MetaRow, SettingsRow, base (+15 more)

### Community 10 - "row-groups.tsx"
Cohesion: 0.21
Nodes (26): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), LeavingRows() (+18 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "core/editors.e2e.ts"
Cohesion: 0.10
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 13 - "ValidationError"
Cohesion: 0.18
Nodes (24): ensureAccount(), CategoryInput, checkReferences(), createCategory(), updateCategory(), combine(), dbsDescriptionKey(), debitCreditAmount() (+16 more)

### Community 14 - "duplicates.ts"
Cohesion: 0.13
Nodes (35): updateAccount(), validateBudget(), cleanInput(), allocationOutcome(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), dismissedDuplicatePairs() (+27 more)

### Community 15 - "icon.tsx"
Cohesion: 0.10
Nodes (29): BUDGET_STATES, BudgetCard(), BudgetsPage(), nextConfig, next, aggregateSeries(), CategoryHistoryChart(), ChartMonth (+21 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 18 - "react"
Cohesion: 0.09
Nodes (31): @base-ui/react, lucide-react, react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear() (+23 more)

### Community 19 - "allocator/page.tsx"
Cohesion: 0.18
Nodes (31): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), RecordCreatorHost(), RecordsPage(), StatementsPage() (+23 more)

### Community 20 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 21 - "formatCurrency"
Cohesion: 0.12
Nodes (32): PendingCard(), AllocateBar(), Sparkline(), Amount(), Icon(), Metric(), RecordAmount(), RecordOption() (+24 more)

### Community 22 - "records.ts"
Cohesion: 0.15
Nodes (22): flagParam(), listParam(), looseFlagParam(), numberParam(), ParamSource, textParam(), MonthlyFilters, parseMonthlyFilters() (+14 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "suggestions.ts"
Cohesion: 0.10
Nodes (39): AllocationRow, MonthlyBudgetRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue (+31 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.18
Nodes (9): bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput(), settledOverlayAlpha() (+1 more)

### Community 29 - "statement-rules/page.tsx"
Cohesion: 0.15
Nodes (20): CategoriesPage(), CategoryDialogState, CategoryGroup(), CategoryRow(), DefaultMonthlyBudget(), SECTIONS, Rule, RuleSentence() (+12 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.18
Nodes (18): denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance(), expectReducedRowMovement() (+10 more)

### Community 31 - "providers.tsx"
Cohesion: 0.16
Nodes (15): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, Toaster() (+7 more)

### Community 32 - "primitives.tsx"
Cohesion: 0.10
Nodes (48): ButtonGroupSeparator(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal() (+40 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.18
Nodes (15): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape (+7 more)

### Community 34 - "sync/page.tsx"
Cohesion: 0.05
Nodes (89): COUNT_ROWS, DataSettingsPage(), LINK_TONES, LinkTone, STATUS_TONES, StatusTone, SyncEndpoint(), WorkspaceRow() (+81 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): AppearanceSwitch(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 37 - "statement-rules.ts"
Cohesion: 0.16
Nodes (13): StatementRow, TREATMENT_VALUES, byCreation(), listStatementRules(), NAME_ORDER, RULE_OPERATORS, RuleInput, RuleRecommendation (+5 more)

### Community 38 - "transaction-checks.test.ts"
Cohesion: 0.22
Nodes (3): HELD, raceGap(), reset()

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "routes.ts"
Cohesion: 0.09
Nodes (50): POST(), POST(), POST(), NotFound(), AppNav(), SETTINGS_PATHS, SyncDot(), useSyncIndicator() (+42 more)

### Community 42 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 43 - "utils.ts"
Cohesion: 0.28
Nodes (8): Props, parseValue(), Props, toInputValue(), buttonVariants, Calendar(), CalendarDayButton(), currencyFormat

### Community 45 - "amount-filter.tsx"
Cohesion: 0.18
Nodes (33): dexie-react-hooks, BudgetRecordsSheet(), byRecordDay, Shown, PendingStatementConfirmationSheet(), RecordSearchSheet(), WIDEN, byRecordDay (+25 more)

### Community 46 - "fixtures.ts"
Cohesion: 0.11
Nodes (26): denseCardConsumers, Child, october, september, PREMATURE, routeReady, titles, ScenarioName (+18 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "statements.ts"
Cohesion: 0.11
Nodes (35): AccountRow, asPending(), AccountActivity, NO_ACTIVITY, duplicateStatementIds(), removeStatementDismissals(), getRecord(), dayDifference() (+27 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 54 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "cn"
Cohesion: 0.12
Nodes (32): SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel() (+24 more)

### Community 59 - "(month)/layout.tsx"
Cohesion: 0.12
Nodes (26): MonthLayout(), DateField(), MonthHeaderSlot, MonthHeaderSlotProvider, MonthHeaderSlots, CategoryFilter(), CategoryFilterItem(), Command() (+18 more)

### Community 60 - "alert.tsx"
Cohesion: 0.33
Nodes (6): class-variance-authority, Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 65 - "IndexedDB (Dexie)"
Cohesion: 0.20
Nodes (11): Agent skills, bun test, CONTEXT.md, IndexedDB (Dexie), Domain docs (single-context layout), Domain Language, Domain and importer tests (Dexie with in-memory IndexedDB), Issue tracker (local specs and tickets) (+3 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

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

### Community 94 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 100 - "radix-ui"
Cohesion: 0.18
Nodes (9): radix-ui, ButtonGroup(), ButtonGroupText(), buttonGroupVariants, Progress(), ScrollArea(), ScrollBar(), ToggleGroup() (+1 more)

### Community 102 - "playwright.config.ts"
Cohesion: 0.33
Nodes (3): desktopOnly, APP_URL, HARNESS_URL

## Knowledge Gaps
- **84 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 658 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `(month)/page.tsx`, `duplicates/page.tsx`, `budgets/[id]/page.tsx`, `row-groups.tsx`, `icon.tsx`, `react`, `allocator/page.tsx`, `formatCurrency`, `statement-rules/page.tsx`, `primitives.tsx`, `sync/page.tsx`, `routes.ts`, `utils.ts`, `amount-filter.tsx`, `pagination.tsx`, `(month)/layout.tsx`, `alert.tsx`, `alert-dialog.tsx`, `radix-ui`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07978142076502732 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `IndexedDB (Dexie)`, `providers.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07298850574712644 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `(month)/page.tsx`, `duplicates/page.tsx`, `budgets/[id]/page.tsx`, `row-groups.tsx`, `icon.tsx`, `allocator/page.tsx`, `formatCurrency`, `package.json`, `statement-rules/page.tsx`, `providers.tsx`, `primitives.tsx`, `sync/page.tsx`, `use-appearance.tsx`, `routes.ts`, `utils.ts`, `amount-filter.tsx`, `pagination.tsx`, `cn`, `(month)/layout.tsx`, `alert.tsx`, `main.tsx`, `alert-dialog.tsx`, `radix-ui`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05446853516657853 - nodes in this community are weakly interconnected._