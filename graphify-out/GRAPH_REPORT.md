# Graph Report - finpoint  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1939 nodes · 7790 edges · 91 communities (80 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.84)
- Token cost: 29,182 input · 1,206 output

## Graph Freshness
- Built from commit: `c207d7bf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Accounts and Duplicates Pages
- Record and Budget Dialogs
- Dexie Database Schema
- Graph Artifacts and CI Harness
- Combobox and Alert Primitives
- Analytics and Dashboard Logic
- Amount and Allocation Display
- Root Layout and Providers
- Chart Tests
- Category History Chart
- Data Table Components
- TypeScript Compiler Config
- Editor and Sheet Tests
- Date Fields and Budget Card
- Auto Sync Status
- Dashboard Page and Comparisons
- Package Dependencies
- Test Data Builders
- Budget and Import Operations
- Spending Calendar
- Month Picker
- Replacement Statements Logic
- Static and Detail Pages
- Biome Suspicious Rules
- Package Manifest
- Test Tooling and Inventory
- Biome Correctness Rules
- Suggestion Learning Model
- Playwright Component Tests
- Data Settings and Alert Dialog
- Animation Route Tests
- Test Fixtures and Date Helpers
- Google Drive Storage
- UI Layer Architecture Rules
- Export, Import and Seeding
- shadcn Components Config
- Defaults and Seed Data
- Budget Analytics Page
- Search Sheets and Filters
- Shared Domain Types
- Domain Glossary
- Auth Broker Routes
- Header and Button Group UI
- Duplicate Detection Logic
- Workflow E2E Tests
- Bar and Cashflow Charts
- Navigation E2E Tests
- Biome Formatter Style
- Dev Dependencies
- Pagination Components
- Monthly Budget Logic
- Commands and Tooling
- Next.js Auth Broker Setup
- Category Filter and Command
- Route and Table Tests
- Biome Config
- Biome Complexity Rules
- PWA Web Manifest
- Test Harness App
- NPM Scripts
- Biome Formatting Options
- Core Domain Model
- Agent Skills and Domain Docs
- Optional Platform Dependencies
- E2E TypeScript Config
- Biome Style Rules
- Data Layer and Verification
- Validation and Laravel Mapping
- Icon With Shadow Halo
- Icon Charcoal Shadow
- Local Issue Tracker
- Finpoint Icon
- Domain Docs Guide
- Local Tracker Operations
- Drive Sync and Backup
- F Monogram Icon
- JPG Favicon
- PNG Favicon
- SVG Favicon
- F Monogram Dot Icon
- F Monogram Letter Icon
- App Icon Palette
- Domain Docs Conflicts
- Conventions
- Crawler Policy
- Generated Demo Data
- Progressive Web App
- UI Layer Behavior Rules

## God Nodes (most connected - your core abstractions)
1. `cn()` - 323 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 126 edges
4. `react` - 97 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 58 edges
8. `RecordCreatorDialog()` - 57 edges
9. `round2()` - 47 edges
10. `PageContent()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
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

## Communities (91 total, 11 thin omitted)

### Community 0 - "Accounts and Duplicates Pages"
Cohesion: 0.05
Nodes (145): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+137 more)

### Community 1 - "Record and Budget Dialogs"
Cohesion: 0.06
Nodes (136): CandidateResults(), @base-ui/react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+128 more)

### Community 2 - "Dexie Database Schema"
Cohesion: 0.08
Nodes (23): dexie, fake-indexeddb, xlsx, asPending(), DB_NAME, DB_VERSION, FinpointDB, MetaRow (+15 more)

### Community 3 - "Graph Artifacts and CI Harness"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "Combobox and Alert Primitives"
Cohesion: 0.08
Nodes (56): AlertAction(), AlertDialogTrigger(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty() (+48 more)

### Community 5 - "Analytics and Dashboard Logic"
Cohesion: 0.09
Nodes (46): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory() (+38 more)

### Community 6 - "Amount and Allocation Display"
Cohesion: 0.44
Nodes (7): PendingCard(), AllocateBar(), Amount(), RecordAmount(), StatementOption(), classForCurrency(), formatCurrency()

### Community 7 - "Root Layout and Providers"
Cohesion: 0.06
Nodes (69): metadata, RootLayout(), viewport, MonthLayout(), ReviewLinks(), NotFound(), Boot(), Providers() (+61 more)

### Community 8 - "Chart Tests"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "Category History Chart"
Cohesion: 0.31
Nodes (10): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+2 more)

### Community 10 - "Data Table Components"
Cohesion: 0.21
Nodes (26): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), MOBILE_LIST_CLASS (+18 more)

### Community 11 - "TypeScript Compiler Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "Editor and Sheet Tests"
Cohesion: 0.13
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 13 - "Date Fields and Budget Card"
Cohesion: 0.14
Nodes (24): BudgetCard(), BudgetState, formatBudgetDateWindow(), react-day-picker, DateField(), Props, DateRange(), DateRangeValue (+16 more)

### Community 14 - "Auto Sync Status"
Cohesion: 0.13
Nodes (22): SYNC_TABLES, useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), markDirty(), refreshSyncDisplay() (+14 more)

### Community 15 - "Dashboard Page and Comparisons"
Cohesion: 0.10
Nodes (30): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+22 more)

### Community 16 - "Package Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "Test Data Builders"
Cohesion: 0.12
Nodes (24): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DuplicateDismissalRow, buildDense() (+16 more)

### Community 18 - "Budget and Import Operations"
Cohesion: 0.23
Nodes (21): updateAccount(), createBudget(), validateBudget(), cleanInput(), dismissDuplicatePair(), restoreDuplicatePair(), importFiles(), readFile() (+13 more)

