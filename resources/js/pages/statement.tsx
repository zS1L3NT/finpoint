import { Link } from "@inertiajs/react"
import { CreditCardIcon } from "lucide-react"
import AllocateBar from "@/components/allocate-bar"
import DetailCard from "@/components/detail-card"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useHistory } from "@/history"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import { Allocation, Record, Statement } from "@/types"
import { recordWebRoute, statementsWebRoute } from "@/wayfinder/routes"

export default function StatementPage({
	statement,
	records,
}: {
	statement: Statement
	records: (Record & { pivot: Allocation })[]
}) {
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
					<DetailCard
						label="Account"
						value={`${statement.account.name} (${statement.account.id})`}
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
							data={records}
							columns={[
								{
									header: "Record",
									meta: { width: TABLE_WIDTH_CLASSNAMES.RECORD },
									cell: ({ row }) => (
										<div className="flex items-center gap-3">
											<Icon {...row.original.category} size={16} />
											<div className="flex-1 overflow-hidden">
												<p className="truncate font-medium">
													{row.original.is_pending && (
														<Badge variant="warning" className="mr-1">
															Pending
														</Badge>
													)}
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
									meta: { width: TABLE_WIDTH_CLASSNAMES.AMOUNT },
									cell: ({ row }) => (
										<div
											className={classForCurrency(row.original.pivot.amount)}
										>
											{formatCurrency(row.original.pivot.amount)}
										</div>
									),
								},
								{
									header: "Date & Time",
									meta: { width: TABLE_WIDTH_CLASSNAMES.DATETIME },
									cell: ({ row }) => formatDatetime(row.original.datetime),
								},
								{
									header: "Description",
									meta: { width: TABLE_WIDTH_CLASSNAMES.DESCRIPTION },
									cell: ({ row }) => (
										<div className="truncate text-muted-foreground">
											{row.original.description || "-"}
										</div>
									),
								},
								{
									id: "actions",
									meta: { width: TABLE_WIDTH_CLASSNAMES.ACTIONS_OPEN },
									cell: ({ row }) => (
										<Button variant="outline" size="sm" asChild>
											<Link
												href={recordWebRoute.url({
													record: row.original,
												})}
												onClick={handlePush(`Statement ${statement.id}`)}
											>
												Open
											</Link>
										</Button>
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
