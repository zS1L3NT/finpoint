import { Icon as IconifyIcon } from "@iconify/react"
import { useState } from "react"
import AllocateBar from "@/components/allocate-bar"
import { DetailSummary, DetailSummaryItem } from "@/components/detail-summary"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFetch } from "@/hooks/use-fetch"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { formatDatetime } from "@/lib/utils"
import { Account, Allocation, CategoryWithChildren, Record, Statement } from "@/types"
import { categoryIndexApiRoute, statementsWebRoute } from "@/wayfinder/routes"

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
	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])
	const { editingRecord, loadingRecordId, editRecord, setEditingRecord } = useRecordEditor()
	const columns = useRecordColumns<Record & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Statement ${statement.id}`,
		onEdit: record => void editRecord(record),
		loadingRecordId,
	})
	const mobileRow = useRecordMobileRow<Record & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Statement ${statement.id}`,
		onEdit: record => void editRecord(record),
		loadingRecordId,
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
						name: "Statements",
						url: statementsWebRoute.url(),
					}}
				/>

				<DetailSummary
					footer={
						statement.is_pending ? (
							<span>Status · Handwritten pending Statement</span>
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
						label="Date & Time"
						value={formatDatetime(statement.datetime)}
					/>
				</DetailSummary>

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

			{editingRecord ? (
				<RecordEditorDialog
					record={editingRecord}
					statements={editingRecord.statements}
					categories={categories}
					isOpen
					setIsOpen={isOpen => {
						if (!isOpen) setEditingRecord(null)
					}}
				/>
			) : null}
		</>
	)
}
