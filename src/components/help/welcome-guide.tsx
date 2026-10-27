"use client"

import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dismissWelcome, getLearningOverview, markWorkspaceUsed } from "@/logic/learning"
import { pathDataSettings, pathHelp, pathImporter } from "@/routes"

export function LearningObserver() {
	const overview = useLiveQuery(getLearningOverview, [])
	const used =
		!!overview?.ready &&
		overview.accounts + overview.statements + overview.records + overview.budgets > 0
	useEffect(() => {
		if (used && !overview?.learning.workspaceUsed)
			void markWorkspaceUsed().catch(() => undefined)
	}, [used, overview?.learning.workspaceUsed])
	return null
}

export function WelcomeGuide() {
	const overview = useLiveQuery(getLearningOverview, [])
	if (!overview?.eligible) return null
	return (
		<Card>
			<CardHeader>
				<CardTitle>New to Finpoint?</CardTitle>
				<CardDescription className="text-sm leading-6">
					Bring in your own activity, restore a backup, or learn the basics in the guide.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
				<Button asChild variant="outline" size="lg" className="min-h-11">
					<Link href={pathImporter()}>Import my activity</Link>
				</Button>
				<Button asChild variant="outline" size="lg" className="min-h-11">
					<Link href={pathDataSettings()}>Restore a backup</Link>
				</Button>
				<Button asChild variant="ghost" size="lg" className="min-h-11">
					<Link href={pathHelp()}>Explore the guide</Link>
				</Button>
				<Button
					variant="ghost"
					size="lg"
					className="min-h-11"
					onClick={() =>
						void dismissWelcome().catch(() =>
							toast.error("Could not remember this preference. Try again."),
						)
					}
				>
					Dismiss
				</Button>
			</CardContent>
		</Card>
	)
}
