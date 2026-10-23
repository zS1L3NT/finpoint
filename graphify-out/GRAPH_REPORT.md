# Graph Report - t3-9755e75b  (2026-10-23)

## Corpus Check
- 238 files · ~207,422 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1902 nodes · 7300 edges · 102 communities (94 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 120 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1383f7e8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- budgets/[id]/page.tsx
- record-editor.tsx
- providers.tsx
- budgets/page.tsx
- ledger.e2e.ts
- primitives.tsx
- dashboard.ts
- lucide-react
- data.ts
- STYLE.md
- gate/sheets.e2e.ts
- compilerOptions
- @playwright/test
- utils.ts
- cn
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
- duplicates/page.tsx
- daily-spending-chart.tsx
- Validator
- components.json
- ValidationError
- allocator/page.tsx
- motion/tables.e2e.ts
- test-data.ts
- gate/components.e2e.ts
- Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)
- cashflow-chart.tsx
- export-import.ts
- auth-vault.ts
- scripts
- Browser regression tests
- types.d.ts
- gate/routes.e2e.ts
- formatter
- devDependencies
- category-history-chart.tsx
- PaginationFooter
- google-drive.ts
- Commands
- Opus review: browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358)
- Opus review: pending queue race fix (a364cb8 vs cf72d4c)
- biome.json
- rules
- icon.tsx
- sidebar.tsx
- AGENTS.md project instructions
- manifest.json
- fixtures.ts
- total-spending-chart.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- spending-calendar.tsx
- history.tsx
- Domain Language
- Project Graph
- formatter
- Commit Guide
- Records
- optionalDependencies
- tsconfig.web.json
- tests_web_support_fixtures_expect
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
- record-columns.tsx
- Button
- routes.ts
- next
- db.ts
- duplicates.test.ts
- shared.ts
- monthly-budget-usage.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 119 edges
4. `react` - 93 edges
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
- `1. Restructure fidelity — PASS` --references--> `unwrap()`  [INFERRED]
  reviews/opus-restructure-oct23.md → tests/web/gate/ledger.e2e.ts
- `3. Sidebar hardening (d1ba358) — OBJECTION, Medium` --references--> `HistoryProvider()`  [INFERRED]
  reviews/opus-restructure-oct23.md → src/history.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Motion frame-sampling assertions** — tests_web_support_motion_samplevisiblerowanimations, tests_web_support_motion_expectvisiblerowcascade, tests_web_support_motion_expectreducedrowmovement, tests_web_support_motion_expectpopupentrance [EXTRACTED 1.00]
- **Pending queue URL push race and repairs** — reviews_opus_pending_race_oct23_pushparams, reviews_opus_pending_race_oct23_latestparams_ref, reviews_opus_pending_race_oct23_debounced_commit, reviews_opus_pending_race_oct23_stale_forward_base, reviews_opus_pending_race_oct23_identical_url_skip [EXTRACTED 1.00]
- **Browser suite project/tag selection model** — tests_web_readme_projects_and_tags, agents_playwright_full_matrix, reviews_opus_restructure_oct23_project_tags, reviews_opus_restructure_oct23_full_matrix_env_delete, tests_web_readme_behaviour_ledger [INFERRED 0.85]

## Communities (102 total, 8 thin omitted)

### Community 0 - "budgets/[id]/page.tsx"
Cohesion: 0.16
Nodes (37): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step() (+29 more)

### Community 1 - "record-editor.tsx"
Cohesion: 0.06
Nodes (113): AllocatorPendingPage(), CandidatePage, CandidateResults(), countSuggestions(), PendingCard(), @base-ui/react, react, react-day-picker (+105 more)

### Community 2 - "providers.tsx"
Cohesion: 0.14
Nodes (24): metadata, RootLayout(), viewport, Boot(), Providers(), SidebarInset(), SidebarProvider(), Toaster() (+16 more)

### Community 3 - "budgets/page.tsx"
Cohesion: 0.13
Nodes (38): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, @tanstack/react-table, DataTable() (+30 more)

### Community 4 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, 2. Gate integrity — PASS with notes, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry (+38 more)

