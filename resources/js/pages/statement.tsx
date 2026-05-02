import { Link } from "@inertiajs/react"
import { CreditCardIcon } from "lucide-react"
import AllocateBar from "@/components/allocate-bar"
import DetailCard from "@/components/detail-card"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useHistory } from "@/history"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import { Account, Allocation, Category, Record, Statement } from "@/types"
import { recordWebRoute, statementsWebRoute } from "@/wayfinder/routes"

type StatementExtra = {
	account: Account
	records: (Record & { category: Category } & { pivot: Allocation })[]
}

export default function StatementPage({ statement }: { statement: Statement & StatementExtra }) {
	const { handlePush } = useHistory()

	return (
		<>
			<AppHeader title="Statement" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={statement.description}
					description="Statement details"
					icon={CreditCardIcon}
					back={{
						name: "Back to statements",
						url: statementsWebRoute.url(),
					}}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					<DetailCard
						label="Account"
						value={`${statement.account.name} (${statement.account.id})`}
					/>
					<DetailCard
						label="Amount"
						value={formatCurrency(statement.amount)}
						valueClassName={classForCurrency(statement.amount)}
					/>
					<DetailCard label="Date & Time" value={formatDatetime(statement.datetime)} />
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Records</CardTitle>
						<CardDescription>Records linked to this statement.</CardDescription>
					</CardHeader>
					<CardContent>
						<DataTable
							data={statement.records}
							columns={[
								{
									header: "Record",
									meta: { width: TABLE_WIDTHS.RECORD },
									cell: ({ row }) => (
										<div className="flex items-center gap-3">
											<Icon {...row.original.category} size={16} />
											<div className="flex-1 overflow-hidden">
												<p className="truncate font-medium">
													{row.original.title}
												</p>
												<p className="truncate text-muted-foreground">
													{row.original.subtitle || "No extra context"}
												</p>
											</div>
										</div>
									),
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
									header: "Date & Time",
									meta: { width: TABLE_WIDTHS.DATETIME },
									cell: ({ row }) => formatDatetime(row.original.datetime),
								},
								{
									header: "Description",
									meta: { width: TABLE_WIDTHS.DESCRIPTION },
									cell: ({ row }) => (
										<div className="truncate text-muted-foreground">
											{row.original.description || "-"}
										</div>
									),
								},
								{
									id: "actions",
									cell: ({ row }) => (
										<div className="flex justify-end">
											<Button variant="outline" size="sm" asChild>
												<Link
													href={recordWebRoute.url({
														record: row.original,
													})}
													onClick={handlePush(
														`Statement ${statement.id}`,
													)}
												>
													Open
												</Link>
											</Button>
										</div>
									),
								},
							]}
							emptyMessage="No records found."
						/>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
