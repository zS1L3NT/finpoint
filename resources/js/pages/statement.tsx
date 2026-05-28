import { CreditCardIcon } from "lucide-react"
import AllocateBar from "@/components/allocate-bar"
import DetailCard from "@/components/detail-card"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDatetime } from "@/lib/utils"
import { Allocation, Record, Statement } from "@/types"
import { statementsWebRoute } from "@/wayfinder/routes"

export default function StatementPage({
	statement,
	records,
}: {
	statement: Statement
	records: (Record & { pivot: Allocation })[]
}) {
	const columns = useRecordColumns<Record & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Statement ${statement.id}`,
	})
	const mobileRow = useRecordMobileRow<Record & { pivot: Allocation }>({
		amount: "allocated",
		pageName: `Statement ${statement.id}`,
	})

	return (
		<>
			<AppHeader title="Statement" />

			<PageContent>
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
					<DetailCard label="Account" value={statement.account.name} />
					<DetailCard label="Date & Time" value={formatDatetime(statement.datetime)} />
					<DetailCard label="Day Index" value={statement.index} />
				</div>

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
		</>
	)
}
