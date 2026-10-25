# Graph Report - t3-5de3660e  (2026-10-25)

## Corpus Check
- 251 files · ~218,631 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1959 nodes · 7713 edges · 101 communities (90 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 128 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `509a7951`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- app-sidebar.tsx
- total-spending-chart.tsx
- primitives.tsx
- ledger.e2e.ts
- icon.tsx
- importer/page.tsx
- (month)/page.tsx
- cn
- category-filter.tsx
- pending/page.tsx
- react
- editors.ts
- package.json
- compilerOptions
- dashboard.ts
- budgets/page.tsx
- statements.ts
- dependencies
- README.md
- statement-rules.ts
- suspicious
- db.ts
- runner.ts
- correctness
- use-appearance.tsx
- checks.ts
- budgets/[id]/page.tsx
- auto-sync.ts
- export-import.ts
- support/motion.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- sync/page.tsx
- components.json
- @playwright/test
- types.d.ts
- STYLE.md
- duplicates.ts
- importer.ts
- drive-sync.ts
- test-data.ts
- AGENTS.md
- Monthly Budget
- Validator
- auth-vault.ts
- radix-ui
- utils.ts
- core/components.e2e.ts
- google-drive.ts
- formatter
- devDependencies
- scripts
- pagination.tsx
- fixtures.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- core/routes.e2e.ts
- biome.json
- rules
- summary.ts
- manifest.json
- workflows.e2e.ts
- tests_web_support_fixtures_expect
- Project Graph
- formatter
- Commit Guide
- Records
- app.tsx
- lucide-react
- next
- optionalDependencies
- extra/components.e2e.ts
- process.ts
- tsconfig.web.json
- style
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Local Markdown Issue Tracker
- Google Drive sync
- hashSnapshot
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
- input-group.tsx
- category-history-chart.tsx
- item.tsx
- spending-calendar.tsx
- use-sync-toasts.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 124 edges
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
- **Signed tier check-run sign-off flow** — tests_web_readme_test_runners, tests_web_readme_signoff_check_runs, tests_web_readme_tiers_list, tests_web_readme_ruleset_command [EXTRACTED 1.00]
- **Animation testing stack (extra tier, frame samplers, native-frame clock)** — tests_web_readme_extra_tier, tests_web_readme_frame_samplers, tests_web_readme_date_only_clock, tests_web_readme_test_runners [INFERRED 0.85]
- **Vite component harness entry pages** — tests_web_readme_vite_component_harness, tests_web_harness_index, tests_web_harness_display [INFERRED 0.95]

## Communities (101 total, 11 thin omitted)

### Community 0 - "Button"
Cohesion: 0.05
Nodes (142): CandidateResults(), CategoryTile(), react-day-picker, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+134 more)

### Community 1 - "app-sidebar.tsx"
Cohesion: 0.16
Nodes (31): ReviewLinks(), NotFound(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+23 more)

### Community 2 - "total-spending-chart.tsx"
Cohesion: 0.09
Nodes (46): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart(), CashflowPoint (+38 more)

### Community 3 - "primitives.tsx"
Cohesion: 0.10
Nodes (45): AlertAction(), AlertDialogTrigger(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty() (+37 more)

### Community 4 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 5 - "icon.tsx"
Cohesion: 0.10
Nodes (32): AccountRow, AccountsPage(), CategoriesPage(), CategoryDialogState, SECTIONS, Boot(), Rule, RuleCard() (+24 more)

### Community 6 - "importer/page.tsx"
Cohesion: 0.20
Nodes (31): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), DashboardPage(), ScopedCardTitle(), ScopeLabel(), WeekdayCard() (+23 more)

### Community 7 - "(month)/page.tsx"
Cohesion: 0.09
Nodes (30): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, deltaOf() (+22 more)

### Community 8 - "cn"
Cohesion: 0.13
Nodes (30): AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+22 more)

### Community 9 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 10 - "pending/page.tsx"
Cohesion: 0.08
Nodes (92): AccountPage(), AccountCard(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS (+84 more)

### Community 11 - "react"
Cohesion: 0.34
Nodes (17): react, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Input(), Sheet() (+9 more)

### Community 12 - "editors.ts"
Cohesion: 0.12
Nodes (20): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), editors, expectPointerCursor() (+12 more)

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+20 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 15 - "dashboard.ts"
Cohesion: 0.10
Nodes (44): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+36 more)

