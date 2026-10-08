"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useMonthParams } from "@/hooks/use-month-params"
import { confirmBackupLocated, confirmMonthReviewed, getLearning } from "@/logic/learning"

export function GuideCheckActions({ topic }: { topic: string }) {
	const learning = useLiveQuery(getLearning, [])
	const { month, year, date } = useMonthParams()
	const monthKey = date.toFormat("yyyy-MM")
	if (topic === "dashboard")
		return (
			<div className="rounded-lg border p-4 text-sm leading-6">
				<p className="mb-3">
					After checking {month} {year} in Dashboard and Monthly Records, you can confirm
					your review. This is your confirmation, not an automated check of every amount.
				</p>
				<Button
					size="lg"
					className="min-h-11"
					disabled={!learning || learning.reviewedMonth === monthKey}
					onClick={() =>
						void confirmMonthReviewed(monthKey).catch(() =>
							toast.error("Could not remember this review. Try again."),
						)
					}
				>
					{learning?.reviewedMonth === monthKey
						? `${month} review confirmed`
						: `I reviewed ${month} ${year}`}
				</Button>
			</div>
		)
	if (!["backup-first", "sync"].includes(topic) || !learning?.backupRequestedAt) return null
	return (
		<div className="rounded-lg border p-4 text-sm leading-6">
			<p className="mb-3">
				A backup download was requested{" "}
				{new Date(learning.backupRequestedAt).toLocaleDateString()}. Find the JSON file in
				your Downloads folder and keep it somewhere safe before confirming here.
			</p>
			<Button
				size="lg"
				className="min-h-11"
				disabled={!!learning.backupLocatedAt}
				onClick={() =>
					void confirmBackupLocated().catch(() =>
						toast.error("Could not remember this confirmation. Try again."),
					)
				}
			>
				{learning.backupLocatedAt
					? "File located (confirmed by you)"
					: "I found and kept the backup file"}
			</Button>
		</div>
	)
}
