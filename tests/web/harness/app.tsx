import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FormsSection } from "./forms"
import { PrimitivesSection } from "./primitives"

export type HarnessSection = "all" | "forms" | "primitives"

export function sectionFromLocation(): HarnessSection {
	const { pathname, search, hash } = window.location
	const params = new URLSearchParams(search)
	const query = params.get("section")
	const hashSection = hash.replace(/^#\/?/, "").split("?")[0]
	const pathTail = pathname.split("/").filter(Boolean).pop()
	for (const candidate of [query, hashSection, pathTail]) {
		if (candidate === "forms" || candidate === "primitives") return candidate
	}
	return "all"
}

export function App() {
	const [section, setSection] = useState<HarnessSection>(() => sectionFromLocation())
	const [dark, setDark] = useState(
		() =>
			document.documentElement.classList.contains("dark") ||
			window.matchMedia("(prefers-color-scheme: dark)").matches,
	)

	useEffect(() => {
		const onPopState = () => setSection(sectionFromLocation())
		window.addEventListener("popstate", onPopState)
		window.addEventListener("hashchange", onPopState)
		return () => {
			window.removeEventListener("popstate", onPopState)
			window.removeEventListener("hashchange", onPopState)
		}
	}, [])

	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark)
		document.documentElement.style.colorScheme = dark ? "dark" : "light"
	}, [dark])

	const go = useCallback((next: HarnessSection) => {
		const url = next === "all" ? "/" : `/?section=${next}`
		window.history.pushState(null, "", url)
		setSection(next)
	}, [])

	return (
		<div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 bg-background p-4 text-foreground md:p-6">
			<header className="flex flex-wrap items-center gap-2">
				<h1 className="mr-auto text-base font-semibold">Widget harness</h1>
				<nav aria-label="Harness sections" className="flex flex-wrap items-center gap-2">
					<Button
						variant={section === "all" ? "default" : "outline"}
						onClick={() => go("all")}
					>
						All
					</Button>
					<Button
						variant={section === "forms" ? "default" : "outline"}
						onClick={() => go("forms")}
					>
						Forms
					</Button>
					<Button
						variant={section === "primitives" ? "default" : "outline"}
						onClick={() => go("primitives")}
					>
						Primitives
					</Button>
					<Button variant="ghost" aria-pressed={dark} onClick={() => setDark(v => !v)}>
						Toggle dark theme
					</Button>
				</nav>
			</header>
			<p data-testid="harness-section" data-section={section} className="sr-only">
				{section}
			</p>
			{(section === "all" || section === "forms") && <FormsSection />}
			{(section === "all" || section === "primitives") && <PrimitivesSection />}
		</div>
	)
}
