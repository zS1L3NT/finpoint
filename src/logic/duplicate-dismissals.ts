import { db } from "@/data/db"

export async function removeStatementDismissals(ids: string[]) {
	if (!ids.length) return
	await db.duplicate_dismissals.where("statement_id").anyOf(ids).delete()
	await db.duplicate_dismissals.where("other_statement_id").anyOf(ids).delete()
}
