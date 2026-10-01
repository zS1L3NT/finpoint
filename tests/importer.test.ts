import { beforeEach, expect, mock, test } from "bun:test"
import type { StatementRow } from "@/data/db"

const statements: StatementRow[] = []

mock.module("@/data/db", () => ({
	db: {
		statements: {
			where: () => ({
				equals: ([accountId, datetime]: [string, string]) => ({
						filter: (matches: (statement: StatementRow) => boolean) => ({
						first: async () =>
							statements.find(
								statement =>
									statement.account_id === accountId &&
									statement.datetime === datetime &&
									matches(statement),
							),
					}),
				}),
			}),
				add: async (statement: StatementRow) => {
				statements.push(statement)
			},
				update: async (id: string, changes: Partial<StatementRow>) => {
				const statement = statements.find(row => row.id === id)
				if (statement) Object.assign(statement, changes)
			},
		},
	},
	asPending: (pending: boolean) => (pending ? 1 : 0),
}))

mock.module("@/logic/accounts", () => ({ ensureAccount: async () => {} }))

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

beforeEach(() => {
	statements.length = 0
})

test("DBS overlapping exports treat a dash and blank reference as the same Statement", async () => {
	expect(await importDbs([dbsFile("-")])).toEqual({ imported: 1, reindexed: 0, skipped: 0 })
	expect(await importDbs([dbsFile("")])).toEqual({ imported: 0, reindexed: 0, skipped: 1 })
	expect(statements).toHaveLength(1)
	expect(statements[0]?.description).toBe("")
})

test("DBS blank references match an existing Statement saved with a dash", async () => {
	statements.push({
		id: "legacy",
		account_id: "123456",
		datetime: "2026-07-31 00:00",
		description: "-",
		amount: 0.12,
		index: 1,
		is_pending: 0,
	})

	expect(await importDbs([dbsFile("")])).toEqual({ imported: 0, reindexed: 0, skipped: 1 })
	expect(statements.map(statement => statement.id)).toEqual(["legacy"])
})

test("DBS ignores a dash beside another reference when matching older Statements", async () => {
	statements.push({
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
	expect(statements.map(statement => statement.id)).toEqual(["legacy"])
})

test("DBS still imports Statements with different real descriptions", async () => {
	expect(await importDbs([dbsFile("Salary")])).toEqual({ imported: 1, reindexed: 0, skipped: 0 })
	expect(await importDbs([dbsFile("")])).toEqual({ imported: 1, reindexed: 0, skipped: 0 })
	expect(statements).toHaveLength(2)
})

test("DBS preserves repeated blank-description Statements within one export", async () => {
	expect(await importDbs([dbsFile("", "", 2)])).toEqual({ imported: 2, reindexed: 0, skipped: 0 })
	expect(statements.map(statement => statement.description)).toEqual(["#2", "#1"])
	expect(await importDbs([dbsFile("", "", 2)])).toEqual({ imported: 0, reindexed: 0, skipped: 2 })
})

for (const bank of [
	{ name: "UOB", file: uobFile, importFile: (file: File) => importUob([file]), time: "00:00", index: 1 },
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
		expect(statements).toHaveLength(1)
		expect(statements[0]?.description).toBe("")
	})

	test(`${bank.name} blank descriptions match a Statement previously saved with a dash`, async () => {
		statements.push({
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
		expect(statements.map(statement => statement.id)).toEqual(["legacy"])
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
	expect(statements.map(statement => statement.is_pending)).toEqual([1, 0])
})