### Community 5 - "primitives.tsx"
Cohesion: 0.09
Nodes (47): AlertAction(), AlertDialogTrigger(), ComboboxCollection(), ComboboxValue(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup() (+39 more)

### Community 6 - "dashboard.ts"
Cohesion: 0.17
Nodes (29): contribution(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildProjection(), buildSeries(), buildSpendingHistory() (+21 more)

### Community 7 - "lucide-react"
Cohesion: 0.29
Nodes (7): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 8 - "data.ts"
Cohesion: 0.17
Nodes (17): AccountRow, BudgetRow, DuplicateDismissalRow, buildDense(), buildEmpty(), buildPopulated(), cycle(), DEFAULT_SETTINGS (+9 more)

### Community 9 - "STYLE.md"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 10 - "gate/sheets.e2e.ts"
Cohesion: 0.12
Nodes (21): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), editors, expectPointerCursor() (+13 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "@playwright/test"
Cohesion: 0.17
Nodes (12): @playwright/test, cardTitles, Child, october, september, card(), overview, overviewCharts (+4 more)

### Community 13 - "utils.ts"
Cohesion: 0.19
Nodes (31): AllocateBar(), CategorySpendingMix(), Amount(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet() (+23 more)

### Community 14 - "cn"
Cohesion: 0.14
Nodes (33): CategoryFilter(), CategoryFilterItem(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty() (+25 more)

### Community 15 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (41): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, deltaOf() (+33 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "records.ts"
Cohesion: 0.15
Nodes (19): AllocationRow, AllocationTally, pendingStatementIds(), tallyAllocations(), analyticsValues(), budgetCovers(), ConflictError, createRecord() (+11 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 20 - "Separator"
Cohesion: 0.17
Nodes (13): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+5 more)

### Community 21 - "test-web.ts"
Cohesion: 0.13
Nodes (23): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), flags, paths (+15 more)

### Community 22 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.11
Nodes (26): useSyncStatus(), useSyncToasts(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult() (+18 more)

### Community 24 - "sync/page.tsx"
Cohesion: 0.17
Nodes (22): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+14 more)

### Community 25 - "drive-sync.ts"
Cohesion: 0.35
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 26 - "Project Shape"
Cohesion: 0.14
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell, Pages take no props (+9 more)

### Community 27 - "duplicates/page.tsx"
Cohesion: 0.11
Nodes (39): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, DuplicateReviewDialog(), StatementTile() (+31 more)

### Community 28 - "daily-spending-chart.tsx"
Cohesion: 0.15
Nodes (25): BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CHART_INTRO_MS, useChartIntro(), DailySpendingChart() (+17 more)

### Community 29 - "Validator"
Cohesion: 0.34
Nodes (12): updateAccount(), validateBudget(), cleanInput(), createMonthlyBudget(), setMonthlyBudgetAmount(), updateMonthlyBudget(), upsertMonthlyBudget(), validateAmount() (+4 more)

### Community 30 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 31 - "ValidationError"
Cohesion: 0.25
Nodes (20): asPending(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+12 more)

### Community 32 - "allocator/page.tsx"
Cohesion: 0.14
Nodes (33): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), RecordsPage(), StatementsPage(), dexie-react-hooks (+25 more)

### Community 33 - "motion/tables.e2e.ts"
Cohesion: 0.21
Nodes (15): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, Rendered assertions, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+7 more)

### Community 34 - "test-data.ts"
Cohesion: 0.15
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, seedIfEmpty(), BANK_BLURB, between(), CATEGORIES (+10 more)

### Community 35 - "gate/components.e2e.ts"
Cohesion: 0.15
Nodes (8): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), APP_URL, HARNESS_URL

