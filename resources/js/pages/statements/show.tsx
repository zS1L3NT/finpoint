import { router } from "@inertiajs/react"
import Icon from "@/components/icon"
import { Account, Allocation, Category, Record, Statement } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import RecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

type StatementExtra = {
	account: Account
	records: (Record & { category: Category } & { pivot: Allocation })[]
}

export default function StatementShow({ statement }: { statement: Statement & StatementExtra }) {
	const handleClick = (record: Record) => {
		router.visit(RecordController.show({ record: record.id }).url)
	}

	return (
		<>
			<h1 className="mb-4">Statement {statement.id}</h1>

			<div className="my-3">
				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">AMOUNT</p>
						<p className="fs-3" style={styleCurrency(statement.amount)}>
							{formatCurrency(statement.amount)}
						</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">ACCOUNT</p>
						<p className="fs-5">
							{statement.account.name} ({statement.account.id})
						</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">DATE</p>
						<p className="fs-5">{statement.date}</p>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">DESCRIPTION</p>
						<p className="fs-5">{statement.description}</p>
					</div>
				</div>
			</div>

			<h3 className="mt-5 mb-4">Records</h3>

			<table className="table table-hover" style={{ tableLayout: "fixed" }}>
				<thead>
					<tr>
						<th style={{ width: 250 }}>Title</th>
						<th style={{ width: 160 }}>Date & Time</th>
						<th style={{ width: 125 }}>Record ($)</th>
						<th style={{ width: 125 }}>Allocated ($)</th>
						<th>Allocation Description</th>
					</tr>
				</thead>

				<tbody>
					{statement.records.map(record => (
						<tr
							key={record.id}
							style={{ cursor: "pointer" }}
							onClick={() => handleClick(record)}
						>
							<td className="d-flex align-items-center gap-2">
								<Icon {...record.category} />
								<p className="m-0" style={{ flex: 1 }}>
									{record.title}
									{record.people ? ` with ${record.people}` : ""}
									{record.location ? ` @ ${record.location}` : ""}
								</p>
							</td>
							<td className="align-middle">{record.date}</td>
							<td className="align-middle" style={styleCurrency(record.amount)}>
								{formatCurrency(record.amount)}
							</td>
							<td className="align-middle" style={styleCurrency(record.amount)}>
								{formatCurrency(record.pivot.amount)}
							</td>
							<td className="align-middle">{record.pivot.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}
