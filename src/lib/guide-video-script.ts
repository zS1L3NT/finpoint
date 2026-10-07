// Narration for the video guide. It covers the same ground as the Help articles in
// `guide-content.ts`, but is written to be heard: shorter sentences, fewer steps, one idea at a time.
// Chapter ids match the article ids so the video, articles and practice can link to each other.
// Scenes in `src/components/help/film/scenes.tsx` time their visuals to words in this copy.

export type FilmChapter = {
	id: string
	title: string
	group: string
	problem: string
	idea: string
	steps: string[]
	check: string
	watch?: string
	example: string
}

export const filmChapters: FilmChapter[] = [
	{
		id: "start",
		title: "What does Finpoint do?",
		group: "Start here",
		problem:
			"Your bank shows that money moved, but not what it was really for. One supermarket payment might be groceries and a gift. One dinner payment might include your friends’ shares.",
		idea: "Finpoint links each bank amount to your own explanations, then turns those explanations into spending and plans. You only need one purchase to start.",
		steps: [
			"Try the sample lunch lesson.",
			"Import a bank CSV, or restore a backup.",
			"Explain one Statement.",
			"Download a backup.",
		],
		check: "You can say where one bank amount went, and find it again.",
		watch: "An empty Dashboard is normal at first. Imported Statements don’t count until you explain them.",
		example:
			"Alex paid $12 for lunch. The bank shows −$12. Alex adds a Lunch Record for −$12, and an Allocation of −$12 connects them.",
	},
	{
		id: "model",
		title: "Statements, Records and Allocations",
		group: "Start here",
		problem: "Statements and real-life purchases don’t always match one for one.",
		idea: "A Statement is one entry of bank activity. A Record is your explanation of what happened. An Allocation links an amount from a Statement to a Record. An Account is where money sits, not your login. Money paid is negative, and money received is positive.",
		steps: [
			"Read the Statement’s amount and description.",
			"Decide what it really was.",
			"Create a Record that explains it.",
			"Allocate the amount. One Statement can feed several Records, and one Record can combine several Statements.",
		],
		check: "A Record is complete when it has an Allocation, its Allocation total equals its amount, and none of its Statements are Pending.",
		watch: "Two Statements don’t always mean two Records. A payment and its repayment can explain one shared purchase.",
		example:
			"Statement −$12, Allocation −$12, Lunch Record −$12. Your Account balance and your Dashboard spending answer different questions.",
	},
	{
		id: "workspace",
		title: "Starting fresh, or restoring",
		group: "Start here",
		problem:
			"A new workspace comes with starter Categories and spending buckets, but no bank activity yet.",
		idea: "Everything is stored in this browser, on this device. The starter defaults are yours to edit. You can learn with practice lessons first, or restore a backup you already have.",
		steps: [
			"New here? Open Importer and choose your bank.",
			"Have a backup? Open Sync and restore it.",
			"Export your current data first if you want to keep it. Restoring replaces it; it doesn’t merge.",
			"Use Help in the top bar any time, without leaving a form.",
		],
		check: "Your Accounts, Statements or restored Records show up in their lists.",
		watch: "Load demo data is not a tutorial. It replaces your data. Use the practice lessons instead.",
		example:
			"In practice, you can explain a −$12 lunch without uploading anything or changing your real Account balance.",
	},
	{
		id: "import",
		title: "Importing bank activity",
		group: "Everyday use",
		problem:
			"Finpoint can only read a bank file in a format it supports. Each row becomes one of your Statements.",
		idea: "Importer supports CSV exports from DBS, OCBC, UOB and Revolut. It creates Statements, not finished Records. Missing Accounts are created as you go. Revolut takes one file at a time, and asks which Account it belongs to.",
		steps: [
			"Export a CSV from your bank. Don’t edit its columns.",
			"Open Importer, pick your bank, and choose the file.",
			"Import, then read the inserted, re-indexed and unchanged counts.",
			"Check the new rows in Statements.",
		],
		check: "The rows you expected are there, with the right dates and signs.",
		watch: "If an import fails, check the bank you picked and the file. A PDF or a renamed spreadsheet won’t work.",
		example:
			"Alex imports a salary of +$3,000 and a lunch of −$12. Neither one is explained until Alex creates Records.",
	},
	{
		id: "lunch",
		title: "Explaining your first purchase",
		group: "Everyday use",
		problem:
			"The lunch Statement says −$12, but the Dashboard only counts what a Record explains.",
		idea: "Allocator lists the bank amounts you haven’t explained yet. Pick one and create a Record with a title, an amount and a Category. Finpoint suggests the Allocation for you.",
		steps: [
			"Open Allocator and pick the lunch Statement.",
			"Create a Record called Lunch: Paid $12, in a food Category.",
			"Check the Allocation is −$12, then save.",
		],
		check: "The Record is complete, and the lunch Statement leaves Allocator.",
		watch: "If the Record says Pending, compare its amount with its Allocations, and fix whichever is wrong.",
		example:
			"−$12 from the bank, −$12 allocated, a −$12 Lunch. Nothing left to allocate, and no difference.",
	},
	{
		id: "backup-first",
		title: "Protecting your work",
		group: "Start here",
		problem:
			"Your data is saved in this browser. Clearing browser storage, or changing devices, can lose it.",
		idea: "A Finpoint backup is a separate copy of your data, saved as a JSON file. The browser downloads it. Requesting a download isn’t proof, so find the file yourself.",
		steps: [
			"In Sync, choose Download backup.",
			"Find the file, and keep it somewhere safe.",
			"Keep an older backup before you restore anything.",
		],
		check: "You’ve found the backup file. Clicking the button alone doesn’t confirm that.",
		watch: "Never clear browser storage until you have a backup you’ve checked.",
		example:
			"After explaining Lunch, Alex exports a backup. Restoring it later replaces what’s in this browser.",
	},
	{
		id: "split",
		title: "Splitting one payment",
		group: "Everyday use",
		problem:
			"One −$80 supermarket Statement was really $60 of groceries and a $20 gift. Put it all in one Category, and that difference hides.",
		idea: "Create two Records, and allocate part of the Statement to each. The Statement stays whole, and you get two clear explanations.",
		steps: [
			"Create Groceries for −$60, from the −$80 Statement.",
			"−$20 is left. Create Gift for −$20, and allocate it.",
			"Check both Records, and that $0 remains.",
		],
		check: "−$60 plus −$20 equals −$80. Both Records are complete, and the Statement is fully used.",
		watch: "You can’t allocate more than a Statement has left. Fix the Allocations; don’t invent bank activity.",
		example:
			"One Statement of −$80 becomes Groceries −$60 and Gift −$20. One Statement, two useful explanations.",
	},
	{
		id: "repayment",
		title: "A shared dinner and repayment",
		group: "Everyday use",
		problem:
			"Alex pays $90 for dinner. Later, Alex receives $60 back from friends. Alex’s own cost is $30, not $90.",
		idea: "One Shared dinner Record can combine the payment and the repayment. The money back isn’t income. It reduces Alex’s share.",
		steps: [
			"Create Shared dinner for −$30.",
			"Allocate −$90 from the dinner payment.",
			"Allocate +$60 from the repayment.",
		],
		check: "−$90 + $60 = −$30. Both Statements are explained, and the Record is complete.",
		watch: "Before the repayment arrives, the Record may show Pending. That alone doesn’t mean someone owes you.",
		example:
			"Payment −$90 and repayment +$60 go into one Shared dinner Record. It shows Alex’s −$30 share.",
	},
	{
		id: "treatments",
		title: "Refunds, transfers and savings",
		group: "Understand the numbers",
		problem:
			"A plus or minus sign doesn’t tell you whether money was income, spending, savings or a transfer.",
		idea: "Treatment tells the Dashboard how to count a Record. Income is for salary. Spending covers purchases and their refunds. Saving or investment is money to and from savings. Transfer or neutral is money moving between your own Accounts. Automatic just follows the sign.",
		steps: [
			"Use Income for salary, and Spending for purchases and refunds.",
			"For a transfer, combine the −$200 and +$200 into one $0 Record, as Transfer or neutral.",
			"Use Saving or investment for contributions and withdrawals.",
		],
		check: "A +$20 refund lowers your net spending. Saving or investment contributions show as positive amounts.",
		watch: "A −$250 saving net means more cash went into savings than came out. It isn’t an investment loss.",
		example:
			"Put in $300 and take out $50: contributions $300, withdrawals $50, net −$250. The +$3,000 salary is separate income.",
	},
	{
		id: "pending",
		title: "Why a Record is Pending",
		group: "Fix a problem",
		problem:
			"A Record is Pending when its amounts don’t match, its Allocations are missing, or one of its Statements is Pending.",
		idea: "A Pending Record is an explanation that doesn’t add up yet. A Pending Statement is a placeholder for bank activity you’re still waiting for. Even if the amounts match, the Record stays Pending until that placeholder is replaced.",
		steps: [
			"Open the Record and compare its amount with its Allocations.",
			"If lunch really cost $12, change the Record from −$10 to −$12.",
			"When the real Statement arrives, replace the Pending Statement instead of allocating twice.",
		],
		check: "There’s at least one Allocation, the total matches the Record, and no allocated Statement is Pending.",
		watch: "Fix the facts, not just the label. A Pending Record is still saved.",
		example:
			"The Record says −$10, but the Allocation is −$12. Change the Record to −$12, and the difference drops to $0.",
	},
	{
		id: "find",
		title: "Finding and fixing mistakes",
		group: "Fix a problem",
		problem:
			"Something you saved seems to be missing. Usually filters or the month are hiding it. An empty list doesn’t mean your data is gone.",
		idea: "Records show your explanations. Statements show all your bank activity. Allocator only shows amounts left to explain. Use search and filters to narrow the right list.",
		steps: [
			"Check the month and date range, and clear filters.",
			"Look in Statements for rows Allocator no longer shows.",
			"Open the item, edit it, then check its totals again.",
		],
		check: "The fixed item shows up where you expect, still linked to its Statement.",
		watch: "Renaming doesn’t fix a wrong amount. Keep a backup before big changes.",
		example: "To find payments over $50, choose Paid and type 50. No minus sign needed.",
	},
	{
		id: "categories",
		title: "Category, treatment and bucket",
		group: "Plan your money",
		problem: "Three settings describe every Record. Mixing them up makes totals confusing.",
		idea: "Category is what it’s for. Treatment is how totals count it. A bucket is an optional planning group, like Daily or Recurring. A Category can set defaults, and a Record can override them.",
		steps: [
			"In Categories, create the labels you need.",
			"Give each Category a treatment and a default bucket.",
			"On a Record, check whether those defaults were overridden.",
		],
		check: "Lunch can be Food, Spending and Daily all at once: three different choices.",
		watch: "Changing a Category doesn’t update Records whose choices were set by hand.",
		example:
			"Lunch: Category Food, treatment Spending, bucket Daily. Rent is Spending too, but in the Recurring bucket.",
	},
	{
		id: "targets",
		title: "Monthly targets",
		group: "Plan your money",
		problem: "You want to compare a month’s spending with a plan, without moving any money.",
		idea: "A target is a monthly comparison for a bucket. A default carries forward from the month you set it. A target for only one month overrides it. Targets never reserve cash or block spending.",
		steps: [
			"On the Dashboard, pick the month first.",
			"Choose this month only, or from this month onward.",
			"Compare the bucket’s spending with its target.",
		],
		check: "Daily spending of $127 against a $500 target leaves $373.",
		example:
			"A $500 default starts in October and carries on. A $600 target just for October wins in October, and later months go back to $500.",
	},
	{
		id: "budgets",
		title: "Budgets for trips and events",
		group: "Plan your money",
		problem: "A trip can cross months and several categories. A monthly bucket doesn’t fit it.",
		idea: "A Budget has its own amount, its own dates, and its own attached Records. It’s a separate view from the Dashboard’s totals.",
		steps: [
			"In Budgets, create one with an amount and dates.",
			"Leave Automatic attach on, or turn it off to choose Records yourself.",
			"After changing dates, review the attached Records.",
		],
		check: "The trip’s Records are attached, and fall inside the Budget’s dates.",
		watch: "A Budget total doesn’t have to match Dashboard spending.",
		example:
			"Use a Budget for a week-long holiday. Use the Travel bucket for the monthly view.",
	},
	{
		id: "dashboard",
		title: "Reading the Dashboard",
		group: "Understand the numbers",
		problem:
			"The charts depend on the month and on your Records, so they won’t match your bank balances.",
		idea: "The Dashboard summarizes your Records by treatment, then by Category and bucket. Monthly Records shows the Records behind each number. Pending Records already count, so tidy them first.",
		steps: [
			"Pick the month.",
			"Read income, spending, refunds and surplus.",
			"Use Monthly Records to trace any surprise.",
		],
		check: "Income is $3,000. Gross spending is $147, minus $20 of refunds, so net spending is $127. Surplus is $2,873.",
		watch: "If a number looks wrong, check the month first, then the Record’s treatment.",
		example:
			"A saving net of −$250 shows on its own line. It doesn’t mean income fell, or that you lost money.",
	},
	{
		id: "sync",
		title: "Backups and Google Drive",
		group: "Fix a problem",
		problem:
			"With two devices, you need a copy you can trust, and to know which copy is current.",
		idea: "Your data lives locally. A backup file is a separate copy. Google Drive sync is optional, and shares one workspace across devices. The sign-in broker never sees your financial data.",
		steps: [
			"In Sync, download a backup and find the file.",
			"Connect Google Drive only if you want sync.",
			"If there’s a conflict, back up first, then choose which copy to keep.",
		],
		check: "Up to date in Sync, and a backup you’ve found. Keep both.",
		watch: "Don’t keep overwriting a conflict just to clear the warning. You choose a whole copy; nothing is merged.",
		example:
			"Your practice progress stays in this browser, without going into your backup or Drive.",
	},
	{
		id: "routine",
		title: "Your routine",
		group: "Everyday use",
		problem: "Don’t try to perfect everything at once. A short routine works better.",
		idea: "Each visit: import new activity, explain what’s left, inspect anything Pending, review the month, and protect it all with a backup.",
		steps: [
			"Import your latest bank CSV.",
			"Explain new amounts in Allocator.",
			"Review the month, then check Sync.",
		],
		check: "You can follow any bank amount to its explanation, and get your work back if you need it.",
		example:
			"Import, explain one purchase, fix one Pending Record, review the month, and check your backup.",
	},
]

export const filmLabels = {
	problem: "The problem",
	idea: "The idea",
	check: "Check your result",
	watch: "Watch out",
	example: "Example",
} as const

export function filmSections(chapter: FilmChapter) {
	return [
		{ label: filmLabels.problem, text: chapter.problem },
		{ label: filmLabels.idea, text: chapter.idea },
		...chapter.steps.map((text, index) => ({ label: `Step ${index + 1}`, text })),
		{ label: filmLabels.check, text: chapter.check },
		...(chapter.watch ? [{ label: filmLabels.watch, text: chapter.watch }] : []),
		{ label: filmLabels.example, text: chapter.example },
	]
}
