// The beginner guide: one source for the narrated video and the Help articles.
//
// Chapters introduce one idea at a time, in the order a new user meets them. Each chapter is a
// sequence of beats. A beat is one narrated moment of the video (its `say` is spoken and captioned)
// and one illustrated paragraph of the Help article (with an optional article-only `detail`).
// Beats marked `step` form the chapter's tutorial and are numbered on screen; only chapters that
// really walk through a task have them.
//
// Scenes in `src/components/help/film/scenes.tsx` are keyed by chapter and beat id, and time their
// visuals to words in `say`, so reword with the scene in view.

export type GuideLevel = "The basics" | "Going further" | "Advanced" | "Your data"

export type GuideBeat = {
	id: string
	say: string
	detail?: string
	step?: boolean
}

export type GuideDestination =
	| "importer"
	| "allocator"
	| "records"
	| "statements"
	| "categories"
	| "budgets"
	| "sync"
	| "dashboard"

export type GuideChapter = {
	id: string
	title: string
	level: GuideLevel
	summary: string
	keywords: string
	destination?: GuideDestination
	beats: GuideBeat[]
}

export const guideLevels: GuideLevel[] = ["The basics", "Going further", "Advanced", "Your data"]

export const guideChapters: GuideChapter[] = [
	// ─── The basics ──────────────────────────────────────────────────────────────────────
	{
		id: "start",
		title: "Why Finpoint?",
		level: "The basics",
		summary: "Your bank shows what moved, not what it was for. Finpoint lets you explain it.",
		keywords: "welcome introduction beginner problem purpose overview",
		beats: [
			{
				id: "bank",
				say: "Your bank keeps a record of every payment you make. What it can’t tell you is what each payment was really for.",
			},
			{
				id: "split",
				say: "Say you spent $80 at the supermarket. $50 of that was groceries, and $30 was a birthday gift for a friend. Your bank shows one $80 payment. But to you, those are two very different things.",
			},
			{
				id: "dinner",
				say: "Or you paid $90 for dinner with a friend, and they sent you $60 back for their share. Your bank shows two rows: money out, and money in. What dinner really cost you was $30.",
			},
			{
				id: "explain",
				say: "Finpoint closes that gap. It keeps your bank’s rows exactly as they are, and lets you explain them in your own words: groceries, $50. A gift, $30. Your share of dinner, $30.",
			},
			{
				id: "built",
				say: "Everything else in Finpoint, from spending charts to budgets, is built on those explanations. So using Finpoint comes down to three things: bring in your bank activity, explain it, and see where your money really went.",
			},
		],
	},
	{
		id: "model",
		title: "Statements, Records and Allocations",
		level: "The basics",
		summary:
			"The three words behind everything: bank rows, your explanations, and the links between them.",
		keywords: "statement record allocation terms concepts link split combine transaction",
		destination: "allocator",
		beats: [
			{
				id: "three",
				say: "Finpoint uses three words for this, and they’re worth getting to know: Statements, Records and Allocations.",
			},
			{
				id: "statement",
				say: "A Statement is one row from your bank, exactly as your bank reports it. Like that $80 supermarket payment.",
			},
			{
				id: "record",
				say: "A Record is your explanation of what happened. Groceries for $50 is a Record. The gift for $30 is another.",
			},
			{
				id: "allocation",
				say: "An Allocation connects a Statement to a Record, and says how much of the Statement belongs there. Here, $50 of the supermarket payment is allocated to Groceries, and the other $30 to the gift.",
			},
			{
				id: "split",
				say: "That’s the first pattern: one Statement, split into several Records. It’s how you untangle a mixed shopping trip.",
			},
			{
				id: "combine",
				say: "The second pattern goes the other way: several Statements, combined into one Record. Your $90 dinner payment and your friend’s $60 transfer both belong to one Dinner Record, which comes to your real share: $30.",
			},
			{
				id: "simple",
				say: "And most of the time, it’s simply one to one. A $12 lunch is one Statement, explained by one Lunch Record.",
				detail: "Statements are never edited to make things fit. You explain them with Records, and Allocations record which part of each Statement went where.",
			},
		],
	},
	{
		id: "import",
		title: "Importing your bank statements",
		level: "The basics",
		summary: "Download an export from your bank, then bring it in with the Importer.",
		keywords:
			"import importer csv xls xlsx excel bank dbs ocbc uob revolut account file upload",
		destination: "importer",
		beats: [
			{
				id: "intro",
				say: "Finpoint starts from your bank’s own records. You download them from your bank, then bring them into Finpoint.",
			},
			{
				id: "banks",
				say: "Finpoint can read exports from DBS, OCBC, UOB and Revolut. Depending on the bank, that’s a CSV file or an Excel spreadsheet.",
			},
			{
				id: "accounts",
				say: "Each Statement belongs to an Account, which simply mirrors one of your bank accounts. Import your OCBC 360 Account and your UOB savings account, and Finpoint keeps their Statements apart, using the account details inside each file.",
				detail: "Accounts are created for you the first time you import from them. You can rename them on the Accounts page, but you rarely need to think about them.",
			},
			{
				id: "revolut",
				say: "Some exports, like Revolut’s, don’t say which account they came from. For those, Finpoint asks you to pick or name the account.",
			},
			{
				id: "download",
				step: true,
				say: "Download a CSV or Excel export from your bank, once for each account you want in Finpoint.",
			},
			{
				id: "choose",
				step: true,
				say: "Open Importer, choose your bank, and add your files.",
			},
			{
				id: "result",
				step: true,
				say: "Choose Import, and check how many new Statements came in.",
				detail: "Importing an overlapping file again is safe: rows Finpoint already has are skipped.",
			},
			{
				id: "next",
				step: true,
				say: "Your new Statements are now waiting in Allocator. That’s where we’ll go next.",
			},
		],
	},
	{
		id: "allocator",
		title: "Meet the Allocator",
		level: "The basics",
		summary: "The page that lists every bank amount still waiting for an explanation.",
		keywords: "allocator unexplained remaining allocable statements records pages find missing",
		destination: "allocator",
		beats: [
			{
				id: "list",
				say: "Allocator is where you’ll spend most of your time in Finpoint. It lists every Statement that still has money left to explain, newest first.",
			},
			{
				id: "left",
				say: "When only part of a Statement has been explained, Allocator shows how much is left. Once a Statement is fully explained, it leaves the list.",
			},
			{
				id: "pages",
				say: "Two other pages help you look things up. Statements lists every bank row, explained or not. Records lists your explanations. Allocator only shows what’s still waiting.",
				detail: "If something seems to be missing, check the date range and filters first. A fully explained bank row no longer appears in Allocator, but it’s always in Statements.",
			},
		],
	},
	{
		id: "lunch",
		title: "Explaining your first purchase",
		level: "The basics",
		summary: "Select a Statement in Allocator and create the Record that explains it.",
		keywords: "first record create allocator lunch purchase explain title category save",
		destination: "allocator",
		beats: [
			{
				id: "select",
				step: true,
				say: "Let’s explain a $12 lunch. In Allocator, click the lunch Statement to select it. A bar appears with what you can do next.",
			},
			{
				id: "create",
				step: true,
				say: "Choose Create Record. A new Record opens with the Statement already attached, and its amount filled in.",
			},
			{
				id: "fill",
				step: true,
				say: "Give it a title, like Lunch, and pick a Category, like Dining Out.",
			},
			{
				id: "ignore",
				say: "You’ll also see Treatment and Spending bucket. Leave those alone for now: your Category fills them in, and we’ll come back to them later.",
			},
			{
				id: "save",
				step: true,
				say: "Choose Create Record to save. The lunch Statement leaves Allocator, because it’s fully explained.",
			},
		],
	},
	{
		id: "split",
		title: "Splitting one payment",
		level: "The basics",
		summary: "Explain one Statement with several Records, like groceries and a gift.",
		keywords:
			"split divide partial allocate one statement two records groceries gift remaining",
		destination: "allocator",
		beats: [
			{
				id: "select",
				step: true,
				say: "Back to the $80 supermarket trip. Select it in Allocator, and choose Create Record.",
			},
			{
				id: "amount",
				step: true,
				say: "Call it Groceries, and change both the Record’s amount and the Statement’s Allocation to $50. The other $30 stays unexplained for now.",
			},
			{
				id: "left",
				step: true,
				say: "Save, and the supermarket Statement stays in Allocator, with $30 left.",
			},
			{
				id: "gift",
				step: true,
				say: "Select it again, and create a second Record, Birthday gift, for the remaining $30. Finpoint fills that amount in for you.",
			},
			{
				id: "done",
				say: "Now one Statement is explained by two Records: $50 of groceries, and a $30 gift.",
			},
		],
	},
	{
		id: "repayment",
		title: "Combining payments into one Record",
		level: "The basics",
		summary:
			"Explain several Statements with one Record, like a dinner your friend paid you back for.",
		keywords: "combine shared dinner repayment friend paid back several statements one record",
		destination: "allocator",
		beats: [
			{
				id: "select",
				step: true,
				say: "Now the shared dinner. In Allocator, select both Statements: the $90 you paid, and the $60 your friend sent back. The bar shows their total: $30.",
			},
			{
				id: "create",
				step: true,
				say: "Choose Create Record, and call it Dinner with Sam. Both Statements are attached, and the Record comes to $30, your real share.",
			},
			{
				id: "done",
				say: "Save, and two bank rows are explained by a single Record. Your spending shows the $30 you really spent, not $90.",
				detail: "The money your friend sent back isn’t income. It belongs to the dinner, so it simply reduces what the dinner cost you.",
			},
		],
	},
	{
		id: "dashboard",
		title: "Where your numbers come from",
		level: "The basics",
		summary: "The Dashboard is built from your Records, so explained activity is what counts.",
		keywords: "dashboard numbers totals empty spending records categories monthly charts",
		destination: "dashboard",
		beats: [
			{
				id: "records",
				say: "With a few Records saved, your Dashboard starts to fill in. Everything on it is calculated from Records, never directly from Statements.",
			},
			{
				id: "empty",
				say: "That’s why importing alone leaves the Dashboard empty. A Statement only counts once you’ve explained it.",
			},
			{
				id: "real",
				say: "And because it uses your explanations, the Dashboard shows what you really spent: $30 on dinner, not $90, and groceries apart from the gift.",
			},
			{
				id: "categories",
				say: "Your spending is broken down by Category, so the Categories you choose shape everything you see here.",
				detail: "Use the month switcher at the top to look back, and the Monthly Records tab to see every Record behind the month’s numbers.",
			},
		],
	},

	// ─── Going further ───────────────────────────────────────────────────────────────────
	{
		id: "pending",
		title: "Pending Records",
		level: "Going further",
		summary: "Record spending before all of its bank activity has arrived.",
		keywords:
			"pending record mismatch amounts do not match waiting repayment attach to record why pending",
		destination: "records",
		beats: [
			{
				id: "when",
				say: "Sometimes you know about spending before your bank shows all of it. Finpoint lets you record it anyway.",
			},
			{
				id: "concert",
				say: "Say you paid $200 for two concert tickets, and your friend Jo will pay you back $100 next week. You can already create the Record for your $100 share, from the $200 payment.",
			},
			{
				id: "flag",
				say: "The amounts don’t match yet, $100 against $200. Finpoint warns you, and saves the Record as Pending.",
			},
			{
				id: "list",
				say: "Pending Records are marked in your Records list, so nothing gets forgotten.",
			},
			{
				id: "attach",
				say: "When Jo’s $100 arrives, select it in Allocator and choose Attach to Record. Finpoint suggests the Pending Record it matches exactly.",
			},
			{
				id: "complete",
				say: "Save, and the Record now combines both payments. The amounts match, so it’s no longer Pending.",
			},
			{
				id: "meaning",
				say: "It works the same for a deposit now and the balance later. Pending simply means: this explanation doesn’t add up yet.",
				detail: "A Record with no Statements at all is Pending too. Open any Pending Record and choose Why Pending? to see exactly what doesn’t add up.",
			},
		],
	},
	{
		id: "pending-statements",
		title: "Pending Statements",
		level: "Going further",
		summary:
			"Add a placeholder for a bank row that hasn’t arrived, then replace it when it does.",
		keywords:
			"pending statement placeholder handwritten replace pending card payment not yet exported",
		destination: "statements",
		beats: [
			{
				id: "why",
				say: "Some banks take days to show a card payment. If you want it explained today, create a Pending Statement: a placeholder for a bank row you’re expecting.",
			},
			{
				id: "create",
				step: true,
				say: "On the Statements page, choose Create Pending Statement. Pick the account, then enter the amount and a short description.",
			},
			{
				id: "explain",
				step: true,
				say: "It appears in Allocator, marked Pending. Explain it like any other Statement. The Record counts straight away, but stays Pending while it relies on a placeholder.",
			},
			{
				id: "replace",
				step: true,
				say: "When the real bank row is imported, open Replace Pending in Allocator. Pick the placeholder, and Finpoint suggests the imported Statements it could become.",
			},
			{
				id: "review",
				step: true,
				say: "Choose Replace. The Allocations move to the real Statement, the placeholder disappears, and nothing is counted twice.",
			},
		],
	},
	{
		id: "categories",
		title: "Categories",
		level: "Going further",
		summary: "The most important choice on a Record, and the defaults it brings.",
		keywords: "category categories organise dining groceries defaults rename create",
		destination: "categories",
		beats: [
			{
				id: "most",
				say: "Categories are the most important choice you make on a Record. They say what it was for, and the Dashboard breaks your spending down by them.",
			},
			{
				id: "examples",
				say: "Lunch and dinner with friends are Dining Out. The supermarket run is Groceries. The birthday gift goes under Gifts and Donations. Finpoint starts you with a sensible set, and you can rename them or add your own.",
			},
			{
				id: "defaults",
				say: "Each Category also carries two defaults: a treatment, and a spending bucket. That’s why you could ignore those fields earlier. The Category fills them in.",
			},
		],
	},

	// ─── Advanced ────────────────────────────────────────────────────────────────────────
	{
		id: "treatments",
		title: "Treatments",
		level: "Advanced",
		summary: "How the Dashboard counts a Record: income, spending, saving, or not at all.",
		keywords:
			"treatment income spending saving investment transfer neutral refund automatic counted",
		destination: "categories",
		beats: [
			{
				id: "what",
				say: "Treatment decides how the Dashboard counts a Record: as income, as spending, as saving, or not at all.",
			},
			{
				id: "examples",
				say: "Your salary is Income. Lunch and groceries are Spending, and so is a refund, which lowers what you spent. Moving $500 into savings is Saving or investment. And moving money between your own accounts is a Transfer, which isn’t counted at all.",
			},
			{
				id: "override",
				say: "Your Category sets the treatment for you. Change it on a single Record only when that Record is an exception.",
				detail: "Automatic by direction counts money in as income and money out as spending. It’s rarely what you want for refunds, so most Categories use a fixed treatment.",
			},
		],
	},
	{
		id: "buckets",
		title: "Spending buckets and monthly targets",
		level: "Advanced",
		summary: "Monthly plans for groups of spending, like everyday Daily spending.",
		keywords: "bucket buckets daily recurring irregular travel target monthly budget pace plan",
		destination: "dashboard",
		beats: [
			{
				id: "what",
				say: "A spending bucket groups your spending for monthly planning. Think of it as a monthly budget that repeats. Finpoint starts you with four: Daily, Recurring, Irregular and Travel.",
			},
			{
				id: "daily",
				say: "Daily is the one to watch. It holds everyday spending, like food and transport, and the Dashboard paces it through the month.",
			},
			{
				id: "target",
				say: "Give a bucket a monthly target, say $500 for Daily. You can set it for one month only, or from this month onward.",
			},
			{
				id: "compare",
				say: "The Dashboard then shows how this month is going against the target. Targets don’t move any money. They’re simply a comparison.",
				detail: "A Record joins a bucket through its Category’s default, and only spending counts towards a bucket.",
			},
		],
	},
	{
		id: "budgets",
		title: "Budgets for trips and events",
		level: "Advanced",
		summary: "A plan with its own dates and its own small dashboard.",
		keywords: "budget trip holiday event wedding automatic attach dates period plan",
		destination: "budgets",
		beats: [
			{
				id: "what",
				say: "A Budget is for spending with its own start and end, like a week in Bali, or a wedding.",
			},
			{
				id: "create",
				say: "Create one with a name, an amount and its dates. Leave Automatic attach on, and Records dated inside the period are attached for you: the ones you already have, and new ones as you add them.",
				detail: "With Automatic attach off, you choose the Records yourself. You can attach or detach a Record from the Budget’s page at any time.",
			},
			{
				id: "own",
				say: "A Budget is its own small dashboard for that period: what you’ve spent, what’s left, and your pace. It’s separate from your monthly Dashboard, and doesn’t change it.",
			},
		],
	},

	// ─── Your data ───────────────────────────────────────────────────────────────────────
	{
		id: "sync",
		title: "Backups and Google Drive",
		level: "Your data",
		summary: "Your data stays in your browser. Keep a copy with a backup file or Google Drive.",
		keywords: "backup restore google drive sync export download file privacy device local data",
		destination: "sync",
		beats: [
			{
				id: "local",
				say: "Finpoint keeps your data in this browser, on this device. There’s no Finpoint database, and your finances never pass through our servers, so we never see them.",
			},
			{
				id: "file",
				say: "That means keeping a copy is up to you, and there are two ways. The first is a backup file. Download it from the Data page whenever you like, and restore it later, on this device or a new one.",
				detail: "Restoring replaces everything in the browser, so download a fresh backup first if you might want what’s there now.",
			},
			{
				id: "drive",
				say: "The second is Google Drive. Connect it once, and Finpoint keeps a copy in a hidden folder in your own Drive, automatically, so your devices stay in step.",
				detail: "If the same data changes on two devices, Finpoint asks which copy to keep instead of guessing.",
			},
			{
				id: "yours",
				say: "Either way, your data only goes to places you control.",
			},
		],
	},
	{
		id: "routine",
		title: "Your routine",
		level: "Your data",
		summary:
			"A few minutes each time: import, explain, check Pending, glance at the Dashboard.",
		keywords: "routine habit summary weekly checklist next steps",
		destination: "importer",
		beats: [
			{
				id: "loop",
				say: "Here’s a routine that works. Import your latest statements. Explain what’s new in Allocator. Check anything Pending. Then glance at your Dashboard.",
			},
			{
				id: "backup",
				say: "If you’ve connected Google Drive, you’re backed up automatically. If not, download a backup every so often.",
			},
			{
				id: "help",
				say: "And whenever you’re unsure, open Help from any page or form. Every chapter of this guide is there, with pictures.",
			},
		],
	},
]

export function getGuideChapter(id: string | null | undefined): GuideChapter {
	const chapter = guideChapters.find(item => item.id === id) ?? guideChapters[0]
	if (!chapter) throw new Error("The guide needs at least one chapter.")
	return chapter
}

/** Step number of a beat within its chapter's tutorial, or null when it isn't a step. */
export function stepOf(chapter: GuideChapter, beatId: string) {
	const steps = chapter.beats.filter(beat => beat.step)
	const index = steps.findIndex(beat => beat.id === beatId)
	return index === -1 ? null : { number: index + 1, total: steps.length }
}

/** Practice lessons that rehearse a chapter with sample data. */
export const practiceFor: Record<string, string> = {
	lunch: "lunch",
	split: "split",
	repayment: "repayment",
	pending: "pending",
}
