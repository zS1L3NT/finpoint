"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { use, useState } from "react"
import AllocateBar from "@/components/allocate-bar"
import { AllocationRows } from "@/components/allocation-rows"
import { DetailSummary, DetailSummaryItem } from "@/components/detail-summary"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDatetime } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { getStatement } from "@/logic/statements"
import { pathStatements } from "@/routes"

export default function StatementPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const [isEditingStatement, setIsEditingStatement] = useState(false)
	const data = useLiveQuery(() => (id ? getStatement(id).catch(() => null) : null), [id])
	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	// undefined means the live query is still resolving; only null is genuinely missing.
	if (data === undefined) return null

	if (!data) {
		return (
			<>
				<PageContent>
					<p className="text-xs text-muted-foreground">Statement not found.</p>
				</PageContent>
			</>
		)
	}

	const statement = data

	return (
		<>
			<PageContent>
				<PageHeader
					title={
						<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
							{statement.description}
							{statement.is_pending ? (
								<Badge variant="warning" className="tracking-normal">
									Pending
								</Badge>
							) : null}
						</div>
					}
					description="Statement details"
					icon="lucide:credit-card"
					actions={
						statement.is_pending ? (
							<PendingStatementDialog
								statement={statement}
								accounts={accounts}
								isOpen={isEditingStatement}
								setIsOpen={setIsEditingStatement}
								trigger={
									<Button className="w-full sm:w-auto">
										<IconifyIcon icon="lucide:pencil" /> Edit Pending Statement
									</Button>
								}
							/>
						) : undefined
					}
					back={{
						name: "Statements",
						url: pathStatements(),
					}}
				/>

				<DetailSummary
					footer={
						statement.is_pending ? (
							<span>Status · Pending Statement</span>
						) : (
							<span>Imported day index · {statement.index}</span>
						)
					}
				>
					<DetailSummaryItem
						icon="lucide:circle-dollar-sign"
						label="Amount"
						value={
							<AllocateBar
								title={
									!statement.allocable_amount
										? "Fully allocated"
										: statement.allocable_amount === statement.amount
											? "Not allocated"
											: "Partially allocated"
								}
								value={statement.amount - statement.allocable_amount}
								total={statement.amount}
							/>
						}
					/>
					<DetailSummaryItem
						icon="lucide:landmark"
						label="Account"
						value={statement.account.name}
					/>
					<DetailSummaryItem
						icon="lucide:calendar-clock"
						label="Date and time"
						value={formatDatetime(statement.datetime)}
					/>
				</DetailSummary>

				<Card>
					<CardHeader>
						<CardTitle>Records</CardTitle>
						<CardDescription>Records allocated to this Statement.</CardDescription>
					</CardHeader>
					<CardContent>
						<AllocationRows statement={data} />
					</CardContent>
				</Card>
			</PageContent>
		</>
	)
}
