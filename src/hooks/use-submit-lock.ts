"use client"

// A dialog saves or deletes once per opening: the lock is taken when an operation starts,
// kept after it succeeds (the dialog is closing) and released on failure or when the dialog
// opens again. An operation still running when the dialog reopens keeps the lock until it
// ends. The refs block a second call in the same tick; `locked` drives the buttons.

import { useCallback, useEffect, useRef, useState } from "react"

export function useSubmitLock(isOpen: boolean) {
	const running = useRef(false)
	const done = useRef(false)
	const [locked, setLocked] = useState(false)

	useEffect(() => {
		if (!isOpen) return
		done.current = false
		setLocked(running.current)
	}, [isOpen])

	/** Runs the operation unless one is in flight; it returns whether it succeeded. */
	const run = useCallback(async (operation: () => Promise<boolean>) => {
		if (running.current || done.current) return
		running.current = true
		setLocked(true)
		try {
			done.current = await operation()
		} finally {
			running.current = false
			setLocked(done.current)
		}
	}, [])

	return { locked, run }
}
