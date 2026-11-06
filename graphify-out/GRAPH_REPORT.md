# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 264 files · ~238,065 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1974 nodes · 7913 edges · 96 communities (85 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `720fabda`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- statement-rule.tsx
- formatCurrency
- budgets/page.tsx
- Tests README
- ledger.e2e.ts
- auto-sync.ts
- sidebar.tsx
- (month)/page.tsx
- dashboard.ts
- primitives.tsx
- db.ts
- suggestions.ts
- compilerOptions
- editors.ts
- providers.tsx
- Button
- records.ts
- dependencies
- test
- routes.ts
- daily-spending-chart.tsx
- support/motion.ts
- suspicious
- category.tsx
- package.json
- duplicates/page.tsx
- correctness
- sync/page.tsx
- export-import.ts
- core/components.e2e.ts
- test-data.ts
- components.json
- core/routes.e2e.ts
- types.d.ts
- animations/tables.e2e.ts
- auth-vault.ts
- pending/page.tsx
- STYLE.md
- alert-dialog.tsx
- cn
- app/layout.tsx
- utils.ts
- State persistence rule (ephemeral UI state vs IndexedDB)
- formatter
- devDependencies
- themeColor
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- record-creator.tsx
- biome.json
- rules
- workflows.e2e.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- scripts
- history.tsx
- formatter
- Records
- navigation.e2e.ts
- IndexedDB (Dexie)
- optionalDependencies
- tsconfig.e2e.json
- 0001-drill-down-url-state.md
- style
- 0002 Forecast pacing
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Google Drive sync
- Forecast pacing decision
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
- lucide-react
- statement-replacement-review.tsx
- fixtures.ts
- Statement
- lib/motion.ts
- src/components/*

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 77 edges
6. `RecordEditorDialog()` - 61 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 48 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `BudgetState` --calls--> `parseDate()`  [EXTRACTED]
  app/budgets/page.tsx → src/lib/utils.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Communities (96 total, 11 thin omitted)

### Community 0 - "statement-rule.tsx"
Cohesion: 0.19
Nodes (39): sonner, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), DuplicateReviewDialog(), StatementTile(), COLOURS, MonthlyBudgetDialog() (+31 more)

### Community 1 - "formatCurrency"
Cohesion: 0.13
Nodes (35): AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, DrillPanel(), RecordAmount(), amountTone(), formatRowTime() (+27 more)

### Community 2 - "budgets/page.tsx"
Cohesion: 0.11
Nodes (44): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), @tanstack/react-table, DataTable(), PaginatedDataTable() (+36 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 5 - "auto-sync.ts"
Cohesion: 0.11
Nodes (48): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+40 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.08
Nodes (34): Providers(), AppHeader(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+26 more)

### Community 7 - "(month)/page.tsx"
Cohesion: 0.15
Nodes (20): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+12 more)

### Community 8 - "dashboard.ts"
Cohesion: 0.15
Nodes (33): db, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets() (+25 more)

### Community 9 - "primitives.tsx"
Cohesion: 0.08
Nodes (57): class-variance-authority, radix-ui, AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, ComboboxCollection() (+49 more)

### Community 10 - "db.ts"
Cohesion: 0.06
Nodes (39): dexie, fake-indexeddb, luxon, xlsx, AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow (+31 more)

### Community 11 - "suggestions.ts"
Cohesion: 0.07
Nodes (49): Rule, RuleSentence(), StatementRulesPage(), TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules() (+41 more)

### Community 12 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 13 - "editors.ts"
Cohesion: 0.13
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), IDS, statementRules() (+12 more)

### Community 14 - "providers.tsx"
Cohesion: 0.19
Nodes (18): Boot(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+10 more)

### Community 15 - "Button"
Cohesion: 0.11
Nodes (39): @base-ui/react, react-day-picker, AmountField(), Props, ComboboxField(), Props, DateField(), Props (+31 more)

### Community 16 - "records.ts"
Cohesion: 0.13
Nodes (24): round2(), BudgetDetail, BudgetFilters, isPendingRecord(), pendingStatementIds(), tallyAllocations(), resolveRecordChoices(), inferRecordDatetime() (+16 more)

### Community 17 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 18 - "test"
Cohesion: 0.23
Nodes (8): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), seedWorkspace(), test

### Community 19 - "routes.ts"
Cohesion: 0.12
Nodes (37): MonthLayout(), ReviewLinks(), NotFound(), Template(), nextConfig, next, AppearanceOption, APPEARANCES (+29 more)

### Community 20 - "daily-spending-chart.tsx"
Cohesion: 0.11
Nodes (26): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), CashflowChart() (+18 more)

### Community 21 - "support/motion.ts"
Cohesion: 0.26
Nodes (13): expectVisibleBackdrop(), attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance(), matrixIsIdentity(), MotionFrame, MotionPose (+5 more)

### Community 22 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 23 - "category.tsx"
Cohesion: 0.22
Nodes (17): SECTIONS, CategoryDialog(), CategoryFormValues, EMPTY_FORM_VALUES, iconLabel(), isChildCategory(), RecordAnalyticsFields(), FieldGroup() (+9 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 25 - "duplicates/page.tsx"
Cohesion: 0.06
Nodes (85): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, asPending(), ensureAccount() (+77 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "sync/page.tsx"
Cohesion: 0.18
Nodes (17): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), wasVaultProven(), useSyncStatus() (+9 more)

### Community 28 - "export-import.ts"
Cohesion: 0.11
Nodes (29): FinpointDB, withoutActionModes(), clearAllData(), downloadExport(), exportData(), importData(), monthlyBudgetFields(), parseImportFile() (+21 more)

### Community 29 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 30 - "test-data.ts"
Cohesion: 0.14
Nodes (19): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+11 more)

### Community 31 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 32 - "core/routes.e2e.ts"
Cohesion: 0.23
Nodes (9): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), getScenario(), fits(), patchRows() (+1 more)

### Community 33 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 34 - "animations/tables.e2e.ts"
Cohesion: 0.29
Nodes (9): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), expectReducedRowMovement(), expectVisibleRowCascade(), MotionConsumer (+1 more)

### Community 35 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 36 - "pending/page.tsx"
Cohesion: 0.08
Nodes (102): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), AllocatorPendingPage(), CandidatePage, PendingCard() (+94 more)

### Community 38 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 39 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 40 - "cn"
Cohesion: 0.14
Nodes (33): CategoryFilter(), CategoryFilterItem(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty() (+25 more)

### Community 41 - "app/layout.tsx"
Cohesion: 0.25
Nodes (5): metadata, RootLayout(), viewport, react-dom, root

### Community 42 - "utils.ts"
Cohesion: 0.18
Nodes (31): react, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange (+23 more)

### Community 43 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.33
Nodes (5): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination)

### Community 44 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 46 - "themeColor"
Cohesion: 0.16
Nodes (20): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+12 more)

### Community 48 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 49 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 50 - "record-creator.tsx"
Cohesion: 0.16
Nodes (32): CandidateResults(), @tanstack/react-form, RecordCreatorDialog(), RecordEditorDialog(), CategoryField(), RuleSuggestions(), ruleValueLabel(), Alert() (+24 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.28
Nodes (10): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components (+2 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 57 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 59 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 60 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 61 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 63 - "IndexedDB (Dexie)"
Cohesion: 0.20
Nodes (11): Agent skills, bun test, CONTEXT.md, IndexedDB (Dexie), Domain docs (single-context layout), Domain Language, Domain and importer tests (Dexie with in-memory IndexedDB), Issue tracker (local specs and tickets) (+3 more)

### Community 64 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 65 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 66 - "0001-drill-down-url-state.md"
Cohesion: 0.25
Nodes (8): Record focus, Statement pivot, Gross and net category selection URL, Drill-down, Drill-down URL state, Forecast and Monthly Budget Drill-down with explicit scope, Category and trend Drill-down, Calendar day Drill-down

### Community 67 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 68 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 69 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 73 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

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

### Community 96 - "lucide-react"
Cohesion: 0.22
Nodes (8): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS, Toaster()

### Community 97 - "statement-replacement-review.tsx"
Cohesion: 0.43
Nodes (7): Amount(), dateDifferenceLabel(), ReplacementReview, ReviewAllocation, StatementReplacementReviewDialog(), StatementRow(), formatDatetime()

### Community 98 - "fixtures.ts"
Cohesion: 0.18
Nodes (14): @playwright/test, Child, october, september, installDateOnly(), revisions, setDateOnly(), assertSeeded() (+6 more)

### Community 99 - "Statement"
Cohesion: 0.18
Nodes (14): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Monthly Budget, Pending Record (+6 more)

### Community 100 - "lib/motion.ts"
Cohesion: 0.19
Nodes (15): framer-motion, AllocateBar(), Sparkline(), Delta, Metric(), MonthlyBudgetBadge(), ValueSwap(), armMonthTransition() (+7 more)

### Community 101 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

## Knowledge Gaps
- **90 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 603 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `statement-rule.tsx`, `formatCurrency`, `budgets/page.tsx`, `sidebar.tsx`, `(month)/page.tsx`, `primitives.tsx`, `suggestions.ts`, `Button`, `routes.ts`, `daily-spending-chart.tsx`, `category.tsx`, `duplicates/page.tsx`, `sync/page.tsx`, `pending/page.tsx`, `alert-dialog.tsx`, `utils.ts`, `themeColor`, `record-creator.tsx`, `spending-calendar.tsx`, `lucide-react`, `statement-replacement-review.tsx`, `lib/motion.ts`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _90 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `formatCurrency` be split into smaller, more focused modules?**
  _Cohesion score 0.12775842044134728 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`, `IndexedDB (Dexie)`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `budgets/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11248185776487664 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `statement-rule.tsx`, `formatCurrency`, `budgets/page.tsx`, `sidebar.tsx`, `(month)/page.tsx`, `primitives.tsx`, `suggestions.ts`, `providers.tsx`, `Button`, `routes.ts`, `daily-spending-chart.tsx`, `category.tsx`, `package.json`, `duplicates/page.tsx`, `sync/page.tsx`, `pending/page.tsx`, `alert-dialog.tsx`, `cn`, `app/layout.tsx`, `themeColor`, `record-creator.tsx`, `spending-calendar.tsx`, `history.tsx`, `lucide-react`, `statement-replacement-review.tsx`, `lib/motion.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._