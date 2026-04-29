import { createContext, useContext, useState } from "react"

const NOOP = () => {
	//
}

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
	const [history, setHistory] = useState<{ name: string; url: string }[]>([])

	return (
		<HistoryContext.Provider
			value={{
				latest: history[history.length - 1],
				handlePush: name => () => {
					setHistory(history => [...history, { name, url: window.location.pathname }])
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
