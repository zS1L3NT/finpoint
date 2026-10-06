"use client"

import { useForm, useStore } from "@tanstack/react-form"
import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useRef, useState } from "react"
import { toast } from "sonner"
import SelectField from "@/components/form/select-field"
import TextField from "@/components/form/text-field"
import { UiIcon as IconifyIcon } from "@/components/icon"
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
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { BANKS } from "@/lib/banks"
import { cn } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { importDbs, importOcbc, importRevolut, importUob } from "@/logic/importer"
import { ValidationError } from "@/logic/validate"
import { pathAllocator } from "@/routes"

const BANKS_REQUIRING_ADDITIONAL_INFO = ["revolut"]

const ACCEPT = [
	".csv",
	".xls",
	".xlsx",
	"text/csv",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
].join(",")

function Step({
	number,
	title,
	children,
}: {
	number: number
	title: string
	children: React.ReactNode
}) {
	return (
		<section className="grid gap-3">
			<h3 className="flex items-center gap-2 text-sm font-medium">
				<span className="grid size-5 place-items-center rounded-full bg-foreground text-[0.6875rem] text-background">
					{number}
				</span>
				{title}
			</h3>
			{children}
		</section>
	)
}

export default function ImporterPage() {
	const [files, setFiles] = useState<File[]>([])
	const [fileInputKey, setFileInputKey] = useState(0)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [dragging, setDragging] = useState(false)
	const [result, setResult] = useState<{
		imported: number
		reindexed: number
		skipped: number
	} | null>(null)
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
				const accountId = isNewAccount ? value.account_id : value.account_select
				const accountName = isNewAccount ? value.account_name : undefined
				const data =
					value.bank === "dbs"
						? await importDbs(files)
						: value.bank === "uob"
							? await importUob(files)
							: value.bank === "ocbc"
								? await importOcbc(files)
								: await importRevolut(files[0] ?? null, accountId, accountName)
				toast.success(`Imported successful`, {
					description: (
						<>
							<p>Inserted {data.imported} statements.</p>
							<p>Re-indexed {data.reindexed} existing statements.</p>
							<p>Skipped {data.skipped} unchanged statements.</p>
						</>
					),
				})
				setResult(data)
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
	const submitting = useStore(form.store, state => state.isSubmitting)

	return (
		<>
			<PageContent>
				<PageHeader
					title="Importer"
					subtitle="Upload one or more bank CSV exports, create any missing accounts, and move straight into allocation once the feed is loaded."
					description="Import workspace"
					icon="lucide:import"
				/>

				<form
					className="grid max-w-3xl gap-6"
					method="POST"
					encType="multipart/form-data"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					{result ? (
						<div className="flex flex-col gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-start gap-3">
								<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
									<IconifyIcon icon="lucide:circle-check" className="size-5" />
								</span>
								<div>
									<p className="font-medium">
										{result.imported} new statement
										{result.imported === 1 ? "" : "s"} imported
									</p>
									<p className="text-xs text-muted-foreground">
										{result.reindexed} re-indexed · {result.skipped} already
										here
									</p>
								</div>
							</div>
							{result.imported ? (
								<Button asChild>
									<Link href={pathAllocator()}>
										Allocate them <IconifyIcon icon="lucide:arrow-right" />
									</Link>
								</Button>
							) : null}
						</div>
					) : null}

					<Card>
						<CardHeader className="border-b">
							<CardTitle>Upload statements</CardTitle>
							<CardDescription>
								Choose the bank, then add its CSV or Excel exports.
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							<form.Field name="bank">
								{field => {
									const errors = mergeErrors(field.state.meta.errors, field.name)
									return (
										<Step number={1} title="Bank">
											<div
												role="radiogroup"
												aria-label="Bank"
												className="grid grid-cols-2 gap-2 sm:grid-cols-4"
											>
												{BANKS.map(item => (
													<button
														key={item.value}
														type="button"
														role="radio"
														aria-checked={
															field.state.value === item.value
														}
														onClick={() => {
															field.handleChange(item.value)
															form.setFieldValue("account_select", "")
															form.setFieldValue("account_id", "")
															form.setFieldValue("account_name", "")
															clearApiError(field.name)
															clearApiError("account_select")
															clearApiError("account_id")
															clearApiError("account_name")
														}}
														className="flex cursor-pointer items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted aria-checked:border-foreground aria-checked:ring-1 aria-checked:ring-foreground"
													>
														<span
															className="grid size-7 shrink-0 place-items-center rounded-md text-[0.625rem] font-bold text-white"
															style={{ backgroundColor: item.color }}
														>
															{item.short}
														</span>
														<span className="grid">
															<span className="font-medium">
																{item.label}
															</span>
															<span className="text-[0.6875rem] text-muted-foreground">
																{item.formats}
															</span>
														</span>
													</button>
												))}
											</div>
											<FieldError errors={errors} />
										</Step>
									)
								}}
							</form.Field>

							{BANKS_REQUIRING_ADDITIONAL_INFO.includes(bank) && (
								<Step number={2} title="Account">
									<form.Field name="account_select">
										{field => (
											<SelectField
												id={field.name}
												label="Account"
												value={field.state.value}
												errors={mergeErrors(
													field.state.meta.errors,
													field.name,
												)}
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
								</Step>
							)}

							<form.Field name="files">
								{field => {
									const errors = mergeErrors(field.state.meta.errors, field.name)
									const single = BANKS_REQUIRING_ADDITIONAL_INFO.includes(bank)
									const pick = (picked: File[]) => {
										const next = single ? picked.slice(0, 1) : picked
										field.handleChange(next)
										setFiles(next)
										clearApiError(field.name)
									}

									return (
										<Step
											number={
												BANKS_REQUIRING_ADDITIONAL_INFO.includes(bank)
													? 3
													: 2
											}
											title="Statement files"
										>
											<Field data-invalid={!!errors.length}>
												<Input
													key={fileInputKey}
													ref={fileInputRef}
													id={field.name}
													name="files[]"
													type="file"
													className="hidden"
													multiple={!single}
													accept={ACCEPT}
													aria-invalid={!!errors.length}
													onChange={event =>
														pick(
															Array.from(
																event.currentTarget.files ?? [],
															),
														)
													}
												/>
												<button
													type="button"
													onClick={() => fileInputRef.current?.click()}
													onDragOver={event => {
														event.preventDefault()
														setDragging(true)
													}}
													onDragLeave={() => setDragging(false)}
													onDrop={event => {
														event.preventDefault()
														setDragging(false)
														pick(
															Array.from(
																event.dataTransfer.files ?? [],
															),
														)
													}}
													className={cn(
														"grid cursor-pointer place-items-center gap-1.5 rounded-lg border border-dashed px-4 py-8 text-center text-sm transition-colors hover:bg-muted/50",
														dragging && "border-foreground bg-muted/60",
														errors.length && "border-destructive",
													)}
												>
													<IconifyIcon
														icon="lucide:file-up"
														className="size-6 text-muted-foreground"
													/>
													<span className="font-medium">
														Drop{" "}
														{single ? "your export" : "bank exports"}{" "}
														here
													</span>
													<span className="text-xs text-muted-foreground">
														or click to choose · CSV, XLS or XLSX
													</span>
												</button>
												<FieldError errors={errors} />
											</Field>
											{files.length ? (
												<ul className="grid gap-1.5">
													{files.map(file => (
														<li
															key={`${file.name}-${file.size}`}
															className="flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm"
														>
															<IconifyIcon
																icon="lucide:file-spreadsheet"
																className="size-4 shrink-0 text-muted-foreground"
															/>
															<span className="min-w-0 flex-1 truncate">
																{file.name}
															</span>
															<span className="text-xs text-muted-foreground tabular-nums">
																{(file.size / 1024).toFixed(1)} KB
															</span>
															<Button
																type="button"
																variant="ghost"
																size="icon-sm"
																aria-label={`Remove ${file.name}`}
																onClick={() =>
																	pick(
																		files.filter(
																			item => item !== file,
																		),
																	)
																}
															>
																<IconifyIcon icon="lucide:x" />
															</Button>
														</li>
													))}
												</ul>
											) : null}
										</Step>
									)
								}}
							</form.Field>
						</CardContent>

						<CardFooter className="flex flex-col gap-2 border-t bg-muted/20 sm:flex-row sm:justify-between">
							<span className="text-xs text-muted-foreground">
								Duplicates are skipped; missing accounts are created for you.
							</span>
							<Button
								type="submit"
								className="w-full sm:w-auto"
								disabled={!bank || !files.length || submitting}
							>
								<IconifyIcon
									icon={submitting ? "lucide:loader-circle" : "lucide:import"}
									className={submitting ? "animate-spin" : undefined}
								/>
								{submitting
									? "Importing…"
									: files.length
										? `Import ${files.length} file${files.length === 1 ? "" : "s"}`
										: "Import"}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</PageContent>
		</>
	)
}
