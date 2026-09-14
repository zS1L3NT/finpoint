import { useState } from "react"

function readStored(key: string, initial: string): string {
	try {
		return window.localStorage.getItem(key) ?? initial
	} catch {
		return initial
	}
}

/** useState persisted to localStorage. Never exported — see data layer. */
export function usePersistentState(
	key: string,
	initial: string,
): [string, (value: string) => void] {
	const [value, setValue] = useState(() => readStored(key, initial))

	const set = (next: string) => {
		setValue(next)
		window.localStorage.setItem(key, next)
	}

	return [value, set]
}
