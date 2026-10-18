// Mirrors `Api\ImporterController` (dbs/ocbc/uob/revolut) in TypeScript.
// CSV via PapaParse, XLSX via SheetJS — replaces `maatwebsite/excel`.

import { DateTime } from "luxon"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { db } from "@/data/db"
import { ensureAccount } from "@/logic/accounts"
import { newId, round2 } from "@/logic/shared"
import { ValidationError, Validator } from "@/logic/validate"

export type ImportResult = { imported: number; reindexed: number; skipped: number }

type Row = (string | null)[]
type Parsed = {
	account_id: string
	datetime: string
	description: string
	amount: number
	is_pending?: number
}

async function readFile(file: File): Promise<Row[]> {
	const name = file.name.toLowerCase()
	if (name.endsWith(".csv")) {
		const text = await file.text()
		const parsed = Papa.parse<string[]>(text.trim(), { skipEmptyLines: true })
		if (parsed.errors.length) {
			throw new ValidationError({ files: ["Could not read this CSV file."] })
		}
		return parsed.data.map(row => row.map(value => (value === "" ? null : value)))
	}
	if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
		const buffer = await file.arrayBuffer()
		const workbook = XLSX.read(buffer, { type: "array", cellNF: true })
		const sheetName = workbook.SheetNames[0]
		const sheet = sheetName ? workbook.Sheets[sheetName] : undefined
		if (!sheet) throw new ValidationError({ files: ["This Excel file has no worksheets."] })
		// Decode calendar fields directly: SheetJS Date objects can drift with historical time zones.
		for (const [address, cell] of Object.entries(sheet)) {
			if (
				address.startsWith("!") ||
				cell.t !== "n" ||
				!XLSX.SSF.is_date(String(cell.z ?? ""))
			)
				continue
			const date = XLSX.SSF.parse_date_code(cell.v, {
				date1904: workbook.Workbook?.WBProps?.date1904,
			})
			if (!date) throw new ValidationError({ files: ["A statement date is invalid."] })
			sheet[address] = {
				...cell,
				t: "s",
				v: DateTime.fromObject({
					year: date.y,
					month: date.m,
					day: date.d,
					hour: date.H,
					minute: date.M,
				}).toFormat("yyyy-MM-dd HH:mm"),
			}
		}
		const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
			header: 1,
			raw: true,
		}) as unknown[][]
		return rows.map(row =>
			row.map(value =>
				value === null || value === undefined || value === "" ? null : String(value),
			),
		)
	}
	throw new ValidationError({ files: ["Unsupported file type."] })
}

function parseStatementDate(value: string | null | undefined): string {
	if (!value) throw new ValidationError({ files: ["A statement date is missing."] })
	const normalized = value
		.trim()
		.replace(/^(\d{1,2}\/\d{1,2}\/)(\d{2})$/, (_, date, year) => `${date}20${year}`)
	for (const format of ["d MMM yyyy", "d MMMM yyyy", "d/M/yyyy", "yyyy-MM-dd HH:mm"]) {
		const date = DateTime.fromFormat(normalized, format, { locale: "en" })
		if (date.isValid) return date.toFormat("yyyy-MM-dd 00:00")
	}
	throw new ValidationError({ files: ["A statement date is invalid."] })
}

async function selectedAccount(accountId: string, accountName: string | undefined, bank: string) {
	const id = accountId.trim()
	if (!id) {
		throw new ValidationError({
			[accountName === undefined ? "account_select" : "account_id"]: ["Select an account."],
		})
	}

	if (accountName !== undefined) {
		if (!accountName.trim()) {
			throw new ValidationError({ account_name: ["Enter an account name."] })
		}
		await ensureAccount(id, accountName.trim(), bank)
	} else if (!(await db.accounts.get(id))) {
		throw new ValidationError({ account_select: ["Select an account."] })
	}

	return id
}

