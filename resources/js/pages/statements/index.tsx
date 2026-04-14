import React, { Fragment, useRef, useState } from "react"
import { Category, Paginated, Statement } from "@/types"
import { formatCurrency } from "@/utils"
import RecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

export default function StatementsIndex({
	statements,
	categories,
}: {
	statements: Paginated<Statement>
	categories: Category[]
}) {
	const modalButtonRef = useRef<HTMLButtonElement>(null)
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const setSelected = (id: string, selected: boolean) => {
		setSelectedIds(ids => (selected ? [...ids, id] : ids.filter(_id => _id !== id)))
	}

	const decodeHtml = (html: string) => {
		if (typeof window !== "undefined") {
			return new DOMParser().parseFromString(html, "text/html").documentElement.textContent
		} else {
			return ""
		}
	}

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1>Statements</h1>

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
							<td>
								{statement.account.name} ({statement.account.id})
							</td>
							<td>{statement.transaction_date}</td>
							<td className={statement.amount < 0 ? "text-danger" : "text-success"}>
								{statement.allocations_sum_amount !== null
									? formatCurrency(statement.allocations_sum_amount) + " out of "
									: null}
								{formatCurrency(statement.amount)}
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
	statements: Statement[]
	categories: Category[]
}) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [errors, setErrors] = useState<Record<string, string[]>>({})

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
							<div className="flex-fill">
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
										type="date"
										className="form-control"
										name="date"
										id="date"
										defaultValue={
											statements.map(s => s.transaction_date).toSorted()[0] ??
											""
										}
									/>
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
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										))}
									</select>
									<div className="invalid-feedback">
										{errors.category_id?.join("\n")}
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
													<th>Account</th>
													<td>
														{statement.account.name} (
														{statement.account.id})
													</td>
												</tr>
												<tr>
													<th>Details</th>
													<td>
														{statement.supplementary_code}
														{", "}
														{statement.client_reference}
													</td>
												</tr>
												<tr>
													<th>Date</th>
													<td>{statement.transaction_date}</td>
												</tr>
												<tr>
													<th className="align-middle">Allocated</th>
													<td>
														<div className="input-group">
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
													<th
														className="align-middle"
														style={{ width: 120 }}
													>
														Description
													</th>
													<td>
														<div className="input-group">
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
