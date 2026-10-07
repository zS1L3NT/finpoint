// One teaching source for articles, contextual help, and the narrated video.
export type GuideTopic = {
	id: string
	title: string
	group: string
	keywords: string
	problem: string
	explanation: string
	steps: string[]
	check: string
	fix: string
	example: string
	destination:
		| "importer"
		| "allocator"
		| "records"
		| "categories"
		| "budgets"
		| "sync"
		| "dashboard"
		| "settings"
}

export const guideTopics: GuideTopic[] = [
	{
		id: "start",
		title: "What does Finpoint help me do?",
		group: "Start here",
		keywords: "beginner welcome first setup finance transaction expense",
		destination: "dashboard",
		problem:
			"A bank description tells you money moved, but not what it was really for. A supermarket payment might include groceries and a gift. A dinner payment might include your friends’ shares.",
		explanation:
			"Finpoint connects bank activity to your own explanations, then uses those explanations to show spending and planning. Start with one purchase. You do not need to organize every Category or set every target first.",
		steps: [
			"Try the sample lunch lesson in Help & guides.",
			"Import a supported bank CSV, or restore a Finpoint backup from Sync.",
			"Explain one Statement with a Record and an Allocation.",
			"Check your result, then request a backup from Sync.",
		],
		check: "You can explain where one bank amount went and find the Record again.",
		fix: "An empty Dashboard is expected before you have Records. Importing Statements alone does not explain spending.",
		example:
			"Alex paid $12 for lunch. The bank amount is −$12. The explanation is a Lunch Record, also −$12. An Allocation of −$12 connects them.",
	},
	{
		id: "model",
		title: "What are Statements, Records, and Allocations?",
		group: "Start here",
		keywords: "transaction terminology account balance link money paid received sign",
		destination: "allocator",
		problem: "Bank rows and real-life purchases do not always match one for one.",
		explanation:
			"A Statement is one account activity entry. A Record is your explanation of an activity. An Allocation assigns an amount from a Statement to a Record. An Account identifies the financial source, not your login. Money paid is negative; money received is positive.",
		steps: [
			"Read the Statement amount and description.",
			"Choose what that activity means in real life.",
			"Create or select the Record that explains it.",
			"Allocate the appropriate signed amount. A Statement can feed several Records, and a Record can combine several Statements.",
		],
		check: "A complete Record has at least one Allocation, its Allocation total equals its amount, and none of its Statements are Pending.",
		fix: "Do not create a second explanation just because there are two bank rows. A payment and repayment may explain one shared purchase.",
		example:
			"Statement −$12 → Allocation −$12 → Lunch Record −$12. An Account balance and the Dashboard spending total answer different questions.",
	},
	{
		id: "workspace",
		title: "How do I start or restore a workspace?",
		group: "Start here",
		keywords: "new user account local browser device seed restore sample demo",
		destination: "sync",
		problem:
			"A new workspace has starter Categories and spending buckets, but no personal bank activity.",
		explanation:
			"Finpoint stores financial data in this browser on this device. The starter Categories and buckets are editable planning defaults. You can learn using the isolated practice lessons before importing your own data.",
		steps: [
			"For a new workspace, open Importer and choose your bank.",
			"If you already have a Finpoint JSON backup, open Sync and under Backup file, click Restore from a backup file, choose the JSON file, then use Restore.",
			"Before restoring, export the current workspace if you need to keep it. Restore replaces financial data; it does not merge two workspaces.",
			"Use Help in the top bar whenever you need an explanation without leaving a form.",
		],
		check: "Your expected Accounts, Statements, or restored Records appear in their lists.",
		fix: "Do not use Load demo data as a safe tutorial in your own workspace: it replaces financial data. Help & guides practice is separate and uses sample values only.",
		example:
			"A beginner can practice a −$12 lunch without uploading files or changing an Account balance.",
	},
	{
		id: "import",
		title: "How do I import bank activity?",
		group: "Everyday use",
		keywords: "csv file DBS OCBC UOB Revolut duplicate upload bank unsupported",
		destination: "importer",
		problem:
			"A bank file has to match a supported format before Finpoint can turn its rows into Statements.",
		explanation:
			"Importer supports DBS, OCBC, UOB, and Revolut CSV exports. Importing loads Statements, not finished Records. Missing Accounts can be created during import. Revolut asks for Account details and accepts one file; the other supported importers allow multiple files.",
		steps: [
			"Export a CSV from your supported bank. Keep its original columns.",
			"Open Importer, select the bank, and select the file or files. For Revolut, choose or create the Account.",
			"Submit the import and read the inserted, re-indexed, and unchanged counts.",
			"Open Statements to check dates, amounts, and Account. Then open Allocator to explain the remaining amounts.",
		],
		check: "The expected bank rows are visible with the correct signs and dates.",
		fix: "If import fails, check the selected bank and original CSV format. A PDF or renamed spreadsheet is not the same format. If no rows are inserted, inspect skipped counts and filters before importing repeatedly.",
		example:
			"Alex imports a bank CSV containing a salary of +$3,000 and a lunch payment of −$12. Neither has a personal explanation until Alex creates Records.",
	},
	{
		id: "lunch",
		title: "How do I explain my first purchase?",
		group: "Everyday use",
		keywords: "record create allocation lunch purchase save category",
		destination: "allocator",
		problem:
			"The imported lunch Statement says −$12, but the Dashboard needs the Record that explains it.",
		explanation:
			"Allocator shows Statements with amounts still available to allocate. Create a Record from the relevant Statement, give it a useful title, date, amount, and Category, and check the proposed Allocation before saving.",
		steps: [
			"Open Allocator and choose the lunch Statement.",
			"Create a Record titled Lunch. Use Paid $12, represented as −$12, and select the appropriate food Category.",
			"Check that the Allocation from the lunch Statement is −$12. Review treatment and bucket defaults.",
			"Save, reopen the Record, and confirm its amount and Allocation total both equal −$12.",
		],
		check: "The Record is complete and the fully allocated lunch Statement leaves the remaining-amount list.",
		fix: "If the Record is Pending, compare its amount with the saved Allocation total. Correct the amount or missing Allocation based on what actually happened.",
		example:
			"−$12 bank activity → −$12 allocated → −$12 Lunch. Statement remaining: $0. Record difference: $0.",
	},
	{
		id: "backup-first",
		title: "How do I protect my first results?",
		group: "Start here",
		keywords: "save backup export download JSON local loss browser",
		destination: "sync",
		problem:
			"Automatically saved browser data can still be lost if you clear browser storage or change devices.",
		explanation:
			"Saving a Record writes to this browser. A Finpoint JSON backup gives you a separate copy of financial data and settings. Requesting a download cannot prove that the file was kept successfully, so check your Downloads folder yourself.",
		steps: [
			"Open Sync and under Backup file, choose Download backup.",
			"Find the downloaded Finpoint JSON file and keep it somewhere you can find again.",
			"Keep an earlier backup before choosing Restore or replacing data.",
			"If you choose Google Drive sync, review its status and any conflicts separately.",
		],
		check: "You have located the downloaded backup file; a button click alone does not confirm that.",
		fix: "If the browser blocks a download, allow it and request the export again. Never clear storage until you have a usable backup or have confirmed the intended synced copy.",
		example:
			"After explaining Lunch, Alex exports a backup. Later, restoring that file replaces the financial workspace currently in this browser.",
	},
	{
		id: "split",
		title: "How do I split one payment into different purchases?",
		group: "Everyday use",
		keywords: "split supermarket groceries shopping multiple remaining",
		destination: "allocator",
		problem:
			"One −$80 supermarket Statement includes $60 of groceries and a $20 gift. Putting everything in one Category hides the distinction.",
		explanation:
			"Create two Records and allocate part of the same Statement to each. Allocations keep the bank link while Records explain the separate purposes. Their total should use the available Statement amount without exceeding it.",
		steps: [
			"Create Groceries for −$60 and allocate −$60 from the −$80 Statement.",
			"The Statement has −$20 left to allocate. Create Gift for −$20 and allocate that remainder.",
			"Choose the correct Category and treatment for each Record.",
			"Check both Records and confirm the Statement has $0 remaining.",
		],
		check: "−$60 plus −$20 equals −$80. Both Records tally and the Statement is fully allocated.",
		fix: "An Allocation larger than the available amount is rejected. Reduce it or remove an incorrect existing Allocation; do not invent extra bank activity.",
		example:
			"One Statement −$80 → Groceries −$60 and Gift −$20. You keep one bank row and two useful explanations.",
	},
	{
		id: "repayment",
		title: "How do I record a shared dinner and repayment?",
		group: "Everyday use",
		keywords: "friends reimbursement received dinner split bill owe repayment people",
		destination: "records",
		problem:
			"Alex pays $90 for dinner and later receives $60 from friends. Alex’s own cost is $30, not $90.",
		explanation:
			"One shared-dinner Record can combine the payment and repayment Statements. Record the amount you are explaining after the repayment. Money received back for the same dinner does not have to become a separate Income Record.",
		steps: [
			"Create Shared dinner with amount −$30 and an appropriate spending Category.",
			"Allocate −$90 from the dinner payment Statement.",
			"Allocate +$60 from the friends’ repayment Statement to the same Record.",
			"Save and check that the Allocation total is −$30.",
		],
		check: "−$90 + $60 = −$30. Both Statements are explained and the Record tallies.",
		fix: "Until the repayment is available, the Record may be Pending because amounts differ or a Statement is still Pending. The status does not by itself prove that someone owes you money. Use your notes to explain the situation.",
		example:
			"Payment −$90 → Shared dinner ← Repayment +$60. The Record shows Alex’s −$30 share.",
	},
	{
		id: "treatments",
		title: "Are refunds, transfers, and savings spending?",
		group: "Understand the numbers",
		keywords:
			"analytics income spending neutral automatic saving investment withdrawal refund surplus",
		destination: "records",
		problem:
			"The sign of money movement alone does not tell you whether it is income, spending, savings, or a transfer.",
		explanation:
			"Treatment tells the Dashboard how to count a Record. Income, Spending, Saving/investment, and Transfer/neutral have different meanings. Automatic follows the amount direction. A Category can supply the default, and a Record can override it.",
		steps: [
			"Use Income for salary, and Spending for purchases and their refunds.",
			"For a transfer between your own Accounts, combine −$200 and +$200 into a $0 Record with Allocations; use Transfer/neutral.",
			"Use Saving/investment for contributions and withdrawals.",
			"Review the effective treatment on the Record rather than guessing from its Category name.",
		],
		check: "A +$20 Spending refund reduces net spending. Saving contributions display as positive magnitudes; net saving movement uses the cash perspective.",
		fix: "A −$250 savings net means more cash went out to savings than came back. It is not evidence of a portfolio loss. A $0 Record without any Allocations is still Pending.",
		example:
			"Contribution −$300 and withdrawal +$50 produce contributions $300, withdrawals $50, and net −$250. Salary +$3,000 is separate income.",
	},
	{
		id: "pending",
		title: "Why is my Record Pending, and how do I fix it?",
		group: "Fix a problem",
		keywords: "mismatch difference unallocated pending statement replace placeholder zero",
		destination: "records",
		problem:
			"A Record can be Pending because amounts differ, Allocations are missing, or an allocated Statement is Pending.",
		explanation:
			"A Record is Pending when it has no Allocations, their total differs from its amount, or any allocated Statement is Pending. A Pending Statement is a placeholder for bank activity still to arrive. Even when amounts tally, the Record stays Pending until that placeholder is replaced.",
		steps: [
			"Open the Record and compare its amount, Allocation total, Allocation count, and Pending Statements.",
			"For a −$10 Record with a −$12 Allocation, correct the Record to −$12 if the lunch really cost $12.",
			"For missing bank activity, keep a pending Statement only when it represents the actual expected activity.",
			"When the real Statement arrives, use the Pending Statement replacement flow and verify its Allocations instead of allocating it twice.",
		],
		check: "At least one Allocation exists, its total matches the Record, and none of its allocated Statements are Pending.",
		fix: "Correct the facts, not just the status. A mismatch is a valid saved state, not a failed save. If the real amount differs from the placeholder, inspect the affected Record after replacement.",
		example:
			"Record −$10; Allocation −$12; difference $2. Change the Record to −$12 when that is the correct purchase amount, then save and check again.",
	},
	{
		id: "find",
		title: "How do I find, edit, or remove a mistake?",
		group: "Fix a problem",
		keywords: "search filter missing date exactly paid received edit delete allocator empty",
		destination: "records",
		problem:
			"A saved item may be outside your filters, fully allocated, or in a different month. An empty list does not always mean your data is gone.",
		explanation:
			"Records, Statements, and Allocator show different things. Allocator focuses on remaining amounts. Use search, Account or Category filters, dates, and Pending filters to narrow the appropriate list. Amount filters use Paid or Received with a positive value.",
		steps: [
			"Check the selected month and date range first. Clear restrictive filters when searching.",
			"Look for a fully allocated bank row in Statements rather than only Allocator.",
			"Open the Record or Statement detail and use its edit actions. Review linked Allocations before changing amounts or removing data.",
			"Save and recheck both the Record total and the Statement remainder.",
		],
		check: "The corrected item appears in the intended date range and its links still explain the activity.",
		fix: "Changing a title does not fix a wrong amount. Changing a Record amount may leave it Pending until the Allocations agree. Destructive removal should be deliberate; keep a backup before large corrections.",
		example:
			"To find payments over $50, select Paid and enter 50. You do not need to type a negative sign into the amount filter.",
	},
	{
		id: "categories",
		title: "What is the difference between Category, treatment, and bucket?",
		group: "Plan your money",
		keywords: "category default inheritance bucket Daily Recurring Irregular Travel archive",
		destination: "categories",
		problem:
			"Three controls describe different aspects of the same Record. Mixing them up makes totals confusing.",
		explanation:
			"Category describes what a Record is for. Treatment determines how analytics count it. A spending bucket is an optional planning group. Starter buckets are Daily, Recurring, Irregular, and Travel. A Category can provide treatment and bucket defaults; a Record can use its own choices.",
		steps: [
			"Open Categories to create or edit the labels you need.",
			"Set a sensible treatment and optional default bucket on the Category.",
			"When editing a Record, check whether its treatment and bucket follow the Category or are manually selected.",
			"Use bucket management on the Dashboard to maintain planning groups. Archiving a bucket preserves existing Records.",
		],
		check: "Lunch can be a food Category, Spending treatment, and Daily bucket. These are three complementary choices.",
		fix: "A renamed Category does not automatically mean every manually overridden Record now has its defaults. Inspect the affected Record’s actual choices.",
		example:
			"Category: food. Treatment: Spending. Bucket: Daily. A rent Record can also be Spending while belonging to Recurring.",
	},
	{
		id: "targets",
		title: "How do monthly bucket targets work?",
		group: "Plan your money",
		keywords: "target onward override monthly daily pace recurring coverage projection",
		destination: "dashboard",
		problem:
			"You need a monthly comparison for a spending group, without moving money or changing bank balances.",
		explanation:
			"A bucket target is a planning comparison. A default applies from the selected month onward. A target set for only one month overrides the default for that month. Targets do not reserve cash or block spending.",
		steps: [
			"Choose the correct month on the Dashboard before editing a bucket target.",
			"Choose whether the amount is for this month only or from this month onward.",
			"Review the bucket’s target and spending in the selected month.",
			"Use pace and projection as estimates, and check month coverage before comparing with earlier months.",
		],
		check: "Daily spending $127 against a $500 target leaves $373 in the planning comparison.",
		fix: "If the target seems wrong, inspect a month-specific override and the effective month of the default. Removing an override allows the applicable default to show again.",
		example:
			"A $500 default beginning in October carries forward. A $600 October-only target takes precedence in October, while later months use $500 unless changed.",
	},
	{
		id: "budgets",
		title: "When should I use a Budget instead of a bucket?",
		group: "Plan your money",
		keywords: "budget event trip automatic attach date period membership chart",
		destination: "budgets",
		problem:
			"A trip or event may span a custom period and several Categories, rather than a regular monthly spending group.",
		explanation:
			"A Budget has its own amount, start and end dates, and attached Records. Its chart uses signed amounts from attached Records within the relevant date windows. This is a different view from the Dashboard’s treatment-based spending totals.",
		steps: [
			"Open Budgets and create a Budget with an amount and date range.",
			"Choose automatic attachment if you want all existing Records in that range attached at creation, and newly created Records attached when they qualify.",
			"Review the actual attached Records; manually attach or remove Records when needed.",
			"Check membership again after editing dates, Records, or the Budget. Updates do not automatically rebuild existing membership.",
		],
		check: "The intended event Records are attached and fall inside the period used by the chart.",
		fix: "An unexpected Budget total may come from a missing attachment, an out-of-window date, or signed income or transfer amounts. It need not equal the Dashboard Spending number.",
		example:
			"Use a Budget for a week-long holiday with selected Records. Use the Travel bucket for the broader monthly planning view.",
	},
	{
		id: "dashboard",
		title: "How do I read the Dashboard and Monthly Records?",
		group: "Understand the numbers",
		keywords:
			"chart income spending surplus refunds saving month comparison coverage analytics",
		destination: "dashboard",
		problem:
			"Useful charts depend on the month, coverage, Record dates, and treatments. Bank balances are not the same as these totals.",
		explanation:
			"The Dashboard summarizes Records by effective treatment, shows spending by Category and bucket, and provides pace and comparisons. Monthly Records lets you inspect the Records behind the selected month. Pending Records can still contribute to analytics, so review unresolved explanations before relying on totals.",
		steps: [
			"Choose the intended month and inspect its coverage information.",
			"Read Income, gross spending, refunds, net spending, surplus, and saving movements with their labels.",
			"Use Monthly Records to trace an unexpected amount back to its Record, Category, treatment, date, and Allocations.",
			"Review history comparisons and future Records in context; partial months and projections are not completed outcomes.",
		],
		check: "With income $3,000, gross spending $147, and refunds $20, net spending is $127. Surplus is $2,873, or about 95.8% of income.",
		fix: "If a total is surprising, first check the selected month and the actual Record treatment. Then inspect Pending Records and coverage. A chart is a summary of the workspace, not a bank reconciliation guarantee.",
		example:
			"Saving net −$250 is displayed separately. It does not mean income fell or investments lost $250.",
	},
	{
		id: "sync",
		title: "How do backups and Google Drive sync work?",
		group: "Fix a problem",
		keywords: "offline Google Drive conflict auth reconnect local backup import export privacy",
		destination: "sync",
		problem:
			"You want a recoverable copy or another device to share the workspace, and need to know which copy is current.",
		explanation:
			"Financial data is stored locally. JSON export is a separate backup. Optional Google Drive sync shares a workspace copy through your connected Drive. Finpoint’s authentication broker handles sign-in, not your financial table contents. Learning progress stays on this browser and is excluded from financial backups and Drive sync.",
		steps: [
			"Open Sync, export a backup, and locate the downloaded file.",
			"Connect Drive only if you want sync, then read the status after changes.",
			"For Offline, reconnect and let the status update. For authentication errors, reconnect Google Drive.",
			"For a conflict, export the current local copy first, inspect the local and remote choices, then explicitly choose the copy you intend to keep.",
		],
		check: "A confirmed Up to date status and a located backup answer different questions. Keep both when appropriate.",
		fix: "Do not repeatedly overwrite a conflict just to remove the warning. Restoring a backup and loading demo data replace financial data. A stale tutorial milestone cannot prove your current financial workspace is complete.",
		example:
			"A practice lesson can remember its completion on this browser without adding sample Records to your financial backup or uploading practice values to Drive.",
	},
	{
		id: "routine",
		title: "What should I do each time I return?",
		group: "Everyday use",
		keywords: "routine workflow settings monthly filters import review next help",
		destination: "settings",
		problem:
			"A repeatable short routine is easier than trying to perfect the entire workspace in one sitting.",
		explanation:
			"Import new activity, explain remaining amounts, inspect Pending items, review the month, and protect the result. You can return to any video chapter, search the Help articles, or replay a practice lesson without restarting all onboarding.",
		steps: [
			"Import your latest supported bank CSV and check the result counts.",
			"Use Allocator for unexplained amounts; use Records to review incomplete explanations and pending Statements separately.",
			"Review the correct month in Dashboard and Monthly Records. Check treatments, buckets, targets, and Budget membership when relevant.",
			"Check Sync and keep backups. Settings lets you adjust default date filters and comparison history to suit your routine.",
		],
		check: "You can follow the bank amount to the explanation, understand the summary, and recover your saved work.",
		fix: "If you get stuck, open Help without leaving your current form. Search using the problem you see, such as ‘Pending’, ‘refund’, or ‘missing Record’. Use practice to rehearse the fix.",
		example:
			"A normal session can be: import, explain one remaining purchase, fix one Pending Record, review this month, check backup and sync.",
	},
]

export function getGuideTopic(id: string | null | undefined): GuideTopic {
	const topic = guideTopics.find(topic => topic.id === id) ?? guideTopics[0]
	if (!topic) throw new Error("The beginner guide needs a start topic.")
	return topic
}

export function guideSections(topic: GuideTopic) {
	return [
		{ label: "The problem", text: topic.problem },
		{ label: "How Finpoint helps", text: topic.explanation },
		...topic.steps.map((text, index) => ({ label: `Step ${index + 1}`, text })),
		{ label: "Check your result", text: topic.check },
		{ label: "If something looks wrong", text: topic.fix },
		{ label: "Example", text: topic.example },
	]
}
