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

test("missing drill Statement focus returns null", async () => {
	const { getDrillStatement } = await import("../../src/logic/drilldown")
	expect(await getDrillStatement("missing-focus")).toBeNull()
})

test("category rows, movers and trend months reconcile across scopes", async () => {
	const now = Settings.now
	Settings.now = () => new Date("2026-11-07T12:00:00+08:00").getTime()
	try {
		await loadDemoWorkspace()
		for (const scope of ["all", ...(await db.monthly_budgets.toArray()).map(b => b.id)]) {
			const view = await getDashboardView({ month: "October", year: 2026, scope })
			for (const c of view.scopedCategories) {
				expect(
					(await getDrilldown("October", 2026, scope, { kind: "category", value: c.id }))
						?.total,
				).toBeCloseTo(c.spending, 2)
				expect(
					(
						await getDrilldown("October", 2026, scope, {
							kind: "category-gross",
							value: c.id,
						})
					)?.total,
				).toBeCloseTo(c.outflow, 2)
			}
			for (const m of view.dashboard.comparison_history.filter(m => m.included)) {
				const at = DateTime.fromFormat(m.month, "MMM yyyy").toFormat("yyyy-MM")
				let total = 0
				for (const c of m.categories) {
					const value =
						scope === "all" ? c.spending : (c.monthly_budget_spending[scope] ?? 0)
					total += value
					if (value === 0) continue
					expect(
						(
							await getDrilldown("October", 2026, scope, {
								kind: "category-gross",
								value: c.id,
								at,
							})
						)?.total,
					).toBeCloseTo(value, 2)
				}
				expect(
					(await getDrilldown("October", 2026, scope, { kind: "month", value: at }))
						?.total,
				).toBeCloseTo(total, 2)
			}
		}
	} finally {
		Settings.now = now
	}
}, 120000)

test("Monthly Budget cards and legend reconcile including refunds and plan amounts", async () => {
	const now = Settings.now
	Settings.now = () => new Date("2026-11-07T12:00:00+08:00").getTime()
	try {
		await loadDemoWorkspace()
		const view = await getDashboardView({ month: "October", year: 2026, scope: "all" })
		for (const b of view.dashboard.monthlyBudgets) {
			const drill = await getDrilldown("October", 2026, "all", {
				kind: "budget",
				value: b.id,
			})
			expect(drill?.total).toBeCloseTo(b.spending, 2)
			expect(drill?.budget?.amount).toBe(b.amount)
		}
		for (const b of view.pace.forecast) {
			const actual = b.points.filter(p => p.spending !== null).at(-1)?.spending ?? 0
			expect(
				(
					await getDrilldown("October", 2026, "all", {
						kind: "budget",
						value: b.id === "total" ? "all" : b.id,
					})
				)?.total,
			).toBeCloseTo(actual, 2)
		}
	} finally {
		Settings.now = now
	}
}, 120000)

 test("summary measures reconcile independently of spending scope", async () => {
 await loadDemoWorkspace()
 const view = await getDashboardView({month: "October", year: 2026, scope: "all"})
 const s = view.dashboard.summary
 for (const [value, total] of Object.entries({spent:s.spending, income:s.income, leftover:s.surplus, saved:s.contributions-s.withdrawals})) {
 expect((await getDrilldown("October",2026,"unbudgeted",{kind:"metric",value}))?.total).toBeCloseTo(total,2)
 }
 }, 30000)

 test("largest selection and Records amount sorting preserve month and scope", async () => {
 await loadDemoWorkspace()
 const {listRecords} = await import("../../src/logic/records")
 for (const scope of ["all", ...(await db.monthly_budgets.toArray()).map(b => b.id)]) {
 const drill = await getDrilldown("October", 2026, scope, {kind:"largest", value:""})
 const records = await listRecords({start_date:"2026-10-01",end_date:"2026-10-31", effective_spending:true,monthly_budget_id:scope === "all" ? undefined : scope,sort:"amount_desc"})
 expect(drill!.records.map(r=>r.id)).toEqual(records.map(r=>r.id))
 expect(records.map(r=>Math.abs(r.amount))).toEqual(records.map(r=>Math.abs(r.amount)).sort((a,b)=>b-a))
 expect(drill!.href).toContain("sort=amount_desc")
 }
 },120000)


test("compare drill uses the mover average and included same-period months", async () => {
 const now = Settings.now
 Settings.now = () => new Date("2026-10-15T12:00:00+08:00").getTime()
 try {
  await loadDemoWorkspace()
  for (const scope of ["all", (await db.monthly_budgets.toArray())[0]!.id]) {
   const view = await getDashboardView({month:"October",year:2026,scope})
   const category = view.scopedCategories.find(c => c.comparison !== null)
   if (!category) throw new Error("Expected comparison history")
   const drill = await getDrilldown("October",2026,scope,{kind:"compare",value:category.id})
   expect(drill!.total).toBeCloseTo(category.spending,2)
   expect(drill!.comparison!.average).toBeCloseTo(category.spending-category.comparison!,2)
   expect(drill!.comparison!.months).toHaveLength(view.scopedComparisonCount)
 expect(-drill!.comparison!.records.reduce((sum,r)=>sum+r.amount,0)/view.scopedComparisonCount).toBeCloseTo(drill!.comparison!.average!,2)
   expect(drill!.comparison!.records.every(r=>r.datetime.slice(8,10) <= "15")).toBe(true)
  }
  expect(await getDrilldown("October",2026,"all",{kind:"compare",value:"missing"})).toBeNull()
 } finally {Settings.now=now}
},30000)
