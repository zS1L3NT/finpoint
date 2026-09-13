// Mirrors `Api\ImporterController` (dbs/uob/revolut) in TypeScript.
// CSV via PapaParse, XLSX via SheetJS — replaces `maatwebsite/excel`.

import Papa from "papaparse"
import * as XLSX from "xlsx"
import { asPending, db } from "@/data/db"
import { ensureAccount } from "@/logic/accounts"
import { newId, round2, ValidationError } from "@/logic/shared"

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
			throw new ValidationError({ files: ["Invalid CSV Format: unable to parse file."] })
		}
		return parsed.data.map(row => row.map(value => (value === "" ? null : value)))
	}
	if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
		const buffer = await file.arrayBuffer()
		const workbook = XLSX.read(buffer, { type: "array" })
		const sheet = workbook.Sheets[workbook.SheetNames[0]]
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

function parseDayMonthYear(value: string | null): string {
	// "27 May 2026" -> "2026-05-27 00:00"
	if (!value)
		throw new ValidationError({ files: ["Invalid CSV Format: missing transaction date."] })
	const months: Record<string, string> = {
		jan: "01",
		feb: "02",
		mar: "03",
		apr: "04",
		may: "05",
		jun: "06",
		jul: "07",
		aug: "08",
		sep: "09",
		oct: "10",
		nov: "11",
		dec: "12",
	}
	const parts = value.trim().split(/\s+/)
	if (parts.length !== 3) throw new ValidationError({ files: ["Invalid CSV Format: bad date."] })
	const [day, mon, year] = parts
	const month = months[mon.slice(0, 3).toLowerCase()]
	if (!month) throw new ValidationError({ files: ["Invalid CSV Format: bad date."] })
	return `${year}-${month}-${day.padStart(2, "0")} 00:00`
}

function combine(header: Row, row: Row): Record<string, string | null> {
	const out: Record<string, string | null> = {}
	header.forEach((key, index) => {
		if (key) out[key] = row[index] ?? null
	})
	return out
}

async function upsertIndexed(rows: Parsed[] & { index?: number }[], withIndex: boolean) {
	let imported = 0
	let reindexed = 0
	let skipped = 0

	type Meta = { data: Parsed; unique_key: string }
	const metas: Meta[] = rows.map(row => ({
		data: row,
		unique_key: [row.account_id, row.datetime, row.description, String(row.amount)].join("\n"),
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
					s.description === data.description &&
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
			})
		}
	}

	for (const [, group] of unmatched) {
		const raw = group[0].raw
		const existing = await db.statements
			.where("[account_id+datetime]")
			.equals([raw.account_id, raw.datetime])
			.filter(
				s =>
					s.description === raw.description &&
					s.amount === raw.amount &&
					s.is_pending === 0,
			)
			.first()
		let remaining = [...group]
		if (existing) {
			const matchIndex = group.findIndex(g => g.index === existing.index)
			const match = matchIndex === -1 ? 0 : matchIndex
			await db.statements.update(existing.id, {
				description: group[match].data.description,
				index: group[match].index,
			})
			reindexed++
			remaining = group.filter((_, i) => i !== match)
		}
		for (const item of remaining) {
			imported++
			await db.statements.add({ id: newId(), ...item.data, is_pending: 0, index: item.index })
		}
	}

	return { imported, reindexed, skipped }
}

export async function importDbs(files: File[]): Promise<ImportResult> {
	if (!files.length) throw new ValidationError({ files: ["Select at least one file."] })
	let imported = 0
	let reindexed = 0
	let skipped = 0

	for (const file of files) {
		const data = await readFile(file)
		const details = data.shift()
		if (!details || details[0] !== "Account Details For:") {
			throw new ValidationError({ files: ["Invalid CSV Format: Missing Account details."] })
		}
		const info = (details[1] ?? "").split(" ")
		const accountId = (info[1] ?? "").replace(/-/g, "")
		if (!accountId)
			throw new ValidationError({ files: ["Invalid CSV Format: Missing Account details."] })
		await ensureAccount(accountId, info[0] ?? accountId, "DBS")

		for (let i = 0; i < 7; i++) data.shift() // statement-as-at … ledger-balance blanks
		const header = data.shift() ?? []
		const rows: Parsed[] = []
		for (const row of data) {
			const statement = combine(header, row)
			if (statement.Status !== "Settled") {
				throw new ValidationError({
					files: ["Invalid CSV Format: Unsettled transaction found."],
				})
			}
			const datetime = parseDayMonthYear(statement["Transaction Date"])
			const description = [
				statement["Supplementary Code"],
				statement["Client Reference"],
				statement["Additional Reference"],
			]
				.filter(v => v && v.trim() !== "")
				.join(", ")
			const debit = statement["Debit Amount"] ? Number(statement["Debit Amount"]) : null
			const credit = statement["Credit Amount"] ? Number(statement["Credit Amount"]) : null
			rows.push({
				account_id: accountId,
				datetime,
				description,
				amount: round2(debit !== null && !Number.isNaN(debit) ? -debit : (credit ?? 0)),
				is_pending: 0,
			})
		}
		const result = await upsertIndexed(rows, true)
		imported += result.imported
		reindexed += result.reindexed
		skipped += result.skipped
	}
	return { imported, reindexed, skipped }
}

