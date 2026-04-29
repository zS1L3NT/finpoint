import { useForm, useStore } from "@tanstack/react-form"
import { FileIcon, ImportIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import SelectField from "@/components/form/select-field"
import TextField from "@/components/form/text-field"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { Account } from "@/types"
import {
	importerDbsApiRoute,
	importerRevolutApiRoute,
	importerUobApiRoute,
} from "@/wayfinder/routes"

const BANKS_REQUIRING_ADDITIONAL_INFO = ["revolut"]

export default function ImporterPage({ accounts }: { accounts: Account[] }) {
	const [files, setFiles] = useState<File[]>([])
	const { mergeErrors, clearApiError, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			bank: "",
			account_select: "",
			account_id: "",
			account_name: "",
			files: [] as File[],
		},
		onSubmit: async ({ value }) => {
			let url = ""
			const formData = new FormData()

			if (!value.bank) {
				setApiErrors({ bank: ["Please select a bank"] })
				return
			}

			if (value.bank === "dbs") {
				url = importerDbsApiRoute.url()
				files.forEach(file => formData.append("files[]", file))
			}

			if (value.bank === "uob") {
				url = importerUobApiRoute.url()
				files.forEach(file => formData.append("files[]", file))
			}

			if (value.bank === "revolut") {
				url = importerRevolutApiRoute.url()
				if (files[0]) {
					formData.append("file", files[0])
				}

				if (value.account_select === "new") {
					formData.append("account_id", value.account_id)
					formData.append("account_name", value.account_name)
				} else {
					formData.append("account_id", value.account_select)
				}
			}

			const response = await fetch(url, {
				method: "POST",
				body: formData,
				headers: { Accept: "application/json" },
			})

			if (response.status === 422) {
				const data = await response.json().catch(() => null)
				setApiErrors((data?.errors ?? {}) as globalThis.Record<string, string[]>)
				return
			}

			if (response.ok) {
				const data = await response.json().catch(() => null)
				toast.success(`Imported successful`, {
					description: (
						<>
							<p>Imported {data.imported} statements.</p>
							<p>Skipped {data.skipped} duplicates.</p>
						</>
					),
				})
				form.reset()
				setFiles([])
				return
			}
		},
	})

	const bank = useStore(form.store, state => state.values.bank)
	const accountSelect = useStore(form.store, state => state.values.account_select)

	return (
		<>
			<AppHeader title="Importer" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Importer"
					subtitle="Upload one or more bank CSV exports, create any missing accounts, and move straight into allocation once the feed is loaded."
					description="Import workspace"
					icon={ImportIcon}
				/>

				<form
					method="POST"
					encType="multipart/form-data"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<Card className="w-full md:w-1/2">
						<CardHeader>
							<CardTitle>Upload statements</CardTitle>
							<CardDescription>
								Select your bank and upload CSV files to import your bank
								statements.
								<br />
								Missing accounts are created automatically and duplicate statement
								rows are skipped.
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							<form.Field name="bank">
								{field => (
									<SelectField
										id={field.name}
										label="Bank"
										value={field.state.value}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										placeholder="Select your bank"
										items={[
											{ value: "dbs", label: "DBS" },
											{ value: "uob", label: "UOB" },
											{ value: "revolut", label: "Revolut" },
										]}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>

							{BANKS_REQUIRING_ADDITIONAL_INFO.includes(bank) && (
								<>
									<form.Field name="account_select">
										{field => (
											<SelectField
												id={field.name}
												label="Account"
												value={field.state.value}
												errors={[]}
												items={[
													...accounts
														.filter(
															a =>
																a.bank.toLowerCase() ===
																bank.toLowerCase(),
														)
														.map(a => ({
															label: a.name,
															value: a.id,
														})),
													{ label: "New account", value: "new" },
												]}
												onChange={value => {
													field.handleChange(value)
													clearApiError(field.name)
												}}
											/>
										)}
									</form.Field>

									{accountSelect === "new" && (
										<>
											<form.Field name="account_id">
												{field => (
													<TextField
														id={field.name}
														label="Account ID"
														value={field.state.value}
														errors={mergeErrors(
															field.state.meta.errors,
															field.name,
														)}
														onChange={value => {
															field.handleChange(value)
															clearApiError(field.name)
														}}
													/>
												)}
											</form.Field>

											<form.Field name="account_name">
												{field => (
													<TextField
														id={field.name}
														label="Account Name"
														value={field.state.value}
														errors={mergeErrors(
															field.state.meta.errors,
															field.name,
														)}
														onChange={value => {
															field.handleChange(value)
															clearApiError(field.name)
														}}
													/>
												)}
											</form.Field>
										</>
									)}
								</>
							)}

							<form.Field name="files">
								{field => {
									const errors = mergeErrors(field.state.meta.errors, field.name)

									return (
										<Field data-invalid={!!errors.length}>
											<FieldLabel htmlFor={field.name}>
												Statement files
											</FieldLabel>
											<Input
												id={field.name}
												name="files[]"
												type="file"
												multiple={
													!BANKS_REQUIRING_ADDITIONAL_INFO.includes(bank)
												}
												accept={[
													".csv",
													".xls",
													".xlsx",
													"text/csv",
													"application/vnd.ms-excel",
													"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
												].join(",")}
												aria-invalid={!!errors.length}
												onChange={event => {
													const nextFiles = Array.from(
														event.currentTarget.files ?? [],
													)
													field.handleChange(nextFiles)
													setFiles(nextFiles)
													clearApiError(field.name)
												}}
											/>
											<FieldError errors={errors} />
										</Field>
									)
								}}
							</form.Field>

							{files.length ? (
								<div className="space-y-2">
									{files.map(file => (
										<Item key={`${file.name}-${file.size}`} variant="outline">
											<ItemMedia>
												<FileIcon className="size-5" />
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{file.name}</ItemTitle>
												<ItemDescription>
													{(file.size / 1024).toFixed(2)} KB
												</ItemDescription>
											</ItemContent>
										</Item>
									))}
								</div>
							) : null}
						</CardContent>

						<CardFooter>
							<Button type="submit" variant="outline" className="w-full">
								<ImportIcon />
								Import
							</Button>
						</CardFooter>
					</Card>
				</form>
			</div>
		</>
	)
}
