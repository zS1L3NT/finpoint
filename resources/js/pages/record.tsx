import { PencilIcon, ReceiptTextIcon } from "lucide-react"
import { useState } from "react"
import DetailCard from "@/components/detail-card"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFetch } from "@/hooks/use-fetch"
import { classForCurrency, cn, formatCurrency, formatDatetime } from "@/lib/utils"
import { Allocation, CategoryWithChildren, Record, Statement } from "@/types"
import { categoryIndexApiRoute, recordsWebRoute } from "@/wayfinder/routes"

export default function RecordPage({
	record,
	statements,
}: {
	record: Record
	statements: (Statement & { pivot: Allocation })[]
}) {
	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])

	const [isEditingRecord, setIsEditingRecord] = useState(false)
	const columns = useStatementColumns<Statement & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Record ${record.id}`,
	})
	const mobileRow = useStatementMobileRow<Statement & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Record ${record.id}`,
	})

	return (
		<>
			<AppHeader title="Record" />

			<PageContent>
				<PageHeader
					title={
						<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
							{record.title}
							{record.subtitle ? (
								<span className="text-base text-muted-foreground md:text-xl">
									{record.subtitle}
								</span>
							) : null}
							{record.is_pending && (
								<Badge variant="warning" className="tracking-normal">
									Pending
								</Badge>
							)}
						</div>
					}
					subtitle={record.description}
					description="Record details"
					icon={ReceiptTextIcon}
					actions={
						<RecordEditorDialog
							record={record}
							statements={statements}
							categories={categories}
							isOpen={isEditingRecord}
							setIsOpen={setIsEditingRecord}
							trigger={
								<Button className="w-full sm:w-auto">
									<PencilIcon /> Edit Record
								</Button>
							}
						/>
					}
					back={{
						name: "Back to records",
						url: recordsWebRoute.url(),
					}}
				/>

				<div className="grid gap-4 lg:grid-cols-4">
					<DetailCard
						label="Amount"
						value={formatCurrency(record.amount)}
						valueClassName={cn(classForCurrency(record.amount), "text-base")}
					/>
					<DetailCard
						label="Category"
						value={
							<div className="flex items-center gap-2">
								<Icon {...record.category} size={16} />
								<span>{record.category.name}</span>
							</div>
						}
					/>
					<DetailCard label="Date & Time" value={formatDatetime(record.datetime)} />
				</div>

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
		</>
	)
}