function combine(header: Row, row: Row): Record<string, string | null> {
	const out: Record<string, string | null> = {}
	header.forEach((key, index) => {
		if (key) out[key] = row[index] ?? null
	})
	return out
}

function statementRows(data: Row[], columns: string[]) {
	const index = data.findIndex(row => columns.every(column => row.includes(column)))
	const header = data[index]
	if (!header)
		throw new ValidationError({ files: ["Required columns are missing from this export."] })
	return data.slice(index + 1).map(row => combine(header, row))
}

function parseAmount(value: string | null | undefined): number {
	const amount = Number((value ?? "0").replace(/,/g, ""))
	if (!Number.isFinite(amount)) {
		throw new ValidationError({ files: ["A statement amount is invalid."] })
	}
	return amount
}

function debitCreditAmount(debit: string | null | undefined, credit: string | null | undefined) {
	const withdrawal = parseAmount(debit)
	const deposit = parseAmount(credit)
	return round2(withdrawal !== 0 ? -withdrawal : deposit)
}

function descriptionKey(description: string | null | undefined): string {
	const value = description ?? ""
	const trimmed = value.trim()
	return trimmed === "" || trimmed === "-" ? "" : value
}

// Older DBS imports kept "-" in individual references before joining them.
function dbsDescriptionKey(description: string | null | undefined): string {
	return (description ?? "").split(", ").map(descriptionKey).filter(Boolean).join(", ")
}

async function upsertIndexed(
	rows: Parsed[],
	withIndex: boolean,
	normalizeDescription: (description: string | null | undefined) => string,
) {
	let imported = 0
	let reindexed = 0
	let skipped = 0

	type Meta = { data: Parsed; unique_key: string }
	const metas: Meta[] = rows.map(row => ({
		data: row,
		unique_key: [
			row.account_id,
			row.datetime,
			normalizeDescription(row.description),
			String(row.amount),
		].join("\n"),
	}))
	const duplicateCounts = new Map<string, number>()
	for (const meta of metas) {
		duplicateCounts.set(meta.unique_key, (duplicateCounts.get(meta.unique_key) ?? 0) + 1)
	}

	const countByDate = new Map<string, number>()
	for (const meta of metas) {
		const date = meta.data.datetime.slice(0, 10)
		countByDate.set(date, (countByDate.get(date) ?? 0) + 1)
	}
	const duplicateIndexes = new Map(duplicateCounts)
	const unmatched = new Map<string, { data: Parsed; raw: Parsed; index: number }[]>()
	const sameDescription = (actual: string, expected: string) =>
		normalizeDescription(actual) === normalizeDescription(expected)

	for (const meta of metas) {
		const data = { ...meta.data }
		const date = data.datetime.slice(0, 10)
		const index = withIndex ? (countByDate.get(date) ?? 1) : 0
		if (withIndex) countByDate.set(date, index - 1)

		if (withIndex && (duplicateCounts.get(meta.unique_key) ?? 0) > 1) {
			const duplicateIndex = duplicateIndexes.get(meta.unique_key) ?? 1
			duplicateIndexes.set(meta.unique_key, duplicateIndex - 1)
			data.description = data.description
				? `${data.description} #${duplicateIndex}`
				: `#${duplicateIndex}`
		}

		const existing = await db.statements
			.where("[account_id+datetime]")
			.equals([data.account_id, data.datetime])
			.filter(
				s =>
					sameDescription(s.description, data.description) &&
					s.amount === data.amount &&
					s.is_pending === (data.is_pending ?? 0),
			)
			.first()

		if (existing) {
			if (withIndex && existing.index !== index) {
				await db.statements.update(existing.id, { index })
				reindexed++
			} else {
				skipped++
			}
		} else if (withIndex && (duplicateCounts.get(meta.unique_key) ?? 0) > 1) {
			const list = unmatched.get(meta.unique_key) ?? []
			list.push({ data, raw: { ...meta.data }, index })
			unmatched.set(meta.unique_key, list)
		} else {
			imported++
			await db.statements.add({
				id: newId(),
				...data,
				is_pending: data.is_pending ?? 0,
				index: withIndex ? index : 0,
				imported_at: new Date().toISOString(),
			})
		}
	}

	for (const [, group] of unmatched) {
		const first = group[0]
		if (!first) continue
		const raw = first.raw
		const existing = await db.statements
			.where("[account_id+datetime]")
			.equals([raw.account_id, raw.datetime])
			.filter(
				s =>
					sameDescription(s.description, raw.description) &&
					s.amount === raw.amount &&
					s.is_pending === 0,
			)
			.first()
		let remaining = [...group]
		if (existing) {
			const matchIndex = group.findIndex(g => g.index === existing.index)
			const matchIdx = matchIndex === -1 ? 0 : matchIndex
			const match = group[matchIdx]
			if (!match) continue
			await db.statements.update(existing.id, {
				description: match.data.description,
				index: match.index,
			})
			reindexed++
			remaining = group.filter((_, i) => i !== matchIdx)
		}
		for (const item of remaining) {
			imported++
			await db.statements.add({
				id: newId(),
				...item.data,
				is_pending: 0,
				index: item.index,
				imported_at: new Date().toISOString(),
			})
		}
	}

	return { imported, reindexed, skipped }
}

