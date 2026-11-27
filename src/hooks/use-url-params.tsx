"use client"

// The URL's search params as one shared value that moves the moment a change is requested.
// `useSearchParams()` only changes when a navigation commits, so a URL built from it while another
// navigation is pending drops that navigation's changes. Changes made in a row, from any
// component, build on the requested params and so compose.

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createContext, useContext, useEffect, useRef, useState } from "react"

/** Whether a change replaces the current history entry, decided from the URL it is sent from. */
type Replace = boolean | ((committed: URLSearchParams) => boolean)

type UrlParams = {
	params: URLSearchParams
	setParams: (
		changes: Record<string, string | null | undefined>,
		options?: { replace?: Replace },
	) => void
}

/** How long a navigation may take before the next one is sent anyway. */
const COMMIT_TIMEOUT_MS = 3000

const UrlParamsContext = createContext<UrlParams | null>(null)

export function UrlParamsProvider({ children }: { children: React.ReactNode }) {
	const committed = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	// The params requested but not committed yet. A plain state, not a transition: the router
	// commits inside its own transition, which React would hold back behind one that waits for it.
	const [requested, setRequested] = useState<URLSearchParams | null>(null)
	const params = requested ?? committed

	// The router drops navigations started while another is in flight, and not always the older
	// one, so only one is sent at a time. Changes requested meanwhile wait as one navigation to
	// the latest params; it pushes when any of them asked for a new history entry.
	const latest = useRef(committed)
	const waiting = useRef<{ href: string; suffix: string; modes: Replace[] } | null>(null)
	// The params last requested, readable before the render that shows them.
	const head = useRef<URLSearchParams | null>(null)
	const draining = useRef<Promise<void> | null>(null)
	const onCommit = useRef<(() => void) | null>(null)
	const url = `${pathname}?${committed}`
	useEffect(() => {
		latest.current = committed
		onCommit.current?.()
	}, [url])

	// Following a link abandons changes that have not been sent, so they cannot land after it.
	useEffect(() => {
		const abandon = (event: MouseEvent) => {
			if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
			const link = event.target instanceof Element ? event.target.closest("a[href]") : null
			if (
				!link ||
				link.getAttribute("target") === "_blank" ||
				link.hasAttribute("data-opens-in-place")
			)
				return
			waiting.current = null
			head.current = null
		}
		document.addEventListener("click", abandon, true)
		return () => document.removeEventListener("click", abandon, true)
	}, [])

	const drain = async () => {
		// Changes made in the same task leave as one navigation; a change undone in that task
		// leaves no history entry.
		await Promise.resolve()
		while (waiting.current) {
			const { href, suffix, modes } = waiting.current
			waiting.current = null
			// A navigation to the URL already shown never commits, so there is nothing to wait for.
			if (suffix === latest.current.toString()) continue
			const replace = modes.every(mode =>
				typeof mode === "function" ? mode(latest.current) : mode,
			)
			const commit = new Promise<void>(resolve => {
				onCommit.current = resolve
				setTimeout(resolve, COMMIT_TIMEOUT_MS)
			})
			if (replace) router.replace(href, { scroll: false })
			else router.push(href, { scroll: false })
			await commit
		}
	}

	const setParams: UrlParams["setParams"] = (changes, { replace = false } = {}) => {
		const next = new URLSearchParams(head.current ?? params)
		for (const [key, value] of Object.entries(changes)) {
			if (value) next.set(key, value)
			else next.delete(key)
		}
		const suffix = next.toString()
		const href = suffix ? `${pathname}?${suffix}` : pathname
		waiting.current = { href, suffix, modes: [...(waiting.current?.modes ?? []), replace] }
		head.current = next
		setRequested(next)
		// `finally` settles a tick later, so the slot is never cleared before it is filled. The
		// requested params hold until every navigation waiting here has committed.
		draining.current ??= drain().finally(() => {
			draining.current = null
			head.current = null
			setRequested(null)
		})
	}

	return <UrlParamsContext value={{ params, setParams }}>{children}</UrlParamsContext>
}

export function useUrlParams() {
	const context = useContext(UrlParamsContext)
	if (!context) throw new Error("useUrlParams needs UrlParamsProvider")
	return context
}
