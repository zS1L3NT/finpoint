"use client"

// A dialog saves or deletes once per opening: the lock is taken when an operation starts,
// kept after it succeeds (the dialog is closing) and released on failure or when the dialog
// opens again. The ref blocks a second call in the same tick; `locked` drives the buttons.

import { useCallback, useEffect, useRef, useState } from "react"

export function useSubmitLock(isOpen: boolean) {
	const held = useRef(false)
	const [locked, setLocked] = useState(false)

	useEffect(() => {
		if (!isOpen) return
		held.current = false
		setLocked(false)
	}, [isOpen])

	/** Runs the operation unless one is in flight; it returns whether it succeeded. */
	const run = useCallback(async (operation: () => Promise<boolean>) => {
		if (held.current) return
		held.current = true
		setLocked(true)
		let succeeded = false
		try {
			succeeded = await operation()
		} finally {
			if (!succeeded) {
				held.current = false
				setLocked(false)
			}
		}
	}, [])

	return { locked, run }
}
