# Drill-down opens as a peek or a page, never docked

The Drill-down used to dock beside the Dashboard at xl, narrowing the main column. Every open reflowed every card and the charts re-measured, which made the Dashboard hard to use on desktop (ticket 33). It now opens over the Dashboard, which never moves, in one of three Drill modes copied from Notion's "open as" switcher: side peek (480px sheet from the right, the default), centre peek (dialog up to 720px that scrolls inside) and full page.

Peeks are modal Radix dialogs over a dimmed Dashboard, so Escape and an outside click close them and focus is trapped. The URL grammar of ADR 0001 is unchanged: the full page is the route `/drill` carrying the same `drill`, `focus`, `month`, `year` and `scope` parameters, and a shared Dashboard link with `drill` opens in the viewer's preferred mode (a preference of full page replaces the entry with `/drill`). Switching mode uses `router.replace`, so it adds no history entry. Phones keep the bottom sheet for both peeks; the full page remains available there.

The preference is the `drill_mode` key of the `settings` table (`side`, `center`, `full`), read and written through `src/logic/settings.ts`. No schema change was needed. `replaceSettings` previously cleared the whole table; it now deletes only the filter-default keys, so importing or syncing synced settings does not reset this interface preference. The preference is not part of the exported or synced snapshot.

Leaving the Dashboard for the full page stores its scroll offset and the opener's label in `sessionStorage`; Back to Dashboard, Escape and browser Back restore both. Overlay modes restore focus as before.
