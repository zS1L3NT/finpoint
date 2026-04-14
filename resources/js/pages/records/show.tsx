import React from "react"
import Icon from "@/components/icon"
import { Account, Category, Record, Statement } from "@/types"
import { formatCurrency } from "@/utils"

type RecordExtra = {
	category: Category
	statements: (Statement & { account: Account } & {
		pivot: { amount: number; description: string }
	})[]
}

export default function RecordShow({ record }: { record: Record & RecordExtra }) {
	return (
		<>
			<h1 className="mb-4">Record {record.id}</h1>

			<div className="my-3">
				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">TITLE</p>
						<p className="fs-3">{record.title}</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">PEOPLE</p>
						<p className="fs-5">{record.people ?? "-"}</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">LOCATION</p>
						<p className="fs-5">{record.location ?? "-"}</p>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">CATEGORY</p>
						<div className="d-flex align-items-center gap-2">
							<Icon {...record.category} size={16} />
							<p className="fs-5 m-0">{record.category.name}</p>
						</div>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">DATE</p>
						<p className="fs-5">{record.date}</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">STATEMENTS</p>
						<p className="fs-5">{record.statements.length}</p>
					</div>
				</div>
			</div>

			<hr />

			<h3>Statements</h3>

			<div>
				<table className="table table-hover">
					<thead>
						<tr>
							<th>Account</th>
							<th>Date</th>
							<th>Amount</th>
							<th>Description</th>
							<th>Label</th>
						</tr>
					</thead>

					<tbody>
						{record.statements.map(statement => (
							<tr key={statement.id}>
								<td>
									{statement.account.name} ({statement.account.id})
								</td>
								<td>{statement.date}</td>
								<td
									className={
										statement.amount < 0 ? "text-danger" : "text-success"
									}
								>
									{statement.pivot.amount !== null
										? formatCurrency(statement.pivot.amount) + " out of "
										: null}
									{formatCurrency(statement.amount)}
								</td>
								<td>{statement.description}</td>
								<td>{statement.pivot.description}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	)
}
