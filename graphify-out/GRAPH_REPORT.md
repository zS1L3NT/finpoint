# Graph Report - t3-9755e75b  (2026-10-24)

## Corpus Check
- 245 files · ~217,182 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1907 nodes · 7590 edges · 97 communities (87 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 119 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ae0fef1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- budgets/[id]/page.tsx
- total-spending-chart.tsx
- statements.ts
- sidebar.tsx
- cn
- sync/page.tsx
- utils.ts
- Validator
- dashboard.ts
- importer/page.tsx
- compilerOptions
- accounts/page.tsx
- package.json
- dependencies
- Project Shape
- routes.ts
- lib/motion.ts
- suspicious
- primitives.tsx
- pending/page.tsx
- correctness
- export-import.ts
- drive-sync.ts
- duplicates/page.tsx
- records.ts
- components.json
- Commands
- test-web.ts
- use-appearance.tsx
- shared.ts
- date-range.tsx
- PaginationFooter
- statement-rules.ts
- auto-sync.ts
- accounts/[id]/page.tsx
- Validation rule (ValidationError + Validator)
- (month)/page.tsx
- Monthly Budget
- auth-vault.ts
- providers.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- AGENTS.md
- category-filter.tsx
- types.d.ts
- fixtures.ts
- editors.ts
- formatter
- db.ts
- ledger.e2e.ts
- motion/editors.e2e.ts
- biome.json
- rules
- icon.tsx
- devDependencies
- manifest.json
- gate/components.e2e.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- Button
- Project Graph
- item.tsx
- formatter
- Commit Guide
- Records
- snapshot-hash.ts
- optionalDependencies
- scripts
- workflows.e2e.ts
- style
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- gate/routes.e2e.ts
- radix-ui
- Finpoint
- Local Markdown Issue Tracker
- Google Drive sync
- google-drive.ts
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
- workflow-tabs.tsx
- navigation.e2e.ts
- spending-calendar.tsx
- tsconfig.web.json

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
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Titles and tags` --references--> `Account`  [INFERRED]
  tests/web/README.md → src/types.d.ts
- `Titles and tags` --references--> `Statement`  [INFERRED]
  tests/web/README.md → src/types.d.ts
- `Titles and tags` --references--> `Record`  [INFERRED]
  tests/web/README.md → src/types.d.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (97 total, 10 thin omitted)

### Community 0 - "react"
Cohesion: 0.06
Nodes (124): CandidateResults(), @base-ui/react, class-variance-authority, react, react-dom, sonner, @tanstack/react-form, AccountDialog() (+116 more)

### Community 1 - "budgets/[id]/page.tsx"
Cohesion: 0.18
Nodes (35): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), DashboardPage(), ScopedCardTitle(), ScopeLabel(), WeekdayCard() (+27 more)

### Community 2 - "total-spending-chart.tsx"
Cohesion: 0.07
Nodes (62): luxon, recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart() (+54 more)

### Community 3 - "statements.ts"
Cohesion: 0.21
Nodes (19): countSuggestions(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason(), ReplacementStatement (+11 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.15
Nodes (26): lucide-react, ICONS, AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+18 more)

### Community 5 - "cn"
Cohesion: 0.18
Nodes (23): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+15 more)

### Community 6 - "sync/page.tsx"
Cohesion: 0.16
Nodes (22): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), clearAllData(), downloadExport() (+14 more)

### Community 7 - "utils.ts"
Cohesion: 0.19
Nodes (32): PendingCard(), AllocateBar(), Amount(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet() (+24 more)

### Community 8 - "Validator"
Cohesion: 0.18
Nodes (24): updateAccount(), BudgetDetail, BudgetFilters, createBudget(), updateBudget(), validateBudget(), cleanInput(), importFiles() (+16 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.14
Nodes (35): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+27 more)

### Community 10 - "importer/page.tsx"
Cohesion: 0.19
Nodes (22): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), AccountActivity, ensureAccount(), NO_ACTIVITY, combine() (+14 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "accounts/page.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "Project Shape"
Cohesion: 0.16
Nodes (10): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), String primary keys (not auto-increment) (+2 more)

### Community 16 - "routes.ts"
Cohesion: 0.17
Nodes (23): MonthLayout(), NotFound(), Template(), ShellHeader(), TITLES, SearchInit, useMonthParams(), armMonthTransition() (+15 more)

### Community 17 - "lib/motion.ts"
Cohesion: 0.22
Nodes (25): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), MOBILE_LIST_CLASS (+17 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "primitives.tsx"
Cohesion: 0.08
Nodes (54): AlertAction(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+46 more)

### Community 20 - "pending/page.tsx"
Cohesion: 0.18
Nodes (39): AllocatorPage(), AllocatorPendingPage(), CandidatePage, ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters() (+31 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.26
Nodes (10): EXPORT_VERSION, FinpointExport, SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings() (+2 more)

### Community 23 - "drive-sync.ts"
Cohesion: 0.35
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 24 - "duplicates/page.tsx"
Cohesion: 0.17
Nodes (25): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, descriptionAnchors(), descriptionIdentity() (+17 more)

### Community 25 - "records.ts"
Cohesion: 0.15
Nodes (16): getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), AllocationTally, pendingStatementIds(), tallyAllocations(), budgetCovers(), enrichRecords() (+8 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "test-web.ts"
Cohesion: 0.09
Nodes (35): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), flags, paths (+27 more)

### Community 29 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 30 - "shared.ts"
Cohesion: 0.17
Nodes (16): db, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData() (+8 more)

### Community 31 - "date-range.tsx"
Cohesion: 0.12
Nodes (22): react-day-picker, DateField(), Props, DateRangeValue, formatRange(), Props, rangeFromValue(), buttonVariants (+14 more)

### Community 32 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 33 - "statement-rules.ts"
Cohesion: 0.10
Nodes (17): dexie, fake-indexeddb, xlsx, inferRecordDatetime(), TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule() (+9 more)

### Community 34 - "auto-sync.ts"
Cohesion: 0.13
Nodes (22): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), markDirty(), refreshSyncDisplay() (+14 more)

### Community 35 - "accounts/[id]/page.tsx"
Cohesion: 0.23
Nodes (15): AccountPage(), MetricGrid(), amountTone(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges() (+7 more)

### Community 36 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 37 - "(month)/page.tsx"
Cohesion: 0.08
Nodes (33): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, deltaOf() (+25 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "providers.tsx"
Cohesion: 0.23
Nodes (12): metadata, RootLayout(), viewport, Boot(), Providers(), normalize(), preloadCategoryIcons(), SidebarProvider() (+4 more)

### Community 41 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 42 - "AGENTS.md"
Cohesion: 0.19
Nodes (11): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+3 more)

### Community 43 - "category-filter.tsx"
Cohesion: 0.36
Nodes (10): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+2 more)

### Community 44 - "types.d.ts"
Cohesion: 0.08
Nodes (28): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+20 more)

### Community 45 - "fixtures.ts"
Cohesion: 0.11
Nodes (25): @playwright/test, cardTitles, Child, october, september, denseRowConsumers, populatedConsumers, card() (+17 more)

### Community 46 - "editors.ts"
Cohesion: 0.12
Nodes (20): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor(), account (+12 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "db.ts"
Cohesion: 0.11
Nodes (29): AccountRow, AllocationRow, AnalyticsMonthRow, asPending(), BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+21 more)

### Community 49 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 50 - "motion/editors.e2e.ts"
Cohesion: 0.17
Nodes (17): editors, denseCardConsumers, expectConsumerEntrance(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade(), matrixIsIdentity() (+9 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 53 - "icon.tsx"
Cohesion: 0.18
Nodes (15): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), DynamicUiIcon(), ICON_NAMES, iconNameSet (+7 more)

### Community 54 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "gate/components.e2e.ts"
Cohesion: 0.14
Nodes (10): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectVisibleBackdrop(), scrollWithInput(), settledOverlayAlpha() (+2 more)

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "Button"
Cohesion: 0.13
Nodes (34): AccountCard(), AccountRow, AccountsPage(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, InvestmentRow() (+26 more)

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 60 - "item.tsx"
Cohesion: 0.20
Nodes (11): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+3 more)

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "snapshot-hash.ts"
Cohesion: 0.40
Nodes (4): FinpointDB, digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, dev, lint, lint:check, start, test:web, test:web:full (+9 more)

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "gate/routes.e2e.ts"
Cohesion: 0.27
Nodes (7): PREMATURE, routeReady, titles, IDS, fits(), patchRows(), statementRow()

### Community 73 - "radix-ui"
Cohesion: 0.18
Nodes (12): radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), ItemSeparator() (+4 more)

### Community 74 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

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

### Community 93 - "workflow-tabs.tsx"
Cohesion: 0.40
Nodes (8): ReviewLinks(), WorkflowTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), pathAllocator(), pathAllocatorDuplicates(), pathAllocatorPending()

### Community 96 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 98 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

## Knowledge Gaps
- **72 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 590 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `budgets/[id]/page.tsx`, `total-spending-chart.tsx`, `sidebar.tsx`, `sync/page.tsx`, `utils.ts`, `importer/page.tsx`, `routes.ts`, `lib/motion.ts`, `primitives.tsx`, `pending/page.tsx`, `duplicates/page.tsx`, `date-range.tsx`, `PaginationFooter`, `accounts/[id]/page.tsx`, `(month)/page.tsx`, `providers.tsx`, `category-filter.tsx`, `icon.tsx`, `Button`, `item.tsx`, `radix-ui`, `workflow-tabs.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06149932664970822 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `fixtures.ts` to `workflows.e2e.ts`, `gate/routes.e2e.ts`, `package.json`, `editors.ts`, `ledger.e2e.ts`, `motion/editors.e2e.ts`, `gate/components.e2e.ts`, `navigation.e2e.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `total-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06882882882882883 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `budgets/[id]/page.tsx`, `total-spending-chart.tsx`, `sidebar.tsx`, `cn`, `sync/page.tsx`, `utils.ts`, `importer/page.tsx`, `accounts/page.tsx`, `package.json`, `routes.ts`, `lib/motion.ts`, `primitives.tsx`, `pending/page.tsx`, `duplicates/page.tsx`, `use-appearance.tsx`, `date-range.tsx`, `PaginationFooter`, `auto-sync.ts`, `accounts/[id]/page.tsx`, `(month)/page.tsx`, `providers.tsx`, `category-filter.tsx`, `icon.tsx`, `Button`, `item.tsx`, `radix-ui`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13655761024182078 - nodes in this community are weakly interconnected._