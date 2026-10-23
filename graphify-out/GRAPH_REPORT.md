# Graph Report - t3-9755e75b  (2026-10-24)

## Corpus Check
- 239 files · ~209,002 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1915 nodes · 7330 edges · 94 communities (84 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 121 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8cfa423a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pending/page.tsx
- record-editor.tsx
- sidebar.tsx
- paginated-data-table.tsx
- ledger.e2e.ts
- cn
- dashboard.ts
- (month)/layout.tsx
- db.ts
- STYLE.md
- gate/sheets.e2e.ts
- compilerOptions
- @playwright/test
- Button
- combobox.tsx
- (month)/page.tsx
- dependencies
- records.ts
- suspicious
- package.json
- Separator
- test-web.ts
- correctness
- auto-sync.ts
- sync/page.tsx
- drive-sync.ts
- Project Shape
- records/[id]/page.tsx
- total-spending-chart.tsx
- Validator
- components.json
- google-drive.ts
- allocator/page.tsx
- motion/tables.e2e.ts
- test-data.ts
- gate/components.e2e.ts
- Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)
- app.tsx
- export-import.ts
- auth-vault.ts
- scripts
- Browser regression tests
- types.d.ts
- fixtures.ts
- formatter
- devDependencies
- pending.ts
- PaginationFooter
- utils.ts
- Commands
- Opus review: browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)
- Opus review: pending queue race fix (a364cb8 vs cf72d4c)
- biome.json
- rules
- AGENTS.md project instructions
- manifest.json
- workflows.e2e.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- spending-calendar.tsx
- Domain Language
- Project Graph
- formatter
- Commit Guide
- Records
- optionalDependencies
- tsconfig.web.json
- navigation.e2e.ts
- style
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
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- budgets/[id]/page.tsx
- category-filter.tsx
- duplicates.test.ts
- statements.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 119 edges
4. `react` - 94 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 49 edges
8. `RecordCreatorDialog()` - 47 edges
9. `round2()` - 46 edges
10. `next` - 41 edges

## Surprising Connections (you probably didn't know these)
- `2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS` --references--> `PageContent()`  [INFERRED]
  reviews/opus-pending-race-oct23.md → src/components/layout/page-content.tsx
