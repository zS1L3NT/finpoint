> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 43 Unslop pass: 20 rules from the user's reference reel

Status: on-hold (user: wait until the current design is approved)
Blocked by: 42
Source: user's reel "20 Ways to Unslop AI Designs" (@charles.unemployed), frames at TEMP-HANDOFF/reel/sheet01.jpg and sheet02.jpg

## Rules, applied to Finpoint (Dashboard, drill-down, Records, Statements, Allocate, Budgets, Settings; dark + light; 1440 + 390)
1. Delete filler badges: drop any badge that repeats what the text or position already says (e.g. "All budgets" scope chips on every card when the page-level scope already says it; "Daily/Recurring" chips where the colour dot is enough).
2. Drop redundant labels: no label restating the heading or the value ("Nov 2026 · selected month" under "Categories this month").
3. No random italic/bold/Title Case words for emphasis.
4. Monospace only for numbers that need alignment, nowhere else.
5. One design system: tokens only (no stray hex/arbitrary values), one radius scale, one shadow scale.
6. Show the actual product: empty states and onboarding show a real preview of what will appear, not abstract icons.
7. Enlarge the main feature: each page's primary number or answer is clearly the biggest thing (headline sentence, drill total).
8. Group with spacing before borders/cards: remove nested borders where spacing groups the content.
9. Specific headlines: card titles say what they answer ("Where your money went", not "Categories").
10. Emphasise the main action per screen: one primary button; the rest secondary or ghost.
11. One accent colour, used only for interactive/primary things; category colours stay as data colours.
12. Consistent icons: one set (lucide), one stroke width, one size per context.
13. Remove embellishments: no decorative gradients, glows or underline squiggles.
14. Inner radius = outer radius − padding for nested rounded elements (cards in cards, buttons in pills, the filter reset ✕, segmented controls).
15. Text contrast: secondary text meets WCAG AA (4.5:1) in both themes. Measure it.
16. Wrap headlines properly: `text-wrap: balance` on headings, `pretty` on paragraphs, and no orphans.
17. Align by eye, not by pixels: optical alignment for icons next to text, play/chevron glyphs, and numbers.
18. Tabular numbers on every amount, count and date column (`tabular-nums`).
19. Loading states: N/A. AGENTS.md forbids loaders and skeletons for local reads. Only Drive sync and import may show progress. Check those two have one.
20. Animate useful feedback: confirm actions (save, allocate, filter reset, copy) with a short motion from src/lib/motion.ts; no decorative motion.

## Deliverable
A table in ## Comments, one row for each rule: where it was violated, what changed, and before/after screenshot paths. Rule 19's N/A goes in that table with its reason. Copy changes follow ticket 42's plain-words style. Edit only tests whose behaviour changed, and name each one. The whole tests/core suite must be green on a production build.
