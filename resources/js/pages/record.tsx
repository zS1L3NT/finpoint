import { PencilIcon, ReceiptTextIcon } from "lucide-react"
import { useState } from "react"
import DetailCard from "@/components/detail-card"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { useStatementColumns } from "@/components/table/statement-columns"
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

	return (
		<>
			<AppHeader title="Record" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={
						<div className="flex items-center gap-2">
							{record.title}
							<p className="text-xl text-muted-foreground">{record.subtitle}</p>
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
								<Button>
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
							emptyMessage="No statements found."
						/>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
