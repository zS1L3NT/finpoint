import { useRouter } from "next/navigation"
import { useHistory } from "@/history"

/** Row click handler that opens a detail page and remembers where to come back to. */
export function useOpenRow<TRow extends { id: string }>(
	path: (id: string) => string,
	pageName?: string,
) {
	const router = useRouter()
	const { handlePush } = useHistory()
	return (row: TRow) => {
		if (pageName) handlePush(pageName)()
		router.push(path(row.id))
	}
}
