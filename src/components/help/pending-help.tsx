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
import { getGuideTopic } from "@/lib/guide-content"
import { formatCurrency } from "@/lib/utils"
import { round2 } from "@/logic/shared"

export function PendingHelp({
	amount,
	allocated,
	count,
}: {
	amount: number
	allocated: number
	count: number
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
				</dl>
				<p className="text-sm leading-6">
					{count === 0
						? "This Record has no Allocations. Even a $0 Record needs at least one Allocation to be complete."
						: "The saved Allocation total does not match the Record amount. Correct the Record or its Allocations according to what actually happened, then save again."}
				</p>
				<GuideArticle topic={getGuideTopic("pending")} compact />
			</DialogContent>
		</Dialog>
	)
}