### Community 36 - "Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)"
Cohesion: 0.11
Nodes (18): 1. Product fix — `app/allocator/pending/page.tsx`, 1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`, 1b. OBJECTION (Low–Medium): the identical-URL skip compares against the committed URL, not the last intent, 1c. PASS (Low note): `setCandidateQuery("")` per keystroke still allows one mid-typing push, 2. Test fixes, 2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS, 2b. `tests/web/navigation-motion.e2e.ts:123-130` — PASS (Low note), 2c. `tests/web/pending-search.e2e.ts:112-120` (mobile settled wait) — PASS with a Low note (+10 more)

### Community 37 - "cashflow-chart.tsx"
Cohesion: 0.31
Nodes (9): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+1 more)

### Community 38 - "export-import.ts"
Cohesion: 0.19
Nodes (17): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+9 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, dev, lint, lint:check, start, test:web, test:web:full (+9 more)

### Community 41 - "Browser regression tests"
Cohesion: 0.14
Nodes (13): Gate integrity (UI-INVENTORY-PROJECTS, parser, ledger maps), Finpoint display harness page (TEST ONLY), Finpoint widget harness page (TEST ONLY), Test areas (routes, tables, editors, sheets, modals, navigation, keyboard, workflows, charts, components, helpers, ledger), Behaviour ledger (component-inventory.ts + gate/ledger.e2e.ts), Browser regression tests, Vite component harness (port 5174/5274), Fixtures (+5 more)

### Community 42 - "types.d.ts"
Cohesion: 0.13
Nodes (14): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+6 more)

### Community 43 - "gate/routes.e2e.ts"
Cohesion: 0.29
Nodes (6): PREMATURE, routeReady, titles, fits(), patchRows(), statementRow()

### Community 44 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 46 - "category-history-chart.tsx"
Cohesion: 0.22
Nodes (12): recharts, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths() (+4 more)

### Community 47 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 48 - "google-drive.ts"
Cohesion: 0.27
Nodes (11): AuthNeededError, cacheToken(), CodeResponse, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId(), hasFreshDriveToken() (+3 more)

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

### Community 54 - "icon.tsx"
Cohesion: 0.17
Nodes (22): RecordPage(), Sparkline(), DetailSummary(), DetailSummaryItem(), DynamicUiIcon(), Icon(), ICON_NAMES, iconNameSet (+14 more)

### Community 55 - "sidebar.tsx"
Cohesion: 0.11
Nodes (34): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), Sidebar() (+26 more)

### Community 56 - "AGENTS.md project instructions"
Cohesion: 0.20
Nodes (10): Agent Behavior, AGENTS.md project instructions, bun test, Conventions, Domain and importer tests (Dexie with in-memory IndexedDB), Next.js breaking-changes notice, Verification, openMobileSidebar helper (file-local copies) (+2 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "fixtures.ts"
Cohesion: 0.13
Nodes (10): DBS_VALID, WorkspaceDataset, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace(), STORE_NAMES (+2 more)

### Community 59 - "total-spending-chart.tsx"
Cohesion: 0.36
Nodes (8): LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart(), CashflowHistoryMonth

### Community 60 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 61 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 62 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

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

### Community 70 - "tests_web_support_fixtures_expect"
Cohesion: 0.14
Nodes (10): 1. Restructure fidelity — PASS, 3. Sidebar hardening (d1ba358) — OBJECTION, Medium, 4. Evidence audit — CONDITIONAL, Graph, Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358), Required follow-ups (in order), Summary table, expectBackAboveHeadingFromKeyboardNavigation() (+2 more)

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

### Community 94 - "record-columns.tsx"
Cohesion: 0.14
Nodes (26): ReviewLinks(), MonthlyRecordsPage(), CategoryMovers(), Mover, amountTone(), formatRowTime(), PendingBadge(), pendingReason() (+18 more)

### Community 95 - "Button"
Cohesion: 0.18
Nodes (20): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, RecordCreatorHost(), CategoryDialog(), CategoryFormValues, EMPTY_FORM_VALUES (+12 more)

### Community 96 - "routes.ts"
Cohesion: 0.22
Nodes (17): TITLES, WorkflowTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), getSettings(), pathAccounts(), pathAllocator() (+9 more)

### Community 97 - "next"
Cohesion: 0.23
Nodes (13): MonthLayout(), NotFound(), Template(), nextConfig, luxon, next, ShellHeader(), SearchInit (+5 more)

### Community 98 - "db.ts"
Cohesion: 0.12
Nodes (16): AnalyticsMonthRow, BudgetRecordRow, CategoryRow, DB_NAME, DB_VERSION, MetaRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow (+8 more)

### Community 99 - "duplicates.test.ts"
Cohesion: 0.14
Nodes (7): dexie, fake-indexeddb, FinpointDB, StatementRow, digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 100 - "shared.ts"
Cohesion: 0.24
Nodes (9): db, AnalyticsRecord, AnalyticsSummary, summarize(), getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), fromCents() (+1 more)

### Community 101 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

## Knowledge Gaps
- **80 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 600 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@playwright/test` connect `@playwright/test` to `motion/tables.e2e.ts`, `gate/components.e2e.ts`, `ledger.e2e.ts`, `tests_web_support_fixtures_expect`, `gate/sheets.e2e.ts`, `gate/routes.e2e.ts`, `package.json`, `fixtures.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06308724832214765 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `budgets/[id]/page.tsx`, `record-editor.tsx`, `providers.tsx`, `budgets/page.tsx`, `primitives.tsx`, `lucide-react`, `utils.ts`, `(month)/page.tsx`, `Separator`, `sync/page.tsx`, `duplicates/page.tsx`, `daily-spending-chart.tsx`, `allocator/page.tsx`, `PaginationFooter`, `icon.tsx`, `sidebar.tsx`, `total-spending-chart.tsx`, `spending-calendar.tsx`, `record-columns.tsx`, `Button`, `routes.ts`, `next`, `monthly-budget-usage.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `providers.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `react` connect `record-editor.tsx` to `budgets/[id]/page.tsx`, `providers.tsx`, `budgets/page.tsx`, `primitives.tsx`, `lucide-react`, `utils.ts`, `cn`, `(month)/page.tsx`, `package.json`, `Separator`, `auto-sync.ts`, `sync/page.tsx`, `duplicates/page.tsx`, `daily-spending-chart.tsx`, `allocator/page.tsx`, `PaginationFooter`, `icon.tsx`, `sidebar.tsx`, `total-spending-chart.tsx`, `history.tsx`, `record-columns.tsx`, `Button`, `routes.ts`, `next`, `monthly-budget-usage.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `budgets/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12979591836734694 - nodes in this community are weakly interconnected._