### Community 16 - "budgets/page.tsx"
Cohesion: 0.17
Nodes (17): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), PaginationHeader(), amountTone(), StatementActions() (+9 more)

### Community 17 - "statements.ts"
Cohesion: 0.13
Nodes (26): countSuggestions(), asPending(), BudgetDetail, BudgetFilters, createBudget(), duplicateStatementIds(), removeStatementDismissals(), dayDifference() (+18 more)

### Community 18 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 19 - "README.md"
Cohesion: 0.10
Nodes (24): Finpoint display harness (display.html), Finpoint widget harness (index.html), Areas, Behaviour Ledger (component-inventory.ts + ledger.e2e.ts), Browser regression tests, Core Test Tier (tests/web/core), Extra Test Tier (tests/web/extra, animation), Fixtures (+16 more)

### Community 20 - "statement-rules.ts"
Cohesion: 0.12
Nodes (15): dexie, fake-indexeddb, xlsx, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement() (+7 more)

### Community 21 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 22 - "db.ts"
Cohesion: 0.12
Nodes (26): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+18 more)

### Community 23 - "runner.ts"
Cohesion: 0.13
Nodes (20): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), wasSignaled(), ALL_PROJECTS (+12 more)

### Community 24 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 25 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 26 - "checks.ts"
Cohesion: 0.16
Nodes (22): appJwt(), call(), Check, Checks, Client, Conclusion, CONFIG, configProblems() (+14 more)

### Community 27 - "budgets/[id]/page.tsx"
Cohesion: 0.21
Nodes (21): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), Icon(), formatRowTime(), PendingBadge(), pendingReason() (+13 more)

### Community 28 - "auto-sync.ts"
Cohesion: 0.14
Nodes (25): useSyncStatus(), cycle(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), ingestManualResult(), markDirty() (+17 more)

### Community 29 - "export-import.ts"
Cohesion: 0.26
Nodes (10): EXPORT_VERSION, FinpointExport, SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings() (+2 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 31 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) Route-Group Shell, Pages take no props (+9 more)

### Community 32 - "sync/page.tsx"
Cohesion: 0.15
Nodes (28): COUNT_ROWS, DataSettingsPage(), MethodHeader(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog() (+20 more)

### Community 33 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 34 - "@playwright/test"
Cohesion: 0.17
Nodes (12): @playwright/test, cardTitles, Child, october, september, card(), overview, overviewCharts (+4 more)

### Community 35 - "types.d.ts"
Cohesion: 0.11
Nodes (21): describe(), Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category (+13 more)

### Community 36 - "STYLE.md"
Cohesion: 0.12
Nodes (18): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, ValidationError (Laravel-shaped field map), Validator, APIs, Arguments, And Props, Code Style, Consistency (+10 more)

### Community 37 - "duplicates.ts"
Cohesion: 0.27
Nodes (11): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC, pairIds() (+3 more)

### Community 38 - "importer.ts"
Cohesion: 0.25
Nodes (19): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+11 more)

### Community 39 - "drive-sync.ts"
Cohesion: 0.29
Nodes (17): exportData(), disconnectDrive(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured() (+9 more)

### Community 40 - "test-data.ts"
Cohesion: 0.18
Nodes (15): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData(), Meal (+7 more)

### Community 41 - "AGENTS.md"
Cohesion: 0.13
Nodes (14): Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), docs/agents/issue-tracker.md (.scratch tracking), Project Graph Refresh (graphify) (+6 more)

### Community 42 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 43 - "Validator"
Cohesion: 0.26
Nodes (18): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+10 more)

### Community 44 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 45 - "radix-ui"
Cohesion: 0.16
Nodes (13): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+5 more)

### Community 46 - "utils.ts"
Cohesion: 0.19
Nodes (16): PendingCard(), AllocateBar(), CategoryMovers(), Mover, CategorySpendingMix(), Amount(), MonthlyBudgetBadge(), RecordAmount() (+8 more)

