// Which illustrated scene shows which beats. A beat recorded in a take (`video/takes.json`) needs
// no entry here; every other beat should be listed, or the film shows a placeholder card for it.
//
// A scene is a HyperFrames sub-composition in `compositions/scenes/<scene>.html`. It reads
// `cues` (a JSON object of seconds into the scene) from its variables and reveals each part as
// the narration names it, so rewording a beat only needs its cue words updated here.

/** A spoken word: `[beat, word or phrase, which occurrence]`. Without a word, the beat's start. */
export type CueRef = [beat: string, word?: string, nth?: number]

export type SceneUse = {
	/** Consecutive beats this scene shows, continuously. */
	beats: string[]
	scene: string
	/** Named moments the scene animates on. */
	cues?: Record<string, CueRef>
	/** Other variables the scene declares. */
	values?: Record<string, string | number | boolean>
}

export const scenes: Record<string, SceneUse[]> = {
	start: [
		{
			beats: ["bank", "split", "dinner"],
			scene: "start-problem",
			cues: {
				feed: ["bank", "bank"],
				spent: ["split", "spent"],
				groceries: ["split", "groceries"],
				gift: ["split", "gift"],
				dinner: ["dinner", "dinner"],
				week: ["dinner", "week"],
				share: ["dinner", "$30"],
			},
		},
		{
			beats: ["explain", "built"],
			scene: "start-explain",
			cues: {
				closed: ["explain", "closes"],
				exact: ["explain", "exactly"],
				groceries: ["explain", "groceries"],
				gift: ["explain", "gift"],
				dinner: ["explain", "dinner"],
				bring: ["built", "bring"],
				explain2: ["built", "explain"],
				see: ["built", "see"],
			},
		},
	],
	model: [
		{
			beats: ["three", "statement", "record", "allocation", "split", "combine", "simple"],
			scene: "model-diagram",
			cues: {
				three: ["three", "three"],
				wS: ["three", "Statements"],
				wR: ["three", "Records"],
				wA: ["three", "Allocations"],
				stmt: ["statement", "supermarket"],
				rec: ["record", "Groceries"],
				rec2: ["record", "gift"],
				alloc: ["allocation", "allocated"],
				alloc2: ["allocation", "other"],
				pat: ["split", "pattern"],
				comb: ["combine", "combined"],
				dinner: ["combine", "Dinner"],
				share: ["combine", "share"],
				simp: ["simple", "one to one"],
				lunch: ["simple", "lunch"],
			},
		},
	],
	import: [
		{
			beats: ["intro", "banks", "accounts"],
			scene: "import-banks",
			cues: {
				bank: ["intro", "bank's"],
				download: ["intro", "download"],
				bring: ["intro", "bring"],
				dbs: ["banks", "DBS"],
				ocbc: ["banks", "OCBC"],
				uob: ["banks", "UOB"],
				rev: ["banks", "Revolut"],
				acct: ["accounts", "Account"],
				apart: ["accounts", "apart"],
			},
		},
		{
			beats: ["download"],
			scene: "import-download",
			cues: {
				dl: ["download", "Download"],
				csv: ["download", "CSV"],
				acct: ["download", "account"],
			},
		},
	],
	split: [
		{
			beats: ["done"],
			scene: "split-done",
			cues: {
				stmt: ["done", "Statement"],
				two: ["done", "two"],
				fifty: ["done", "$50"],
				gift: ["done", "gift"],
			},
		},
	],
	dashboard: [
		{
			beats: ["records", "empty"],
			scene: "dashboard-source",
			cues: {
				recs: ["records", "Records"],
				calc: ["records", "calculated"],
				dash: ["records", "Dashboard"],
				imp: ["empty", "importing"],
				expl: ["empty", "explained"],
			},
		},
	],
	pending: [
		{
			beats: ["when"],
			scene: "pending-when",
			cues: {
				spend: ["when", "spending"],
				bank: ["when", "bank"],
				rec: ["when", "record"],
			},
		},
		{
			beats: ["meaning"],
			scene: "pending-reasons",
			cues: {
				two: ["meaning", "two"],
				tally: ["meaning", "tally"],
				stmts: ["meaning", "Statements"],
				conf: ["meaning", "confirmed"],
			},
		},
	],
	"pending-statements": [
		{
			beats: ["why"],
			scene: "pending-statement",
			cues: {
				pend: ["why", "Pending"],
				rev: ["why", "Revolut's"],
				add: ["why", "add"],
				conf: ["why", "confirmed"],
			},
		},
	],
	duplicates: [
		{
			beats: ["why"],
			scene: "duplicate-export",
			cues: {
				chg: ["why", "changes"],
				desc: ["why", "description"],
				exps: ["why", "exports"],
				twice: ["why", "twice"],
			},
		},
	],
	rules: [
		{
			beats: ["why"],
			scene: "rule-recurring",
			cues: {
				month: ["why", "month"],
				phone: ["why", "phone"],
				rule: ["why", "rule"],
				fills: ["why", "fills"],
			},
		},
	],
	treatments: [
		{
			beats: ["what", "examples"],
			scene: "treatments",
			cues: {
				treat: ["what", "Treatment"],
				income: ["what", "income"],
				spend: ["what", "spending"],
				salary: ["examples", "salary"],
				lunch: ["examples", "Lunch"],
				refund: ["examples", "refund"],
				inv: ["examples", "$500"],
				trans: ["examples", "Transfer"],
			},
		},
		{
			beats: ["override"],
			scene: "treatment-override",
			cues: {
				cat: ["override", "Category"],
				chg: ["override", "Change"],
				exc: ["override", "exception"],
			},
		},
	],
	buckets: [
		{
			beats: ["what"],
			scene: "monthly-budgets",
			cues: {
				mb: ["what", "Monthly Budget"],
				daily: ["what", "Daily"],
				rec: ["what", "Recurring"],
				irr: ["what", "Irregular"],
				trav: ["what", "Travel"],
				month: ["what", "month"],
			},
		},
	],
	budgets: [
		{
			beats: ["what"],
			scene: "budget-period",
			cues: {
				bud: ["what", "Budget"],
				start: ["what", "start"],
				end: ["what", "end"],
				bali: ["what", "Bali"],
				wed: ["what", "wedding"],
			},
		},
	],
	sync: [
		{
			beats: ["local"],
			scene: "sync-local",
			cues: {
				browser: ["local", "browser"],
				device: ["local", "device"],
				servers: ["local", "servers"],
			},
		},
		{
			beats: ["conflict", "yours"],
			scene: "sync-conflict",
			cues: {
				two: ["conflict", "two"],
				devices: ["conflict", "devices"],
				keep: ["conflict", "keep"],
				whole: ["conflict", "whole"],
				ctrl: ["yours", "control"],
			},
		},
	],
	routine: [
		{
			beats: ["loop", "backup"],
			scene: "routine-loop",
			cues: {
				routine: ["loop", "routine"],
				import: ["loop", "Import"],
				dups: ["loop", "duplicates"],
				expl: ["loop", "explain"],
				pend: ["loop", "Pending"],
				dash: ["loop", "Dashboard"],
				backup: ["loop", "backup"],
				drive: ["backup", "Drive"],
			},
		},
	],
}