### Community 19 - "Spending Calendar"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 20 - "Month Picker"
Cohesion: 0.33
Nodes (6): ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 21 - "Replacement Statements Logic"
Cohesion: 0.20
Nodes (20): countSuggestions(), duplicateStatementIds(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+12 more)

### Community 22 - "Static and Detail Pages"
Cohesion: 0.27
Nodes (20): WeekdayCard(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), StatementPage(), MethodHeader() (+12 more)

### Community 23 - "Biome Suspicious Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "Package Manifest"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 25 - "Test Tooling and Inventory"
Cohesion: 0.07
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 26 - "Biome Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "Suggestion Learning Model"
Cohesion: 0.11
Nodes (36): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+28 more)

### Community 28 - "Playwright Component Tests"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "Data Settings and Alert Dialog"
Cohesion: 0.16
Nodes (24): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+16 more)

### Community 30 - "Animation Route Tests"
Cohesion: 0.17
Nodes (18): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade() (+10 more)

### Community 31 - "Test Fixtures and Date Helpers"
Cohesion: 0.19
Nodes (15): Child, october, september, installDateOnly(), revisions, setDateOnly(), assertSeeded(), checkSeededMarker() (+7 more)

### Community 32 - "Google Drive Storage"
Cohesion: 0.17
Nodes (30): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+22 more)

### Community 33 - "UI Layer Architecture Rules"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "Export, Import and Seeding"
Cohesion: 0.18
Nodes (19): clearAllData(), downloadExport(), exportData(), importData(), parseImportFile(), tableCounts(), TableName, TABLES (+11 more)

### Community 35 - "shadcn Components Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Defaults and Seed Data"
Cohesion: 0.15
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+10 more)

### Community 37 - "Budget Analytics Page"
Cohesion: 0.21
Nodes (18): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), luxon, BudgetProgressChart(), BudgetProgressPoint, buildSeries() (+10 more)

### Community 38 - "Search Sheets and Filters"
Cohesion: 0.17
Nodes (27): radix-ui, react, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange (+19 more)

### Community 39 - "Shared Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 40 - "Domain Glossary"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 41 - "Auth Broker Routes"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "Header and Button Group UI"
Cohesion: 0.09
Nodes (42): class-variance-authority, AppHeader(), AppearanceSwitch(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+34 more)

### Community 43 - "Duplicate Detection Logic"
Cohesion: 0.22
Nodes (15): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, eligible(), fixDuplicates() (+7 more)

### Community 45 - "Bar and Cashflow Charts"
Cohesion: 0.12
Nodes (26): bar(), BarChart(), BarSeries, PAD, CashflowChart(), CashflowPoint, ChartFrame(), ChartSize (+18 more)

### Community 47 - "Biome Formatter Style"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "Pagination Components"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "Monthly Budget Logic"
Cohesion: 0.40
Nodes (5): buildMonthlyBudgets(), amountFor(), defaultAmountFor(), MONTHLY_BUDGET_GROUPS, PACE_KINDS

### Community 51 - "Commands and Tooling"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js Auth Broker Setup"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "Category Filter and Command"
Cohesion: 0.15
Nodes (22): CategoryFilter(), CategoryFilterItem(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), Command(), CommandEmpty(), CommandGroup() (+14 more)

### Community 54 - "Route and Table Tests"
Cohesion: 0.24
Nodes (8): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), fits(), patchRows(), statementRow()

### Community 55 - "Biome Config"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "Biome Complexity Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "PWA Web Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "Test Harness App"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 59 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 62 - "Biome Formatting Options"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Core Domain Model"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 65 - "Agent Skills and Domain Docs"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "Optional Platform Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "E2E TypeScript Config"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "Biome Style Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Data Layer and Verification"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 71 - "Validation and Laravel Mapping"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 72 - "Icon With Shadow Halo"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Icon Charcoal Shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Local Issue Tracker"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 75 - "Finpoint Icon"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Domain Docs Guide"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 77 - "Local Tracker Operations"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 79 - "Drive Sync and Backup"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 80 - "F Monogram Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 81 - "JPG Favicon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 82 - "PNG Favicon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 83 - "SVG Favicon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 84 - "F Monogram Dot Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 85 - "F Monogram Letter Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 94 - "UI Layer Behavior Rules"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

## Knowledge Gaps
- **83 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 588 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Header and Button Group UI` to `Accounts and Duplicates Pages`, `Record and Budget Dialogs`, `Combobox and Alert Primitives`, `Budget Analytics Page`, `Amount and Allocation Display`, `Root Layout and Providers`, `Search Sheets and Filters`, `Data Table Components`, `Date Fields and Budget Card`, `Bar and Cashflow Charts`, `Dashboard Page and Comparisons`, `Pagination Components`, `Spending Calendar`, `Month Picker`, `Category Filter and Command`, `Static and Detail Pages`, `Data Settings and Alert Dialog`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Accounts and Duplicates Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05224283912808503 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Search Sheets and Filters` to `Accounts and Duplicates Pages`, `Record and Budget Dialogs`, `Combobox and Alert Primitives`, `Root Layout and Providers`, `Category History Chart`, `Data Table Components`, `Date Fields and Budget Card`, `Auto Sync Status`, `Dashboard Page and Comparisons`, `Spending Calendar`, `Month Picker`, `Static and Detail Pages`, `Package Manifest`, `Data Settings and Alert Dialog`, `Budget Analytics Page`, `Header and Button Group UI`, `Bar and Cashflow Charts`, `Pagination Components`, `Category Filter and Command`, `Test Harness App`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `Record and Budget Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.05534155110426297 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `Data Layer and Verification` to `UI Layer Architecture Rules`, `Root Layout and Providers`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Dexie Database Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.07965860597439545 - nodes in this community are weakly interconnected._