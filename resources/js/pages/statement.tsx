import { Icon as IconifyIcon } from "@iconify/react"
import { useState } from "react"
import AllocateBar from "@/components/allocate-bar"
import DetailCard from "@/components/detail-card"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDatetime } from "@/lib/utils"
import { Account, Allocation, Record, Statement } from "@/types"
import { statementsWebRoute } from "@/wayfinder/routes"

export default function StatementPage({
	statement,
	records,
	accounts,
}: {
	statement: Statement
	records: (Record & { pivot: Allocation })[]
	accounts: Account[]
}) {
	const [isEditingStatement, setIsEditingStatement] = useState(false)
	const columns = useRecordColumns<Record & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Statement ${statement.id}`,
	})
	const mobileRow = useRecordMobileRow<Record & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Statement ${statement.id}`,
	})

	return (
		<>
			<AppHeader title="Statement" />

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
						name: "Back to statements",
						url: statementsWebRoute.url(),
					}}
				/>

				<div className="grid gap-4 lg:grid-cols-4">
					<DetailCard
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
					<DetailCard label="Account" value={statement.account.name} />
					<DetailCard label="Date & Time" value={formatDatetime(statement.datetime)} />
					<DetailCard
						label={statement.is_pending ? "Status" : "Day Index"}
						value={statement.is_pending ? "Pending" : statement.index}
					/>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Records</CardTitle>
						<CardDescription>Records linked to this statement.</CardDescription>
					</CardHeader>
					<CardContent>
						<DataTable
							data={records}
							columns={columns}
							mobileRow={mobileRow}
							emptyMessage="No records found."
						/>
					</CardContent>
				</Card>
			</PageContent>
		</>
	)
}
