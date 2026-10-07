"use client"

import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dismissWelcome, getLearningOverview, markWorkspaceUsed } from "@/logic/learning"
import { pathDashboard, pathDataSettings, pathHelp, pathHelpPractice, pathImporter } from "@/routes"

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
	const params = useSearchParams()
	const overview = useLiveQuery(getLearningOverview, [])
	if (!overview?.eligible) return null
	return (
		<Card>
			<CardHeader>
				<CardTitle>New to Finpoint? Start with one purchase.</CardTitle>
				<CardDescription className="text-sm leading-6">
					Practice a $12 lunch, learn what the numbers mean, then bring in your own
					activity.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
				<Button asChild size="lg" className="min-h-11">
					<Link
						href={pathHelpPractice(
							"lunch",
							pathDashboard({
								month: params.get("month") ?? undefined,
								year: params.get("year") ?? undefined,
							}),
						)}
					>
						Try sample practice
					</Link>
				</Button>
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
