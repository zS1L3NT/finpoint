import { Icon as IconifyIcon } from "@iconify/react"
import { useLiveQuery } from "dexie-react-hooks"
import { useState } from "react"
import { useParams } from "react-router-dom"
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
import { listAccounts } from "@/logic/accounts"
import { listCategories } from "@/logic/categories"
import { getStatement } from "@/logic/statements"
import { pathStatements } from "@/routes"
import type { Allocation, Record } from "@/types"

export default function StatementPage() {
	const { id } = useParams<{ id: string }>()
	const [isEditingStatement, setIsEditingStatement] = useState(false)
	const data = useLiveQuery(() => (id ? getStatement(id).catch(() => null) : null), [id])
	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	const categories = useFetch(() => listCategories(), [])
	const { editingRecord, loadingRecordId, editRecord, setEditingRecord } = useRecordEditor()
	const columns = useRecordColumns<Record & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Statement ${data?.id ?? ""}`,
		onEdit: record => void editRecord(record),
		loadingRecordId,
	})
	const mobileRow = useRecordMobileRow<Record & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Statement ${data?.id ?? ""}`,
		onEdit: record => void editRecord(record),
		loadingRecordId,
	})

	if (!data) {
		return (
			<>
				<AppHeader title="Statement" />
				<PageContent>
					<p className="text-sm text-muted-foreground">Statement not found.</p>
				</PageContent>
			</>
		)
	}

	const { records, ...statement } = data
	const typedRecords = records as unknown as (Record & { pivot: Allocation })[]

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
						url: pathStatements(),
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
							data={typedRecords}
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
