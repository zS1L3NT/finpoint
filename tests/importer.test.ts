import { beforeEach, expect, test } from "bun:test"
import Dexie from "dexie"
import * as XLSX from "xlsx"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { db } = await import("@/data/db")
const { importDbs, importOcbc, importRevolut, importUob } = await import("@/logic/importer")

function dbsFile(reference: string, clientReference = "", count = 1) {
	const csv = [
		"Account Details For:,DBS 123-456",
		...Array.from({ length: 7 }, (_, index) => `metadata ${index}`),
		"Transaction Date,Status,Supplementary Code,Client Reference,Additional Reference,Debit Amount,Credit Amount",
		...Array(count).fill(`31 Jul 2026,Settled,${reference},${clientReference},,,0.12`),
	].join("\n")
	return new File([csv], "dbs.csv", { type: "text/csv" })
}

function uobFile(description: string) {
	const csv = [
		...Array.from({ length: 4 }, (_, index) => `metadata ${index}`),
		"Account Number:,123456",
		"Account Type:,Savings",
		"Period,July 2026",
		"Transaction Date,Transaction Description,Withdrawal,Deposit",
		`31 Jul 2026,${description},,0.12`,
	].join("\n")
	return new File([csv], "uob.csv", { type: "text/csv" })
}

function ocbcFile(description: string) {
	const csv = [
		"Account details for:,OCBC FRANK Account 123-456",
		"Transaction History",
		"Transaction date,Value date,Description,Withdrawals(SGD),Deposits(SGD)",
		`31/07/2026,31/07/2026,${description},,0.12`,
	].join("\n")
	return new File([csv], "ocbc.csv", { type: "text/csv" })
}

function revolutFile(description: string, state = "COMPLETED") {
	const csv = [
		"State,Started Date,Description,Amount,Fee",
		`${state},2026-07-31 12:00:00,${description},0.12,0`,
	].join("\n")
	return new File([csv], "revolut.csv", { type: "text/csv" })
}

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

test("DBS overlapping exports treat a dash and blank reference as the same Statement", async () => {
	expect(await importDbs([dbsFile("-")])).toEqual({ imported: 1, reindexed: 0, skipped: 0 })
	expect(await importDbs([dbsFile("")])).toEqual({ imported: 0, reindexed: 0, skipped: 1 })
	expect(await db.statements.count()).toBe(1)
	expect((await db.statements.toArray())[0]?.description).toBe("")
})

test("DBS blank references match an existing Statement saved with a dash", async () => {
	await db.statements.add({
		id: "legacy",
		account_id: "123456",
		datetime: "2026-07-31 00:00",
		description: "-",
		amount: 0.12,
		index: 1,
		is_pending: 0,
	})

	expect(await importDbs([dbsFile("")])).toEqual({ imported: 0, reindexed: 0, skipped: 1 })
	expect(await db.statements.toCollection().primaryKeys()).toEqual(["legacy"])
})

test("DBS ignores a dash beside another reference when matching older Statements", async () => {
	await db.statements.add({
		id: "legacy",
		account_id: "123456",
		datetime: "2026-07-31 00:00",
		description: "-, PAYNOW",
		amount: 0.12,
		index: 1,
		is_pending: 0,
	})

	expect(await importDbs([dbsFile("", "PAYNOW")])).toEqual({
		imported: 0,
		reindexed: 0,
		skipped: 1,
	})
	expect(await db.statements.toCollection().primaryKeys()).toEqual(["legacy"])
})

test("DBS still imports Statements with different real descriptions", async () => {
	expect(await importDbs([dbsFile("Salary")])).toEqual({ imported: 1, reindexed: 0, skipped: 0 })
	expect(await importDbs([dbsFile("")])).toEqual({ imported: 1, reindexed: 0, skipped: 0 })
	expect(await db.statements.count()).toBe(2)
	expect((await db.statements.toArray()).every(s => s.imported_at)).toBe(true)
})

test("DBS preserves repeated blank-description Statements within one export", async () => {
	expect(await importDbs([dbsFile("", "", 2)])).toEqual({ imported: 2, reindexed: 0, skipped: 0 })
	expect(
		(await db.statements.toCollection().sortBy("index"))
			.reverse()
			.map(statement => statement.description),
	).toEqual(["#2", "#1"])
	expect((await db.statements.toArray()).every(s => s.imported_at)).toBe(true)
	expect(await importDbs([dbsFile("", "", 2)])).toEqual({ imported: 0, reindexed: 0, skipped: 2 })
})

