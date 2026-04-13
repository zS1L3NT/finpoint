import { Form } from "@inertiajs/react"
import React, { useState } from "react"
import Layout from "../Layout"

export default function StatementsIndex({ statements }) {
	const [selectedIds, setSelectedIds] = useState([])

	const setSelected = (id, selected) => {
		setSelectedIds(ids => (selected ? ids.filter(_id => _id !== id) : [...ids, id]))
	}

	const decodeHtml = html => {
		return new DOMParser().parseFromString(html, "text/html").documentElement.textContent
	}

	return (
		<Layout title="Statement List">
			<h1 className="mb-3">Statements</h1>

			<div className="d-flex mb-4">
				{/** biome-ignore lint/correctness/noUndeclaredVariables: Injected */}
				<Form method="post" action={route("records.store")}>
					{selectedIds.map(selectedId => (
						<input
							key={selectedId}
							type="hidden"
							name="statement_ids[]"
							value={selectedId}
						/>
					))}
					<button className="btn btn-primary" disabled={!selectedIds.length}>
						{selectedIds.length > 1 ? "Merge into" : "Create"} Record
					</button>
				</Form>
			</div>

			<table className="table table-hover">
				<thead>
					<tr>
						<th></th>
						<th>Account</th>
						<th>Date</th>
						<th>Amount</th>
						<th>Supplementary</th>
						<th>Client</th>
					</tr>
				</thead>

				<tbody>
					{statements.data.map(statement => (
						<tr
							key={statement.id}
							className={`${selectedIds.includes(statement.id) ? "table-active" : ""}`}
							style={{ cursor: "pointer" }}
							onClick={e => {
								e.preventDefault()
								setSelected(statement.id, selectedIds.includes(statement.id))
							}}
						>
							<td>
								<input
									type="checkbox"
									checked={selectedIds.includes(statement.id)}
									style={{ pointerEvents: "none", userSelect: "none" }}
									onChange={e => e.preventDefault()}
								/>
							</td>
							<td>
								{statement.account.name} ({statement.account.id})
							</td>
							<td>{statement.transaction_date}</td>
							<td style={{ color: statement.amount < 0 ? "red" : "green" }}>
								{statement.amount < 0
									? `-$${Math.abs(statement.amount).toFixed(2)}`
									: `$${statement.amount.toFixed(2)}`}
							</td>
							<td>{statement.supplementary_code}</td>
							<td>{statement.client_reference}</td>
						</tr>
					))}
				</tbody>
			</table>

			<nav>
				<ul className="pagination justify-content-center">
					{statements.links.map(link => (
						<li key={link.label} className={`page-item ${link.active ? "active" : ""}`}>
							<a className="page-link" href={link.url}>
								{decodeHtml(link.label)}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</Layout>
	)
}
