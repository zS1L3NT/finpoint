# Graph Report - t3-c121a3a9-38bcf55d741cb3b3  (2026-11-20)

## Corpus Check
- 282 files · ~252,198 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2079 nodes · 8252 edges · 99 communities (88 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 138 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65eb907a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard.ts
- react
- data.ts
- Tests README
- records-sheet.tsx
- next
- auth-vault.ts
- statements.ts
- @playwright/test
- db.ts
- lib/motion.ts
- compilerOptions
- core/editors.e2e.ts
- combobox.tsx
- duplicates.ts
- utils.ts
- dependencies
- duplicates/page.tsx
- budgets/[id]/page.tsx
- app-sidebar.tsx
- IndexedDB (Dexie)
- command.tsx
- records.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- spending-calendar.tsx
- support/motion.ts
- fixtures.ts
- primitives.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- google-drive.ts
- components.json
- providers.tsx
- accounts/page.tsx
- transaction-checks.test.ts
- types.d.ts
- STYLE.md
- amount-filter.tsx
- scripts
- importer/page.tsx
- export-import.ts
- item.tsx
- navigation.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- record-columns.tsx
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- test-data.ts
- optionalDependencies
- biome.json
- rules
- manifest.json
- drive-sync.ts
- cn
- (month)/page.tsx
- use-appearance.tsx
- formatter
- Records
- Validation rule (ValidationError + Validator)
- Domain docs (single-context layout)
- Button
- icon.tsx
- tsconfig.e2e.json
- style
- auto-sync.test.ts
- workflows.e2e.ts
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
- budgets/page.tsx
- app.tsx
- auto-sync.ts
- snapshot-hash.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 123 edges
4. `react` - 99 edges
5. `formatCurrency()` - 74 edges
6. `RecordEditorDialog()` - 62 edges
7. `RecordCreatorDialog()` - 59 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 46 edges
10. `ValidationError` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `BudgetState` --calls--> `parseDate()`  [EXTRACTED]
  app/budgets/page.tsx → src/lib/utils.ts
- `SECTIONS` --calls--> `treatmentLabel()`  [EXTRACTED]
  app/categories/page.tsx → src/lib/analytics.ts

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

## Communities (99 total, 11 thin omitted)

### Community 0 - "dashboard.ts"
Cohesion: 0.14
Nodes (33): AllocationRow, summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection() (+25 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (137): Rule, RuleSentence(), StatementRulesPage(), react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog() (+129 more)

### Community 2 - "data.ts"
Cohesion: 0.12
Nodes (21): AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow, MonthlyBudgetRow, buildDense() (+13 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "records-sheet.tsx"
Cohesion: 0.19
Nodes (16): byRecordDay, MOBILE_BREAKPOINT, useIsMobile(), RecordsSheetFilters, flagParam(), listParam(), looseFlagParam(), numberParam() (+8 more)

### Community 5 - "next"
Cohesion: 0.15
Nodes (15): nextConfig, next, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick() (+7 more)

### Community 6 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 7 - "statements.ts"
Cohesion: 0.13
Nodes (23): AccountRow, asPending(), StatementRow, AccountActivity, duplicateStatementIds(), dayDifference(), ensureCanReplace(), ReplacementAllocation (+15 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "db.ts"
Cohesion: 0.05
Nodes (24): dexie, fake-indexeddb, luxon, xlsx, CategoryRow, DB_NAME, DB_VERSION, MetaRow (+16 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.08
Nodes (51): framer-motion, @tanstack/react-table, bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize (+43 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "core/editors.e2e.ts"
Cohesion: 0.09
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), IDS, account (+12 more)

### Community 13 - "combobox.tsx"
Cohesion: 0.10
Nodes (27): @base-ui/react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+19 more)

### Community 14 - "duplicates.ts"
Cohesion: 0.15
Nodes (29): updateAccount(), validateBudget(), cleanInput(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, DuplicateStatement (+21 more)

### Community 15 - "utils.ts"
Cohesion: 0.19
Nodes (17): PendingCard(), AllocateBar(), CategoryMovers(), Mover, Sparkline(), Amount(), UiIcon(), Delta (+9 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "duplicates/page.tsx"
Cohesion: 0.13
Nodes (58): AccountPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage() (+50 more)

### Community 18 - "budgets/[id]/page.tsx"
Cohesion: 0.15
Nodes (42): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), ImporterPage(), metadata, PrivacyPage(), SECTIONS (+34 more)

### Community 19 - "app-sidebar.tsx"
Cohesion: 0.19
Nodes (27): NotFound(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), ShellHeader() (+19 more)

### Community 20 - "IndexedDB (Dexie)"
Cohesion: 0.15
Nodes (11): app/**/page.tsx, bun test, IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), String primary keys (not auto-increment) (+3 more)

### Community 21 - "command.tsx"
Cohesion: 0.53
Nodes (7): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandItem(), CommandList()

### Community 22 - "records.ts"
Cohesion: 0.13
Nodes (31): db, AnalyticsRecord, AnalyticsSummary, compareRecords(), contribution(), BudgetDetail, BudgetFilters, budgetSpent() (+23 more)

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
Nodes (30): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+22 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.13
Nodes (11): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput() (+3 more)

### Community 29 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (21): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, expectVisibleBackdrop(), attachSamplingFailure(), expectModalEntrance(), expectModalExit() (+13 more)

### Community 31 - "fixtures.ts"
Cohesion: 0.13
Nodes (23): Child, october, september, PREMATURE, routeReady, titles, getScenario(), statementRules() (+15 more)

### Community 32 - "primitives.tsx"
Cohesion: 0.11
Nodes (38): AlertAction(), CommandSeparator(), CommandShortcut(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+30 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.28
Nodes (10): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components (+2 more)

### Community 34 - "google-drive.ts"
Cohesion: 0.09
Nodes (28): AuthNeededError, AuthRedirectError, cacheToken(), CodeResponse, completeDriveRedirect(), disconnectDrive(), DriveAction, DriveFileMeta (+20 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "providers.tsx"
Cohesion: 0.21
Nodes (12): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, useSyncToasts() (+4 more)

### Community 37 - "accounts/page.tsx"
Cohesion: 0.11
Nodes (25): AccountCard(), AccountRow, AccountsPage(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, amountTone() (+17 more)

### Community 38 - "transaction-checks.test.ts"
Cohesion: 0.22
Nodes (3): HELD, raceGap(), reset()

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 41 - "amount-filter.tsx"
Cohesion: 0.26
Nodes (23): PendingStatementConfirmationSheet(), RecordSearchSheet(), RecordsSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS (+15 more)

### Community 42 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 43 - "importer/page.tsx"
Cohesion: 0.18
Nodes (21): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, Step(), BANKS, SPRING, ensureAccount(), combine(), dbsDescriptionKey() (+13 more)

### Community 44 - "export-import.ts"
Cohesion: 0.14
Nodes (24): brokenReferences(), clearAllData(), downloadExport(), exportData(), importData(), monthlyBudgetFields(), parseImportFile(), tableCounts() (+16 more)

### Community 45 - "item.tsx"
Cohesion: 0.11
Nodes (23): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+15 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "record-columns.tsx"
Cohesion: 0.17
Nodes (21): BudgetProgressChart(), BudgetProgressPoint, buildSeries(), Icon(), RecordOption(), formatRowTime(), PendingBadge(), pendingReason() (+13 more)

### Community 51 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "test-data.ts"
Cohesion: 0.13
Nodes (19): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+11 more)

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

### Community 58 - "drive-sync.ts"
Cohesion: 0.32
Nodes (19): downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile(), hashSnapshot() (+11 more)

### Community 59 - "cn"
Cohesion: 0.11
Nodes (34): AppearanceSwitch(), MonthCal(), MonthPicker(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+26 more)

### Community 60 - "(month)/page.tsx"
Cohesion: 0.10
Nodes (38): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+30 more)

### Community 61 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

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
Cohesion: 0.40
Nodes (6): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking

### Community 66 - "Button"
Cohesion: 0.13
Nodes (29): MonthLayout(), react-day-picker, DateField(), Props, DateRange(), DateRangeValue, formatRange(), Props (+21 more)

### Community 67 - "icon.tsx"
Cohesion: 0.24
Nodes (10): lucide-react, DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon(), loadingIcons, normalize() (+2 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "auto-sync.test.ts"
Cohesion: 0.18
Nodes (7): drive, listeners, nav, realDrive, realSync, timers, win

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

### Community 95 - "budgets/page.tsx"
Cohesion: 0.36
Nodes (7): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), PaginationHeader(), pathBudget()

### Community 96 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 97 - "auto-sync.ts"
Cohesion: 0.11
Nodes (29): SYNC_TABLES, hasFreshDriveToken(), useSyncStatus(), armPushTimer(), emit(), eventListeners, exclusive(), finishCycle() (+21 more)

### Community 98 - "snapshot-hash.ts"
Cohesion: 0.33
Nodes (5): FinpointDB, withoutActionModes(), digestSnapshot(), hashLegacySnapshot(), Snapshot

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 651 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `next`, `lib/motion.ts`, `combobox.tsx`, `utils.ts`, `duplicates/page.tsx`, `budgets/[id]/page.tsx`, `app-sidebar.tsx`, `command.tsx`, `spending-calendar.tsx`, `primitives.tsx`, `accounts/page.tsx`, `amount-filter.tsx`, `importer/page.tsx`, `item.tsx`, `pagination.tsx`, `record-columns.tsx`, `(month)/page.tsx`, `Button`, `icon.tsx`, `alert-dialog.tsx`, `budgets/page.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `records-sheet.tsx`, `next`, `lib/motion.ts`, `combobox.tsx`, `utils.ts`, `duplicates/page.tsx`, `budgets/[id]/page.tsx`, `app-sidebar.tsx`, `command.tsx`, `package.json`, `spending-calendar.tsx`, `primitives.tsx`, `providers.tsx`, `accounts/page.tsx`, `amount-filter.tsx`, `importer/page.tsx`, `item.tsx`, `pagination.tsx`, `record-columns.tsx`, `cn`, `(month)/page.tsx`, `use-appearance.tsx`, `Button`, `icon.tsx`, `alert-dialog.tsx`, `budgets/page.tsx`, `app.tsx`, `auto-sync.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.0587442218798151 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `IndexedDB (Dexie)`, `providers.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._