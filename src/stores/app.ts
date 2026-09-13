// Global client state (Zustand).
//
// Split of responsibilities:
// - `data/db.ts`        -> persisted state (IndexedDB, versioned migrations)
// - `logic/*`           -> domain operations (mirrors old Api controllers)
// - `stores/*` (here)   -> ephemeral global UI state (boot status, toasts state)
// - `components/pages`  -> UI only, reads via live queries + logic calls
//
// This is the Zustand-based answer to the old server session: small,
// explicit stores instead of one Redux boilerplate tree.

import { create } from "zustand"

type AppState = {
	ready: boolean
	error: string | null
	markReady: () => void
	setError: (error: string | null) => void
}

export const useAppStore = create<AppState>(set => ({
	ready: false,
	error: null,
	markReady: () => set({ ready: true, error: null }),
	setError: (error: string | null) => set({ error }),
}))
