"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createContext, startTransition, useContext, useEffect, useRef, useState } from "react"

export type HistoryItem = { name: string; url: string }

const NOOP = () => undefined

const normaliseUrl = (url: string) => {
	const destination = new URL(url, window.location.origin)
	return destination.pathname + (destination.search ? `?${destination.searchParams}` : "")
}

const withoutTrailingSelf = (history: HistoryItem[], url: string) => {
	let end = history.length
	while (end) {
		const item = history[end - 1]
		if (!item || normaliseUrl(item.url) !== url) break
		end--
	}
	return end === history.length ? history : history.slice(0, end)
}

const getValidHistory = (stored: unknown): HistoryItem[] => {
	if (!Array.isArray(stored)) return []
	return stored.filter((item): item is HistoryItem => {
		if (
			item === null ||
			typeof item !== "object" ||
			typeof item.name !== "string" ||
			item.name.trim() === "" ||
			typeof item.url !== "string" ||
			!item.url.startsWith("/")
		)
			return false
		try {
			return new URL(item.url, location.origin).origin === location.origin
		} catch {
			return false
		}
	})
}

const getStoredHistory = (): HistoryItem[] => {
	try {
		return getValidHistory(JSON.parse(localStorage.getItem("history") || "[]"))
	} catch {
		return []
	}
}