- `1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`` --references--> `PaginationFooter()`  [INFERRED]
  reviews/opus-pending-race-oct23.md → src/components/table/pagination-footer.tsx
- `What to run` --references--> `SelectItem()`  [INFERRED]
  tests/web/README.md → src/components/ui/select.tsx
- `3. Sidebar hardening (d1ba358) — OBJECTION, Medium` --references--> `HistoryProvider()`  [INFERRED]
  reviews/opus-restructure-oct23.md → src/history.tsx
- `3. Sidebar hardening (d1ba358) — OBJECTION, Medium` --references--> `useIsMobile()`  [INFERRED]
  reviews/opus-restructure-oct23.md → src/hooks/use-mobile.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Motion frame-sampling assertions** — tests_web_support_motion_samplevisiblerowanimations, tests_web_support_motion_expectvisiblerowcascade, tests_web_support_motion_expectreducedrowmovement, tests_web_support_motion_expectpopupentrance [EXTRACTED 1.00]
- **Pending queue URL push race and repairs** — reviews_opus_pending_race_oct23_pushparams, reviews_opus_pending_race_oct23_latestparams_ref, reviews_opus_pending_race_oct23_debounced_commit, reviews_opus_pending_race_oct23_stale_forward_base, reviews_opus_pending_race_oct23_identical_url_skip [EXTRACTED 1.00]
- **Browser suite project/tag selection model** — tests_web_readme_projects_and_tags, agents_playwright_full_matrix, reviews_opus_restructure_oct23_project_tags, reviews_opus_restructure_oct23_full_matrix_env_delete, tests_web_readme_behaviour_ledger [INFERRED 0.85]

## Communities (94 total, 10 thin omitted)

### Community 0 - "pending/page.tsx"
Cohesion: 0.16
Nodes (39): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+31 more)

### Community 1 - "record-editor.tsx"
Cohesion: 0.07
Nodes (111): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog() (+103 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.06
Nodes (76): metadata, RootLayout(), viewport, ReviewLinks(), NotFound(), Boot(), Providers(), Template() (+68 more)

### Community 3 - "paginated-data-table.tsx"
Cohesion: 0.15
Nodes (32): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+24 more)

### Community 4 - "ledger.e2e.ts"
Cohesion: 0.05
Nodes (54): typescript, vite, @vitejs/plugin-react, 1. Restructure fidelity — PASS, 2. Gate integrity — PASS with notes, 3. Sidebar hardening (d1ba358) — OBJECTION, Medium, 4. Evidence audit — CONDITIONAL, Graph (+46 more)

### Community 5 - "cn"
Cohesion: 0.09
Nodes (63): radix-ui, AlertAction(), AlertDialogTrigger(), ChartLegendContent(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup() (+55 more)

### Community 6 - "dashboard.ts"
Cohesion: 0.17
Nodes (29): avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection(), buildSeries(), buildSpendingHistory() (+21 more)

### Community 7 - "(month)/layout.tsx"
Cohesion: 0.12
Nodes (30): BudgetState, MonthLayout(), luxon, react-day-picker, DateField(), Props, DateRange(), DateRangeValue (+22 more)

### Community 8 - "db.ts"
Cohesion: 0.11
Nodes (28): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION, DuplicateDismissalRow (+20 more)

### Community 9 - "STYLE.md"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 10 - "gate/sheets.e2e.ts"
Cohesion: 0.12
Nodes (21): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), editors, expectPointerCursor() (+13 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "@playwright/test"
Cohesion: 0.17
Nodes (12): @playwright/test, cardTitles, Child, october, september, card(), overview, overviewCharts (+4 more)

### Community 13 - "Button"
Cohesion: 0.26
Nodes (23): dexie-react-hooks, react, PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS (+15 more)

### Community 14 - "combobox.tsx"
Cohesion: 0.11
Nodes (25): @base-ui/react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+17 more)

### Community 15 - "(month)/page.tsx"
Cohesion: 0.08
Nodes (48): AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), formatBudgetDateWindow(), Comparison (+40 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "records.ts"
Cohesion: 0.13
Nodes (21): canUseMonthlyBudget(), AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly() (+13 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 20 - "Separator"
Cohesion: 0.21
Nodes (11): class-variance-authority, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), ItemSeparator() (+3 more)

### Community 21 - "test-web.ts"
Cohesion: 0.09
Nodes (35): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), flags, paths (+27 more)

### Community 22 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.15
Nodes (17): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), sameSnapshot(), set(), snapshot (+9 more)

### Community 24 - "sync/page.tsx"
Cohesion: 0.16
Nodes (24): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+16 more)

### Community 25 - "drive-sync.ts"
Cohesion: 0.26
Nodes (23): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+15 more)

### Community 26 - "Project Shape"
Cohesion: 0.14
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell, Pages take no props (+9 more)

### Community 27 - "records/[id]/page.tsx"
Cohesion: 0.17
Nodes (33): WeekdayCard(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), SettingsPage(), StatementPage() (+25 more)

### Community 28 - "total-spending-chart.tsx"
Cohesion: 0.07
Nodes (55): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart(), CashflowPoint (+47 more)

### Community 29 - "Validator"
Cohesion: 0.15
Nodes (30): updateAccount(), validateBudget(), cleanInput(), allocationOutcome(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), dismissedDuplicatePairs() (+22 more)

### Community 30 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 31 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 32 - "allocator/page.tsx"
Cohesion: 0.16
Nodes (40): AccountPage(), AllocatorPage(), ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters(), MonthlyRecordsPage() (+32 more)

### Community 33 - "motion/tables.e2e.ts"
Cohesion: 0.21
Nodes (15): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, Rendered assertions, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+7 more)

### Community 34 - "test-data.ts"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 35 - "gate/components.e2e.ts"
Cohesion: 0.14
Nodes (8): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), APP_URL, HARNESS_URL

### Community 36 - "Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)"
Cohesion: 0.11
Nodes (18): 1. Product fix — `app/allocator/pending/page.tsx`, 1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`, 1b. OBJECTION (Low–Medium): the identical-URL skip compares against the committed URL, not the last intent, 1c. PASS (Low note): `setCandidateQuery("")` per keystroke still allows one mid-typing push, 2. Test fixes, 2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS, 2b. `tests/web/navigation-motion.e2e.ts:123-130` — PASS (Low note), 2c. `tests/web/pending-search.e2e.ts:112-120` (mobile settled wait) — PASS with a Low note (+10 more)

### Community 37 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 38 - "export-import.ts"
Cohesion: 0.21
Nodes (16): db, downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+8 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 40 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, dev, lint, lint:check, start, test:web, test:web:full (+9 more)

### Community 41 - "Browser regression tests"
Cohesion: 0.14
Nodes (13): Gate integrity (UI-INVENTORY-PROJECTS, parser, ledger maps), Finpoint display harness page (TEST ONLY), Finpoint widget harness page (TEST ONLY), Test areas (routes, tables, editors, sheets, modals, navigation, keyboard, workflows, charts, components, helpers, ledger), Behaviour ledger (component-inventory.ts + gate/ledger.e2e.ts), Browser regression tests, Vite component harness (port 5174/5274), Fixtures (+5 more)

