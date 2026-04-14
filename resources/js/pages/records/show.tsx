import React from "react"
import Icon from "@/components/icon"
import { Account, Category, Record, Statement } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"

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
						<p className="m-0 fs-6 font-monospaced text-body-secondary">AMOUNT</p>
						<p className="fs-3" style={styleCurrency(record.amount)}>
							{formatCurrency(record.amount)}
						</p>
					</div>

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
				</div>
			</div>

			<hr />

			<h3>Statements</h3>

			<div>
				<table className="table table-hover" style={{ tableLayout: "fixed" }}>
					<thead>
						<tr>
							<th style={{ width: 250 }}>Account</th>
							<th style={{ width: 125 }}>Date</th>
							<th style={{ width: 125 }}>Total ($)</th>
							<th style={{ width: 125 }}>Allocated ($)</th>
							<th>Description</th>
						</tr>
					</thead>

					<tbody>
						{record.statements.map(statement => (
							<tr key={statement.id}>
								<td>
									{statement.account.name} ({statement.account.id})
								</td>
								<td>{statement.date.slice(0, "YYYY-MM-DD".length)}</td>
								<td style={styleCurrency(statement.amount)}>
									{formatCurrency(statement.amount)}
								</td>
								<td style={styleCurrency(statement.amount)}>
									{formatCurrency(statement.pivot.amount)}
								</td>
								<td
									title={statement.description}
									style={{
										textOverflow: "ellipsis",
										overflow: "hidden",
										whiteSpace: "nowrap",
									}}
								>
									{statement.description}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	)
}
