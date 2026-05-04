import { router, usePage } from "@inertiajs/react"

export function useSearchParam(key: string): [string | null, (value: string | null) => void]
export function useSearchParam(key: string, defaultValue: string): [string, (value: string) => void]
export function useSearchParam(key: string, defaultValue?: string): [any, (value: any) => void] {
	const page = usePage()
	const url = new URL(page.url, "http://localhost")

	const value = url.searchParams.get(key) ?? defaultValue ?? null

	const setValue = (value: string | null) => {
		if (value !== null) {
			url.searchParams.set(key, value)
		} else {
			url.searchParams.delete(key)
		}
		router.visit(url.pathname + url.search, { preserveState: true, preserveScroll: true })
	}

	return [value, setValue] as const
}