export async function importUob(files: File[]): Promise<ImportResult> {
	if (!files.length) throw new ValidationError({ files: ["Select at least one file."] })
	let imported = 0
	let reindexed = 0
	let skipped = 0

	for (const file of files) {
		const data = await readFile(file)
		for (let i = 0; i < 4; i++) data.shift()
		const numberRow = data.shift()
		if (!numberRow || numberRow[0] !== "Account Number:") {
			throw new ValidationError({ files: ["Invalid CSV Format: Missing Account Number."] })
		}
		const accountId = numberRow[1] ?? ""
		const typeRow = data.shift()
		if (!typeRow || typeRow[0] !== "Account Type:") {
			throw new ValidationError({ files: ["Invalid CSV Format: Missing Account Type."] })
		}
		await ensureAccount(accountId, typeRow[1] ?? accountId, "UOB")
		data.shift() // statement period

		const header = data.shift() ?? []
		const rows: Parsed[] = []
		for (const row of data) {
			const statement = combine(header, row)
			const datetime = parseDayMonthYear(statement["Transaction Date"])
			const withdrawal = Number(statement.Withdrawal ?? 0)
			const deposit = Number(statement.Deposit ?? 0)
			rows.push({
				account_id: accountId,
				datetime,
				description: statement["Transaction Description"] ?? "",
				amount: round2(withdrawal !== 0 ? -withdrawal : deposit),
				is_pending: 0,
			})
		}
		const result = await upsertIndexed(rows, true)
		imported += result.imported
		reindexed += result.reindexed
		skipped += result.skipped
	}
	return { imported, reindexed, skipped }
}

export async function importRevolut(
	file: File,
	accountId: string,
	accountName?: string,
): Promise<ImportResult> {
	if (!file) throw new ValidationError({ files: ["Select a file."] })
	if (!accountId.trim()) throw new ValidationError({ account_id: ["Select an account."] })
	if (accountName?.trim()) {
		await ensureAccount(accountId.trim(), accountName.trim(), "Revolut")
	} else if (!(await db.accounts.get(accountId.trim()))) {
		throw new ValidationError({ account_id: ["Select an account."] })
	}

	const data = await readFile(file)
	const header = data.shift() ?? []
	let imported = 0
	let skipped = 0

	for (const row of data) {
		const statement = combine(header, row)
		if (statement.State === "REVERTED") {
			skipped++
			continue
		}
		if (statement.State !== "COMPLETED" && statement.State !== "PENDING") {
			throw new ValidationError({
				files: ["Invalid CSV Format: Incompleted transaction found."],
			})
		}
		// "2026-05-27 14:03:22" -> "2026-05-27 14:03"
		const started = (statement["Started Date"] ?? "").slice(0, 16)
		const datetime =
			started.length === 16 ? `${started.slice(0, 10)} ${started.slice(11)}` : started
		const candidate = {
			account_id: accountId.trim(),
			datetime,
			description: statement.Description ?? "",
			amount: round2(Number(statement.Amount ?? 0) - Number(statement.Fee ?? 0)),
			is_pending: statement.State === "PENDING" ? asPending(true) : asPending(false),
		}
		const exists = await db.statements
			.where("[account_id+datetime]")
			.equals([candidate.account_id, candidate.datetime])
			.filter(
				s =>
					s.description === candidate.description &&
					s.amount === candidate.amount &&
					s.is_pending === candidate.is_pending,
			)
			.first()
		if (!exists) {
			imported++
			await db.statements.add({ id: newId(), ...candidate, index: 0 })
		} else {
			skipped++
		}
	}
	return { imported, reindexed: 0, skipped }
}
