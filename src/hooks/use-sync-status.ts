import { useSyncExternalStore } from "react"
import { getSyncSnapshot, type SyncSnapshot, subscribeSync } from "@/logic/auto-sync"

export function useSyncStatus(): SyncSnapshot {
	return useSyncExternalStore(subscribeSync, getSyncSnapshot, getSyncSnapshot)
}
