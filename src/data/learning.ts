import { db } from "@/data/db"

export async function readLearningValue(key: string): Promise<string | undefined> {
	return (await db.learning.get(key))?.value
}

export async function updateLearningValue(
	key: string,
	update: (current: string | undefined) => string,
): Promise<void> {
	await db.transaction("rw", db.learning, async () => {
		const current = await readLearningValue(key)
		await db.learning.put({ key, value: update(current) })
	})
}

export async function readLearningWorkspace(recordId: string | null) {
	const [seed, accounts, statements, records, budgets] = await Promise.all([
		db.meta.get("seeded_v2"),
		db.accounts.count(),
		db.statements.count(),
		db.records.count(),
		db.budgets.count(),
	])
	const record = recordId ? await db.records.get(recordId) : undefined
	const allocations = record
		? await db.allocations.where("record_id").equals(record.id).toArray()
		: []
	const allocatedStatements = await db.statements.bulkGet(
		allocations.map(item => item.statement_id),
	)
	return {
		ready: !!seed,
		accounts,
		statements,
		records,
		budgets,
		record,
		allocations,
		pendingStatements: new Set(
			allocatedStatements.flatMap(item => (item?.is_pending === 1 ? [item.id] : [])),
		),
	}
}
