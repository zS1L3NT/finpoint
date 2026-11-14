# Graph Report - t3-6b4fc13c-8de3ddf0f021ed8e  (2026-11-14)

## Corpus Check
- 266 files · ~240,445 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1993 nodes · 7906 edges · 103 communities (92 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b8fe727b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard.ts
- record-creator.tsx
- db.ts
- Tests README
- sync/page.tsx
- primitives.tsx
- auth-vault.ts
- statements.ts
- @playwright/test
- command.tsx
- paginated-data-table.tsx
- compilerOptions
- editors.ts
- PrimitivesSection
- Validator
- export-import.ts
- dependencies
- icon.tsx
- fixtures.ts
- category-history-chart.tsx
- cn
- app.tsx
- snapshot-hash.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- drive-sync.ts
- support/motion.ts
- core/routes.e2e.ts
- amount-filter.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- test-data.ts
- components.json
- app-sidebar.tsx
- auto-sync.ts
- utils.ts
- types.d.ts
- STYLE.md
- collectTests
- statement-rules.ts
- ValidationError
- combobox.tsx
- budgets/[id]/page.tsx
- navigation.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- records.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- spending-calendar.tsx
- Button
- biome.json
- rules
- manifest.json
- luxon
- scripts
- (month)/page.tsx
- react
- formatter
- Records
- Validation rule (ValidationError + Validator)
- Domain docs (single-context layout)
- optionalDependencies
- trend-chart.tsx
- tsconfig.e2e.json
- style
- allocator/page.tsx
- vite.config.ts
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
- src/components/*
- google-drive.ts
- accounts/[id]/page.tsx
- IndexedDB (Dexie)
- duplicates.ts
- auto-sync.test.ts
- lucide-react
- next

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
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `DataSettingsPage()` --indirect_call--> `syncDrive()`  [INFERRED]
  app/sync/page.tsx → src/logic/drive-sync.ts

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

## Communities (103 total, 11 thin omitted)

### Community 0 - "dashboard.ts"
Cohesion: 0.13
Nodes (36): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories() (+28 more)

### Community 1 - "record-creator.tsx"
Cohesion: 0.07
Nodes (108): SECTIONS, framer-motion, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+100 more)

### Community 2 - "db.ts"
Cohesion: 0.06
Nodes (37): dexie, fake-indexeddb, xlsx, AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow (+29 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "sync/page.tsx"
Cohesion: 0.13
Nodes (35): ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, COUNT_ROWS, DataSettingsPage(), MethodHeader() (+27 more)

### Community 5 - "primitives.tsx"
Cohesion: 0.14
Nodes (21): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+13 more)

### Community 6 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 7 - "statements.ts"
Cohesion: 0.12
Nodes (30): asPending(), StatementRow, duplicateStatementIds(), removeStatementDismissals(), getRecord(), dayDifference(), ensureCanReplace(), maskDescription() (+22 more)

### Community 8 - "@playwright/test"
Cohesion: 0.15
Nodes (14): @playwright/test, cardTitles, Child, october, september, card(), chartTooltip, overview (+6 more)

### Community 9 - "command.tsx"
Cohesion: 0.19
Nodes (18): @base-ui/react, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+10 more)

### Community 10 - "paginated-data-table.tsx"
Cohesion: 0.21
Nodes (26): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), LeavingRows() (+18 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.12
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 13 - "PrimitivesSection"
Cohesion: 0.12
Nodes (34): Providers(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+26 more)

### Community 14 - "Validator"
Cohesion: 0.24
Nodes (20): updateAccount(), validateBudget(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), importFiles(), upsertIndexed() (+12 more)

### Community 15 - "export-import.ts"
Cohesion: 0.12
Nodes (24): FinpointDB, withoutActionModes(), clearAllData(), downloadExport(), EXPORT_VERSION, exportData(), FinpointExport, importData() (+16 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "icon.tsx"
Cohesion: 0.12
Nodes (35): AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), formatBudgetDateWindow(), CategoriesPage() (+27 more)

### Community 18 - "fixtures.ts"
Cohesion: 0.13
Nodes (12): DBS_VALID, buildPopulated(), getScenario(), learnedCoffee(), assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser() (+4 more)

### Community 19 - "category-history-chart.tsx"
Cohesion: 0.27
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+3 more)

### Community 20 - "cn"
Cohesion: 0.10
Nodes (36): class-variance-authority, radix-ui, AppHeader(), AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+28 more)

### Community 21 - "app.tsx"
Cohesion: 0.22
Nodes (7): metadata, RootLayout(), viewport, App(), HarnessSection, sectionFromLocation(), root

### Community 22 - "snapshot-hash.ts"
Cohesion: 0.67
Nodes (3): digestSnapshot(), hashLegacySnapshot(), Snapshot

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
Cohesion: 0.11
Nodes (30): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+22 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.18
Nodes (9): bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput(), settledOverlayAlpha() (+1 more)

### Community 29 - "drive-sync.ts"
Cohesion: 0.35
Nodes (16): downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), uploadBackupFile(), hashSnapshot(), cycle() (+8 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.12
Nodes (24): desktopOnly, denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, statementRules(), attachSamplingFailure(), expectModalEntrance() (+16 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.29
Nodes (6): PREMATURE, routeReady, titles, fits(), patchRows(), statementRow()

### Community 32 - "amount-filter.tsx"
Cohesion: 0.17
Nodes (34): getBudgetAnalytics(), getCategoryData(), dexie-react-hooks, buildSeries(), PendingStatementConfirmationSheet(), RecordSearchSheet(), byRecordDay, RecordsSheet() (+26 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.28
Nodes (10): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components (+2 more)

### Community 34 - "test-data.ts"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData() (+9 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "app-sidebar.tsx"
Cohesion: 0.07
Nodes (56): Boot(), @vercel/analytics, @vercel/speed-insights, AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+48 more)

### Community 37 - "auto-sync.ts"
Cohesion: 0.13
Nodes (26): isDriveConfigured(), armPushTimer(), emit(), eventListeners, exclusive(), finishCycle(), flushOnHide(), idle() (+18 more)

### Community 38 - "utils.ts"
Cohesion: 0.17
Nodes (33): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+25 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 42 - "statement-rules.ts"
Cohesion: 0.22
Nodes (13): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+5 more)

### Community 43 - "ValidationError"
Cohesion: 0.19
Nodes (23): ensureAccount(), CategoryInput, checkReferences(), cleanInput(), createCategory(), updateCategory(), combine(), dbsDescriptionKey() (+15 more)

### Community 44 - "combobox.tsx"
Cohesion: 0.11
Nodes (25): ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+17 more)

### Community 45 - "budgets/[id]/page.tsx"
Cohesion: 0.20
Nodes (20): BudgetPage(), Legend(), Icon(), RecordOption(), PendingBadge(), pendingReason(), RecordActions(), RecordActionsCell() (+12 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "records.ts"
Cohesion: 0.14
Nodes (20): db, getMonthlyRecords(), MonthlyFilters, expandCategoryIds(), AllocationTally, pendingStatementIds(), tallyAllocations(), analyticsValues() (+12 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 53 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 54 - "Button"
Cohesion: 0.24
Nodes (14): BudgetState, NotFound(), react-day-picker, DateField(), Props, DateRange(), formatRange(), Props (+6 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "luxon"
Cohesion: 0.21
Nodes (13): MonthLayout(), luxon, react-dom, MonthHeaderPortal(), MonthHeaderSlot, MonthHeaderSlotProvider, MonthHeaderSlots, useMonthParams() (+5 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (40): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+32 more)

### Community 61 - "react"
Cohesion: 0.20
Nodes (17): RecordPage(), StatementPage(), react, AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), Delta (+9 more)

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

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "trend-chart.tsx"
Cohesion: 0.18
Nodes (16): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, ChartFrame(), ChartSize (+8 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "allocator/page.tsx"
Cohesion: 0.24
Nodes (26): AllocatorPage(), ScopeSelect(), RecordCreatorHost(), RecordFilters(), RecordsPage(), learnedSignals(), SettingsPage(), StatementsPage() (+18 more)

### Community 71 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

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

### Community 95 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

### Community 96 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 97 - "accounts/[id]/page.tsx"
Cohesion: 0.22
Nodes (16): AccountPage(), amountTone(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges(), StatementRow (+8 more)

### Community 98 - "IndexedDB (Dexie)"
Cohesion: 0.20
Nodes (8): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), String primary keys (not auto-increment), URL search params (filters and pagination), useLiveQuery

### Community 99 - "duplicates.ts"
Cohesion: 0.27
Nodes (11): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC, pairIds() (+3 more)

### Community 100 - "auto-sync.test.ts"
Cohesion: 0.18
Nodes (7): drive, listeners, nav, realDrive, realSync, timers, win

### Community 101 - "lucide-react"
Cohesion: 0.25
Nodes (7): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 614 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-creator.tsx`, `sync/page.tsx`, `primitives.tsx`, `command.tsx`, `paginated-data-table.tsx`, `PrimitivesSection`, `icon.tsx`, `category-history-chart.tsx`, `amount-filter.tsx`, `app-sidebar.tsx`, `utils.ts`, `combobox.tsx`, `budgets/[id]/page.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `Button`, `(month)/page.tsx`, `react`, `trend-chart.tsx`, `allocator/page.tsx`, `alert-dialog.tsx`, `accounts/[id]/page.tsx`, `lucide-react`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12955465587044535 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `record-creator.tsx`, `sync/page.tsx`, `primitives.tsx`, `command.tsx`, `paginated-data-table.tsx`, `PrimitivesSection`, `icon.tsx`, `category-history-chart.tsx`, `cn`, `app.tsx`, `package.json`, `amount-filter.tsx`, `app-sidebar.tsx`, `utils.ts`, `combobox.tsx`, `budgets/[id]/page.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `Button`, `luxon`, `(month)/page.tsx`, `trend-chart.tsx`, `allocator/page.tsx`, `alert-dialog.tsx`, `accounts/[id]/page.tsx`, `lucide-react`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `record-creator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0651383841207716 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `IndexedDB (Dexie)`, `app-sidebar.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05704365079365079 - nodes in this community are weakly interconnected._