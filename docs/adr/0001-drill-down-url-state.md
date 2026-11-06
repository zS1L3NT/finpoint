# Drill-down URL state

The Drill-down explains a Dashboard number while preserving the month, year, scope and scroll position. Store its selection in the `drill` search parameter rather than component state so links survive reloads and browser Back restores the previous selection. Each selection and explicit close uses `router.push` with `scroll: false`; Back after opening closes the panel. Invalid selections render no panel and produce no error.

The shipped grammar is `day:YYYY-MM-DD`, `category:<id>[:YYYY-MM]`, `budget:<id>[:YYYY-MM]`, and `month:YYYY-MM`. Category selections may contain comma-separated IDs. Month and year describe the Dashboard; an optional selection month describes the drill's period without changing that Dashboard context. Keep the existing `scope` parameter. Opening or closing clears `focus`; Record expansion and Statement pivot currently remain local state. The planned `focus=record:<id>` / `focus=statement:<id>` contract and further selection kinds belong to later tickets, not this implementation.

At xl the panel docks at 420px and the main column narrows with the shared smooth spring. Below xl it uses a bottom sheet. Closing restores focus to the opener without scrolling; selecting another mark reuses the panel. Component state alone would lose shareable context, while navigating to Records would remove the chart that supplied the question.
