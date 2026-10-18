# Graph Report - t3-e5df8507  (2026-10-18)

## Corpus Check
- 200 files · ~122,812 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1599 nodes · 6369 edges · 80 communities (72 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 104 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2c721b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- item.tsx
- total-spending-chart.tsx
- statements.ts
- cn
- utils.ts
- sync/page.tsx
- app-sidebar.tsx
- Validator
- dashboard.ts
- importer/page.tsx
- compilerOptions
- db.ts
- package.json
- dependencies
- Project Shape
- combobox.tsx
- paginated-data-table.tsx
- suspicious
- sidebar.tsx
- Button
- correctness
- export-import.ts
- drive-sync.ts
- STYLE.md
- records.ts
- components.json
- Commands
- providers.tsx
- command.tsx
- test-data.ts
- routes.ts
- PaginationFooter
- importer.test.ts
- auto-sync.ts
- statement-rules.ts
- Validation rule (ValidationError + Validator)
- use-appearance.tsx
- Monthly Budget
- auth-vault.ts
- duplicates.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- AGENTS.md
- calendar.tsx
- types.d.ts
- record-defaults.ts
- formatter
- biome.json
- rules
- devDependencies
- manifest.json
- Next.js agent rules block ("This is NOT the Next.js you know")
- Project Graph
- formatter
- Commit Guide
- Records
- hashSnapshot
- optionalDependencies
- scripts
- style
- Finpoint icon concept
- Finpoint icon with charcoal shadow
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 317 edges
2. `Button()` - 118 edges
3. `react` - 89 edges
4. `formatCurrency()` - 81 edges
5. `RecordEditorDialog()` - 62 edges
6. `UiIcon()` - 54 edges
7. `RecordCreatorDialog()` - 51 edges
8. `round2()` - 44 edges
9. `PageContent()` - 42 edges
10. `ValidationError` - 42 edges

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

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (80 total, 8 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.07
Nodes (100): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), SECTIONS, react, sonner (+92 more)

### Community 1 - "item.tsx"
Cohesion: 0.12
Nodes (21): class-variance-authority, radix-ui, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), Item() (+13 more)

### Community 2 - "total-spending-chart.tsx"
Cohesion: 0.08
Nodes (57): luxon, recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart() (+49 more)

### Community 3 - "statements.ts"
Cohesion: 0.16
Nodes (23): countSuggestions(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+15 more)

### Community 4 - "cn"
Cohesion: 0.11
Nodes (18): AlertAction(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+10 more)

### Community 5 - "utils.ts"
Cohesion: 0.06
Nodes (109): PendingCard(), BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), Comparison, comparisonRateText(), comparisonText() (+101 more)

### Community 6 - "sync/page.tsx"
Cohesion: 0.15
Nodes (24): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+16 more)

### Community 7 - "app-sidebar.tsx"
Cohesion: 0.19
Nodes (20): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), SidebarContent() (+12 more)

### Community 8 - "Validator"
Cohesion: 0.20
Nodes (22): updateAccount(), validateBudget(), CategoryInput, cleanInput(), createCategory(), updateCategory(), dismissDuplicatePair(), eligible() (+14 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.11
Nodes (42): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+34 more)

### Community 10 - "importer/page.tsx"
Cohesion: 0.20
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), BANKS, ensureAccount(), combine(), dbsDescriptionKey() (+17 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "db.ts"
Cohesion: 0.12
Nodes (16): AccountRow, AllocationRow, AnalyticsMonthRow, asPending(), BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+8 more)

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, @fontsource-variable/inter, lightningcss-linux-x64-gnu (+20 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "Project Shape"
Cohesion: 0.18
Nodes (9): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), URL search params (filters and pagination) (+1 more)

### Community 16 - "combobox.tsx"
Cohesion: 0.15
Nodes (13): @base-ui/react, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxGroup(), ComboboxInput(), ComboboxLabel() (+5 more)

