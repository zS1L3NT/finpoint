import { DateTime } from "luxon"
import React, { Fragment, useEffect, useRef, useState } from "react"
import { Account, Category, Paginated, Statement } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import RecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

type StatementExtra = {
	allocations_sum_amount: number
	account: Account
}

type CategoryExtra = {
	children: Category[]
}

export default function Allocator({
	statements,
	categories,
}: {
	statements: Paginated<Statement & StatementExtra>
	categories: (Category & CategoryExtra)[]
}) {
	const modalButtonRef = useRef<HTMLButtonElement>(null)
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const setSelected = (id: string, selected: boolean) => {
		setSelectedIds(ids => (selected ? [...ids, id] : ids.filter(_id => _id !== id)))
	}

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h1>Allocator</h1>
					<p className="text-body-secondary">Allocate bank statements to app records</p>
				</div>

				<button
					ref={modalButtonRef}
					type="button"
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#record-allocator"
					disabled={!selectedIds.length}
				>
					Allocate to Record
				</button>
			</div>

			<table className="table table-hover" style={{ tableLayout: "fixed" }}>
				<thead>
					<tr>
						<th style={{ width: 32 }}></th>
						<th style={{ width: 125 }}>Account</th>
						<th style={{ width: 125 }}>Date</th>
						<th style={{ width: 100 }}>Total ($)</th>
						<th style={{ width: 125 }}>Allocable ($)</th>
						<th>Description</th>
					</tr>
				</thead>

				<tbody>
					{statements.data.map(statement => (
						<tr
							key={statement.id}
							className={`${selectedIds.includes(statement.id) ? "table-active" : ""}`}
							style={{ cursor: "pointer" }}
							onClick={() =>
								setSelected(statement.id, !selectedIds.includes(statement.id))
							}
							onKeyDown={e => {
								if (e.key === " ") {
									e.preventDefault()
									setSelected(statement.id, !selectedIds.includes(statement.id))
								}
							}}
							tabIndex={0}
						>
							<td>
								<input
									type="checkbox"
									className="form-check-input"
									checked={selectedIds.includes(statement.id)}
									onChange={e => setSelected(statement.id, e.target.checked)}
									tabIndex={-1}
								/>
							</td>
							<td>{statement.account.id}</td>
							<td>
								{DateTime.fromFormat(statement.date, "y-MM-dd").toFormat("d MMM y")}
							</td>
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

			<RecordAllocator
				statements={statements.data.filter(s => selectedIds.includes(s.id))}
				categories={categories}
			/>
		</>
	)
}

function RecordAllocator({
	statements,
	categories,
}: {
	statements: (Statement & StatementExtra)[]
	categories: (Category & CategoryExtra)[]
}) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [date, setDate] = useState("")
	const [errors, setErrors] = useState<Record<string, string[]>>({})

	/**
	 * Scans all transactions for the unique date format like 09APR,
	 * these dates best reflect when the transactions was made.
	 * If it is found, use the earliest one, if not use the earliest
	 * date from the statements
	 */
	useEffect(() => {
		const textDateRegex = /\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/
		const textDate = statements
			.map(s => s.description.match(textDateRegex)?.[0])
			.filter(s => !!s)
			// biome-ignore lint/style/noNonNullAssertion: Filtered above
			.map(s => DateTime.fromFormat(s!.slice(0, 3) + s!.slice(3, 5).toLowerCase(), "ddMMM"))
			.filter(d => d.isValid)
			.toSorted((a, b) => a.toMillis() - b.toMillis())[0]

		if (textDate) {
			setDate(textDate.startOf("day").toFormat("yyyy-MM-dd HH:mm"))
		} else {
			setDate((statements.map(s => s.date).toSorted()[0] ?? "") + " 00:00")
		}
	}, [statements])

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		await fetch(RecordController.store.url(), {
			method: "post",
			body: new FormData(e.currentTarget),
			headers: { Accept: "application/json" },
		})
			.then(async res => [res, await res.json()] as const)
			.then(([res, data]) => {
				if (res.status === 422) {
					setErrors(data.errors)
				}

				if (res.status === 201) {
					closeButtonRef.current?.click()
					setTimeout(() => {
						window.location.reload()
					}, 500)
				}
			})
	}

	return (
		<form
			className="modal fade"
			id="record-allocator"
			tabIndex={-1}
			aria-labelledby="record-allocator-label"
			aria-hidden="true"
			onSubmit={handleSubmit}
		>
			<div className="modal-dialog modal-dialog-centered modal-xl">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="record-allocator-label">
							Allocate to Record
						</h1>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">
						<div className="d-flex gap-4">
							<div style={{ width: 300 }}>
								<div className="mb-3">
									<label htmlFor="title" className="form-label">
										Title
									</label>
									<input
										type="text"
										className={`form-control ${errors.title?.length ? "is-invalid" : ""}`}
										name="title"
										id="title"
									/>
									<div className="invalid-feedback">
										{errors.title?.join("\n")}
									</div>
								</div>

								<div className="mb-3">
									<label htmlFor="people" className="form-label">
										People
									</label>
									<input
										type="text"
										className={`form-control ${errors.people?.length ? "is-invalid" : ""}`}
										name="people"
										id="people"
									/>
									<div className="invalid-feedback">
										{errors.people?.join("\n")}
									</div>
								</div>

								<div className="mb-3">
									<label htmlFor="location" className="form-label">
										Location
									</label>
									<input
										type="text"
										className={`form-control ${errors.location?.length ? "is-invalid" : ""}`}
										name="location"
										id="location"
									/>
									<div className="invalid-feedback">
										{errors.location?.join("\n")}
									</div>
								</div>

								<div className="mb-3">
									<label htmlFor="date" className="form-label">
										Date
									</label>
									<input
										type="datetime-local"
										className={`form-control ${errors.date?.length ? "is-invalid" : ""}`}
										name="date"
										id="date"
										defaultValue={date}
									/>
									<div className="invalid-feedback">
										{errors.date?.join("\n")}
									</div>
								</div>

								<div className="mb-3">
									<label htmlFor="category_id" className="form-label">
										Category
									</label>
									<select
										className={`form-select ${errors.category_id?.length ? "is-invalid" : ""}`}
										name="category_id"
										id="category_id"
										defaultValue=""
									>
										<option value="">-</option>
										{categories.map(category => (
											<optgroup key={category.id} label={category.name}>
												<option value={category.id}>{category.name}</option>
												{category.children.map(category => (
													<option key={category.id} value={category.id}>
														{category.name}
													</option>
												))}
											</optgroup>
										))}
									</select>
									<div className="invalid-feedback">
										{errors.category_id?.join("\n")}
									</div>
								</div>

								<div className="mb-3">
									<label htmlFor="description" className="form-label">
										Description
									</label>
									<textarea
										className={`form-control ${errors.description?.length ? "is-invalid" : ""}`}
										name="description"
										id="description"
										rows={4}
									/>
									<div className="invalid-feedback">
										{errors.description?.join("\n")}
									</div>
								</div>
							</div>

							<div className="vr"></div>

							<div className="flex-fill">
								{statements.map((statement, i) => (
									<Fragment key={statement.id}>
										{i !== 0 ? <hr /> : null}

										<input
											type="hidden"
											name={`statements[${i}][id]`}
											value={statement.id}
										/>

										<table className="table table-sm table-borderless">
											<tbody>
												<tr>
													<th style={{ width: 120 }}>Account</th>
													<td>
														{statement.account.name} (
														{statement.account.id})
													</td>
												</tr>
												<tr>
													<th>Description</th>
													<td>{statement.description}</td>
												</tr>
												<tr>
													<th>Date</th>
													<td>{statement.date}</td>
												</tr>
												<tr>
													<th className="align-middle">Allocated</th>
													<td>
														<div
															className="input-group"
															style={{ width: 400 }}
														>
															<span className="input-group-text">
																$
															</span>
															<input
																type="number"
																step={0.01}
																className={`form-control ${errors[`statements.${i}.amount`]?.length ? "is-invalid" : ""}`}
																name={`statements[${i}][amount]`}
																defaultValue={
																	statement.amount -
																	(statement.allocations_sum_amount ??
																		0)
																}
															/>
															<span className="input-group-text">
																out of{" "}
																{formatCurrency(
																	statement.amount -
																		(statement.allocations_sum_amount ??
																			0),
																)}
															</span>
															<div className="invalid-feedback">
																{errors[
																	`statements.${i}.amount`
																]?.join("\n")}
															</div>
														</div>
													</td>
												</tr>
												<tr>
													<th className="align-middle">Description</th>
													<td>
														<div
															className="input-group"
															style={{ width: 400 }}
														>
															<input
																type="text"
																className={`form-control ${errors[`statements.${i}.description`]?.length ? "is-invalid" : ""}`}
																name={`statements[${i}][description]`}
															/>
															<div className="invalid-feedback">
																{errors[
																	`statements.${i}.description`
																]?.join("\n")}
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</Fragment>
								))}
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button
							ref={closeButtonRef}
							type="button"
							className="btn btn-secondary"
							data-bs-dismiss="modal"
						>
							Close
						</button>
						<button type="submit" className="btn btn-primary">
							Save
						</button>
					</div>
				</div>
			</div>
		</form>
	)
}
