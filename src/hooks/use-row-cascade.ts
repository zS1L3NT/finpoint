import { useEffect, useState } from "react"

/**
 * True for the first moments after a table's data arrives, so its on-screen rows cascade in
 * together. Afterwards rows that join (paging, filtering) use the calmer fade instead.
 */
export function useRowCascade(loading = false): boolean {
	const [cascade, setCascade] = useState(true)

	useEffect(() => {
		if (loading) {
			setCascade(true)
			return
		}
		const timer = setTimeout(() => setCascade(false), 900)
		return () => clearTimeout(timer)
	}, [loading])

	return cascade
}
