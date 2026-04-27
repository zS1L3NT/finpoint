import { router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { FileIcon, ImportIcon } from "lucide-react"
import { useState } from "react"
import SelectField from "@/components/form/select-field"
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
import { allocatorWebRoute, importerApiRoute } from "@/wayfinder/routes"

export default function Importer() {
	const [files, setFiles] = useState<File[]>([])
	const { mergeErrors, clearApiError, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			bank: "",
			files: [] as File[],
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("bank", value.bank)
			value.files.forEach(file => formData.append("files[]", file))

			const response = await fetch(importerApiRoute.url(), {
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
				router.visit(allocatorWebRoute.url())
			}
		},
	})

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
							<form.Field
								name="bank"
								children={field => (
									<SelectField
										id={field.name}
										label="Bank"
										value={field.state.value}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										placeholder="Select your bank"
										items={[
											{ value: "dbs", label: "DBS" },
											{ value: "uob", label: "UOB" },
										]}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							/>

							<form.Field
								name="files"
								children={field => {
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
												multiple
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
							/>

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
								<form.Subscribe
									selector={state => state.isSubmitting}
									children={isSubmitting =>
										isSubmitting ? (
											<ImportIcon className="animate-pulse" />
										) : (
											<ImportIcon />
										)
									}
								/>
								Import
							</Button>
						</CardFooter>
					</Card>
				</form>
			</div>
		</>
	)
}