async function importFiles(
	files: File[],
	parse: (data: Row[]) => Promise<{ rows: Parsed[]; skipped?: number }>,
	withIndex = true,
	normalizeDescription = descriptionKey,
): Promise<ImportResult> {
	if (!files.length) throw new ValidationError({ files: ["Select at least one file."] })

	// Read files before opening IndexedDB's transaction; file I/O can outlive it.
	const exports = await Promise.all(files.map(readFile))
	return db.transaction("rw", db.accounts, db.statements, async () => {
		const totals = { imported: 0, reindexed: 0, skipped: 0 }
		for (const data of exports) {
			const { rows, skipped = 0 } = await parse(data)
			const validator = new Validator()
			for (const row of rows) {
				validator.text(row.account_id, "files", "A statement account is missing.")
				validator.amount(row.amount, "files", "A statement amount is invalid.")
				if (!DateTime.fromFormat(row.datetime, "yyyy-MM-dd HH:mm").isValid) {
					validator.reject("files", "A statement date is invalid.")
				}
			}
			validator.throwIfInvalid()
			const result = await upsertIndexed(rows, withIndex, normalizeDescription)
			totals.imported += result.imported
			totals.reindexed += result.reindexed
			totals.skipped += result.skipped + skipped
		}
		return totals
	})
}

export async function importDbs(files: File[]): Promise<ImportResult> {
	return importFiles(
		files,
		async data => {
			const details = data.shift()
			if (!details || details[0] !== "Account Details For:") {
				throw new ValidationError({
					files: ["Account details are missing from this export."],
				})
			}
			const info = (details[1] ?? "").split(" ")
			const accountId = (info[1] ?? "").replace(/-/g, "")
			if (!accountId)
				throw new ValidationError({
					files: ["Account details are missing from this export."],
				})
			await ensureAccount(accountId, info[0] ?? accountId, "DBS")

			const rows: Parsed[] = []
			for (const statement of statementRows(data, [
				"Transaction Date",
				"Status",
				"Supplementary Code",
				"Client Reference",
				"Additional Reference",
				"Debit Amount",
				"Credit Amount",
			])) {
				if (statement.Status !== "Settled") {
					throw new ValidationError({
						files: ["This export contains an unsettled statement."],
					})
				}
				const datetime = parseStatementDate(statement["Transaction Date"])
				const description = [
					statement["Supplementary Code"],
					statement["Client Reference"],
					statement["Additional Reference"],
				]
					.filter(v => v && v.trim() !== "" && v.trim() !== "-")
					.join(", ")
				rows.push({
					account_id: accountId,
					datetime,
					description,
					amount: debitCreditAmount(
						statement["Debit Amount"],
						statement["Credit Amount"],
					),
					is_pending: 0,
				})
			}
			return { rows }
		},
		true,
		dbsDescriptionKey,
	)
}

