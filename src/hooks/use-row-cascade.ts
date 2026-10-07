import { useEffect, useState } from "react"
import type { RowEntrance } from "@/lib/motion"

/** How long a cascade or refilter keeps rows that join in the same style before they just fade. */
const SETTLE_MS = 900

type State = { listKey: string; pageKey: string; entrance: RowEntrance }

/**
 * Decides how a table's rows enter, and a `rowsKey` that remounts them whenever they change.
 * - First data: `cascade`.
 * - Different rows on the same page (filtering, searching, deleting): `refilter`.
 * - A different page: `fade`, so paging stays quiet.
 * `listKey` identifies the displayed rows; `pageKey` the page they came from.
 */
export function useRowEntrance(loading: boolean, listKey: string, pageKey = "") {
	const [state, setState] = useState<State>({ listKey, pageKey, entrance: "cascade" })
	let { entrance } = state

	if (!loading && (state.listKey !== listKey || state.pageKey !== pageKey)) {
		const samePage = state.pageKey === pageKey
		const firstRows = state.listKey === "" && state.entrance === "cascade"
		entrance = !samePage ? "fade" : firstRows ? "cascade" : "refilter"
		setState({ listKey, pageKey, entrance })
	}

	useEffect(() => {
		if (loading || entrance === "fade") return
		const timer = setTimeout(
			() => setState(current => ({ ...current, entrance: "fade" })),
			SETTLE_MS,
		)
		return () => clearTimeout(timer)
	}, [loading, entrance, listKey])

	return { entrance, rowsKey: `${pageKey}|${listKey}` }
}
