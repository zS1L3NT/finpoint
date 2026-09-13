import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export type HistoryItem = { name: string; url: string }

const NOOP = () => undefined

const getStoredHistory = (): HistoryItem[] => {
	try {
		return JSON.parse(localStorage.getItem("history") || "[]")
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
	const navigate = useNavigate()

	useEffect(() => {
		setHistory(getStoredHistory())
		setHasLoadedHistory(true)
	}, [])

	useEffect(() => {
		if (hasLoadedHistory) localStorage.setItem("history", JSON.stringify(history))
	}, [hasLoadedHistory, history])

	return (
		<HistoryContext.Provider
			value={{
				latest: history[history.length - 1] ?? null,
				isNavigatingBack,
				handlePush: name => () => {
					setHistory(history => [
						...history,
						{ name, url: location.pathname + location.search },
					])
				},
				handlePop: () => {
					setHistory(history => history.slice(0, -1))
				},
				handleClear: () => {
					setHistory([])
				},
				navigateBack: fallback => {
					if (isNavigatingBack) return

					const hasHistory = history.length > 0
					const target = history[history.length - 1] ?? fallback
					setIsNavigatingBack(true)
					void navigate(target.url)
					if (hasHistory) {
						setHistory(current => current.slice(0, -1))
					}
					setIsNavigatingBack(false)
				},
			}}
		>
			{children}
		</HistoryContext.Provider>
	)
}

export const useHistory = () => useContext(HistoryContext)
