import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { subscribeSyncEvents } from "@/logic/auto-sync"

/** Toasts background sync events; manual actions keep their own toasts. */
export function useSyncToasts(): void {
	const lastKey = useRef<string | null>(null)
	useEffect(
		() =>
			subscribeSyncEvents(event => {
				if (event.key === lastKey.current) return
				lastKey.current = event.key
				if (event.detail) toast.warning(event.title, { description: event.detail })
				else toast.success(event.title)
			}),
		[],
	)
}
