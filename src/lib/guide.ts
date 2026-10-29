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
	/** The next beat finishes this beat's thought, so the film barely pauses between them. */
	flow?: boolean
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
		summary: "Your bank shows what moved, not what it was for. Finpoint lets you label it.",
		keywords: "welcome introduction beginner problem purpose overview",
		beats: [
			{
				id: "welcome",
				say: "So you’ve decided to take charge of your spending, maybe after noticing your bank balance running dry faster than you expected. Congratulations, and welcome to Finpoint. This guide walks you through everything Finpoint can do, so you can use all of it, or just the parts you need. Finpoint can help you track several bank accounts, or just a few daily payments from one bank account. Finpoint works either way.",
			},
			{
				id: "missing",
				say: "But modern banking apps can already list every payment from your bank account. So what’s missing? Isn’t that enough?",
			},
			{
				id: "bank",
				say: "The thing is, your bank can tell you where every dollar went through your bank statements, but your bank can’t tell you what each payment was really for.",
			},
			{
				id: "split",
				say: "Let’s say you spent $80 at the supermarket in one Apple Pay payment: $50 of that $80 was on groceries, and $30 of that $80 was on a birthday gift for a friend. Your banking app shows one $80 payment, and nothing more. But to you, those are two very different purchases, and maybe you’d like to label them that way.",
			},
			{
				id: "dinner",
				say: "Or let’s say you paid $90 for dinner with a friend, and they sent their $60 share back a week later. Your banking app shows two payments, a week apart, so you’d have to scroll past everything in between to get the full picture of both payments. But to you, those two payments are really just one dinner, and maybe you’d like to label them that way.",
			},
			{
				id: "explain",
				say: "Finpoint was built to close that gap. Finpoint not only keeps your bank activity exactly as your bank reports it, but also lets you label your bank activity in your own words: groceries, $50. A gift, $30. Your share of dinner, $30.",
			},
			{
				id: "built",
				say: "That’s the whole idea of Finpoint: adding labels to your bank activity, whether it’s one label or many labels, and whether they’re simple or complex labels. Once your bank activity is labelled, your bank activity becomes much easier to understand.",
			},
			{
				id: "how",
				say: "So how do you use Finpoint? It comes down to just two things: bring in your bank activity, and label your bank activity. Everything else falls into place from there.",
			},
			{
				id: "concepts",
				say: "To do that, you’ll need to understand the three core ideas of Finpoint. Statements, which are your bank activity, exactly as your bank reports it. Records, which are your labels for your bank activity. And Allocations, which are the links between Statements and Records.",
			},
		],
	},
	{
		id: "model",
		title: "Statements, Records and Allocations",
		level: "The basics",
		summary:
			"The three ideas behind everything: bank activity, your labels for it, and the amounts that link them.",
		keywords: "statement record allocation terms concepts split combine transaction",
		destination: "allocator",
		beats: [
			{
				id: "statement",
				say: "A Statement is one line of bank activity, exactly as your bank reports it, like that $80 supermarket payment. Finpoint never lets you edit the Statements your bank gives you, so you can trust your Statements to match your bank. Well, almost always. We’ll get to that.",
			},
			{
				id: "record",
				say: "A Record is your label for what happened, like a Groceries Record for $50, and a Gift Record for $30.",
			},
			{
				id: "allocation",
				say: "An Allocation links a Statement to a Record, and says how much of the Statement belongs to that Record. Here, $50 of the supermarket Statement is allocated to the Groceries Record, and the other $30 to the Gift Record.",
			},
			{
				id: "split",
				say: "So one Statement can be split across several Records. That’s how you untangle a mixed shopping trip, or a bill that covers two different things.",
			},
			{
				id: "combine",
				say: "It works the other way too: several Statements can be combined into one Record. Your $90 dinner Statement and your friend’s $60 transfer Statement both belong to one Dinner Record, and that Record shows what you really spent: $30.",
			},
			{
				id: "simple",
				say: "Most of the time, though, it’s simpler: one Statement, labelled by one Record. A $12 lunch you had on your own is one Statement, labelled by one Lunch Record. Your Allocations don’t always have to be complex. Your Allocations can be as simple as this.",
				detail: "You never change the bank’s amounts to make things fit. You label them with Records, and Allocations show which part of each Statement went where.",
			},
			{
				id: "complex",
				say: "And when things get messier, Finpoint keeps up. Say you bought $80 of groceries and a $40 gift in one checkout, but paid $60 on each of two cards. That’s two Statements and two Records, linked by three Allocations.",
			},
			{
				id: "flexible",
				say: "We won’t be covering anything quite this complex in this guide. This example is just to show that Finpoint can be as flexible as you need it to be, even in very complex situations.",
			},
			{
				id: "enough",
				say: "Okay, that’s enough examples. Let’s get you familiar with Finpoint itself.",
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
				say: "On your first visit, you’ll be greeted by an empty Dashboard. Since you don’t have any data yet, click Try demo data. It loads three bank accounts and five months of Records, so you can see what a lived-in Finpoint looks like.",
				detail: "Demo data replaces whatever is in this browser. Clear it from the Data page when you’re ready to start for real.",
			},
			{
				id: "own",
				say: "When you’re done exploring, clear the demo data from the Data page, by clicking Clear all data. Then you’re ready to import your own bank activity.",
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
				say: "Many banks let you download your bank activity as a file, called a bank export, from their website or app. Finpoint doesn’t connect to your bank directly, so this bank export is how your bank activity gets into Finpoint.",
			},
			{
				id: "untouched",
				say: "Import the bank export exactly as your bank gave it to you. Finpoint reads each bank export as it is, so an edited bank export might not import into Finpoint correctly.",
			},
			{
				id: "banks",
				say: "For now, Finpoint reads bank exports from DBS, OCBC, UOB and Revolut, as a CSV file or an Excel spreadsheet, depending on the bank.",
			},
			{
				id: "accounts",
				say: "Don’t worry about importing bank exports from several bank accounts at once. Each bank export says which bank account it came from, so Finpoint sorts the new Statements for you. So if you import bank exports from two DBS bank accounts together, Finpoint keeps each bank account’s Statements apart.",
				detail: "Accounts are created for you the first time you import from them. You can rename them on the Accounts page.",
			},
			{
				id: "revolut",
				say: "There’s one catch, though: some bank exports don’t say which bank account they came from. Revolut is one of them. For a Revolut bank export, Finpoint will ask you to choose which bank account the bank export belongs to.",
			},
			{
				id: "download",
				say: "Let’s import your first bank export. Download a CSV or Excel bank export from your bank, once for each bank account you want to track.",
				step: true,
			},
			{
				id: "choose",
				say: "Then open the Importer from the sidebar, choose your bank, and add your bank exports. You can add several bank exports at once.",
				step: true,
			},
			{
				id: "result",
				say: "Click Import, and Finpoint will tell you how many new Statements came in.",
				detail: "Importing an overlapping file again is safe: Statements Finpoint already has are skipped. If your bank changed a description between exports, the repeat shows up as a possible duplicate instead, which you can fix in Workflows.",
				step: true,
			},
			{
				id: "pick",
				say: "And as we mentioned, for a Revolut bank export, you’ll need to choose its bank account before you import it.",
				step: true,
			},
			{
				id: "next",
				say: "Your new Statements now wait in Workflows for you to label, so that’s where we’re heading next.",
				step: true,
			},
		],
	},
	{
		id: "allocator",
		title: "Workflows",
		level: "The basics",
		summary: "Where bank activity waits for a label, and where you tidy up imports.",
		keywords:
			"workflows allocate to records allocator unexplained remaining allocable fix duplicates replace pending",
		destination: "allocator",
		beats: [
			{
				id: "list",
				say: "Workflows is your to-do list, and it’s where you’ll spend most of your time in Finpoint. Its first tab, Allocate to Records, lists every Statement that still needs a label, newest first.",
			},
			{
				id: "left",
				say: "Once a Statement is fully labelled, the Statement leaves this list. So an empty Allocate to Records list means you’re all caught up, at least until your next import.",
			},
			{
				id: "tabs",
				say: "The other two tabs help you tidy up your imported Statements. We’ll get to those tabs later.",
			},
			{
				id: "pages",
				say: "To look things up, use the Records page and the Statements page. The Records page lists every Record, and the Statements page lists every Statement, with filters to help you find anything. Workflows is different: Workflows only shows the Statements that still need a label.",
				detail: "If something seems to be missing, check the date range and filters first. A fully allocated Statement no longer appears in Allocate to Records, but it’s always in the Statements list.",
			},
		],
	},
	{
		id: "lunch",
		title: "One to one: your first Record",
		level: "The basics",
		summary: "Select a Statement in Workflows and create the Record that labels it.",
		keywords:
			"first record create workflows allocate lunch purchase explain title category save",
		destination: "allocator",
		beats: [
			{
				id: "select",
				say: "Let’s label that $12 solo lunch from earlier. In Workflows, click the lunch Statement to select it. A bar will appear at the top, with buttons for what you can do next.",
				step: true,
			},
			{
				id: "create",
				say: "We’ll cover the other buttons later. For now, click Create Record. The Create Record form opens with the Statement’s $12 already allocated, and the Record’s amount and date filled in for you.",
				step: true,
			},
			{
				id: "fill",
				say: "Give the Record a title, like Lunch, and choose a Category, like Dining Out. A Category says what the money was for, and your Category will matter on your Dashboard later.",
				detail: "People, Location and Description are optional. Add them when they’ll help you find the Record later.",
				step: true,
			},
			{
				id: "ignore",
				say: "Under Analytics, you’ll also see Treatment and Monthly Budget. Leave Treatment and Monthly Budget as they are for now: your Category fills them in. These features are more advanced, so we’ll cover them later.",
			},
			{
				id: "save",
				say: "Check that everything looks right, then click Create Record at the bottom to save the Record. The lunch Statement is now fully allocated by this Record, so the Statement leaves the list.",
				step: true,
			},
			{
				id: "found",
				say: "And on the Records page, you’ll find your new Lunch Record.",
			},
		],
	},
	{
		id: "split",
		title: "One to many: splitting a payment",
		level: "The basics",
		summary: "Label one Statement with several Records, like groceries and a gift.",
		keywords:
			"split divide partial allocate one statement two records groceries gift remaining",
		destination: "allocator",
		beats: [
			{
				id: "select",
				say: "Now let’s split the $80 supermarket trip. Select the supermarket Statement in Workflows, and click Create Record.",
				step: true,
			},
			{
				id: "amount",
				say: "Call the Record Groceries, and set both the Record’s amount and its Allocation to −$50. The Record is what you spent, and the Allocation is how much of this $80 Statement the Record uses. The other $30 stays unlabelled, for the next Record.",
				step: true,
			},
			{
				id: "submit",
				say: "Click Create Record.",
				step: true,
				flow: true,
			},
			{
				id: "left",
				say: "Because only $50 of the Statement is allocated, the supermarket Statement stays in the list, showing the $30 left.",
				step: true,
			},
			{
				id: "gift",
				say: "Select the supermarket Statement again, and create a second Record, Birthday gift. Finpoint fills in the $30 that’s left to allocate.",
				step: true,
			},
			{
				id: "save",
				say: "Click Create Record, and the supermarket Statement leaves the list.",
				step: true,
			},
			{
				id: "found",
				say: "On the Records page, you’ll now find both new Records: Groceries, and Birthday gift.",
			},
			{
				id: "done",
				say: "The supermarket Statement is now fully labelled by the two Records we just created: $50 of groceries, and a $30 gift.",
			},
		],
	},
	{
		id: "repayment",
		title: "Many to one: combining payments",
		level: "The basics",
		summary:
			"Label several Statements with one Record, like a dinner your friend paid you back for.",
		keywords: "combine shared dinner repayment friend paid back several statements one record",
		destination: "allocator",
		beats: [
			{
				id: "select",
				say: "Now let’s combine the two payments from the shared dinner we talked about earlier. Select both Statements: the $90 you paid, and the $60 your friend Sam sent back. The bar adds both Statements up: $90 out and $60 in, so $30 out.",
				step: true,
			},
			{
				id: "create",
				say: "Click Create Record, and call the Record Dinner. Both Statements are already allocated, and the Record comes to $30: what dinner really cost you.",
				step: true,
			},
			{
				id: "done",
				say: "Click Create Record, and both Statements are labelled by a single Record. Your spending now shows the $30 you really spent, not $90.",
				detail: "The money your friend sent back isn’t income. It belongs to the dinner, so it simply reduces what the dinner cost you.",
			},
		],
	},
	{
		id: "dashboard",
		title: "The Dashboard",
		level: "The basics",
		summary: "The Dashboard is built from your Records, so labelled activity is what counts.",
		keywords: "dashboard overview numbers totals empty spending records categories monthly",
		destination: "dashboard",
		beats: [
			{
				id: "records",
				say: "We’ve spent some time creating Records. So how do those Records help you understand your money? That’s what the Dashboard is for. Everything on the Dashboard is calculated from your Records, never directly from your Statements.",
			},
			{
				id: "empty",
				say: "That’s why importing Statements alone doesn’t change your Dashboard. A Statement only counts on the Dashboard once a Record labels it.",
			},
			{
				id: "real",
				say: "Let’s open the Dashboard now. Total spending shows $122. That’s the four Records we just created: your $12 lunch, $50 of groceries, the $30 gift, and your $30 share of dinner. Your banking app would count the full $90 for that dinner, but the Dashboard counts the $30 you really spent, because the Dashboard uses your Records. The Spending forecast chart below shows the same four Records. The chart steps up on each Record’s date, and the dashed line shows where your spending is heading this month.",
			},
			{
				id: "explore",
				say: "There’s a lot more further down the Dashboard: your Monthly Budgets, your spending by Category, a spending calendar, and more. Scroll through and explore the Dashboard at your own pace. We’ll come back to reading the Dashboard in more depth later.",
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
				say: "Your Dashboard is only as up to date as your labels. But sometimes you know about spending before your bank shows all of it, and you’d rather label that spending now than try to remember it later.",
			},
			{
				id: "concert",
				say: "Say you paid $200 for two concert tickets, and your friend Jo will pay you back $100 next week. You can already create the Record for your $100 share, from the $200 Statement.",
			},
			{
				id: "flag",
				say: "The amounts don’t match yet: $100 against $200. Finpoint warns you, and saves the Record as Pending, which means the Record isn’t settled yet. Your $100 share already counts.",
			},
			{
				id: "list",
				say: "Pending Records are marked in your Records list, so nothing gets forgotten.",
			},
			{
				id: "attach",
				say: "When Jo’s $100 Statement arrives, select that Statement in Workflows and click Allocate to record. Finpoint will suggest the Pending Record that the Statement completes.",
			},
			{
				id: "complete",
				say: "The Record now combines both Statements. Save the Record, and because the amounts add up, the Record is no longer Pending.",
			},
			{
				id: "meaning",
				say: "So a Record is Pending for one of two reasons. Its amounts don’t add up yet, like the concert. Or one of its Statements is still Pending at the bank. Either way, Pending means the Record isn’t fully confirmed yet.",
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
				say: "Remember how a Statement matches your bank, almost always? This is the exception. A Pending Statement is bank activity that isn’t confirmed yet. Some bank exports, like Revolut’s, bring card payments in as Pending Statements. And if your bank takes days to show a payment, you can add a Pending Statement yourself, and edit it until the confirmed Statement arrives, so your month stays complete.",
			},
			{
				id: "create",
				say: "On the Statements page, click Create Pending Statement. Choose the Account, then enter the amount and a short description.",
				step: true,
			},
			{
				id: "explain",
				say: "The Pending Statement appears in Workflows, marked Pending. Label the Pending Statement like any other Statement: here, with a Burger with Mia Record, under Dining Out. Save the Record, and the Record counts straight away, but stays Pending while its Statement does.",
				step: true,
			},
			{
				id: "replace",
				say: "When the confirmed Statement arrives in a later import, open Replace Pending in Workflows. Choose the Pending Statement, and Finpoint will suggest the imported Statements the Pending Statement could become.",
				step: true,
			},
			{
				id: "review",
				say: "Review the swap, and click Replace pending Statement. The Allocations move to the confirmed Statement, the Pending Statement disappears, and nothing is counted twice.",
				step: true,
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
				say: "Imported Statements can go wrong in one more way. Sometimes a bank changes a payment’s description between bank exports. Import both bank exports, and the same payment arrives twice, as two Statements, so you might label it twice.",
			},
			{
				id: "badge",
				say: "Finpoint spots Statements with the same account, day and amount, and marks those Statements as possible duplicates. Open Fix Duplicates in Workflows to review the duplicate Statements.",
			},
			{
				id: "choose",
				say: "If the Statements really are two payments, click Not duplicates. Otherwise, choose the Statement to keep, then click Review deletion.",
				step: true,
			},
			{
				id: "review",
				say: "Finpoint shows you what will happen before anything is deleted. Allocations follow the Statement you keep, so your Records stay labelled.",
				detail: "Pairs you mark as not duplicates are listed separately, and you can restore them. Finpoint doesn’t remember deleted descriptions, so importing the same old export again can bring them back.",
				step: true,
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
				say: "Sooner or later, you’ll want to look something up, like what that dinner with Sam really cost. Open the Records page, then search by title, or filter by date, Category or amount.",
			},
			{
				id: "edit",
				say: "Open a Record to see its Statements, then click Edit Record to change any field, or the Allocations behind it.",
				step: true,
			},
			{
				id: "statements",
				say: "The Statements page works the same way for your bank activity, and each Account has a page of its own.",
			},
			{
				id: "settings",
				say: "And if you always look at the same period, set default filters in Settings, so Records and Allocate to Records open on that range.",
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
				say: "We’ve been picking Categories all along. They’re the most important choice you make on a Record: they say what it was for, and your Dashboard breaks your spending down by them.",
			},
			{
				id: "examples",
				say: "Lunch and dinner with friends are Dining Out. The supermarket run is Groceries. The birthday gift goes under Gifts & Donations. Finpoint starts you with a sensible set, and you can rename them, add your own, or nest one under another, like Coffee under Dining Out.",
			},
			{
				id: "defaults",
				say: "Each Category also carries two defaults: a Treatment, and a Monthly Budget. That’s why you could leave those fields alone earlier: your Category fills them in. We’ll look at both, right after one more time-saver.",
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
				say: "Some payments come back every month, like your phone bill, and labelling them again and again gets old. A Statement rule recognises those Statements, and fills in the Record for you when you create a Record from one. It never creates Records on its own.",
			},
			{
				id: "match",
				say: "Open Rules, and click New rule. Give it a name, and the text to look for in the description. Finpoint shows you the Statements the rule matches.",
				step: true,
			},
			{
				id: "fill",
				say: "Then choose what the rule fills in: a title, a Category, even People or a Location. Autofill puts the value straight into the field. Suggest offers it as a one-click suggestion instead.",
				step: true,
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
				say: "The second default is a Monthly Budget. It answers a different question: am I on track? A Monthly Budget is a group of spending you plan for. Finpoint starts you with four: Daily for everyday spending, Recurring for bills like rent and your phone, Irregular for one-off costs, and Travel. Each Monthly Budget gets its own amount every month.",
			},
			{
				id: "daily",
				say: "Daily is the Monthly Budget to watch. Daily holds everyday spending, like food and transport, and the Dashboard forecasts where Daily is heading by the end of the month.",
			},
			{
				id: "amount",
				say: "To give Daily an amount, click Edit beside Daily on the Dashboard, and set a Monthly amount, say $500.",
				step: true,
			},
			{
				id: "rule",
				say: "The Amount rule decides which months that amount covers. Choose Override one month to change this month only. Choose Override default to apply it from this month onward.",
				detail: "A month set to Default uses the latest default from an earlier month. No amount means there’s nothing to compare against. An amount of zero is a real plan to spend nothing.",
				step: true,
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
				say: "You’ve put real work into labelling your money, so it’s worth knowing where it lives. Finpoint runs in your browser, and keeps your data on this device. There’s no Finpoint database, and your finances never pass through our servers, so we never see them.",
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
		summary: "A few minutes each time: import, label, check Pending, glance at the Dashboard.",
		keywords: "routine habit summary weekly checklist next steps",
		destination: "importer",
		beats: [
			{
				id: "loop",
				say: "Here’s a routine that works. Import your latest bank exports. Fix any duplicates, and label what’s new in Workflows. Check anything Pending. Glance at your Dashboard. And keep a backup.",
			},
			{
				id: "backup",
				say: "With Google Drive connected, backups happen automatically. If not, download a backup file every so often.",
			},
			{
				id: "help",
				say: "And whenever you’re unsure, click Help at the top of any page. Help lists the guides for that page, step by step.",
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
