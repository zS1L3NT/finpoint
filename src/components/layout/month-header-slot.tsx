"use client"

import { createContext, useContext } from "react"
import { createPortal } from "react-dom"

const MonthHeaderSlot = createContext<HTMLElement | null>(null)

export const MonthHeaderSlotProvider = MonthHeaderSlot.Provider

/** Renders page-owned controls beside the month navigation in the persistent month header. */
export function MonthHeaderControls({ children }: { children: React.ReactNode }) {
	const slot = useContext(MonthHeaderSlot)
	return slot ? createPortal(children, slot) : null
}
