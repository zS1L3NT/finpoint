import { useSyncExternalStore } from "react"

export type ResolvedAppearance = "light" | "dark"
export type Appearance = ResolvedAppearance | "system"

const APPEARANCE_COOKIE = "appearance"
const APPEARANCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const listeners = new Set<() => void>()
let currentAppearance: Appearance = "system"

const prefersDark = () => {
	if (typeof window === "undefined") {
		return false
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
}

const setCookie = (name: string, value: string, maxAge: number) => {
	if (typeof document === "undefined") {
		return
	}

	document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`
}

const getStoredAppearance = () => {
	if (typeof window === "undefined") {
		return "system" satisfies Appearance
	}

	const storedAppearance = localStorage.getItem(APPEARANCE_COOKIE)
	return storedAppearance === "light" ||
		storedAppearance === "dark" ||
		storedAppearance === "system"
		? storedAppearance
		: "system"
}

const isDarkMode = (appearance: Appearance) =>
	appearance === "dark" || (appearance === "system" && prefersDark())

const applyAppearance = (appearance: Appearance) => {
	if (typeof document === "undefined") {
		return
	}

	const dark = isDarkMode(appearance)
	document.documentElement.classList.toggle("dark", dark)
	document.documentElement.style.colorScheme = dark ? "dark" : "light"
}

const subscribe = (listener: () => void) => {
	listeners.add(listener)
	return () => listeners.delete(listener)
}

const notify = () => listeners.forEach(listener => listener())

const mediaQuery = () => {
	if (typeof window === "undefined") {
		return null
	}

	return window.matchMedia("(prefers-color-scheme: dark)")
}

const handleSystemThemeChange = () => applyAppearance(currentAppearance)

export function initializeAppearance(defaultAppearance: Appearance = "system") {
	if (typeof window === "undefined") {
		return
	}

	const storedAppearance = localStorage.getItem(APPEARANCE_COOKIE)
	if (!storedAppearance) {
		localStorage.setItem(APPEARANCE_COOKIE, defaultAppearance)
		setCookie(APPEARANCE_COOKIE, defaultAppearance, APPEARANCE_COOKIE_MAX_AGE)
	}

	currentAppearance = getStoredAppearance()
	applyAppearance(currentAppearance)
	mediaQuery()?.addEventListener("change", handleSystemThemeChange)
}

export function useAppearance() {
	const appearance: Appearance = useSyncExternalStore(
		subscribe,
		(): Appearance => currentAppearance,
		(): Appearance => "system",
	)

	const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance) ? "dark" : "light"

	const updateAppearance = (appearance: Appearance) => {
		currentAppearance = appearance
		localStorage.setItem(APPEARANCE_COOKIE, appearance)
		setCookie(APPEARANCE_COOKIE, appearance, APPEARANCE_COOKIE_MAX_AGE)
		applyAppearance(appearance)
		notify()
	}

	return { appearance, resolvedAppearance, updateAppearance } as const
}