### Community 47 - "core/components.e2e.ts"
Cohesion: 0.23
Nodes (7): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectVisibleBackdrop(), scrollWithInput(), settledOverlayAlpha()

### Community 48 - "google-drive.ts"
Cohesion: 0.22
Nodes (13): AuthNeededError, cacheToken(), CodeResponse, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId(), hasFreshDriveToken() (+5 more)

### Community 49 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 50 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 51 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, dev, lint, lint:check, start, test:web, test:web:core (+5 more)

### Community 52 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 53 - "fixtures.ts"
Cohesion: 0.23
Nodes (12): getScenario(), ScenarioName, WorkspaceDataset, WorkspaceTables, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser() (+4 more)

### Community 54 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 55 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth Auth Broker (app/api/auth), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 56 - "core/routes.e2e.ts"
Cohesion: 0.26
Nodes (7): PREMATURE, routeReady, titles, openEditor(), fits(), patchRows(), statementRow()

### Community 57 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 58 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 59 - "summary.ts"
Cohesion: 0.20
Nodes (10): Annotation, Outcome, ANSI, PhaseSummary, Report, Result, Spec, specs() (+2 more)

### Community 60 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 63 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 64 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 65 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 66 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 67 - "app.tsx"
Cohesion: 0.20
Nodes (8): metadata, RootLayout(), viewport, react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 68 - "lucide-react"
Cohesion: 0.15
Nodes (12): Providers(), lucide-react, buttonVariants, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker() (+4 more)

### Community 69 - "next"
Cohesion: 0.26
Nodes (9): MonthLayout(), Template(), nextConfig, luxon, next, SearchInit, useMonthParams(), armMonthTransition() (+1 more)

### Community 70 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 71 - "extra/components.e2e.ts"
Cohesion: 0.38
Nodes (3): desktopOnly, APP_URL, HARNESS_URL

### Community 72 - "process.ts"
Cohesion: 0.38
Nodes (4): awaitGroupExit(), groupAlive(), runAsync(), runTier()

### Community 73 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 74 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 75 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 77 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 78 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 79 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 81 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 82 - "hashSnapshot"
Cohesion: 0.43
Nodes (5): FinpointDB, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 83 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 84 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 85 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 86 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 87 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 88 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 96 - "input-group.tsx"
Cohesion: 0.24
Nodes (11): ComboboxClear(), ComboboxInput(), ComboboxTrigger(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput() (+3 more)

### Community 97 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 98 - "item.tsx"
Cohesion: 0.20
Nodes (11): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+3 more)

### Community 99 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

## Knowledge Gaps
- **75 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 594 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `app-sidebar.tsx`, `total-spending-chart.tsx`, `primitives.tsx`, `icon.tsx`, `importer/page.tsx`, `(month)/page.tsx`, `category-filter.tsx`, `pending/page.tsx`, `react`, `budgets/page.tsx`, `budgets/[id]/page.tsx`, `sync/page.tsx`, `radix-ui`, `utils.ts`, `pagination.tsx`, `lucide-react`, `next`, `input-group.tsx`, `item.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05313092979127135 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `app-sidebar.tsx`, `total-spending-chart.tsx`, `primitives.tsx`, `icon.tsx`, `importer/page.tsx`, `(month)/page.tsx`, `cn`, `category-filter.tsx`, `pending/page.tsx`, `package.json`, `budgets/page.tsx`, `use-appearance.tsx`, `budgets/[id]/page.tsx`, `auto-sync.ts`, `sync/page.tsx`, `radix-ui`, `utils.ts`, `pagination.tsx`, `app.tsx`, `lucide-react`, `next`, `input-group.tsx`, `item.tsx`, `use-sync-toasts.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `total-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09398496240601503 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `@playwright/test` to `ledger.e2e.ts`, `extra/components.e2e.ts`, `editors.ts`, `package.json`, `core/components.e2e.ts`, `fixtures.ts`, `support/motion.ts`, `core/routes.e2e.ts`, `workflows.e2e.ts`, `tests_web_support_fixtures_expect`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `primitives.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09551020408163265 - nodes in this community are weakly interconnected._