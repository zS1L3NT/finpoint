import { Icon as IconifyIcon } from "@iconify/react"
import { useState } from "react"
import { DetailSummary, DetailSummaryItem } from "@/components/detail-summary"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import RecordAmount from "@/components/record-amount"
import DataTable from "@/components/table/data-table"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFetch } from "@/hooks/use-fetch"
import { treatmentLabel } from "@/lib/analytics"
import { formatDatetime } from "@/lib/utils"
import { Account, Allocation, CategoryWithChildren, Record, Statement } from "@/types"
import { categoryIndexApiRoute, recordsWebRoute } from "@/wayfinder/routes"

export default function RecordPage({
	record,
	statements,
	accounts,
}: {
	record: Record
	statements: (Statement & { pivot: Allocation })[]
	accounts: Account[]
}) {
	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])

	const [isEditingRecord, setIsEditingRecord] = useState(false)
	const [editingStatement, setEditingStatement] = useState<Statement | null>(null)
	const columns = useStatementColumns<Statement & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Record ${record.id}`,
		onEdit: setEditingStatement,
	})
	const mobileRow = useStatementMobileRow<Statement & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Record ${record.id}`,
		onEdit: setEditingStatement,
	})

	return (
		<>
			<AppHeader title="Record" />

			<PageContent>
				<PageHeader
					title={
						<div className="flex flex-wrap items-center gap-2">
							{record.title}
							{record.is_pending && (
								<Badge variant="warning" className="tracking-normal">
									Pending
								</Badge>
							)}
						</div>
					}
					subtitle={
						<div className="grid gap-1">
							{record.subtitle ? (
								<span className="text-foreground/80">{record.subtitle}</span>
							) : null}
							{record.description ? <span>{record.description}</span> : null}
						</div>
					}
					description="Record details"
					icon="lucide:receipt-text"
					actions={
						<RecordEditorDialog
							record={record}
							statements={statements}
							categories={categories}
							isOpen={isEditingRecord}
							setIsOpen={setIsEditingRecord}
							trigger={
								<Button className="w-full sm:w-auto">
									<IconifyIcon icon="lucide:pencil" /> Edit Record
								</Button>
							}
						/>
					}
					back={{
						name: "Records",
						url: recordsWebRoute.url(),
					}}
				/>

				<DetailSummary
					footer={
						<div className="flex flex-wrap gap-x-5 gap-y-1">
							<span>Treatment · {treatmentLabel(record.analytics_treatment)}</span>
							<span>Spending bucket · {record.bucket?.name ?? "No bucket"}</span>
						</div>
					}
				>
					<DetailSummaryItem
						icon="lucide:circle-dollar-sign"
						label="Amount"
						value={<RecordAmount record={record} className="text-base" />}
					/>
					<DetailSummaryItem
						icon="lucide:tag"
						label="Category"
						value={
							<div className="flex items-center gap-2">
								<Icon {...record.category} size={16} />
								<span>{record.category.name}</span>
							</div>
						}
					/>
					<DetailSummaryItem
						icon="lucide:calendar-clock"
						label="Date & Time"
						value={formatDatetime(record.datetime)}
					/>
				</DetailSummary>

				<Card>
					<CardHeader>
						<CardTitle>Statements</CardTitle>
						<CardDescription>
							Allocated statements attached to this record.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<DataTable
							data={statements}
							columns={columns}
							mobileRow={mobileRow}
							emptyMessage="No statements found."
						/>
					</CardContent>
				</Card>
			</PageContent>

			{editingStatement ? (
				<PendingStatementDialog
					statement={editingStatement}
					accounts={accounts}
					isOpen
					setIsOpen={open => {
						if (!open) setEditingStatement(null)
					}}
				/>
			) : null}
		</>
	)
}
