"use client"

// Seeds form state during render (no effect, so no flash of stale values): `seed` runs when
// `key` changes to a non-null value, and not when it becomes null (the dialog closing).

import { useState } from "react"

export function useSeed(key: string | null, seed: () => void) {
	const [seeded, setSeeded] = useState<string | null>(null)
	if (key !== seeded) {
		setSeeded(key)
		if (key !== null) seed()
	}
}
