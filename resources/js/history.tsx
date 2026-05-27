import { createContext, useContext, useEffect, useState } from "react"

const NOOP = () => {
	//
}

const getStoredHistory = () =>
	typeof localStorage === "undefined" ? [] : JSON.parse(localStorage.getItem("history") || "[]")

const HistoryContext = createContext<{
	latest: { name: string; url: string } | null
	handlePush: (name: string) => () => void
	handlePop: () => void
	handleClear: () => void
}>({
	latest: null,
	handlePush: () => NOOP,
	handlePop: NOOP,
	handleClear: NOOP,
})

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
	const [history, setHistory] = useState<{ name: string; url: string }[]>(getStoredHistory)

	useEffect(() => {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem("history", JSON.stringify(history))
		}
	}, [history])

	return (
		<HistoryContext.Provider
			value={{
				latest: history[history.length - 1],
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
			}}
		>
			{children}
		</HistoryContext.Provider>
	)
}

export const useHistory = () => useContext(HistoryContext)
