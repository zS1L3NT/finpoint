import { useEffect, useState } from "react"
import type { RowEntrance } from "@/lib/motion"

/** How long a cascade or refilter keeps rows that join in the same style before they just fade. */
const SETTLE_MS = 900

type State = { listKey: string; pageKey: string; entrance: RowEntrance; rowsKey: string }

/** Whether `next` is `previous` with some ids removed and the rest in the same order. */
export function isPureRemoval(previous: string, next: string) {
	const kept = next === "" ? [] : next.split("|")
	const before = previous === "" ? [] : previous.split("|")
	let cursor = 0
	for (const id of before) if (id === kept[cursor]) cursor++
	return cursor === kept.length
}

/**
 * Decides how a table's rows enter, and a `rowsKey` that remounts them whenever they change.
 * - First data: `cascade`.
 * - Different rows on the same page (filtering, searching, deleting): `refilter`.
 * - A different page: `fade`, so paging stays quiet.
 * - Rows only removed from the same page: the rows left keep their `rowsKey`, so they stay put.
 * `listKey` identifies the displayed rows; `pageKey` the page they came from.
 */
export function useRowEntrance(loading: boolean, listKey: string, pageKey = "") {
	const [state, setState] = useState<State>({
		listKey,
		pageKey,
		entrance: "cascade",
		rowsKey: `${pageKey}|${listKey}`,
	})
	let { entrance, rowsKey } = state

	if (!loading && (state.listKey !== listKey || state.pageKey !== pageKey)) {
		const samePage = state.pageKey === pageKey
		const firstRows = state.listKey === "" && state.entrance === "cascade"
		if (samePage && !firstRows && isPureRemoval(state.listKey, listKey)) {
			entrance = "fade"
		} else {
			entrance = !samePage ? "fade" : firstRows ? "cascade" : "refilter"
			rowsKey = `${pageKey}|${listKey}`
		}
		setState({ listKey, pageKey, entrance, rowsKey })
	}

	useEffect(() => {
		if (loading || entrance === "fade") return
		const timer = setTimeout(
			() => setState(current => ({ ...current, entrance: "fade" })),
			SETTLE_MS,
		)
		return () => clearTimeout(timer)
	}, [loading, entrance, listKey])

	return { entrance, rowsKey }
}
