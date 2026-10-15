# Graph Report - t3-9755e75b  (2026-10-15)

## Corpus Check
- 235 files · ~184,039 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1767 nodes · 7026 edges · 96 communities (86 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 98 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8714177c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- pending/page.tsx
- (month)/page.tsx
- monthly/page.tsx
- primitives.tsx
- icon.tsx
- cn
- Button
- Validator
- dashboard.ts
- ValidationError
- compilerOptions
- db.ts
- package.json
- dependencies
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- ui/field.tsx
- paginated-data-table.tsx
- suspicious
- statements.ts
- sync/page.tsx
- correctness
- export-import.ts
- auto-sync.ts
- next
- records.ts
- components.json
- Commands
- app-sidebar.tsx
- combobox.tsx
- shared.ts
- assertions.ts
- fixtures.ts
- Validation rule (ValidationError + Validator)
- coverage.e2e.ts
- react
- google-drive.ts
- STYLE.md
- Monthly Budget
- auth-vault.ts
- duplicates.ts
- app.tsx
- AGENTS.md
- category-filter.tsx
- types.d.ts
- lucide-react
- data.ts
- formatter
- editors.e2e.ts
- chart-edges.e2e.ts
- pagination.tsx
- biome.json
- rules
- workflows.e2e.ts
- devDependencies
- manifest.json
- importer.test.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- importer/page.tsx
- Project Graph
- HistoryProvider
- formatter
- Commit Guide
- Records
- drive-sync.ts
- optionalDependencies
- scripts
- widgets.e2e.ts
- style
- sheet-loading.e2e.ts
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- @playwright/test
- vite.config.ts
- Finpoint
- Local Markdown Issue Tracker
- Google Drive sync
- tsconfig.web.json
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
- collectTests
- Browser regression tests

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 119 edges
4. `react` - 92 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 49 edges
8. `RecordCreatorDialog()` - 47 edges
9. `round2()` - 46 edges
10. `next` - 41 edges

## Surprising Connections (you probably didn't know these)
- `What to run` --references--> `SelectItem()`  [INFERRED]
  tests/web/README.md → src/components/ui/select.tsx
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Fixtures` --references--> `seedWorkspace()`  [INFERRED]
  tests/web/README.md → tests/web/support/fixtures.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (96 total, 10 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.07
Nodes (120): CandidateResults(), SECTIONS, ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS (+112 more)

### Community 1 - "pending/page.tsx"
Cohesion: 0.19
Nodes (45): AccountPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage() (+37 more)

### Community 2 - "(month)/page.tsx"
Cohesion: 0.05
Nodes (94): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+86 more)

### Community 3 - "monthly/page.tsx"
Cohesion: 0.13
Nodes (28): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordsPage() (+20 more)

### Community 4 - "primitives.tsx"
Cohesion: 0.10
Nodes (42): AlertAction(), AlertDialogTrigger(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+34 more)

### Community 5 - "icon.tsx"
Cohesion: 0.11
Nodes (32): CategoriesPage(), CategoryDialogState, CategoryTile(), framer-motion, AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem() (+24 more)

### Community 6 - "cn"
Cohesion: 0.12
Nodes (33): Providers(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+25 more)

### Community 7 - "Button"
Cohesion: 0.14
Nodes (29): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), MonthLayout(), NotFound(), react-day-picker (+21 more)

### Community 8 - "Validator"
Cohesion: 0.27
Nodes (17): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+9 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.12
Nodes (38): AllocationRow, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+30 more)

### Community 10 - "ValidationError"
Cohesion: 0.25
Nodes (20): asPending(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+12 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "db.ts"
Cohesion: 0.11
Nodes (18): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION, DuplicateDismissalRow (+10 more)

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+21 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+9 more)

### Community 16 - "ui/field.tsx"
Cohesion: 0.12
Nodes (19): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldContent() (+11 more)

### Community 17 - "paginated-data-table.tsx"
Cohesion: 0.25
Nodes (23): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), MOBILE_LIST_CLASS (+15 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "statements.ts"
Cohesion: 0.19
Nodes (21): countSuggestions(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason(), ReplacementStatement (+13 more)

### Community 20 - "sync/page.tsx"
Cohesion: 0.14
Nodes (29): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+21 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.26
Nodes (10): EXPORT_VERSION, FinpointExport, SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings() (+2 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.11
Nodes (26): Boot(), seedIfEmpty(), useSyncStatus(), useSyncToasts(), emit(), eventListeners, finishCycle(), getSyncSnapshot() (+18 more)

### Community 24 - "next"
Cohesion: 0.15
Nodes (16): nextConfig, next, Mover, amountTone(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementAmount() (+8 more)

### Community 25 - "records.ts"
Cohesion: 0.12
Nodes (20): BudgetDetail, BudgetFilters, getBudget(), getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), analyticsValues(), budgetCovers() (+12 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "app-sidebar.tsx"
Cohesion: 0.10
Nodes (44): Template(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), ShellHeader() (+36 more)

### Community 29 - "combobox.tsx"
Cohesion: 0.11
Nodes (24): Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty() (+16 more)

### Community 30 - "shared.ts"
Cohesion: 0.17
Nodes (16): db, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData() (+8 more)

### Community 31 - "assertions.ts"
Cohesion: 0.24
Nodes (12): containedFooter(), longName, attachSamplingFailure(), expectPointerCursor(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleBackdrop(), expectVisibleRowCascade() (+4 more)

### Community 32 - "fixtures.ts"
Cohesion: 0.14
Nodes (18): routes, overviewCharts, consumers, Child, october, september, installDateOnly(), revisions (+10 more)

### Community 33 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 34 - "coverage.e2e.ts"
Cohesion: 0.16
Nodes (16): typescript, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry (+8 more)

### Community 35 - "react"
Cohesion: 0.22
Nodes (28): PendingCard(), react, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter() (+20 more)

### Community 36 - "google-drive.ts"
Cohesion: 0.22
Nodes (13): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+5 more)

### Community 37 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "duplicates.ts"
Cohesion: 0.24
Nodes (12): StatementRow, descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC (+4 more)

### Community 41 - "app.tsx"
Cohesion: 0.20
Nodes (8): metadata, RootLayout(), viewport, react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 42 - "AGENTS.md"
Cohesion: 0.18
Nodes (12): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+4 more)

### Community 43 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 44 - "types.d.ts"
Cohesion: 0.13
Nodes (14): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+6 more)

### Community 45 - "lucide-react"
Cohesion: 0.20
Nodes (8): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS, Toaster()

### Community 46 - "data.ts"
Cohesion: 0.16
Nodes (17): first, next, pending, buildDense(), buildEmpty(), buildPopulated(), cycle(), DEFAULT_SETTINGS (+9 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "editors.e2e.ts"
Cohesion: 0.12
Nodes (10): account, budget, deleted, editors, imported, kept, longText, openEditor() (+2 more)

### Community 49 - "chart-edges.e2e.ts"
Cohesion: 0.22
Nodes (4): cardTitles, expectBackAboveHeading(), keyboardBack(), IDS

### Community 50 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "importer/page.tsx"
Cohesion: 0.18
Nodes (13): AccountCard(), AccountRow, AccountsPage(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, dexie-react-hooks, dayLabel(), bankMeta() (+5 more)

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 60 - "HistoryProvider"
Cohesion: 0.60
Nodes (5): getStoredHistory(), getValidHistory(), HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "drive-sync.ts"
Cohesion: 0.20
Nodes (24): FinpointDB, exportData(), importData(), parseImportFile(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs() (+16 more)

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, lint, lint:check, start, test:web, test:web:harness (+6 more)

### Community 67 - "widgets.e2e.ts"
Cohesion: 0.28
Nodes (3): expectDropdownPreservesScroll(), scrollWithInput(), expectWheelScrollsPageWhileOpen()

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 69 - "sheet-loading.e2e.ts"
Cohesion: 0.28
Nodes (3): expectHeldRead(), expectRetainedRows(), expectSilentSheet()

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "@playwright/test"
Cohesion: 0.17
Nodes (3): @playwright/test, bounds(), contained()

### Community 73 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 74 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

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

### Community 93 - "collectTests"
Cohesion: 0.83
Nodes (4): collectTests(), disabled(), value(), visit()

### Community 94 - "Browser regression tests"
Cohesion: 0.40
Nodes (4): Browser regression tests, Fixtures, Rendered assertions, What to run

## Knowledge Gaps
- **72 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 568 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `pending/page.tsx`, `(month)/page.tsx`, `react`, `monthly/page.tsx`, `icon.tsx`, `primitives.tsx`, `Button`, `category-filter.tsx`, `lucide-react`, `ui/field.tsx`, `paginated-data-table.tsx`, `pagination.tsx`, `sync/page.tsx`, `next`, `importer/page.tsx`, `app-sidebar.tsx`, `combobox.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06839492553778267 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `record-editor.tsx`, `pending/page.tsx`, `(month)/page.tsx`, `monthly/page.tsx`, `primitives.tsx`, `icon.tsx`, `cn`, `Button`, `package.json`, `ui/field.tsx`, `paginated-data-table.tsx`, `sync/page.tsx`, `auto-sync.ts`, `next`, `app-sidebar.tsx`, `combobox.tsx`, `app.tsx`, `category-filter.tsx`, `lucide-react`, `pagination.tsx`, `importer/page.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `(month)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05228442728442728 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `@playwright/test` to `fixtures.ts`, `coverage.e2e.ts`, `widgets.e2e.ts`, `sheet-loading.e2e.ts`, `package.json`, `editors.e2e.ts`, `chart-edges.e2e.ts`, `workflows.e2e.ts`, `assertions.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `monthly/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12878787878787878 - nodes in this community are weakly interconnected._