import { router } from "@inertiajs/react"
import { Account, Paginated, Record, Statement } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import StatementController from "@/wayfinder/actions/App/Http/Controllers/StatementController"

type StatementExtra = {
	allocations_sum_amount: number
	account: Account
	records: Record[]
}

export default function StatementIndex({
	statements,
}: {
	statements: Paginated<Statement & StatementExtra>
}) {
	const handleClick = (statement: Statement) => {
		router.visit(StatementController.show({ statement: statement.id }).url)
	}

	return (
		<>
			<h1 className="mb-4">Statements</h1>

			<table className="table table-hover" style={{ tableLayout: "fixed" }}>
				<thead>
					<tr>
						<th style={{ width: 250 }}>Account</th>
						<th style={{ width: 125 }}>Date</th>
						<th style={{ width: 125 }}>Total ($)</th>
						<th style={{ width: 125 }}>Allocable ($)</th>
						<th>Description</th>
					</tr>
				</thead>

				<tbody>
					{statements.data.map(statement => (
						<tr
							key={statement.id}
							style={{ cursor: "pointer" }}
							onClick={() => handleClick(statement)}
						>
							<td>
								{statement.account.name} ({statement.account.id})
							</td>
							<td>{statement.date}</td>
							<td style={styleCurrency(statement.amount)}>
								{formatCurrency(statement.amount)}
							</td>
							<td style={styleCurrency(statement.amount)}>
								{formatCurrency(
									statement.amount - (statement.allocations_sum_amount ?? 0),
								)}
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

			<nav>
				<ul className="pagination justify-content-center">
					{statements.links.map(link => (
						<li key={link.label} className={`page-item ${link.active ? "active" : ""}`}>
							<a className="page-link" href={link.url}>
								{link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</>
	)
}
