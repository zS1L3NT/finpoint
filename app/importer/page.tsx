"use client"

import { useForm, useStore } from "@tanstack/react-form"
import { useLiveQuery } from "dexie-react-hooks"
import { useState } from "react"
import { toast } from "sonner"
import SelectField from "@/components/form/select-field"
import TextField from "@/components/form/text-field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
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
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { listAccounts } from "@/logic/accounts"
import { importDbs, importRevolut, importUob } from "@/logic/importer"
import { ValidationError } from "@/logic/validate"

const BANKS_REQUIRING_ADDITIONAL_INFO = ["revolut"]

export default function ImporterPage() {
	const [files, setFiles] = useState<File[]>([])
	const [fileInputKey, setFileInputKey] = useState(0)
	const { mergeErrors, clearApiError, setApiErrors } = useApiFormErrors()
	const accounts = useLiveQuery(() => listAccounts(), []) ?? []

	const form = useForm({
		defaultValues: {
			bank: "",
			account_select: "",
			account_id: "",
			account_name: "",
			files: [] as File[],
		},
		onSubmit: async ({ value }) => {
			if (!value.bank) {
				setApiErrors({ bank: ["Please select a bank"] })
				return
			}

			try {
				const isNewAccount = value.account_select === "new"
				const data =
					value.bank === "dbs"
						? await importDbs(files)
						: value.bank === "uob"
							? await importUob(files)
							: await importRevolut(
									files[0] ?? null,
									isNewAccount ? value.account_id : value.account_select,
									isNewAccount ? value.account_name : undefined,
								)
				toast.success(`Imported successful`, {
					description: (
						<>
							<p>Inserted {data.imported} statements.</p>
							<p>Re-indexed {data.reindexed} existing statements.</p>
							<p>Skipped {data.skipped} unchanged statements.</p>
						</>
					),
				})
				form.reset()
				setFiles([])
				setFileInputKey(key => key + 1)
			} catch (cause) {
				if (cause instanceof ValidationError) {
					setApiErrors(cause.errors)
					return
				}
				toast.error("Import failed. Check your files and try again.")
			}
		},
	})

	const bank = useStore(form.store, state => state.values.bank)
	const accountSelect = useStore(form.store, state => state.values.account_select)

	return (
		<>
			<AppHeader title="Importer" />

			<PageContent>
				<PageHeader
					title="Importer"
					subtitle="Upload one or more bank CSV exports, create any missing accounts, and move straight into allocation once the feed is loaded."
					description="Import workspace"
					icon="lucide:import"
				/>

				<form
					className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start"
					method="POST"
					encType="multipart/form-data"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<Card>
						<CardHeader className="border-b">
							<CardTitle>Upload statements</CardTitle>
							<CardDescription>
								Select your bank and upload CSV files to import your bank
								statements.
								<br />
								Missing accounts are created automatically and duplicate statement
								rows are re-indexed when their day index changes.
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
												key={fileInputKey}
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
												<IconifyIcon
													icon="lucide:file"
													className="size-5"
												/>
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

						<CardFooter className="border-t bg-muted/20">
							<Button type="submit" className="w-full sm:ml-auto sm:w-auto">
								<IconifyIcon icon="lucide:import" />
								Import
							</Button>
						</CardFooter>
					</Card>

					<Card className="bg-muted/20" size="sm">
						<CardHeader>
							<CardTitle>Import flow</CardTitle>
							<CardDescription>
								A quick check before adding account activity.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ol className="grid gap-4 text-sm">
								<li className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
										1
									</span>
									<span>Select the bank that produced the export.</span>
								</li>
								<li className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
										2
									</span>
									<span>Choose the account when the bank requires it.</span>
								</li>
								<li className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
										3
									</span>
									<span>Review the selected files, then import.</span>
								</li>
							</ol>
						</CardContent>
					</Card>
				</form>
			</PageContent>
		</>
	)
}