### Community 42 - "types.d.ts"
Cohesion: 0.13
Nodes (14): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+6 more)

### Community 43 - "fixtures.ts"
Cohesion: 0.17
Nodes (16): PREMATURE, routeReady, titles, getScenario(), IDS, assertSeeded(), checkSeededMarker(), countStore() (+8 more)

### Community 44 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 46 - "pending.ts"
Cohesion: 0.50
Nodes (3): AllocationRow, AllocationTally, tallyAllocations()

### Community 47 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 48 - "utils.ts"
Cohesion: 0.16
Nodes (17): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, AllocateBar(), Sparkline(), Delta, Metric() (+9 more)

### Community 49 - "Commands"
Cohesion: 0.22
Nodes (10): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands, Generated / Ignored Files (+2 more)

### Community 50 - "Opus review: browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)"
Cohesion: 0.24
Nodes (10): PLAYWRIGHT_FULL_MATRIX release run, Verification evidence audit (runtime not certified), 2a delete PLAYWRIGHT_FULL_MATRIX likely ineffective, Certification blocker: mobile Statements Back fallback failure, Project tag selection (@tall, @light, @desktop-only, @mobile-only), Restructure fidelity (362 listed, 749 full matrix), Opus review: browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358), 3d pre-effect tap writes desktop sidebar cookie (+2 more)

### Community 51 - "Opus review: pending queue race fix (a364cb8 vs cf72d4c)"
Cohesion: 0.25
Nodes (10): Single debounced queue commit, 1b pushParams identical-URL skip objection, latestParams ref as debounce base, pushParams (app/allocator/pending/page.tsx), Queue resurrection bug (pending_statement_id restored), Residual (b): dense cascade frame starvation on GPU-less hosts, Opus review: pending queue race fix (a364cb8 vs cf72d4c), 1a stale-forward latestParams objection (+2 more)

### Community 52 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 53 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 56 - "AGENTS.md project instructions"
Cohesion: 0.20
Nodes (10): Agent Behavior, AGENTS.md project instructions, bun test, Conventions, Domain and importer tests (Dexie with in-memory IndexedDB), Next.js breaking-changes notice, Verification, openMobileSidebar helper (file-local copies) (+2 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 60 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 61 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 63 - "Domain Language"
Cohesion: 0.29
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 64 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 65 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 66 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 67 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 68 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 69 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 71 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 72 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 73 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 76 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 77 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 78 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 80 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 81 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 82 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 83 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 84 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 85 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 86 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 94 - "budgets/[id]/page.tsx"
Cohesion: 0.13
Nodes (32): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), Icon(), MetricGrid(), amountTone(), formatRowTime() (+24 more)

### Community 97 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 98 - "duplicates.test.ts"
Cohesion: 0.14
Nodes (7): dexie, fake-indexeddb, FinpointDB, clearAllData(), digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 100 - "statements.ts"
Cohesion: 0.19
Nodes (20): countSuggestions(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+12 more)

## Knowledge Gaps
- **80 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 605 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@playwright/test` connect `@playwright/test` to `motion/tables.e2e.ts`, `gate/components.e2e.ts`, `ledger.e2e.ts`, `navigation.e2e.ts`, `gate/sheets.e2e.ts`, `fixtures.ts`, `package.json`, `workflows.e2e.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06680369989722508 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `pending/page.tsx`, `record-editor.tsx`, `allocator/page.tsx`, `category-filter.tsx`, `paginated-data-table.tsx`, `sidebar.tsx`, `(month)/layout.tsx`, `Button`, `combobox.tsx`, `(month)/page.tsx`, `utils.ts`, `PaginationFooter`, `Separator`, `sync/page.tsx`, `records/[id]/page.tsx`, `total-spending-chart.tsx`, `spending-calendar.tsx`, `budgets/[id]/page.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.058363858363858365 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `pending/page.tsx`, `record-editor.tsx`, `sidebar.tsx`, `paginated-data-table.tsx`, `cn`, `(month)/layout.tsx`, `combobox.tsx`, `(month)/page.tsx`, `package.json`, `Separator`, `auto-sync.ts`, `sync/page.tsx`, `records/[id]/page.tsx`, `total-spending-chart.tsx`, `allocator/page.tsx`, `app.tsx`, `PaginationFooter`, `utils.ts`, `budgets/[id]/page.tsx`, `category-filter.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Should `ledger.e2e.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05427547363031234 - nodes in this community are weakly interconnected._