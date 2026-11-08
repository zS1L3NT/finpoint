"use client"
import { DateTime } from "luxon"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { SELECTION_KINDS, type Selection } from "@/logic/drilldown"
import { pathDashboard, pathDrill } from "@/routes"

/** Where the Dashboard was when a drill left it for the full page, so Back can put it there. */
const RETURN_KEY = "finpoint:drill-return"
const RESTORABLE = 'button, a[href], [role="application"]'
const labelOf = (element: Element) =>
	element.getAttribute("aria-label") ?? element.textContent?.trim().slice(0, 80) ?? ""

type DrillReturn = { y: number; label: string; index: number; returning?: boolean }

function readReturn(): DrillReturn | null {
	try {
		return JSON.parse(sessionStorage.getItem(RETURN_KEY) ?? "null")
	} catch {
		return null
	}
}

function writeReturn(value: DrillReturn | null) {
	try {
		if (value) sessionStorage.setItem(RETURN_KEY, JSON.stringify(value))
		else sessionStorage.removeItem(RETURN_KEY)
	} catch {
		// Storage can be blocked; Back then lands at the top.
	}
}

export function useDrill() {
	const router = useRouter()
	const pathname = usePathname()
	const params = useSearchParams()
	const trigger = useRef<HTMLElement | null>(null)
	const wasOpen = useRef(false)
	const page = pathname === pathDrill()
	const base = page ? pathDrill : pathDashboard
	const [kind, value = "", at, extra] = (params.get("drill") ?? "").split(":")
	const focus = params.get("focus")
	const validFocus = focus === null || /^(record|statement):[^:]+$/.test(focus)
	const selection: Selection | null =
		validFocus &&
		(value || kind === "largest") &&
		(kind !== "metric" || ["spent", "income", "leftover", "saved"].includes(value)) &&
		extra === undefined &&
		(SELECTION_KINDS as readonly string[]).includes(kind ?? "") &&
		(at === undefined || (/^\d{4}-\d{2}$/.test(at) && DateTime.fromISO(`${at}-01`).isValid)) &&
		(kind !== "month" ||
			(/^\d{4}-\d{2}$/.test(value) && DateTime.fromISO(`${value}-01`).isValid)) &&
		(kind !== "day" ||
			(at === undefined &&
				/^\d{4}-\d{2}-\d{2}$/.test(value) &&
				DateTime.fromISO(value).isValid))
			? { kind: kind as Selection["kind"], value: value ?? "", at }
			: null
	useEffect(() => {
		if (!selection && wasOpen.current && !page) {
			writeReturn(null)
			requestAnimationFrame(() => {
				if (
					document.activeElement === document.body ||
					document.activeElement?.closest(
						'[aria-labelledby="drill-title"], [data-slot="sheet-content"]',
					)
				)
					trigger.current?.focus({ preventScroll: true })
			})
		}
		wasOpen.current = !!selection
	}, [!!selection])
	// Back from the full page: put the Dashboard at its old scroll and focus the opener. The
	// Dashboard fills in section by section, so keep nudging until it is tall enough.
	useEffect(() => {
		if (page || selection) return
		const saved = readReturn()
		writeReturn(null)
		if (!saved?.returning) return
		const until = performance.now() + 2000
		let frame = 0
		const restore = () => {
			window.scrollTo({ top: saved.y, behavior: "instant" })
			const opener = [...document.querySelectorAll(RESTORABLE)].filter(
				element => labelOf(element) === saved.label,
			)[saved.index]
			if (
				(Math.abs(window.scrollY - saved.y) < 2 && (opener || saved.index < 0)) ||
				performance.now() > until
			) {
				if (opener instanceof HTMLElement) opener.focus({ preventScroll: true })
				return
			}
			frame = requestAnimationFrame(restore)
		}
		frame = requestAnimationFrame(restore)
		return () => cancelAnimationFrame(frame)
	}, [page, !!selection])
	// Leaving the full page for the Dashboard by any route (its Back button, Escape, the browser's
	// Back) means returning: the location has already changed when this cleanup runs.
	useEffect(() => {
		if (!page) return
		return () => {
			const saved = readReturn()
			if (saved && window.location.pathname === pathDashboard())
				writeReturn({ ...saved, returning: true })
		}
	}, [page])
	const current = () => Object.fromEntries(params)
	const href = (s: Selection) =>
		base({
			...current(),
			drill: [s.kind, s.value, s.at].filter(Boolean).join(":"),
			focus: undefined,
		})
	const open = (s: Selection) => {
		const element = document.activeElement
		trigger.current = element as HTMLElement
		if (!page && element instanceof HTMLElement && element !== document.body) {
			const label = labelOf(element)
			writeReturn({
				y: window.scrollY,
				label,
				index: [...document.querySelectorAll(RESTORABLE)]
					.filter(item => labelOf(item) === label)
					.indexOf(element),
			})
		}
		router.push(
			selection?.kind === s.kind && selection.value === s.value && selection.at === s.at
				? base({ ...current(), drill: undefined, focus: undefined })
				: href(s),
			{ scroll: false },
		)
	}
	const close = () => {
		router.push(pathDashboard({ ...current(), drill: undefined, focus: undefined }), {
			scroll: false,
		})
	}
	const pivot = (focus: string | null) => {
		router.push(base({ ...current(), focus: focus ?? undefined }), { scroll: false })
	}
	/** Moves the open drill between the Dashboard overlay and the full page without a new history entry. */
	const place = (full: boolean) => {
		if (full === page) return
		router.replace((full ? pathDrill : pathDashboard)(current()), { scroll: false })
	}
	return { selection, focus, page, pivot, open, close, href, place }
}
