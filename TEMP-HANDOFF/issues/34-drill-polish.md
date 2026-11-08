> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 34 Drill-down hover, press and focus polish

Status: resolved
Blocked by: 33
Spec: ../spec.md §6

## Why
User: "the drill down is not very polished. the hover and what not is all bad."

## What
Run /apple-design + /emil-design-eng rules over src/components/drill/*: consistent row hover/press/focus-visible states across every row type (Record, Statement, group header, comparison, budget), one radius, rows inset so hover backgrounds don't touch the edges, clickable vs static rows visually distinct (chevron/cursor only when it does something), header controls (close, mode switcher, back) as proper icon buttons with tooltips and hit areas ≥ 32px, no layout shift on hover, expand/collapse animated with motion presets. Dark and light.

## Acceptance
- [ ] Before/after screenshots of each row type, hover + focus, desktop and mobile, dark.
- [ ] No hover state on non-interactive rows.

## Comments
- Commit d89cabf. Rows (Record, comparison, expanded Statement rows) are inset with `-mx` so hover fills clear the text, share the theme `rounded-lg` radius (10px), have press and `focus-visible` ring states; group headers and summary text have no hover; Allocation rows gained a chevron since they navigate; expansion now animates closed as well as open. Header controls were already 32px icon buttons with tooltips (ticket 33).
- New e2e "drill rows: only clickable rows react..." green on desktop and mobile (6 repeats, no flake). Core drilldown all green.
- Screenshots (after only; the 33-*.png set is the before): review/34-record-row-hover-desktop-dark.png, 34-record-row-focus-desktop-dark.png, 34-expanded-statement-row-hover-desktop-dark.png, 34-expanded-row-mobile-dark.png.
- Look for: hover fill not touching the row text or panel edge, focus ring shape, collapse animation.
