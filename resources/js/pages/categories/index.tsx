import React, { useEffect, useRef, useState } from "react"
import CategoryController from "@/actions/App/Http/Controllers/CategoryController"
import Icon from "@/components/icon"
import { Category } from "@/types"

export default function CategoriesIndex({ categories }: { categories: Category[] }) {
	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1>Categories</h1>

				<button
					type="button"
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#category-creator"
				>
					Create
				</button>
			</div>

			<CategoryCreator categories={categories} />

			<div className="list-group">
				{categories.map(category => (
					<CategoryItem key={category.id} category={category} depth={0} />
				))}
			</div>
		</>
	)
}

function CategoryItem({ category, depth }: { category: Category; depth: number }) {
	return (
		<>
			<button
				type="button"
				className="list-group-item list-group-item-action"
				data-bs-toggle="modal"
				data-bs-target={`#category-${category.id}-editor`}
			>
				<div className="d-flex align-items-center gap-2" style={{ marginLeft: depth * 24 }}>
					<Icon name={category.icon} color={category.color} />
					<p className="m-0">{category.name}</p>
				</div>
			</button>

			<CategoryEditor category={category} />

			{category.children?.map(category => (
				<CategoryItem key={category.id} category={category} depth={depth + 1} />
			))}
		</>
	)
}

function CategoryCreator({ categories }: { categories: Category[] }) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [name, setName] = useState("")
	const [icon, setIcon] = useState("")
	const [color, setColor] = useState("")
	const [errors, setErrors] = useState<Record<string, string[]>>({})

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		await fetch(CategoryController.store().url, {
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
			id="category-creator"
			tabIndex={-1}
			aria-labelledby="category-creator-label"
			aria-hidden="true"
			onSubmit={handleSubmit}
		>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="category-creator-label">
							Category Creator
						</h1>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">
						<div className="mb-3">
							<label htmlFor="name" className="form-label">
								Name
							</label>
							<input
								type="text"
								className={`form-control ${errors.name?.length ? "is-invalid" : ""}`}
								name="name"
								id="name"
								value={name}
								onChange={e => setName(e.target.value)}
							/>
							<div className="invalid-feedback">{errors.name?.join("\n")}</div>
						</div>

						<div className="mb-3">
							<label htmlFor="icon" className="form-label">
								Icon
							</label>
							<input
								type="text"
								className={`form-control ${errors.icon?.length ? "is-invalid" : ""}`}
								name="icon"
								id="icon"
								value={icon}
								onChange={e => setIcon(e.target.value)}
							/>
							<div className="invalid-feedback">{errors.icon?.join("\n")}</div>
						</div>

						<div className="mb-3">
							<label htmlFor="color" className="form-label">
								Color
							</label>
							<input
								type="text"
								className={`form-control ${errors.color?.length ? "is-invalid" : ""}`}
								name="color"
								id="color"
								value={color}
								onChange={e => setColor(e.target.value)}
							/>
							<div className="invalid-feedback">{errors.color?.join("\n")}</div>
						</div>

						<div className="mb-3">
							<label htmlFor="parent_category_id" className="form-label">
								Parent Category
							</label>
							<select
								className={`form-select ${errors.parent_category_id?.length ? "is-invalid" : ""}`}
								name="parent_category_id"
								id="parent_category_id"
							>
								<option value="" selected>
									-
								</option>
								{categories.map(category => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
							<div className="invalid-feedback">
								{errors.parent_category_id?.join("\n")}
							</div>
						</div>

						<div className="d-flex align-items-center gap-2 mt-4">
							<Icon name={icon} color={color} />
							<p className="m-0">{name}</p>
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

function CategoryEditor({ category }: { category: Category }) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [name, setName] = useState("")
	const [icon, setIcon] = useState("")
	const [color, setColor] = useState("")
	const [errors, setErrors] = useState<Record<string, string[]>>({})

	useEffect(() => {
		setName(category.name)
		setIcon(category.icon)
		setColor(category.color)
	}, [category])

	const handleDelete = async () => {
		const formData = new FormData()
		formData.set("_method", "DELETE")

		await fetch(CategoryController.destroy({ category }).url, {
			method: "post",
			body: formData,
			headers: { Accept: "application/json" },
		}).then(res => {
			if (res.status === 200) {
				closeButtonRef.current?.click()
				setTimeout(() => {
					window.location.reload()
				}, 500)
			}
		})
	}

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		formData.set("_method", "PUT")

		await fetch(CategoryController.update({ category }).url, {
			method: "post",
			body: formData,
			headers: { Accept: "application/json" },
		})
			.then(async res => [res, await res.json()] as const)
			.then(([res, data]) => {
				if (res.status === 422) {
					setErrors(data.errors)
				}

				if (res.status === 200) {
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
			id={`category-${category.id}-editor`}
			tabIndex={-1}
			aria-labelledby={`category-${category.id}-editor-label`}
			aria-hidden="true"
			onSubmit={handleSubmit}
		>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id={`category-${category.id}-editor`}>
							Category Editor
						</h1>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">
						<div className="mb-3">
							<label htmlFor="name" className="form-label">
								Name
							</label>
							<input
								type="text"
								className={`form-control ${errors.name?.length ? "is-invalid" : ""}`}
								name="name"
								id="name"
								value={name}
								onChange={e => setName(e.target.value)}
							/>
							<div className="invalid-feedback">{errors.name?.join("\n")}</div>
						</div>

						<div className="mb-3">
							<label htmlFor="icon" className="form-label">
								Icon
							</label>
							<input
								type="text"
								className={`form-control ${errors.icon?.length ? "is-invalid" : ""}`}
								name="icon"
								id="icon"
								value={icon}
								onChange={e => setIcon(e.target.value)}
							/>
							<div className="invalid-feedback">{errors.icon?.join("\n")}</div>
						</div>

						<div className="mb-3">
							<label htmlFor="color" className="form-label">
								Color
							</label>
							<input
								type="text"
								className={`form-control ${errors.color?.length ? "is-invalid" : ""}`}
								name="color"
								id="color"
								value={color}
								onChange={e => setColor(e.target.value)}
							/>
							<div className="invalid-feedback">{errors.color?.join("\n")}</div>
						</div>

						<div className="d-flex align-items-center gap-2 mt-4">
							<Icon name={icon} color={color} />
							<p className="m-0">{name}</p>
						</div>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-danger me-auto"
							onClick={handleDelete}
							disabled={category.records_count !== 0}
						>
							Delete
						</button>
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
