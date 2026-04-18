import { router } from "@inertiajs/react"
import { DateTime } from "luxon"
import { Account, Paginated, Record, Statement } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import WebStatementController from "@/wayfinder/actions/App/Http/Controllers/StatementController"

type StatementExtra = {
	account: Account
	records: Record[]
}

export default function StatementIndex({
	statements,
}: {
	statements: Paginated<Statement & StatementExtra>
}) {
	const handleClick = (statement: Statement) => {
		router.visit(WebStatementController.show({ statement: statement.id }).url)
	}

	return (
		<>
			<h1 className="mb-2">Statements</h1>

			<div className="d-flex justify-content-end">
				<input
					type="text"
					className="form-control mb-4"
					style={{ width: 300 }}
					placeholder="Search..."
					value={new URLSearchParams(window.location.search).get("query") ?? ""}
					onChange={e => {
						router.reload({ data: { query: e.target.value } })
					}}
				/>
			</div>

			<table className="table table-hover" style={{ tableLayout: "fixed" }}>
				<thead>
					<tr>
						<th style={{ width: 125 }}>Account</th>
						<th style={{ width: 125 }}>Date</th>
						<th style={{ width: 100 }}>Total ($)</th>
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
							<td>{statement.account.id}</td>
							<td>
								{DateTime.fromFormat(statement.date, "y-MM-dd").toFormat("d MMM y")}
							</td>
							<td style={styleCurrency(statement.amount)}>
								{formatCurrency(statement.amount)}
							</td>
							<td
								title={statement.description}
								style={{
									textOverflow: "ellipsis",
									overflow: "hidden",
									whiteSpace: "nowrap",
								}}
								dangerouslySetInnerHTML={{
									__html: statement.description.replaceAll(
										/(\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))/g,
										"<mark>$1</mark>",
									),
								}}
							/>
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
