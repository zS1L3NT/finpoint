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
			beats: ["welcome", "missing"],
			scene: "start-welcome",
			cues: {
				welcome: ["welcome", "Welcome"],
				balance: ["welcome", "running dry"],
				several: ["welcome", "several bank accounts"],
				few: ["welcome", "few daily payments"],
				missing: ["missing", "what’s missing"],
			},
		},
		{
			beats: ["bank", "split", "dinner"],
			scene: "start-problem",
			cues: {
				feed: ["bank"],
				spent: ["split", "$80"],
				groceries: ["split", "groceries"],
				gift: ["split", "birthday gift"],
				label: ["split", "label them"],
				dinner: ["dinner", "$90"],
				week: ["dinner", "week later"],
				scroll: ["dinner", "scroll past"],
				share: ["dinner", "just one dinner"],
				label2: ["dinner", "label them that way"],
			},
		},
		{
			beats: ["explain", "built"],
			scene: "start-explain",
			cues: {
				gap: ["explain"],
				exact: ["explain", "exactly as your bank reports"],
				groceries: ["explain", "groceries"],
				gift: ["explain", "A gift"],
				share: ["explain", "Your share of dinner"],
				idea: ["built", "whole idea"],
				one: ["built", "one label or many"],
				sense: ["built", "much easier to understand"],
			},
		},
		{
			beats: ["how", "concepts"],
			scene: "start-how",
			cues: {
				two: ["how"],
				bring: ["how", "bring in"],
				label: ["how", "label your bank activity"],
				place: ["how", "falls into place"],
				three: ["concepts"],
				stmt: ["concepts", "Statements"],
				rec: ["concepts", "Records"],
				alloc: ["concepts", "Allocations"],
			},
		},
	],
	model: [
		{
			beats: ["statement", "record", "allocation", "split", "combine", "simple"],
			scene: "model-diagram",
			cues: {
				stmt: ["statement"],
				trust: ["statement", "trust your Statements"],
				rec: ["record", "Record"],
				gift: ["record", "Gift Record"],
				alloc: ["allocation", "$50"],
				alloc2: ["allocation", "other $30"],
				splitc: ["split", "split across"],
				comb: ["combine"],
				dinner: ["combine", "Dinner Record"],
				share: ["combine", "really spent"],
				simp: ["simple"],
				lunch: ["simple", "Lunch Record"],
			},
		},
		{
			beats: ["complex", "flexible", "enough"],
			scene: "model-complex",
			cues: {
				messier: ["complex"],
				buy: ["complex", "$80 of groceries"],
				gift40: ["complex", "$40 gift"],
				cards: ["complex", "two cards"],
				three: ["complex", "three Allocations"],
				flex: ["flexible", "flexible"],
				itself: ["enough", "Finpoint itself"],
			},
		},
	],
	import: [
		{
			beats: ["intro", "untouched", "banks", "accounts", "revolut"],
			scene: "import-banks",
			cues: {
				export: ["intro", "export"],
				app: ["intro", "website or app"],
				file: ["intro", "this bank export"],
				exactly: ["untouched", "exactly as your bank gave"],
				edited: ["untouched", "edited bank export"],
				dbs: ["banks", "DBS"],
				ocbc: ["banks", "OCBC"],
				uob: ["banks", "UOB"],
				rev: ["banks", "Revolut"],
				csv: ["banks", "CSV"],
				sort: ["accounts"],
				says: ["accounts", "says which bank account"],
				files: ["accounts", "sorts the new Statements"],
				two: ["accounts", "two DBS bank accounts"],
				own: ["accounts", "apart"],
				rev2: ["revolut"],
				dont: ["revolut", "don’t say"],
				ask: ["revolut", "ask you"],
			},
		},
		{
			beats: ["download"],
			scene: "import-download",
			cues: {
				first: ["download"],
				dl: ["download", "Download"],
				csv: ["download", "CSV or Excel"],
				each: ["download", "once for each bank account"],
			},
		},
	],
	split: [
		{
			beats: ["done"],
			scene: "split-done",
			cues: {
				two: ["done", "two Records"],
				groc: ["done", "$50 of groceries"],
				gift: ["done", "$30 gift"],
			},
		},
	],
	dashboard: [
		{
			beats: ["records", "empty"],
			scene: "dashboard-source",
			cues: {
				recs: ["records"],
				dash: ["records", "what the Dashboard is for"],
				calc: ["records", "calculated from your Records"],
				imp: ["empty"],
				counts: ["empty", "only counts"],
			},
		},
	],
	pending: [
		{
			beats: ["when"],
			scene: "pending-when",
			cues: {
				date: ["when"],
				know: ["when", "know about spending"],
				bank: ["when", "bank shows"],
				label: ["when", "label that spending now"],
			},
		},
		{
			beats: ["meaning"],
			scene: "pending-reasons",
			cues: {
				two: ["meaning", "two reasons"],
				tally: ["meaning", "don’t add up"],
				stmts: ["meaning", "one of its Statements"],
				conf: ["meaning", "isn’t fully confirmed"],
			},
		},
	],
	"pending-statements": [
		{
			beats: ["why"],
			scene: "pending-statement",
			cues: {
				remember: ["why"],
				exception: ["why", "exception"],
				pend: ["why", "A Pending Statement"],
				rev: ["why", "Revolut’s"],
				add: ["why", "add a Pending Statement yourself"],
				edit: ["why", "edit it"],
			},
		},
	],
	duplicates: [
		{
			beats: ["why"],
			scene: "duplicate-export",
			cues: {
				exps: ["why"],
				chg: ["why", "changes a payment’s description"],
				desc: ["why", "description"],
				twice: ["why", "arrives twice"],
			},
		},
	],
	rules: [
		{
			beats: ["why"],
			scene: "rule-recurring",
			cues: {
				month: ["why"],
				phone: ["why", "phone bill"],
				rule: ["why", "Statement rule"],
				fills: ["why", "fills in the Record"],
				never: ["why", "never creates"],
			},
		},
	],
	treatments: [
		{
			beats: ["what", "examples"],
			scene: "treatments",
			cues: {
				treat: ["what"],
				income: ["what", "income"],
				spend: ["what", "spending"],
				saving: ["what", "saving"],
				notatall: ["what", "not at all"],
				salary: ["examples", "salary"],
				lunch: ["examples", "Lunch"],
				refund: ["examples", "refund"],
				inv: ["examples", "investment account"],
				trans: ["examples", "Transfer"],
			},
		},
		{
			beats: ["override"],
			scene: "treatment-override",
			cues: {
				cat: ["override"],
				exc: ["override", "exception"],
				chg: ["override", "single Record"],
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
				month: ["what", "am I on track"],
				each: ["what", "own amount every month"],
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
				months: ["what", "two months"],
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
				expl: ["loop", "label what’s new"],
				pend: ["loop", "Pending"],
				dash: ["loop", "Dashboard"],
				backup: ["loop", "keep a backup"],
				drive: ["backup", "Drive"],
			},
		},
	],
}
