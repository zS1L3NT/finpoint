"use client"
import { DateTime } from "luxon"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import type { Selection } from "@/logic/drilldown"
import { pathDashboard } from "@/routes"
export function useDrill() {
	const router = useRouter()
	const params = useSearchParams()
	const trigger = useRef<HTMLElement | null>(null)
	const wasOpen = useRef(false)
	const [kind, value, at, extra] = (params.get("drill") ?? "").split(":")
	const focus = params.get("focus")
	const validFocus = focus === null || /^(record|statement):[^:]+$/.test(focus)
	const selection: Selection | null =
		validFocus &&
		value &&
		extra === undefined &&
		["day", "category", "month", "budget"].includes(kind ?? "") &&
		(at === undefined || (/^\d{4}-\d{2}$/.test(at) && DateTime.fromISO(`${at}-01`).isValid)) &&
		(kind !== "month" ||
			(/^\d{4}-\d{2}$/.test(value) && DateTime.fromISO(`${value}-01`).isValid)) &&
		(kind !== "day" ||
			(at === undefined &&
				/^\d{4}-\d{2}-\d{2}$/.test(value) &&
				DateTime.fromISO(value).isValid))
			? { kind: kind as Selection["kind"], value, at }
			: null
	useEffect(() => {
		if (!selection && wasOpen.current)
			requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }))
		wasOpen.current = !!selection
	}, [!!selection])
	const href = (s: Selection) =>
		pathDashboard({
			...Object.fromEntries(params),
			drill: [s.kind, s.value, s.at].filter(Boolean).join(":"),
			focus: undefined,
		})
	const open = (s: Selection) => {
		trigger.current = document.activeElement as HTMLElement
		router.push(href(s), { scroll: false })
	}
	const close = () => {
		router.push(
			pathDashboard({ ...Object.fromEntries(params), drill: undefined, focus: undefined }),
			{ scroll: false },
		)
	}
	const pivot = (focus: string | null) => {
		router.push(pathDashboard({ ...Object.fromEntries(params), focus: focus ?? undefined }), {
			scroll: false,
		})
	}
	return { selection, focus, pivot, open, close, href }
}
