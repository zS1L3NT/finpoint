"use client"

import { GuideArticle } from "@/components/help/guide-article"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { getGuideChapter } from "@/lib/guide"
import { formatCurrency } from "@/lib/utils"
import { round2 } from "@/logic/shared"

export function PendingHelp({
	amount,
	allocated,
	count,
	pendingCount,
}: {
	amount: number
	allocated: number
	count: number
	pendingCount: number
}) {
	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="outline" size="lg" className="min-h-11">
						Why Pending?
					</Button>
				}
			/>
			<DialogContent className="md:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Why this Record is Pending</DialogTitle>
					<DialogDescription>
						These amounts come from the saved Record and its current Allocations.
					</DialogDescription>
				</DialogHeader>
				<dl className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border p-4 text-sm tabular-nums">
					<dt>Record amount</dt>
					<dd>{formatCurrency(amount)}</dd>
					<dt>Allocation total</dt>
					<dd>{formatCurrency(allocated)}</dd>
					<dt>Difference</dt>
					<dd>{formatCurrency(round2(amount - allocated))}</dd>
					<dt>Allocations</dt>
					<dd>{count}</dd>
					<dt>Pending Statements</dt>
					<dd>{pendingCount}</dd>
				</dl>
				<p className="text-sm leading-6">
					{count === 0
						? "This Record has no Allocations. Even a $0 Record needs at least one Allocation to be complete."
						: round2(amount - allocated) !== 0
							? "The saved Allocation total does not match the Record amount. Correct the Record or its Allocations according to what actually happened, then save again."
							: "The amounts tally, but this Record uses a Pending Statement. It stays Pending until the real imported activity replaces the placeholder."}
					{pendingCount > 0 &&
						round2(amount - allocated) !== 0 &&
						" It also uses a Pending Statement, which still needs replacement with the real imported activity."}
				</p>
				<GuideArticle chapter={getGuideChapter("pending")} compact />
			</DialogContent>
		</Dialog>
	)
}
