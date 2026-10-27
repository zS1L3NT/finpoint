// The beginner guide: one source for the narrated video and the Help articles.
//
// Chapters introduce one idea at a time, in the order a new user meets them. Each chapter is a
// sequence of beats. A beat is one narrated moment of the video (its `say` is spoken and captioned)
// and one illustrated paragraph of the Help article (with an optional article-only `detail`).
// Beats marked `step` form the chapter's tutorial and are numbered on screen; only chapters that
// really walk through a task have them.
//
// The film shows each beat with a real-app take (`video/scripts/story.ts`) or an illustrated scene
// (`video/scenes.ts`). Both are keyed by chapter and beat id and act on words in `say`, so reword
// with them in view: a cue word that disappears fails the build loudly.

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
	| "duplicates"
	| "replace"
	| "records"
	| "monthly"
	| "statements"
	| "accounts"
	| "categories"
	| "rules"
	| "budgets"
	| "sync"
	| "settings"
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
				say: "Your bank can tell you where every dollar went. What it can’t tell you is what each payment was really for.",
			},
			{
				id: "split",
				say: "Say you spent $80 at the supermarket. $50 of that was groceries, and $30 was a birthday gift for a friend. Your bank shows one $80 payment. But to you, those are two very different things.",
			},
			{
				id: "dinner",
				say: "Or you paid $90 for dinner with a friend, and they sent their $60 share back a week later. Your bank shows two payments, a week apart: money out, and money in. What dinner really cost you was $30.",
			},
			{
				id: "explain",
				say: "Finpoint closes that gap. It keeps your bank activity exactly as your bank reports it, and lets you explain it in your own words: groceries, $50. A gift, $30. Your share of dinner, $30.",
			},
			{
				id: "built",
				say: "Once your spending is explained, your charts and budgets finally tell the truth. So using Finpoint comes down to three things: bring in your bank activity, explain it, and see where your money really went.",
			},
		],
	},
	{
		id: "model",
		title: "Statements, Records and Allocations",
		level: "The basics",
		summary:
			"The three words behind everything: bank activity, your explanations, and the amounts that connect them.",
		keywords: "statement record allocation terms concepts split combine transaction",
		destination: "allocator",
		beats: [
			{
				id: "three",
				say: "To do that, Finpoint uses three words, and everything else builds on them: Statements, Records and Allocations.",
			},
			{
				id: "statement",
				say: "A Statement is one line of bank activity, exactly as your bank reports it. Like that $80 supermarket payment.",
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
				say: "Most of the time, though, it’s one to one. A $12 lunch is one Statement, explained by one Lunch Record.",
				detail: "You never change the bank’s amounts to make things fit. You explain them with Records, and Allocations show which part of each Statement went where.",
			},
		],
	},
	{
		id: "workspace",
		title: "Trying Finpoint first",
		level: "The basics",
		summary: "Look around with demo data before you bring in your own.",
		keywords: "demo data try sample explore first visit empty start",
		destination: "dashboard",
		beats: [
			{
				id: "demo",
				say: "Before you bring in your own bank, you can look around. On your first visit, the Dashboard, Finpoint’s home page, offers demo data: three accounts and five months of Records, so you can see what a lived-in Finpoint looks like.",
				detail: "Demo data replaces whatever is in this browser. Reset it from the Data page when you’re ready to start for real.",
			},
			{
				id: "own",
				say: "When you’re ready for your own money, reset the demo data from the Data page, and start with your own bank activity. That’s next.",
			},
		],
	},
	{
		id: "import",
		title: "Importing your bank activity",
		level: "The basics",
		summary: "Download an export from your bank, then bring it in with the Importer.",
		keywords:
			"import importer csv xls xlsx excel bank dbs ocbc uob revolut account file upload skipped",
		destination: "importer",
		beats: [
			{
				id: "intro",
				say: "Banks let you download your activity as a file, called an export, from your bank’s website or app. You bring that file into Finpoint, and it reads every line.",
			},
			{
				id: "banks",
				say: "Finpoint reads exports from DBS, OCBC, UOB and Revolut, as a CSV file or an Excel spreadsheet, depending on the bank.",
			},
			{
				id: "accounts",
				say: "Each Statement belongs to an Account, one for each of your bank accounts. Import your OCBC 360 Account and your UOB savings account, and Finpoint keeps their Statements apart, using the account details inside each file.",
				detail: "Accounts are created for you the first time you import from them. You can rename them on the Accounts page.",
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
				say: "Then open Importer from the sidebar, choose your bank, and add your files.",
			},
			{
				id: "result",
				step: true,
				say: "Choose Import, and check how many new Statements came in.",
				detail: "Importing an overlapping file again is safe: Statements Finpoint already has are skipped. If your bank changed a description between exports, the repeat shows up as a possible duplicate instead, which you can fix in Workflows.",
			},
			{
				id: "next",
				step: true,
				say: "Your new Statements now wait in Workflows, under Allocate to Records, until you explain them. That’s where we’ll go next.",
			},
		],
	},
	{
		id: "allocator",
		title: "Workflows",
		level: "The basics",
		summary: "Where bank amounts wait for an explanation, and where you tidy up imports.",
		keywords:
			"workflows allocate to records allocator unexplained remaining allocable fix duplicates replace pending",
		destination: "allocator",
		beats: [
			{
				id: "list",
				say: "Workflows is your to-do list, and where you’ll spend most of your time. Its first tab, Allocate to Records, lists every Statement that still has money left to explain, newest first.",
			},
			{
				id: "left",
				say: "When only part of a Statement has been explained, it shows how much is left. Once it’s fully explained, it leaves the list. An empty list means you’re done.",
			},
			{
				id: "tabs",
				say: "The other two tabs keep your imports clean. Fix Duplicates catches a payment your bank exported twice, and Replace Pending swaps a payment your bank hadn’t confirmed yet for the confirmed one. We’ll get to both.",
			},
			{
				id: "pages",
				say: "Two other pages help you look things up. Statements lists all your bank activity, explained or not. Records lists your explanations. Workflows only shows what still needs you.",
				detail: "If something seems to be missing, check the date range and filters first. A fully allocated Statement no longer appears in Allocate to Records, but it’s always in the Statements list.",
			},
		],
	},
	{
		id: "lunch",
		title: "Explaining your first purchase",
		level: "The basics",
		summary: "Select a Statement in Workflows and create the Record that explains it.",
		keywords:
			"first record create workflows allocate lunch purchase explain title category save",
		destination: "allocator",
		beats: [
			{
				id: "select",
				step: true,
				say: "Let’s explain a $12 lunch. In Allocate to Records, click the lunch Statement to select it. A bar appears at the top, with what you can do next.",
			},
			{
				id: "create",
				step: true,
				say: "Choose Create Record. A new Record opens with the Statement already allocated, and its amount and date filled in.",
			},
			{
				id: "fill",
				step: true,
				say: "Give it a title, like Lunch, and pick a Category, like Dining Out. A Category says what the money was for, and your spending charts are grouped by it.",
				detail: "People, Location and Description are optional. Add them when they’ll help you find the Record later.",
			},
			{
				id: "ignore",
				say: "Under Analytics you’ll also see Treatment and Monthly Budget. Leave those for now: your Category fills them in, and we’ll come back to them later.",
			},
			{
				id: "save",
				step: true,
				say: "Choose Create Record again, at the bottom, to save. The lunch Statement leaves the list, because it’s fully explained.",
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
				say: "Now the $80 supermarket trip, which was really two things. Select it, and choose Create Record.",
			},
			{
				id: "amount",
				step: true,
				say: "Call it Groceries, and set both the Record’s amount and its Allocation to $50. The Record is what you spent, and the Allocation is how much of this payment covers it. The other $30 stays unexplained for now.",
			},
			{
				id: "left",
				step: true,
				say: "Save, and the supermarket Statement stays in the list, with $30 left.",
			},
			{
				id: "gift",
				step: true,
				say: "Select it again, and create a second Record, Birthday gift, for the $30 left to allocate. Finpoint fills that amount in for you.",
			},
			{
				id: "save",
				step: true,
				say: "Save, and the supermarket Statement leaves the list, because it’s now fully explained.",
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
				say: "Now the shared dinner. Select both Statements: the $90 you paid, and the $60 your friend Sam sent back. The bar nets them out: $90 out, $60 back, so $30.",
			},
			{
				id: "create",
				step: true,
				say: "Choose Create Record, and call it Dinner. Both Statements are allocated, and the Record comes to $30, your real share.",
			},
			{
				id: "done",
				say: "Save, and two Statements are explained by a single Record. Your spending shows the $30 you really spent, not $90.",
				detail: "The money your friend sent back isn’t income. It belongs to the dinner, so it simply reduces what the dinner cost you.",
			},
		],
	},
	{
		id: "dashboard",
		title: "Where your numbers come from",
		level: "The basics",
		summary: "The Dashboard is built from your Records, so explained activity is what counts.",
		keywords: "dashboard overview numbers totals empty spending records categories monthly",
		destination: "dashboard",
		beats: [
			{
				id: "records",
				say: "Now let’s see what those explanations buy you. With a few Records saved, your Dashboard starts to fill in. Every total on it is calculated from Records, never directly from Statements.",
			},
			{
				id: "empty",
				say: "That’s why importing alone doesn’t change your spending. A Statement only counts once you’ve explained it.",
			},
			{
				id: "real",
				say: "And because it uses your explanations, the Dashboard shows what you really spent: $30 on dinner, not $90, and groceries apart from the gift.",
			},
			{
				id: "categories",
				say: "Categories this month breaks your spending down by Category, so the Categories you choose shape everything you see here.",
				detail: "Use the arrows beside the month to look back, and the Monthly Records tab to see every Record behind the month’s numbers. Pending Records already count in these totals.",
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
			"pending record mismatch amounts do not match waiting repayment allocate to record why pending",
		destination: "records",
		beats: [
			{
				id: "when",
				say: "Your Dashboard is only as current as your explanations. But sometimes you know about spending before your bank shows all of it, and you’d rather record it now than try to remember it later.",
			},
			{
				id: "concert",
				say: "Say you paid $200 for two concert tickets, and your friend Jo will pay you back $100 next week. You can already create the Record for your $100 share, from the $200 payment.",
			},
			{
				id: "flag",
				say: "The amounts don’t match yet: $100 against $200. Finpoint warns you, and saves the Record as Pending, which means it isn’t settled yet. Your $100 share already counts.",
			},
			{
				id: "list",
				say: "Pending Records are marked in your Records list, so nothing gets forgotten.",
			},
			{
				id: "attach",
				say: "When Jo’s $100 arrives, select it and choose Allocate to record. Finpoint suggests the Pending Record it completes.",
			},
			{
				id: "complete",
				say: "The Record now combines both payments. Save, and because the amounts tally, it’s no longer Pending.",
			},
			{
				id: "meaning",
				say: "So a Record is Pending for one of two reasons. Its amounts don’t tally yet, like the concert. Or one of its Statements is still Pending at the bank. Either way, Pending means the Record isn’t fully confirmed yet.",
				detail: "A Record with no Statements at all is Pending too. Open any Pending Record and choose Why Pending? to see exactly what doesn’t add up.",
			},
		],
	},
	{
		id: "pending-statements",
		title: "Pending Statements",
		level: "Going further",
		summary:
			"Bank activity that isn’t confirmed yet, and how to swap it for the real Statement.",
		keywords:
			"pending statement placeholder replace pending card payment not yet exported revolut",
		destination: "replace",
		beats: [
			{
				id: "why",
				say: "That second kind of Pending starts at the bank. A Pending Statement is bank activity that isn’t confirmed yet. Some imports, like Revolut’s, bring card payments in as Pending. And if your bank takes days to show a payment, you can add one yourself, so your month stays complete.",
			},
			{
				id: "create",
				step: true,
				say: "On the Statements page, choose Create Pending Statement. Pick the account, then enter the amount and a short description.",
			},
			{
				id: "explain",
				step: true,
				say: "It appears in Workflows, marked Pending. Explain it like any other Statement: here, a burger with Mia, under Dining Out. Save, and the Record counts straight away, but stays Pending while its Statement does.",
			},
			{
				id: "replace",
				step: true,
				say: "When the confirmed Statement arrives in a later import, open Replace Pending. Pick the Pending Statement, and Finpoint suggests the imported Statements it could become.",
			},
			{
				id: "review",
				step: true,
				say: "Review the swap, and choose Replace pending Statement. The Allocations move to the confirmed Statement, the Pending one disappears, and nothing is counted twice.",
			},
		],
	},
	{
		id: "duplicates",
		title: "Fixing duplicate Statements",
		level: "Going further",
		summary: "When your bank exports the same activity twice, keep one and delete the rest.",
		keywords: "duplicate duplicates double import fix keep delete not duplicates same day",
		destination: "duplicates",
		beats: [
			{
				id: "why",
				say: "Imports can go wrong in one more way. Sometimes a bank changes a payment’s description between exports. Import both files, and the same payment arrives twice, so you might explain it twice.",
			},
			{
				id: "badge",
				say: "Finpoint spots Statements with the same account, day and amount, and marks them as possible duplicates. Open Fix Duplicates in Workflows to review them.",
			},
			{
				id: "choose",
				step: true,
				say: "If they really are two payments, choose Not duplicates. Otherwise, choose the Statement to keep, then Review deletion.",
			},
			{
				id: "review",
				step: true,
				say: "Finpoint shows what will happen before anything is deleted. Allocations follow the Statement you keep, so your Records stay explained.",
				detail: "Pairs you mark as not duplicates are listed separately, and you can restore them. Finpoint doesn’t remember deleted descriptions, so importing the same old export again can bring them back.",
			},
		],
	},
	{
		id: "find",
		title: "Finding and fixing Records",
		level: "Going further",
		summary: "Search, filter and edit your Records, and set the date range you usually want.",
		keywords: "find search filter edit record statements accounts settings default filters",
		destination: "records",
		beats: [
			{
				id: "records",
				say: "Sooner or later you’ll want to look something up, like what that $90 dinner was. Open Records. Search by title, or filter by date, Category or amount.",
			},
			{
				id: "edit",
				step: true,
				say: "Open a Record to see its Statements, then choose Edit Record to change any field, or the Allocations behind it.",
			},
			{
				id: "statements",
				say: "Statements works the same way for your bank activity, and each Account has a page of its own.",
			},
			{
				id: "settings",
				say: "And if you always look at the same period, set default filters in Settings, so every list opens on that range.",
			},
		],
	},
	{
		id: "categories",
		title: "Categories",
		level: "Going further",
		summary: "The most important choice on a Record, and the defaults it brings.",
		keywords: "category categories organise dining groceries defaults subcategory create",
		destination: "categories",
		beats: [
			{
				id: "most",
				say: "We’ve been picking Categories all along. They’re the most important choice you make on a Record: they say what it was for, and the Dashboard breaks your spending down by them.",
			},
			{
				id: "examples",
				say: "Lunch and dinner with friends are Dining Out. The supermarket run is Groceries. The birthday gift goes under Gifts & Donations. Finpoint starts you with a sensible set, and you can rename them, add your own, or nest one under another, like Coffee under Dining Out.",
			},
			{
				id: "defaults",
				say: "Each Category also carries two defaults: a Treatment, and a Monthly Budget. That’s why you could leave those fields alone earlier: the Category fills them in. We’ll look at both, right after one more time-saver.",
			},
		],
	},
	{
		id: "rules",
		title: "Statement rules",
		level: "Going further",
		summary: "Recognise repeat Statements and fill in the Records you create from them.",
		keywords: "rule rules statement rules recurring autofill suggest description match repeat",
		destination: "rules",
		beats: [
			{
				id: "why",
				say: "Your Categories already fill in two fields. Some payments come back every month, like your phone bill, and typing them out again gets old. A Statement rule recognises them, and fills in the Record for you when you create it. It never creates Records on its own.",
			},
			{
				id: "match",
				step: true,
				say: "Open Rules and choose New rule. Give it a name, and the text to look for in the description. Finpoint shows the Statements it matches.",
			},
			{
				id: "fill",
				step: true,
				say: "Then choose what it fills in: a title, a Category, even People or a Location. Autofill puts the value straight into the field. Suggest offers it as a one-click suggestion instead.",
			},
			{
				id: "use",
				say: "Next time you create a Record from a matching Statement, the autofilled fields are ready, and the suggestions are one click away. You can still change any of them.",
				detail: "Rules only prepare a Record when you create one. They don’t create Records on their own, or change Records you already have. You can pause a rule at any time.",
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
			"treatment income spending saving investment transfer excluded refund automatic counted",
		destination: "categories",
		beats: [
			{
				id: "what",
				say: "Now, those two defaults. The first is Treatment. It decides how the Dashboard counts a Record: as income, as spending, as saving, or not at all.",
			},
			{
				id: "examples",
				say: "Your salary is Income. Lunch and groceries are Spending. A refund is Spending too, because it lowers what you spent. Putting $500 into an investment account is Saving / investment. And moving money between two accounts you track is a Transfer, which isn’t counted at all.",
			},
			{
				id: "dashboard",
				say: "On the Dashboard, Income and Spending make up your totals and charts. Saving and investment are kept out of them, in their own section further down, so saving never looks like spending. And Transfers don’t appear at all.",
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
		title: "Monthly Budgets",
		level: "Advanced",
		summary: "Plans that repeat every month, like everyday Daily spending.",
		keywords:
			"monthly budget budgets daily recurring irregular travel amount rule override default plan forecast",
		destination: "dashboard",
		beats: [
			{
				id: "what",
				say: "The second default is a Monthly Budget. It answers a different question: am I on track? A Monthly Budget is a group of spending you plan for. Finpoint starts you with four: Daily for everyday spending, Recurring for bills like rent and your phone, Irregular for one-off costs, and Travel. Each gets its own amount every month.",
			},
			{
				id: "daily",
				say: "Daily is the one to watch. It holds everyday spending, like food and transport, and the Dashboard forecasts where it’s heading by the end of the month.",
			},
			{
				id: "amount",
				step: true,
				say: "To give Daily an amount, choose Edit beside it on the Dashboard, and set a Monthly amount, say $500.",
			},
			{
				id: "rule",
				step: true,
				say: "The Amount rule decides which months that amount covers. Override one month changes this month only. Override default applies from this month onward.",
				detail: "A month set to Default uses the latest default from an earlier month. No amount means there’s nothing to compare against. An amount of zero is a real plan to spend nothing.",
			},
			{
				id: "compare",
				say: "The Dashboard then shows how the month is going against the plan. A Monthly Budget doesn’t move or set aside any money. It’s a comparison, nothing more.",
				detail: "A Record joins a Monthly Budget through its Category’s default, or one you choose on the Record. Only spending counts towards it.",
			},
		],
	},
	{
		id: "insights",
		title: "Reading the Overview",
		level: "Advanced",
		summary: "What the Dashboard’s numbers and charts compare, and how to dig into them.",
		keywords:
			"overview dashboard charts income spending surplus compare forecast calendar weekday category trend",
		destination: "dashboard",
		beats: [
			{
				id: "metrics",
				say: "With a plan in place, the Overview, the Dashboard’s first tab, becomes your monthly check-in. Its top answers the big questions: what came in, what you spent, and your surplus, which is the difference. Each number is compared with the last two months, at the same point in the month.",
			},
			{
				id: "scope",
				say: "Choose a Monthly Budget at the top, and the spending charts narrow to it. Cards whose names start with Total ignore that choice, and always show everything.",
			},
			{
				id: "forecast",
				say: "The Spending forecast chart shows this month so far, where it’s heading, and the months before, so you can see early if you’re running ahead.",
			},
			{
				id: "category",
				say: "Further down, Categories this month and their trend show what changed, and Biggest changes calls out the largest moves.",
			},
			{
				id: "calendar",
				say: "The calendar colours each day by how much you spent. Pick a day to see its Records.",
			},
		],
	},
	{
		id: "monthly",
		title: "Monthly Records",
		level: "Advanced",
		summary: "Every Record behind a month’s numbers, day by day.",
		keywords: "monthly records month day review pending unallocated unbudgeted shortcuts",
		destination: "monthly",
		beats: [
			{
				id: "days",
				say: "When a number on the Overview surprises you, Monthly Records shows what’s behind it. It sits next to the Overview: every Record in the month, grouped by day, with each day’s total.",
			},
			{
				id: "drill",
				say: "Click any part of a chart on the Overview, and Monthly Records opens on just those Records.",
			},
			{
				id: "review",
				say: "And at the bottom of the Overview, Review this month links to anything that needs you: Pending Records, Pending Statements, and spending that isn’t in any Monthly Budget, so no plan is tracking it.",
			},
		],
	},
	{
		id: "budgets",
		title: "Budgets for trips and events",
		level: "Advanced",
		summary: "A plan with its own dates and its own small dashboard.",
		keywords: "budget trip holiday event wedding automatic attach detach dates period plan",
		destination: "budgets",
		beats: [
			{
				id: "what",
				say: "Everything so far works month by month. A Budget, with no Monthly in front, is different: it has its own start and end, like a week in Bali, or a wedding. You see the whole trip in one place, even when it spans two months.",
			},
			{
				id: "create",
				step: true,
				say: "Create one with a name, an amount and its dates.",
			},
			{
				id: "attach",
				step: true,
				say: "Automatic attach adds every Record dated inside the period, including income and transfers. To choose the Records yourself, turn it off, and attach them from the Budget’s page.",
			},
			{
				id: "own",
				say: "A Budget is its own small dashboard for that period: what you’ve spent, what’s left, and your pace. Its Records still count on your monthly Dashboard as usual.",
				detail: "A Budget adds up the amounts of the Records attached to it, whatever their treatment, so its total can differ from the Dashboard’s.",
			},
		],
	},

	// ─── Your data ───────────────────────────────────────────────────────────────────────
	{
		id: "sync",
		title: "Backups and Google Drive",
		level: "Your data",
		summary: "Your data stays in your browser. Keep a copy with a backup file or Google Drive.",
		keywords:
			"backup restore google drive sync export download file privacy device local data conflict reset",
		destination: "sync",
		beats: [
			{
				id: "local",
				say: "You’ve put real work into explaining your money, so it’s worth knowing where it lives. Finpoint runs in your browser, and keeps your data on this device. There’s no Finpoint database, and your finances never pass through our servers, so we never see them.",
			},
			{
				id: "file",
				say: "That means keeping a copy is up to you, and there are two ways. The first is a backup file. Download it from the Data page whenever you like, and restore it later, on this device or a new one. Restoring replaces this browser’s data with the backup.",
				detail: "Restoring replaces everything in the browser, so download a fresh backup first if you might want what’s there now.",
			},
			{
				id: "drive",
				say: "The second is Google Drive. Connect it once, and Finpoint keeps a copy in a hidden folder in your own Drive, automatically, so your devices stay in step.",
			},
			{
				id: "conflict",
				say: "If the same data changed on two devices, Finpoint asks which copy to keep, and keeps that whole copy, never a mix of both, so your Records always add up.",
			},
			{
				id: "yours",
				say: "Either way, your data only goes to places you control.",
				detail: "The Data page can also load demo data or clear everything. Both replace what’s in this browser.",
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
				say: "Here’s a routine that works. Import your latest bank exports. Fix any duplicates, and explain what’s new in Workflows. Check anything Pending. Glance at your Dashboard. And keep a backup.",
			},
			{
				id: "backup",
				say: "With Google Drive connected, that happens automatically. If not, download a backup file every so often.",
			},
			{
				id: "help",
				say: "And whenever you’re unsure, choose Help at the top of any page. It lists the guides for that page, step by step.",
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
