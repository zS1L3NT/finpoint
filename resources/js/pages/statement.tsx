import { Link } from "@inertiajs/react"
import { CreditCardIcon } from "lucide-react"
import AllocateBar from "@/components/allocate-bar"
import DetailCard from "@/components/detail-card"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { currencyClass, toCurrency, toDate, toDatetime } from "@/lib/utils"
import { Account, Allocation, Category, Record, Statement } from "@/types"
import { recordWebRoute, statementsWebRoute } from "@/wayfinder/routes"

type StatementExtra = {
	account: Account
	records: (Record & { category: Category } & { pivot: Allocation })[]
}

export default function StatementPage({ statement }: { statement: Statement & StatementExtra }) {
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
						value={toCurrency(statement.amount)}
						valueClassName={currencyClass(statement.amount)}
					/>
					<DetailCard label="Date" value={toDate(statement.date)} />
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Records</CardTitle>
						<CardDescription>Records linked to this statement.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-hidden rounded-lg border bg-card">
							<Table className="table-fixed">
								<TableHeader>
									<TableRow>
										<TableHead className="w-64">Record</TableHead>
										<TableHead className="w-64">Amount</TableHead>
										<TableHead className="w-48">Date & Time</TableHead>
										<TableHead>Description</TableHead>
										<TableHead className="w-16" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{statement.records.length ? (
										statement.records.map(record => (
											<TableRow key={record.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<Icon {...record.category} size={16} />
														<div className="min-w-0">
															<p className="truncate font-medium">
																{record.title}
															</p>
															<p className="truncate text-muted-foreground">
																{[
																	record.people
																		? `w/ ${record.people}`
																		: null,
																	record.location
																		? `@ ${record.location}`
																		: null,
																]
																	.filter(Boolean)
																	.join(" ") ||
																	"No extra context"}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<AllocateBar
														title="Allocated"
														value={record.pivot.amount}
														total={record.amount}
													/>
												</TableCell>
												<TableCell>{toDatetime(record.datetime)}</TableCell>
												<TableCell className="truncate text-muted-foreground">
													{record.description ?? "-"}
												</TableCell>
												<TableCell>
													<Button variant="outline" size="sm" asChild>
														<Link
															href={recordWebRoute.url({
																record,
															})}
														>
															Open
														</Link>
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={6}
												className="h-24 text-center text-muted-foreground"
											>
												No records found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