### Community 17 - "paginated-data-table.tsx"
Cohesion: 0.14
Nodes (34): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal() (+26 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "sidebar.tsx"
Cohesion: 0.12
Nodes (20): lucide-react, AppHeader(), SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction() (+12 more)

### Community 20 - "Button"
Cohesion: 0.05
Nodes (146): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+138 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.19
Nodes (17): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+9 more)

### Community 23 - "drive-sync.ts"
Cohesion: 0.18
Nodes (30): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+22 more)

### Community 24 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 25 - "records.ts"
Cohesion: 0.16
Nodes (19): isPendingRecord(), pendingStatementIds(), tallyAllocations(), analyticsValues(), budgetCovers(), ConflictError, createRecord(), enrichRecords() (+11 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "providers.tsx"
Cohesion: 0.20
Nodes (13): metadata, RootLayout(), viewport, Boot(), Providers(), SidebarInset(), SidebarProvider(), Toaster() (+5 more)

### Community 29 - "command.tsx"
Cohesion: 0.24
Nodes (10): cmdk, CommandInput(), CommandSeparator(), CommandShortcut(), InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupText() (+2 more)

### Community 30 - "test-data.ts"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 31 - "routes.ts"
Cohesion: 0.20
Nodes (20): ReviewLinks(), Template(), ShellHeader(), TITLES, WorkflowTabs(), SearchInit, useMonthParams(), pathAccounts() (+12 more)

### Community 32 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 33 - "importer.test.ts"
Cohesion: 0.22
Nodes (3): dexie, fake-indexeddb, xlsx

### Community 34 - "auto-sync.ts"
Cohesion: 0.13
Nodes (21): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), markDirty(), refreshSyncDisplay(), refreshTimes() (+13 more)

### Community 35 - "statement-rules.ts"
Cohesion: 0.24
Nodes (12): StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), previewStatementRule(), RULE_FIELDS (+4 more)

### Community 36 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 37 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "duplicates.ts"
Cohesion: 0.24
Nodes (12): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC (+4 more)

### Community 41 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 42 - "AGENTS.md"
Cohesion: 0.18
Nodes (12): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+4 more)

### Community 43 - "calendar.tsx"
Cohesion: 0.23
Nodes (10): react-day-picker, buttonVariants, Calendar(), CalendarDayButton(), ButtonVariant, Month, MonthCal(), MonthCalProps (+2 more)

### Community 44 - "types.d.ts"
Cohesion: 0.10
Nodes (19): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+11 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse (+2 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "hashSnapshot"
Cohesion: 0.43
Nodes (5): FinpointDB, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

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

## Knowledge Gaps
- **73 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 496 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `item.tsx`, `total-spending-chart.tsx`, `PaginationFooter`, `utils.ts`, `sync/page.tsx`, `app-sidebar.tsx`, `importer/page.tsx`, `calendar.tsx`, `combobox.tsx`, `paginated-data-table.tsx`, `sidebar.tsx`, `Button`, `providers.tsx`, `command.tsx`, `routes.ts`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07193356525642465 - nodes in this community are weakly interconnected._
- **Why does `react` connect `record-editor.tsx` to `PaginationFooter`, `item.tsx`, `total-spending-chart.tsx`, `auto-sync.ts`, `cn`, `utils.ts`, `sync/page.tsx`, `use-appearance.tsx`, `importer/page.tsx`, `calendar.tsx`, `package.json`, `combobox.tsx`, `paginated-data-table.tsx`, `sidebar.tsx`, `Button`, `providers.tsx`, `command.tsx`, `routes.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `item.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11956521739130435 - nodes in this community are weakly interconnected._
- **Why does `pluralize()` connect `Button` to `record-editor.tsx`, `STYLE.md`, `importer/page.tsx`, `utils.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `total-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07715260017050299 - nodes in this community are weakly interconnected._