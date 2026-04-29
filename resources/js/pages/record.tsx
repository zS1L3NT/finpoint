import { Link } from "@inertiajs/react"
import { ReceiptTextIcon } from "lucide-react"
import AllocateBar from "@/components/allocate-bar"
import DetailCard from "@/components/detail-card"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RecordEditorDialog from "@/dialogs/record-editor"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, cn, formatCurrency, formatDatetime } from "@/lib/utils"
import { Account, Allocation, Category, Record, Statement } from "@/types"
import { recordsWebRoute, statementWebRoute } from "@/wayfinder/routes"

type RecordExtra = {
	category: Category & CategoryExtra
	statements: (Statement & StatementExtra)[]
}

type StatementExtra = {
	allocations_sum_amount: number
	account: Account
	pivot: Allocation
}

type CategoryExtra = {
	children: Category[]
}

export default function RecordPage({
	record,
	categories,
	titles,
	locations,
	peoples,
}: {
	record: Record & RecordExtra
	categories: (Category & CategoryExtra)[]
	titles: string[]
	locations: string[]
	peoples: string[]
}) {
	return (
		<>
			<AppHeader title="Record" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={
						<div className="flex items-center gap-2">
							{record.title}
							<p className="text-xl text-muted-foreground">
								{[
									record.people ? `w/ ${record.people}` : null,
									record.location ? `@ ${record.location}` : null,
								]
									.filter(Boolean)
									.join(" ")}
							</p>
						</div>
					}
					subtitle={record.description}
					description="Record details"
					icon={ReceiptTextIcon}
					actions={
						<RecordEditorDialog
							record={record}
							categories={categories}
							titles={titles}
							locations={locations}
							peoples={peoples}
						/>
					}
					back={{
						name: "Back to records",
						url: recordsWebRoute.url(),
					}}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					<DetailCard
						label="Category"
						value={
							<div className="flex items-center gap-2">
								<Icon {...record.category} size={16} />
								<span>{record.category.name}</span>
							</div>
						}
					/>
					<DetailCard
						label="Amount"
						value={formatCurrency(record.amount)}
						valueClassName={cn(classForCurrency(record.amount), "text-base")}
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
							data={record.statements}
							columns={[
								{
									header: "Account",
									meta: { width: TABLE_WIDTHS.ACCOUNT },
									cell: ({ row }) => row.original.account.id,
								},
								{
									header: "Date & Time",
									meta: { width: TABLE_WIDTHS.DATETIME },
									cell: ({ row }) => formatDatetime(row.original.datetime),
								},
								{
									header: "Amount",
									meta: { width: TABLE_WIDTHS.AMOUNT_BAR },
									cell: ({ row }) => (
										<AllocateBar
											title="Allocated"
											value={row.original.pivot.amount}
											total={row.original.amount}
										/>
									),
								},
								{
									header: "Description",
									// Expand width to maximum for statements
									cell: ({ row }) => (
										<div className="truncate text-muted-foreground">
											{row.original.description || "-"}
										</div>
									),
								},
								{
									id: "actions",
									meta: { width: TABLE_WIDTHS.ACTIONS_OPEN },
									cell: ({ row }) => (
										<div className="flex justify-end">
											<Button variant="outline" size="sm" asChild>
												<Link
													href={statementWebRoute.url({
														statement: row.original,
													})}
												>
													Open
												</Link>
											</Button>
										</div>
									),
								},
							]}
							emptyMessage="No statements found."
						/>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