export async function importUob(files: File[]): Promise<ImportResult> {
	return importFiles(
		files,
		async data => {
			const numberRow = data.find(row => row[0] === "Account Number:")
			if (!numberRow) {
				throw new ValidationError({
					files: ["The account number is missing from this export."],
				})
			}
			const accountId = numberRow[1] ?? ""
			const typeRow = data.find(row => row[0] === "Account Type:")
			if (!typeRow) {
				throw new ValidationError({
					files: ["The account type is missing from this export."],
				})
			}
			await ensureAccount(accountId, typeRow[1] ?? accountId, "UOB")
			const rows: Parsed[] = []
			for (const statement of statementRows(data, [
				"Transaction Date",
				"Transaction Description",
				"Withdrawal",
				"Deposit",
			])) {
				const datetime = parseStatementDate(statement["Transaction Date"])
				rows.push({
					account_id: accountId,
					datetime,
					description: descriptionKey(statement["Transaction Description"]),
					amount: debitCreditAmount(statement.Withdrawal, statement.Deposit),
					is_pending: 0,
				})
			}
			return { rows }
		},
		true,
		descriptionKey,
	)
}

export async function importOcbc(files: File[]): Promise<ImportResult> {
	return importFiles(
		files,
		async data => {
			const details = data.shift()
			const account = /^OCBC\s+(.+?)\s+(\d[\d-]*)$/.exec(details?.[1]?.trim() ?? "")
			if (details?.[0] !== "Account details for:" || !account) {
				throw new ValidationError({
					files: ["OCBC account details are missing from this export."],
				})
			}
			const accountId = account[2]?.replace(/-/g, "") ?? ""
			const accountName = account[1] ?? ""
			const rows: Parsed[] = []
			for (const statement of statementRows(data, [
				"Transaction date",
				"Value date",
				"Description",
				"Withdrawals(SGD)",
				"Deposits(SGD)",
			])) {
				rows.push({
					account_id: accountId,
					datetime: parseStatementDate(statement["Transaction date"]),
					description: descriptionKey(
						(statement.Description ?? "").replace(/\s+/g, " ").trim(),
					),
					amount: debitCreditAmount(
						statement["Withdrawals(SGD)"],
						statement["Deposits(SGD)"],
					),
					is_pending: 0,
				})
			}

			await ensureAccount(accountId, accountName, "OCBC")
			return { rows }
		},
		true,
		descriptionKey,
	)
}

export async function importRevolut(
	file: File | null,
	accountId: string,
	accountName?: string,
): Promise<ImportResult> {
	if (!file) throw new ValidationError({ files: ["Select a file."] })
	return importFiles(
		[file],
		async data => {
			const id = await selectedAccount(accountId, accountName, "Revolut")
			const rows: Parsed[] = []
			let skipped = 0
			for (const statement of statementRows(data, [
				"State",
				"Started Date",
				"Description",
				"Amount",
				"Fee",
			])) {
				if (statement.State === "REVERTED") {
					skipped++
					continue
				}
				if (statement.State !== "COMPLETED" && statement.State !== "PENDING") {
					throw new ValidationError({
						files: ["This export contains a statement with an unsupported status."],
					})
				}
				rows.push({
					account_id: id,
					datetime: (statement["Started Date"] ?? "").slice(0, 16).replace("T", " "),
					description: descriptionKey(statement.Description),
					amount: round2(parseAmount(statement.Amount) - parseAmount(statement.Fee)),
					is_pending: statement.State === "PENDING" ? 1 : 0,
				})
			}
			return { rows, skipped }
		},
		false,
	)
}
