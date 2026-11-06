import { expect, test } from "bun:test"
import Dexie from "dexie"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import { DateTime, Settings } from "luxon"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { db } = await import("../../src/data/db")
const { loadDemoWorkspace } = await import("../../src/logic/workspace")
const { getDashboardView } = await import("../../src/logic/dashboard")
const { getDrilldown } = await import("../../src/logic/drilldown")

test("every demo calendar day reconciles with its drill-down across scopes", async () => {
	const now = Settings.now
	Settings.now = () => new Date("2026-11-07T12:00:00+08:00").getTime()
	try {
		await loadDemoWorkspace()
		const months = new Set((await db.records.toArray()).map(r => r.datetime.slice(0, 7)))
		const scopes = ["all", ...(await db.monthly_budgets.toArray()).map(b => b.id)]
		for (const month of months) {
			const date = DateTime.fromISO(`${month}-01`)
			for (const scope of scopes) {
				const view = await getDashboardView({
					month: date.toFormat("MMMM"),
					year: date.year,
					scope,
				})
				for (const day of view.scopedDaily) {
					const drill = await getDrilldown(date.toFormat("MMMM"), date.year, scope, {
						kind: "day",
						value: day.date,
					})
					expect(drill?.total).toBeCloseTo(Math.max(day.spending, 0), 2)
					const amounts = drill!.records.map(r => Math.abs(r.amount))
					expect(amounts).toEqual([...amounts].sort((a, b) => b - a))
				}
			}
		}
	} finally {
		Settings.now = now
	}
}, 120000)