for (const bank of [
	{
		name: "UOB",
		file: uobFile,
		importFile: (file: File) => importUob([file]),
		time: "00:00",
		index: 1,
	},
	{
		name: "OCBC",
		file: ocbcFile,
		importFile: (file: File) => importOcbc([file]),
		time: "00:00",
		index: 1,
	},
	{
		name: "Revolut",
		file: revolutFile,
		importFile: (file: File) => importRevolut(file, "123456", "Account"),
		time: "12:00",
		index: 0,
	},
]) {
	test(`${bank.name} overlapping exports treat a dash and blank description as the same Statement`, async () => {
		expect(await bank.importFile(bank.file("-"))).toEqual({
			imported: 1,
			reindexed: 0,
			skipped: 0,
		})
		expect(await bank.importFile(bank.file(""))).toEqual({
			imported: 0,
			reindexed: 0,
			skipped: 1,
		})
		expect(await db.statements.count()).toBe(1)
		expect((await db.statements.toArray())[0]?.description).toBe("")
	})

	test(`${bank.name} blank descriptions match a Statement previously saved with a dash`, async () => {
		await db.statements.add({
			id: "legacy",
			account_id: "123456",
			datetime: `2026-07-31 ${bank.time}`,
			description: "-",
			amount: 0.12,
			index: bank.index,
			is_pending: 0,
		})

		expect(await bank.importFile(bank.file(""))).toEqual({
			imported: 0,
			reindexed: 0,
			skipped: 1,
		})
		expect(await db.statements.toCollection().primaryKeys()).toEqual(["legacy"])
	})
}

test("Revolut still distinguishes pending and completed Statements with blank descriptions", async () => {
	expect(await importRevolut(revolutFile("", "PENDING"), "123456", "Account")).toEqual({
		imported: 1,
		reindexed: 0,
		skipped: 0,
	})
	expect(await importRevolut(revolutFile("", "COMPLETED"), "123456", "Account")).toEqual({
		imported: 1,
		reindexed: 0,
		skipped: 0,
	})
	expect(
		(await db.statements.orderBy("is_pending").reverse().toArray()).map(
			statement => statement.is_pending,
		),
	).toEqual([1, 0])
})

async function replaceFile(file: File, from: string, to: string) {
	return new File([(await file.text()).replace(from, to)], file.name, { type: file.type })
}

for (const bank of [
	{ name: "DBS", file: () => dbsFile("SHOP"), date: "31 Jul 2026", importFile: importDbs },
	{ name: "UOB", file: () => uobFile("SHOP"), date: "31 Jul 2026", importFile: importUob },
	{ name: "OCBC", file: () => ocbcFile("SHOP"), date: "31/07/2026", importFile: importOcbc },
]) {
	test(`${bank.name} accepts dd/MM/yy dates`, async () => {
		await bank.importFile([await replaceFile(bank.file(), bank.date, "17/10/26")])
		expect((await db.statements.toArray())[0]?.datetime).toBe("2026-10-17 00:00")
	})

	test(`${bank.name} rejects impossible dates and rolls back all files`, async () => {
		await expect(
			bank.importFile([bank.file(), await replaceFile(bank.file(), bank.date, "31/02/26")]),
		).rejects.toThrow("date is invalid")
		expect(await db.statements.count()).toBe(0)
		expect(await db.accounts.count()).toBe(0)
	})

	test(`${bank.name} handles comma amounts`, async () => {
		await bank.importFile([await replaceFile(bank.file(), "0.12", '"1,234.56"')])
		expect((await db.statements.toArray())[0]?.amount).toBe(1234.56)
	})

	test(`${bank.name} rejects non-finite amounts`, async () => {
		await expect(
			bank.importFile([await replaceFile(bank.file(), "0.12", "Infinity")]),
		).rejects.toThrow("amount is invalid")
		expect(await db.statements.count()).toBe(0)
	})

	test(`${bank.name} rejects missing columns`, async () => {
		await expect(
			bank.importFile([
				await replaceFile(
					bank.file(),
					bank.name === "OCBC" ? "Transaction date" : "Transaction Date",
					"Unknown",
				),
			]),
		).rejects.toThrow()
	})
}

test("Revolut counts reverted statements as skipped", async () => {
	expect(await importRevolut(revolutFile("SHOP", "REVERTED"), "123456", "Account")).toEqual({
		imported: 0,
		reindexed: 0,
		skipped: 1,
	})
})

test("Revolut rejects invalid dates without creating an account", async () => {
	await expect(
		importRevolut(
			await replaceFile(revolutFile("SHOP"), "2026-07-31", "2026-02-31"),
			"123456",
			"Account",
		),
	).rejects.toThrow("date is invalid")
	expect(await db.accounts.count()).toBe(0)
})

test("Revolut handles comma amounts and fees in the shared pipeline", async () => {
	await importRevolut(
		await replaceFile(revolutFile("SHOP"), "0.12,0", '"1,234.56",1.56'),
		"123456",
		"Account",
	)
	expect((await db.statements.toArray())[0]?.amount).toBe(1233)
})

for (const bookType of ["xls", "xlsx"] as const) {
	test(`UOB reads real Excel date cells in ${bookType}`, async () => {
		const sheet = XLSX.utils.aoa_to_sheet([
			["Account Number:", "123456"],
			["Account Type:", "Savings"],
			["Transaction Date", "Transaction Description", "Withdrawal", "Deposit"],
			[46312, "SHOP", null, 12.34],
		])
		sheet.A4 = { t: "n", v: 46312, z: "dd/mm/yyyy" }
		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, sheet, "Statements")
		const file = new File(
			[XLSX.write(workbook, { type: "array", bookType })],
			`uob.${bookType}`,
		)
		await importUob([file])
		expect((await db.statements.toArray())[0]?.datetime).toBe("2026-10-17 00:00")
	})
}
