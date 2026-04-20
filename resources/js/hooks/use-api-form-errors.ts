import { useCallback, useState } from "react"

type ErrorItem = { message?: string }

const toDotPath = (path: string) => path.replace(/\[(\d+)\]/g, ".$1")

export default function useApiFormErrors() {
	const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})

	const getApiFieldErrors = useCallback(
		(path: string): ErrorItem[] =>
			(apiErrors[toDotPath(path)] ?? []).map(message => ({ message })),
		[apiErrors],
	)

	const mergeErrors = useCallback(
		(errors: unknown[] | undefined, path: string): ErrorItem[] => [
			...((errors ?? []) as ErrorItem[]),
			...getApiFieldErrors(path),
		],
		[getApiFieldErrors],
	)

	const clearApiError = useCallback((path: string) => {
		const dotPath = toDotPath(path)
		setApiErrors(current => {
			if (!(dotPath in current)) {
				return current
			}

			const next = { ...current }
			delete next[dotPath]
			return next
		})
	}, [])

	const resetApiErrors = useCallback(() => setApiErrors({}), [])

	return {
		apiErrors,
		setApiErrors,
		getApiFieldErrors,
		mergeErrors,
		clearApiError,
		resetApiErrors,
	}
}