const HistoryContext = createContext<{
	latest: HistoryItem | null
	isNavigatingBack: boolean
	handlePush: (name: string) => () => void
	handlePop: () => void
	handleClear: () => void
	navigateBack: (fallback: HistoryItem) => void
}>({
	latest: null,
	isNavigatingBack: false,
	handlePush: () => NOOP,
	handlePop: NOOP,
	handleClear: NOOP,
	navigateBack: NOOP,
})

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
	const [history, setHistory] = useState<HistoryItem[]>([])
	const [hasLoadedHistory, setHasLoadedHistory] = useState(false)
	const [isNavigatingBack, setIsNavigatingBack] = useState(false)
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const pendingLink = useRef<{ destination: string; origin: HistoryItem } | null>(null)
	// Ref mirror of the history stack: event handlers must read the latest stack even
	// when their render closure is stale (e.g. two back navigations in quick succession),
	// otherwise the second navigation targets an already-popped entry and goes nowhere.
	const historyRef = useRef<HistoryItem[]>([])
	const navigatingBackRef = useRef(false)
	// The origin URL whose Back entry a drill link pushed before its destination committed.
	const pendingPushRef = useRef<string | null>(null)
	const setHistorySync = (next: HistoryItem[] | ((current: HistoryItem[]) => HistoryItem[])) => {
		const value = typeof next === "function" ? next(historyRef.current) : next
		historyRef.current = value
		setHistory(value)
	}

	useEffect(() => {
		setHistorySync(withoutTrailingSelf(getStoredHistory(), normaliseUrl(window.location.href)))
		setHasLoadedHistory(true)
	}, [])

	useEffect(() => {
		if (hasLoadedHistory) localStorage.setItem("history", JSON.stringify(history))
	}, [hasLoadedHistory, history])

	useEffect(() => {
		// Cover ordinary links too, including links rendered by static content pages.
		// An in-flight ordinary origin survives unrelated input: only another
		// unmodified ordinary navigation replaces it. Tab and sidebar navigations
		// never create Back entries, so they discard it instead. Workflow tabs
		// have no explicit clear handler (unlike the sidebar and monthly tabs,
		// which clear through their own onClick), so they also clear the
		// committed drill stack here for consistent tab semantics.
		const rememberLink = (event: MouseEvent) => {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			)
				return
			const link = event.target instanceof Element ? event.target.closest("a[href]") : null
			if (!(link instanceof HTMLAnchorElement)) return
			if (
				link.closest(
					'[data-sidebar], [role="tablist"], nav[aria-label="Monthly finance views"], nav[aria-label="Workflow views"]',
				)
			) {
				pendingLink.current = null
				if (link.closest('nav[aria-label="Workflow views"]')) {
					historyRef.current = []
					setHistory([])
				}
				return
			}
			if (link.hasAttribute("download") || (link.target && link.target !== "_self")) return
			const destination = new URL(link.href)
			const url = window.location.pathname + window.location.search
			if (
				destination.origin !== window.location.origin ||
				destination.pathname + destination.search === url
			)
				return
			const name = document.querySelector("main h2")?.textContent?.trim() || document.title
			pendingLink.current = {
				destination:
					destination.pathname +
					(destination.search ? `?${destination.searchParams}` : ""),
				origin: { name, url },
			}
		}
		document.addEventListener("click", rememberLink, true)
		return () => document.removeEventListener("click", rememberLink, true)
	}, [])

	useEffect(() => {
		const restoreHistory = (event: PopStateEvent) => {
			pendingLink.current = null
			pendingPushRef.current = null
			// Next can commit the route before this listener runs. Restore here,
			// rather than waiting for a route-arrival effect that already ran.
			setHistorySync(getValidHistory(event.state?.finpointHistory))
		}
		window.addEventListener("popstate", restoreHistory)
		return () => window.removeEventListener("popstate", restoreHistory)
	}, [])

	useEffect(() => {
		const pending = pendingLink.current
		const url = pathname + (searchParams.size ? `?${searchParams}` : "")
		// A navigation has landed: any pending drill entry now renders, and a back
		// navigation re-arms the back control.
		pendingPushRef.current = null
		navigatingBackRef.current = false
		setIsNavigatingBack(false)
		// A filter can settle on the origin while the clicked destination is loading.
		if (
			pending &&
			pending.destination !== url &&
			new URL(pending.origin.url, window.location.origin).pathname === pathname
		)
			return
		pendingLink.current = null
		if (pending?.destination !== url) return
		setHistorySync(current =>
			current.at(-1)?.url === pending.origin.url ? current : [...current, pending.origin],
		)
	}, [pathname, searchParams])

	useEffect(() => {
		if (!hasLoadedHistory || navigatingBackRef.current) return
		const url = pathname + (searchParams.size ? `?${searchParams}` : "")
		const here = new URL(window.location.href)
		if (here.pathname + (here.search ? `?${here.searchParams}` : "") !== url) return
		// Each browser entry keeps its own origin, including identical detail
		// URLs reached from different filters. Preserve Next's router state and
		// keep pre-arrival pushes out of the outgoing entry's snapshot.
		window.history.replaceState(
			{
				...window.history.state,
				finpointHistory: withoutTrailingSelf(historyRef.current, url),
			},
			"",
		)
	}, [hasLoadedHistory, history, pathname, searchParams])

	return (
		<HistoryContext.Provider
			value={{
				latest: history[history.length - 1] ?? null,
				isNavigatingBack,
				handlePush: name => () => {
					const url = pathname + window.location.search
					pendingPushRef.current = normaliseUrl(url)
					// Commit the Back entry with the route transition, so the outgoing
					// page does not reveal its own Back button while the destination loads.
					startTransition(() => {
						setHistorySync(history => [
							...(history.at(-1)?.url === url ? history.slice(0, -1) : history),
							{ name, url },
						])
					})
				},
				handlePop: () => {
					setHistorySync(history => history.slice(0, -1))
				},
				handleClear: () => {
					setHistorySync([])
				},
				navigateBack: fallback => {
					if (navigatingBackRef.current) return
					const here = pathname + (searchParams.size ? `?${searchParams}` : "")
					// A drill link leaving this page pushes this page's Back entry before the
					// destination commits. Skip that unrendered entry, so Back still goes where
					// its visible label says and supersedes the pending link.
					let current = historyRef.current
					const top = current[current.length - 1]
					if (pendingPushRef.current === here && top && normaliseUrl(top.url) === here)
						current = current.slice(0, -1)
					pendingPushRef.current = null
					const target = current[current.length - 1] ?? fallback
					setHistorySync(current.length ? current.slice(0, -1) : current)
					if (normaliseUrl(target.url) === here) return
					navigatingBackRef.current = true
					setIsNavigatingBack(true)
					router.push(target.url)
				},
			}}
		>
			{children}
		</HistoryContext.Provider>
	)
}

export const useHistory = () => useContext(HistoryContext)
