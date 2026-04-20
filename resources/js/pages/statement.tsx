import { router } from "@inertiajs/react"
import AppHeader from "@/components/app-header"
import DetailCard from "@/components/detail-card"
import Icon from "@/components/icon"
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
import RecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

type StatementExtra = {
	account: Account
	records: (Record & { category: Category } & { pivot: Allocation })[]
}

export default function StatementPage({ statement }: { statement: Statement & StatementExtra }) {
	return (
		<>
			<AppHeader title="Statement" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-semibold">Statement {statement.id}</h2>
					<p className="text-muted-foreground">
						Review the imported statement and the records allocated to it.
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					<DetailCard
						label="Amount"
						value={toCurrency(statement.amount)}
						valueClassName={currencyClass(statement.amount)}
					/>
					<DetailCard
						label="Account"
						value={`${statement.account.name} (${statement.account.id})`}
					/>
					<DetailCard label="Date" value={toDate(statement.date)} />
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Description</CardTitle>
						<CardDescription>Imported statement description.</CardDescription>
					</CardHeader>
					<CardContent>{statement.description}</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Records</CardTitle>
						<CardDescription>Records linked to this statement.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-hidden rounded-lg border bg-card">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-72">Record</TableHead>
										<TableHead className="w-44">Date & Time</TableHead>
										<TableHead className="w-36">Record</TableHead>
										<TableHead className="w-36">Allocated</TableHead>
										<TableHead>Description</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{statement.records.length ? (
										statement.records.map(record => (
											<TableRow
												key={record.id}
												className="cursor-pointer"
												onClick={() =>
													router.visit(
														RecordController.show({ record: record.id })
															.url,
													)
												}
											>
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
												<TableCell>{toDatetime(record.datetime)}</TableCell>
												<TableCell className={currencyClass(record.amount)}>
													{toCurrency(record.amount)}
												</TableCell>
												<TableCell
													className={currencyClass(record.pivot.amount)}
												>
													{toCurrency(record.pivot.amount)}
												</TableCell>
												<TableCell className="max-w-0 truncate text-muted-foreground">
													{record.description ?? "-"}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={5}
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
