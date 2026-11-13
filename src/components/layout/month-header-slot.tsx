"use client"

import { createContext, useContext } from "react"
import { createPortal } from "react-dom"

export type MonthHeaderSlots = { status: HTMLElement | null; controls: HTMLElement | null }

const MonthHeaderSlot = createContext<MonthHeaderSlots>({ status: null, controls: null })

export const MonthHeaderSlotProvider = MonthHeaderSlot.Provider

/**
 * Renders page-owned content into the persistent month header: `status` sits under the month
 * subtitle, `controls` beside the month navigation.
 */
export function MonthHeaderPortal({
	slot,
	children,
}: {
	slot: keyof MonthHeaderSlots
	children: React.ReactNode
}) {
	const element = useContext(MonthHeaderSlot)[slot]
	return element ? createPortal(children, element) : null
}
