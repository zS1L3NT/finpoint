// Every illustrated scene, built from the shared kit so a Statement, a Record and an Allocation look
// the same wherever they appear. Build-time components leave ordinary, editable HTML for
// HyperFrames; nothing creates timed DOM at runtime. Run: bun video/scripts/visual-scenes.ts
//
// Sizes: a relationship diagram (Statement, Allocation, Record) always uses full-size `card`s at
// the standard columns (x=192 and x=1168, 560 wide). Lists and labels use the compact `row` and
// `label`. Movement, order and cause are drawn `arrow`s; never a → glyph.
import { writeFileSync } from "node:fs"
import { arrow, badge, callout, card, connector, dashboard, icon, label, merge, meter, row, scene, split, steps, tile } from "../compositions/components/kit"

const write = (id: string, duration: number, kicker: string, title: string, body: string, animation: string) =>
	writeFileSync(new URL(`../compositions/scenes/${id}.html`, import.meta.url), scene(id, duration, kicker, title, body, animation))
const hold = (cue: string, fallback: number, seconds = 1.6) => `tl.set({}, {}, T("${cue}", ${fallback}) + ${seconds});`

// ─── 01 · Why Finpoint? ─────────────────────────────────────────────────────────────────────

write("start-welcome", 40, "Welcome", "Welcome to Finpoint.", `
	<div id="balance" class="fp-dashboard" style="left:192px;top:330px;--tone:var(--statement)"><h2 style="color:var(--statement)">Your bank balance</h2><span id="balance-value" class="fp-value">$2,400</span>${meter("balance-meter", "statement")}<p style="margin-top:24px">Going faster than you expected</p></div>
	${tile("many", "bank", "Several accounts", 1168, 330, "DBS, OCBC, UOB, Revolut", "statement", 560)}
	${tile("few", "statement", "A few daily payments", 1168, 520, "From just one account", "statement", 560)}
	${callout("missing", "Your banking app lists every payment. So what’s missing?", "statement")}`, `
enter("#heading", T("welcome", 0.3));
enter("#balance", T("balance", 2), -32);
count("#balance-value", 380, T("balance", 2) + 0.4, 2400);
tl.fromTo("#balance-meter", { scaleX: 1 }, { scaleX: 0.16, duration: 0.8, ease: "power2.out" }, T("balance", 2) + 0.4);
enter("#many", T("several", 14), 32);
enter("#few", T("few", 17), 32);
enter("#missing", T("missing", 22));
${hold("missing", 22)}
`)

// The banking app's view on the left, what you meant on the right. start-explain keeps the layout.
const feed = (prefix: string, spacer: boolean) => `
	<div id="${prefix}-head" class="fp-kicker" style="position:absolute;left:192px;top:262px;margin:0;color:var(--dim)">${prefix === "bank" ? "Your banking app" : "Your bank activity, untouched"}</div>
	${row(`${prefix}-ntuc`, "statement", "NTUC FAIRPRICE", -80, 192, 310, "5 Oct")}
	${row(`${prefix}-sakura`, "statement", "SAKURA DINING", -90, 192, 430, "10 Oct")}
	${spacer ? `<div id="${prefix}-more" class="fp-row-meta" style="position:absolute;left:220px;top:552px;font-size:28px">··· 14 more payments in between ···</div>` : ""}
	${row(`${prefix}-sam`, "statement", "PAYNOW FROM SAM", 60, 192, spacer ? 610 : 550, "17 Oct")}`

write("start-problem", 60, "Your bank shows payments", "…but not what they were for.", `
	${feed("bank", true)}
	<div id="you-head" class="fp-kicker" style="position:absolute;left:1168px;top:262px;margin:0;color:var(--record)">To you</div>
	${label("groceries", "Groceries", -50, 1168, 300)}
	${label("gift", "Birthday gift", -30, 1168, 392)}
	${arrow("to-groceries", [912, 362], [1160, 336], "record")}
	${arrow("to-gift", [912, 362], [1160, 428], "record")}
	${label("dinner", "Dinner, your share", -30, 1168, 560)}
	${arrow("from-sakura", [912, 482], [1160, 596], "record")}
	${arrow("from-sam", [912, 662], [1160, 596], "record")}`, `
enter("#heading", T("feed", 0.3));
enter("#bank-head", T("feed", 0.3) + 0.2);
enter("#bank-ntuc", T("feed", 0.3) + 0.35);
enter("#bank-sakura", T("feed", 0.3) + 0.55);
enter("#bank-more", T("feed", 0.3) + 0.75);
enter("#bank-sam", T("feed", 0.3) + 0.95);
dim("#bank-sakura, #bank-more, #bank-sam", T("spent", 6));
emphasis("#bank-ntuc", T("spent", 6));
enter("#you-head", T("groceries", 8));
draw("#to-groceries", T("groceries", 8));
enter("#groceries", T("groceries", 8) + 0.45, 24);
draw("#to-gift", T("gift", 10));
enter("#gift", T("gift", 10) + 0.45, 24);
emphasis("#groceries, #gift", T("label", 16));
dim("#bank-ntuc, #groceries, #gift, #to-groceries, #to-gift", T("dinner", 19));
undim("#bank-sakura, #bank-sam", T("dinner", 19));
emphasis("#bank-sakura", T("dinner", 19) + 0.2);
emphasis("#bank-sam", T("week", 23));
undim("#bank-more", T("scroll", 26));
emphasis("#bank-more", T("scroll", 26));
dim("#bank-more", T("share", 31));
draw("#from-sakura", T("share", 31));
draw("#from-sam", T("share", 31) + 0.2);
enter("#dinner", T("share", 31) + 0.6, 24);
emphasis("#dinner", T("label2", 34));
${hold("label2", 34)}
`)

write("start-explain", 50, "Finpoint closes that gap", "Your bank’s words, and your own.", `
	${feed("fp", false)}
	<div id="fp-you" class="fp-kicker" style="position:absolute;left:1168px;top:262px;margin:0;color:var(--record)">Your labels</div>
	${label("fp-groceries", "Groceries", -50, 1168, 300)}
	${label("fp-gift", "A gift", -30, 1168, 392)}
	${arrow("fp-to-groceries", [912, 362], [1160, 336], "record")}
	${arrow("fp-to-gift", [912, 362], [1160, 428], "record")}
	${label("fp-dinner", "Your share of dinner", -30, 1168, 520)}
	${arrow("fp-from-sakura", [912, 482], [1160, 556], "record")}
	${arrow("fp-from-sam", [912, 602], [1160, 556], "record")}
	${callout("idea", "Labels on your bank activity: one or many, simple or detailed.", "record")}`, `
enter("#heading", T("gap", 0.3));
enter("#fp-head", T("exact", 2));
enter("#fp-ntuc", T("exact", 2) + 0.15);
enter("#fp-sakura", T("exact", 2) + 0.3);
enter("#fp-sam", T("exact", 2) + 0.45);
enter("#fp-you", T("groceries", 7));
draw("#fp-to-groceries", T("groceries", 7));
enter("#fp-groceries", T("groceries", 7) + 0.45, 24);
draw("#fp-to-gift", T("gift", 9));
enter("#fp-gift", T("gift", 9) + 0.45, 24);
draw("#fp-from-sakura", T("share", 11));
draw("#fp-from-sam", T("share", 11) + 0.2);
enter("#fp-dinner", T("share", 11) + 0.6, 24);
enter("#idea", T("idea", 15));
emphasis("#fp-groceries, #fp-gift", T("one", 17));
emphasis("#fp-dinner", T("one", 17) + 0.5);
emphasis("#fp-groceries, #fp-gift, #fp-dinner", T("sense", 21));
${hold("sense", 21)}
`)

write("start-how", 40, "Using Finpoint", "Two things to do.", `
	<header id="heading-ideas" class="fp-heading"><div class="fp-kicker">Using Finpoint</div><h1>Three ideas.</h1></header>
	<div id="how" class="fp-stage">
		${tile("bring", "file", "Bring in your bank activity", 192, 420, "Statements", "statement", 560)}
		${tile("labelit", "record", "Label it", 1168, 420, "Records", "record", 560)}
		${arrow("how-arrow", [760, 476], [1160, 476], "neutral")}
		${callout("place", "Everything else falls into place from there.", "record")}
	</div>
	<div id="ideas" class="fp-stage">
		${card("idea-s", "statement", "Your bank activity", -80, 192, 418, "As your bank reports it")}
		${card("idea-r", "record", "Your label for it", -80, 1168, 418, "In your own words")}
		${connector("idea-a", [752, 510], [1168, 510], null)}
	</div>`, `
enter("#heading", T("two", 0.3));
enter("#bring", T("bring", 3), -32);
draw("#how-arrow", T("label", 5));
enter("#labelit", T("label", 5) + 0.4, 32);
enter("#place", T("place", 7));
leave("#how, #heading", T("three", 12) - 0.35);
enter("#heading-ideas", T("three", 12));
enter("#idea-s", T("stmt", 14), -32);
enter("#idea-r", T("rec", 18), 32);
flow("#idea-a", T("alloc", 22));
emphasis("#idea-s, #idea-r", T("alloc", 22) + 0.9);
${hold("alloc", 22, 2.4)}
`)

// ─── 02 · Statements, Records and Allocations ──────────────────────────────────────────────

write("model-diagram", 110, "The basics · three ideas", "Bank activity, labelled by you.", `
	${steps("patterns", ["One to many", "Many to one", "One to one"])}
	<div id="split" class="fp-stage">
		${card("supermarket", "statement", "NTUC FAIRPRICE", -80, 192, 418, "OCBC · 5 Oct", `<div id="untouched">${badge("Matches your bank", "statement")}</div>`)}
		${card("groceries", "record", "Groceries", -50, 1168, 318)}
		${card("gift", "record", "Birthday gift", -30, 1168, 558)}
		${split("split-flow", [-50, -30])}
		${callout("split-note", "One Statement, split across two Records: −$50 + −$30 = −$80.")}
	</div>
	<div id="merge" class="fp-stage">
		${card("dinner-payment", "statement", "SAKURA DINING", -90, 192, 318, "OCBC · 10 Oct")}
		${card("repayment", "statement", "PAYNOW FROM SAM", 60, 192, 558, "OCBC · 17 Oct")}
		${card("dinner-record", "record", "Dinner", -30, 1168, 418, "Your share")}
		${merge("merge-flow", [-90, 60])}
		${callout("merge-note", "Two Statements, combined into one Record: −$90 + $60 = −$30.")}
	</div>
	<div id="lunch" class="fp-stage">
		${card("kopi", "statement", "KOPI & CO", -12, 192, 418, "OCBC · 3 Oct")}
		${card("lunch-record", "record", "Lunch", -12, 1168, 418)}
		${connector("lunch-flow", [752, 510], [1168, 510], -12)}
		${callout("lunch-note", "One Statement, one Record. Most of the time, it’s this simple.")}
	</div>`, `
enter("#heading", T("stmt", 0.3));
enter("#supermarket", T("stmt", 0.3), -32);
tl.fromTo("#untouched", { opacity: 0 }, { opacity: 1, duration: 0.4 }, T("trust", 6));
enter("#groceries", T("rec", 14), 32);
enter("#gift", T("gift", 17), 32);
flow("#split-flow-1", T("alloc", 24));
flow("#split-flow-2", T("alloc2", 27));
emphasis("#groceries", T("alloc", 24) + 0.8);
emphasis("#gift", T("alloc2", 27) + 0.8);
steps("#patterns", [T("splitc", 31), T("comb", 40), T("simp", 50)]);
enter("#split-note", T("splitc", 31) + 0.4);
leave("#split", T("comb", 40) - 0.35);
enter("#dinner-payment", T("comb", 40), -32);
enter("#repayment", T("comb", 40) + 0.25, -32);
enter("#dinner-record", T("dinner", 44), 32);
flow("#merge-flow-1", T("dinner", 44));
flow("#merge-flow-2", T("dinner", 44) + 0.6);
emphasis("#dinner-record", T("share", 47) + 0.4);
enter("#merge-note", T("share", 47) + 0.4);
leave("#merge", T("simp", 50) - 0.35);
enter("#kopi", T("simp", 50), -32);
enter("#lunch-record", T("lunch", 54), 32);
flow("#lunch-flow", T("lunch", 54));
enter("#lunch-note", T("lunch", 54) + 0.6);
${hold("lunch", 54, 2.2)}
`)

write("model-complex", 50, "The basics · when it gets messier", "Many to many, too.", `
	${card("dbs", "statement", "DBS card", -60, 192, 318, "One checkout, 24 Oct")}
	${card("ocbc", "statement", "OCBC card", -60, 192, 558, "Same checkout, 24 Oct")}
	${card("m-groceries", "record", "Groceries", -80, 1168, 318)}
	${card("m-gift", "record", "Gift", -40, 1168, 558)}
	${connector("dbs-groceries", [752, 410], [1168, 410], -60)}
	${connector("ocbc-groceries", [752, 650], [1168, 410], -20)}
	${connector("ocbc-gift", [752, 650], [1168, 650], -40)}
	${callout("three-note", "Two Statements and two Records, linked by three Allocations.")}
	<style>#ocbc-groceries .fp-flow-label, #ocbc-gift .fp-flow-label { display: none; }</style>`, `
enter("#heading", T("messier", 0.3));
enter("#m-groceries", T("buy", 3), 32);
enter("#m-gift", T("gift40", 5), 32);
enter("#dbs", T("cards", 7), -32);
enter("#ocbc", T("cards", 7) + 0.25, -32);
flow("#dbs-groceries", T("three", 11));
flow("#ocbc-groceries", T("three", 11) + 0.5);
flow("#ocbc-gift", T("three", 11) + 1);
enter("#three-note", T("three", 11) + 1.4);
emphasis("#dbs, #ocbc, #m-groceries, #m-gift", T("flex", 18));
tl.to("#root > div > *", { opacity: 0.25, duration: 0.5 }, T("itself", 21));
${hold("itself", 21, 1.2)}
`)

// ─── 04 · Importing your bank activity ─────────────────────────────────────────────────────

write("import-banks", 110, "Importing your bank activity", "From your bank, as a file.", `
	<div id="path" class="fp-stage">
		${tile("bank", "bank", "Your bank", 192, 420, "Website or app", "statement", 400)}
		${tile("file", "file", "Export", 760, 420, "ocbc-october.csv", "neutral", 400)}
		${tile("finpoint", "browser", "Finpoint", 1328, 420, "Reads every line", "record", 400)}
		${arrow("bank-file", [600, 476], [752, 476])}
		${arrow("file-finpoint", [1168, 476], [1320, 476], "record")}
		<div id="as-is" style="position:absolute;left:760px;top:560px">${badge("✓ As your bank gave it", "record")}</div>
		<div id="edited" style="position:absolute;left:760px;top:650px">${badge("✕ Edited: might not import", "danger")}</div>
	</div>
	<div id="banks" class="fp-stage">
		${tile("b-dbs", "bank", "DBS", 192, 400, "CSV or Excel", "statement", 340)}
		${tile("b-ocbc", "bank", "OCBC", 580, 400, "CSV or Excel", "statement", 340)}
		${tile("b-uob", "bank", "UOB", 968, 400, "CSV or Excel", "statement", 340)}
		${tile("b-rev", "bank", "Revolut", 1356, 400, "CSV or Excel", "statement", 372)}
	</div>
	<div id="accounts" class="fp-stage">
		${tile("f-1", "file", "DBS export", 192, 330, "Account …1234", "neutral", 460)}
		${tile("f-2", "file", "DBS export", 192, 560, "Account …5678", "neutral", 460)}
		${arrow("f-1-a", [660, 386], [1160, 386], "statement")}
		${arrow("f-2-a", [660, 616], [1160, 616], "statement")}
		${tile("a-1", "bank", "DBS …1234", 1168, 330, "Its own Statements", "statement", 560)}
		${tile("a-2", "bank", "DBS …5678", 1168, 560, "Its own Statements", "statement", 560)}
	</div>
	<div id="revolut" class="fp-stage">
		${tile("r-file", "file", "Revolut export", 192, 420, "No account inside", "neutral", 460)}
		<div id="r-q" style="position:absolute;left:192px;top:560px">${badge("? Which account", "pending")}</div>
		${arrow("r-ask", [660, 476], [1160, 476], "pending")}
		${tile("r-pick", "bank", "Pick an Account", 1168, 380, "One you already have", "statement", 560)}
		${tile("r-new", "bank", "Or create one", 1168, 560, "With an ID and a name", "statement", 560)}
	</div>`, `
enter("#heading", T("export", 0.3));
enter("#bank", T("export", 0.3), -32);
draw("#bank-file", T("export", 0.3) + 0.5);
enter("#file", T("export", 0.3) + 0.9);
emphasis("#bank", T("app", 4));
draw("#file-finpoint", T("file", 9));
enter("#finpoint", T("file", 9) + 0.4, 32);
enter("#as-is", T("exactly", 13));
emphasis("#file", T("exactly", 13));
enter("#edited", T("edited", 17));
leave("#path", T("dbs", 22) - 0.35);
enter("#b-dbs", T("dbs", 22));
enter("#b-ocbc", T("ocbc", 22.6));
enter("#b-uob", T("uob", 23.2));
enter("#b-rev", T("rev", 23.8));
emphasis("#b-dbs, #b-ocbc, #b-uob, #b-rev", T("csv", 25));
leave("#banks", T("sort", 30) - 0.35);
enter("#f-1", T("sort", 30), -32);
enter("#f-2", T("sort", 30) + 0.25, -32);
emphasis("#f-1, #f-2", T("says", 33));
draw("#f-1-a", T("files", 36));
enter("#a-1", T("files", 36) + 0.4, 32);
draw("#f-2-a", T("two", 40));
enter("#a-2", T("two", 40) + 0.4, 32);
emphasis("#a-1, #a-2", T("own", 43));
leave("#accounts", T("rev2", 47) - 0.35);
enter("#r-file", T("rev2", 47), -32);
enter("#r-q", T("dont", 49));
draw("#r-ask", T("ask", 52));
enter("#r-pick", T("ask", 52) + 0.4, 32);
enter("#r-new", T("new", 55), 32);
${hold("new", 55)}
`)

write("import-download", 30, "Step one", "Download an export for each account.", `
	${tile("d-bank", "bank", "Your bank", 192, 440, "Website or app", "statement", 460)}
	${arrow("d-1", [660, 496], [1160, 400])}
	${arrow("d-2", [660, 496], [1160, 620])}
	${tile("d-f1", "file", "OCBC 360 Account", 1168, 340, "ocbc-october.csv", "neutral", 560)}
	${tile("d-f2", "file", "OCBC savings", 1168, 560, "ocbc-savings.xlsx", "neutral", 560)}
	${callout("d-note", "A CSV or Excel file, once for each account you want to track.", "statement")}`, `
enter("#heading", T("first", 0.3));
enter("#d-bank", T("dl", 2), -32);
draw("#d-1", T("csv", 4));
enter("#d-f1", T("csv", 4) + 0.4, 32);
draw("#d-2", T("each", 6));
enter("#d-f2", T("each", 6) + 0.4, 32);
enter("#d-note", T("each", 6) + 0.8);
${hold("each", 6)}
`)

// ─── 07 · One to many ──────────────────────────────────────────────────────────────────────

write("split-done", 24, "One to many", "Fully labelled.", `
	${card("sd-ntuc", "statement", "NTUC FAIRPRICE", -80, 192, 418, "OCBC · 5 Oct", `<div style="margin-top:18px"><div class="fp-comparison" style="margin:0 0 10px"><span>Left to allocate</span><b id="sd-left">−$30</b></div>${meter("sd-meter", "allocation")}</div>`)}
	${card("sd-groceries", "record", "Groceries", -50, 1168, 318)}
	${card("sd-gift", "record", "Birthday gift", -30, 1168, 558)}
	${split("sd-flow", [-50, -30])}`, `
enter("#heading", 0);
flow("#sd-flow-1", 0);
enter("#sd-gift", T("two", 1), 32);
flow("#sd-flow-2", T("two", 1));
count("#sd-left", 0, T("gift", 3), -30);
tl.fromTo("#sd-meter", { scaleX: 0.375 }, { scaleX: 0, duration: 0.8, ease: "power2.out" }, T("gift", 3));
emphasis("#sd-groceries", T("groc", 2));
emphasis("#sd-gift", T("gift", 3) + 0.4);
${hold("gift", 3, 2)}
`)

// ─── 09 · Where your numbers come from ─────────────────────────────────────────────────────

write("dashboard-source", 40, "Dashboard · where the numbers come from", "Records make the numbers.", `
	${row("ds-lunch", "record", "Lunch", -12, 192, 300, "Dining Out", 640)}
	${row("ds-groceries", "record", "Groceries", -50, 192, 420, "Groceries", 640)}
	${row("ds-gift", "record", "Birthday gift", -30, 192, 540, "Gifts & Donations", 640)}
	${row("ds-dinner", "record", "Dinner", -30, 192, 660, "Dining Out", 640)}
	${arrow("ds-a1", [840, 352], [1160, 470], "record")}
	${arrow("ds-a2", [840, 472], [1160, 490], "record")}
	${arrow("ds-a3", [840, 592], [1160, 510], "record")}
	${arrow("ds-a4", [840, 712], [1160, 530], "record")}
	${dashboard("ds-dash", 1168, 330, "Dashboard · Spending", "Lunch, groceries, a gift and dinner")}
	<div id="ds-unlabelled" class="fp-stage">
		${row("ds-grab", "statement", "GRAB RIDE", -18, 192, 780, "Not labelled yet", 640)}
		<div id="ds-not" style="position:absolute;left:880px;top:808px">${badge("✕ Not counted", "neutral")}</div>
	</div>`, `
enter("#heading", T("recs", 0.3));
enter("#ds-lunch", T("recs", 0.3) + 0.1, -32);
enter("#ds-groceries", T("recs", 0.3) + 0.25, -32);
enter("#ds-gift", T("recs", 0.3) + 0.4, -32);
enter("#ds-dinner", T("recs", 0.3) + 0.55, -32);
enter("#ds-dash", T("dash", 6));
draw("#ds-a1", T("calc", 9));
draw("#ds-a2", T("calc", 9) + 0.15);
draw("#ds-a3", T("calc", 9) + 0.3);
draw("#ds-a4", T("calc", 9) + 0.45);
count("#ds-dash-value", -122, T("calc", 9) + 0.7);
meter("#ds-dash-meter", 1, T("calc", 9) + 0.7);
enter("#ds-grab", T("imp", 15), -32);
enter("#ds-not", T("counts", 17));
emphasis("#ds-dash", T("counts", 17) + 0.4);
${hold("counts", 17)}
`)

// ─── 10 · Pending Records ──────────────────────────────────────────────────────────────────

write("pending-when", 30, "Pending Records", "Label it now, before the bank catches up.", `
	<div id="pw-rail" style="position:absolute;left:192px;top:680px;width:1536px;height:4px;background:var(--line)"></div>
	<div id="pw-today" class="fp-row-meta" style="position:absolute;left:192px;top:704px;font-size:28px">Today</div>
	<div id="pw-week" class="fp-row-meta" style="position:absolute;left:1108px;top:704px;font-size:28px">Next week</div>
	${row("pw-paid", "statement", "SISTIC TICKETS", -200, 192, 320, "You paid for two", 620)}
	${row("pw-back", "statement", "PAYNOW FROM JO", 100, 1108, 320, "Not here yet", 620)}
	${arrow("pw-down", [300, 428], [300, 500], "record", "v")}
	${label("pw-label", "Concert, your share", -100, 192, 508)}`, `
enter("#heading", T("date", 0.3));
tl.fromTo("#pw-rail", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.8, ease: "power2.out" }, T("date", 0.3));
enter("#pw-today", T("date", 0.3) + 0.4);
enter("#pw-week", T("date", 0.3) + 0.6);
enter("#pw-paid", T("know", 4));
tl.fromTo("#pw-back", { opacity: 0 }, { opacity: 0.4, duration: 0.5 }, T("bank", 7));
draw("#pw-down", T("label", 10));
enter("#pw-label", T("label", 10) + 0.4);
emphasis("#pw-label", T("label", 10) + 0.6);
${hold("label", 10)}
`)

write("pending-reasons", 30, "Pending · two different reasons", "What still needs your attention?", `
	<section id="mismatch" class="fp-reason" style="left:192px">
		<h2>1. The amounts don’t add up</h2>
		${card("concert", "record", "Concert", -100, 0, 0, "", badge("Pending · don’t add up"))}
		<div class="fp-comparison"><span>Record <b>−$100</b></span><span>Allocated <b>−$200</b></span></div>
		${meter("mismatch-meter", "pending")}
	</section>
	<section id="unconfirmed" class="fp-reason" style="left:1008px">
		<h2>2. The bank hasn’t confirmed it</h2>
		${card("bank-pending", "statement", "Card payment", -45, 0, 0, "Amounts add up", badge("Pending Statement"))}
		<div id="pending-status" style="margin-top:30px">${badge("Record stays Pending")}</div>
	</section>
	${callout("pending-note", "Either reason keeps the Record Pending.", "pending")}`, `
enter("#heading", T("two", 0.3));
enter("#mismatch", T("tally", 2));
meter("#mismatch-meter", 0.5, T("tally", 2) + 0.3);
emphasis("#concert .fp-badge", T("tally", 2) + 0.7);
enter("#unconfirmed", T("stmts", 5));
enter("#pending-status", T("conf", 8));
emphasis("#bank-pending .fp-badge", T("conf", 8));
enter("#pending-note", T("conf", 8) + 0.3);
${hold("conf", 8, 1.5)}
`)

// ─── 11 · Pending Statements ───────────────────────────────────────────────────────────────

write("pending-statement", 40, "Pending Statements", "Not confirmed by the bank yet.", `
	${row("pst-1", "statement", "NTUC FAIRPRICE", -80, 192, 330, "Confirmed", 760)}
	${row("pst-2", "statement", "BURGER JOINT", -35, 192, 450, "Card payment", 760)}
	<div id="pst-badge" style="position:absolute;left:992px;top:476px">${badge("Pending Statement")}</div>
	${row("pst-3", "statement", "TAXI HOME", -24, 192, 570, "Added by you, the bank is slow", 760)}
	<div id="pst-badge-3" style="position:absolute;left:992px;top:596px">${badge("Pending Statement")}</div>
	<div id="pst-edit" style="position:absolute;left:192px;top:700px">${badge("You can edit it until the real one arrives", "statement")}</div>`, `
enter("#heading", T("remember", 0.3));
enter("#pst-1", T("remember", 0.3) + 0.2);
emphasis("#pst-1", T("exception", 3));
enter("#pst-2", T("pend", 5));
enter("#pst-badge", T("rev", 9));
enter("#pst-3", T("add", 13));
enter("#pst-badge-3", T("add", 13) + 0.3);
enter("#pst-edit", T("edit", 16));
${hold("edit", 16)}
`)

// ─── 12 · Fixing duplicate Statements ──────────────────────────────────────────────────────

write("duplicate-export", 30, "Fixing duplicates", "The same payment, exported twice.", `
	${tile("de-f1", "file", "September export", 192, 300, "", "neutral", 560)}
	${tile("de-f2", "file", "October export", 1168, 300, "", "neutral", 560)}
	${row("de-r1", "statement", "GRAB *RIDE", -18, 192, 470, "OCBC · 12 Sep", 560)}
	${row("de-r2", "statement", "GRAB RIDE SG", -18, 1168, 470, "OCBC · 12 Sep", 560)}
	<div id="de-q" style="position:absolute;left:820px;top:496px">${badge("Duplicate?")}</div>
	${callout("de-note", "Same account, same day, same amount. Only the description changed.", "pending")}`, `
enter("#heading", T("exps", 0.3));
enter("#de-f1", T("exps", 0.3), -32);
enter("#de-r1", T("exps", 0.3) + 0.3, -32);
enter("#de-f2", T("chg", 4), 32);
enter("#de-r2", T("chg", 4) + 0.3, 32);
emphasis("#de-r1 .fp-row-title, #de-r2 .fp-row-title", T("desc", 6));
enter("#de-q", T("twice", 9));
enter("#de-note", T("twice", 9) + 0.4);
${hold("twice", 9)}
`)

// ─── 15 · Statement rules ──────────────────────────────────────────────────────────────────

write("rule-recurring", 30, "Statement rules", "Recognise it once, fill it in every time.", `
	${row("rr-1", "statement", "SINGTEL BILL", -45, 192, 300, "Aug", 520)}
	${row("rr-2", "statement", "SINGTEL BILL", -45, 192, 420, "Sep", 520)}
	${row("rr-3", "statement", "SINGTEL BILL", -45, 192, 540, "Oct", 520)}
	${arrow("rr-in", [720, 472], [810, 472], "allocation")}
	${tile("rr-rule", "rule", "Phone bill rule", 818, 416, "Looks for “SINGTEL”", "allocation", 420)}
	${arrow("rr-out", [1246, 472], [1320, 472], "record")}
	${tile("rr-record", "record", "Phone bill", 1328, 416, "Bills & Utilities", "record", 400)}
	${callout("rr-note", "It fills in the Record when you create one. It never creates Records on its own.", "allocation")}`, `
enter("#heading", T("month", 0.3));
enter("#rr-1", T("phone", 2));
enter("#rr-2", T("phone", 2) + 0.25);
enter("#rr-3", T("phone", 2) + 0.5);
draw("#rr-in", T("rule", 7));
enter("#rr-rule", T("rule", 7) + 0.3);
draw("#rr-out", T("fills", 10));
enter("#rr-record", T("fills", 10) + 0.3, 24);
enter("#rr-note", T("never", 13));
${hold("never", 13)}
`)

// ─── 16 · Treatments ───────────────────────────────────────────────────────────────────────

const bucket = (id: string, name: string, tone: string, y: number) =>
	`<div id="${id}" class="fp-tile" style="left:1328px;top:${y}px;width:400px;--tone:var(--${tone})"><div class="fp-tile-title" style="color:var(--${tone})">${name}</div></div>`
write("treatments", 60, "Treatments", "How the Dashboard counts a Record.", `
	${row("tm-salary", "record", "Salary", 3000, 192, 280, "Income", 620)}
	${row("tm-lunch", "record", "Lunch", -12, 192, 390, "Spending", 620)}
	${row("tm-refund", "record", "Refund", 20, 192, 500, "Spending, lowered", 620)}
	${row("tm-invest", "record", "Investing", -500, 192, 610, "Saving / investment", 620)}
	${row("tm-transfer", "record", "Savings transfer", -200, 192, 720, "Transfer", 620)}
	${bucket("tm-income", "Income", "income", 280)}
	${bucket("tm-spending", "Spending", "spending", 420)}
	${bucket("tm-saving", "Saving", "saving", 560)}
	${bucket("tm-none", "Not counted", "neutral", 700)}
	${arrow("tm-a1", [820, 332], [1320, 327], "income")}
	${arrow("tm-a2", [820, 442], [1320, 457], "spending")}
	${arrow("tm-a3", [820, 552], [1320, 477], "spending")}
	${arrow("tm-a4", [820, 662], [1320, 607], "saving")}
	${arrow("tm-a5", [820, 772], [1320, 747], "neutral")}`, `
enter("#heading", T("treat", 0.3));
enter("#tm-income", T("income", 4), 24);
enter("#tm-spending", T("spend", 5), 24);
enter("#tm-saving", T("saving", 6), 24);
enter("#tm-none", T("notatall", 7), 24);
enter("#tm-salary", T("salary", 10), -24);
draw("#tm-a1", T("salary", 10) + 0.3);
enter("#tm-lunch", T("lunch", 12), -24);
draw("#tm-a2", T("lunch", 12) + 0.3);
enter("#tm-refund", T("refund", 14), -24);
draw("#tm-a3", T("refund", 14) + 0.3);
enter("#tm-invest", T("inv", 19), -24);
draw("#tm-a4", T("inv", 19) + 0.3);
enter("#tm-transfer", T("trans", 24), -24);
draw("#tm-a5", T("trans", 24) + 0.3);
${hold("trans", 24, 2.5)}
`)

write("treatment-override", 20, "Treatments · exceptions", "Your Category decides, unless you say otherwise.", `
	${tile("to-cat", "record", "Dining Out", 192, 360, "Category · counts as Spending", "record", 620)}
	${arrow("to-a1", [820, 416], [1160, 340], "spending")}
	${arrow("to-a2", [820, 416], [1160, 560], "neutral")}
	${row("to-r1", "record", "Lunch", -12, 1168, 288, "Spending", 560)}
	${row("to-r2", "record", "Team dinner", -80, 1168, 508, "Company pays you back", 560)}
	<div id="to-badge" style="position:absolute;left:1168px;top:630px">${badge("Changed on this Record only", "allocation")}</div>`, `
enter("#heading", T("cat", 0.3));
enter("#to-cat", T("cat", 0.3) + 0.2, -32);
draw("#to-a1", T("cat", 0.3) + 0.6);
enter("#to-r1", T("cat", 0.3) + 1, 24);
draw("#to-a2", T("chg", 4));
enter("#to-r2", T("chg", 4) + 0.4, 24);
enter("#to-badge", T("exc", 6));
${hold("exc", 6, 2)}
`)

// ─── 17 · Monthly Budgets ──────────────────────────────────────────────────────────────────

const plan = (id: string, name: string, meta: string, x: number) =>
	`<div id="${id}" class="fp-tile" style="left:${x}px;top:430px;width:360px;flex-direction:column;align-items:flex-start;gap:12px;--tone:var(--neutral)">${icon("budget")}<div class="fp-tile-title">${name}</div><div class="fp-tile-meta">${meta}</div></div>`
write("monthly-budgets", 40, "Monthly Budgets", "Am I on track this month?", `
	<div id="mb-month" style="position:absolute;left:192px;top:310px">${badge("October 2026", "neutral")}</div>
	${plan("mb-daily", "Daily", "Food, transport", 192)}
	${plan("mb-rec", "Recurring", "Rent, your phone", 584)}
	${plan("mb-irr", "Irregular", "One-off costs", 976)}
	${plan("mb-trav", "Travel", "Trips", 1368)}
	${callout("mb-note", "Each gets its own amount every month. A plan to compare with, not money set aside.", "neutral")}`, `
enter("#heading", T("mb", 0.3));
enter("#mb-month", T("month", 3));
enter("#mb-daily", T("daily", 8));
enter("#mb-rec", T("rec", 10));
enter("#mb-irr", T("irr", 12));
enter("#mb-trav", T("trav", 14));
enter("#mb-note", T("each", 16));
${hold("each", 16)}
`)

// ─── 20 · Budgets for trips and events ─────────────────────────────────────────────────────

write("budget-period", 30, "Budgets for trips and events", "Its own start and end.", `
	<div id="bp-oct" class="fp-tile" style="left:192px;top:330px;width:760px;--tone:var(--neutral)"><div class="fp-tile-title">October</div></div>
	<div id="bp-nov" class="fp-tile" style="left:968px;top:330px;width:760px;--tone:var(--neutral)"><div class="fp-tile-title">November</div></div>
	<div id="bp-range" style="position:absolute;left:760px;top:450px;width:400px;height:56px;border-radius:28px;background:color-mix(in srgb, var(--allocation) 25%, transparent);border:2px solid var(--allocation)"></div>
	<div id="bp-label" class="fp-row-meta" style="position:absolute;left:780px;top:520px;font-size:28px;color:var(--ink)">28 Oct – 3 Nov</div>
	${card("bp-budget", "budget", "A week in Bali", -1500, 680, 580, "Its own small dashboard")}`, `
enter("#heading", T("bud", 0.3));
enter("#bp-oct", T("bud", 0.3) + 0.2);
enter("#bp-nov", T("bud", 0.3) + 0.4);
tl.fromTo("#bp-range", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, T("start", 4));
enter("#bp-label", T("end", 5));
enter("#bp-budget", T("bali", 7));
emphasis("#bp-range", T("months", 12));
${hold("months", 12)}
`)

// ─── 21 · Backups and Google Drive ─────────────────────────────────────────────────────────

write("sync-local", 30, "Your data", "It lives in your browser.", `
	<div id="sl-zone" class="fp-zone" style="left:192px;top:320px;width:900px;height:420px"><div class="fp-zone-title">This browser, on this device</div></div>
	${row("sl-r1", "record", "Groceries", -50, 240, 380, "", 800)}
	${row("sl-r2", "statement", "NTUC FAIRPRICE", -80, 240, 500, "", 800)}
	${row("sl-r3", "record", "Dinner", -30, 240, 620, "", 800)}
	${tile("sl-server", "cloud", "Finpoint’s servers", 1250, 460, "Never see your data", "neutral", 478)}
	<div id="sl-cross" style="position:absolute;left:1250px;top:580px">${badge("✕ Nothing stored here", "neutral")}</div>`, `
enter("#heading", T("browser", 0.3));
tl.fromTo("#sl-zone", { opacity: 0 }, { opacity: 1, duration: 0.5 }, T("browser", 0.3));
enter("#sl-r1", T("device", 3));
enter("#sl-r2", T("device", 3) + 0.2);
enter("#sl-r3", T("device", 3) + 0.4);
enter("#sl-server", T("servers", 7), 32);
dim("#sl-server", T("servers", 7) + 1);
enter("#sl-cross", T("servers", 7) + 1);
${hold("servers", 7, 3)}
`)

write("sync-conflict", 30, "When copies disagree", "Finpoint keeps one whole copy.", `
	${tile("sc-a", "device", "Laptop", 192, 330, "Changed on Monday", "statement", 560)}
	${tile("sc-b", "phone", "Phone", 192, 560, "Changed on Tuesday", "statement", 560)}
	${arrow("sc-keep", [760, 386], [1160, 470], "record")}
	${tile("sc-kept", "check", "Laptop’s copy", 1168, 420, "Kept whole, never mixed", "record", 560)}
	<div id="sc-yours" class="fp-stage">
		${callout("sc-note", "Your data only goes to places you control: this device, your backup file, your Google Drive.", "record")}
	</div>`, `
enter("#heading", T("two", 0.3));
enter("#sc-a", T("devices", 2), -32);
enter("#sc-b", T("devices", 2) + 0.3, -32);
draw("#sc-keep", T("keep", 5));
enter("#sc-kept", T("keep", 5) + 0.4, 32);
dim("#sc-b", T("whole", 7));
emphasis("#sc-kept", T("whole", 7));
enter("#sc-yours", T("ctrl", 11));
${hold("ctrl", 11, 2)}
`)

// ─── 22 · Your routine ─────────────────────────────────────────────────────────────────────

const stepTile = (id: string, n: number, name: string, glyph: Parameters<typeof icon>[0], x: number, y: number) =>
	tile(id, glyph, `${n}. ${name}`, x, y, "", "neutral", 470).replace('class="fp-tile"', 'class="fp-tile fp-step-tile"')
write("routine-loop", 40, "Your routine", "A few minutes, every so often.", `
	${stepTile("rl-1", 1, "Import", "file", 192, 300)}
	${stepTile("rl-2", 2, "Fix duplicates", "statement", 725, 300)}
	${stepTile("rl-3", 3, "Label what’s new", "record", 1258, 300)}
	${stepTile("rl-4", 4, "Check Pending", "pending", 1258, 520)}
	${stepTile("rl-5", 5, "Glance at Dashboard", "browser", 725, 520)}
	${stepTile("rl-6", 6, "Keep a backup", "cloud", 192, 520)}
	${arrow("rl-a1", [668, 347], [717, 347])}
	${arrow("rl-a2", [1201, 347], [1250, 347])}
	${arrow("rl-a3", [1493, 400], [1493, 512], "neutral", "v")}
	${arrow("rl-a4", [1252, 567], [1203, 567])}
	${arrow("rl-a5", [719, 567], [670, 567])}
	${callout("rl-note", "With Google Drive connected, backups happen on their own.", "record")}`, `
enter("#heading", T("routine", 0.3));
enter("#rl-1", T("import", 1.5));
draw("#rl-a1", T("dups", 4));
enter("#rl-2", T("dups", 4) + 0.3);
draw("#rl-a2", T("expl", 6));
enter("#rl-3", T("expl", 6) + 0.3);
draw("#rl-a3", T("pend", 9));
enter("#rl-4", T("pend", 9) + 0.3);
draw("#rl-a4", T("dash", 11));
enter("#rl-5", T("dash", 11) + 0.3);
draw("#rl-a5", T("backup", 13));
enter("#rl-6", T("backup", 13) + 0.3);
enter("#rl-note", T("drive", 16));
emphasis("#rl-6", T("drive", 16) + 0.3);
${hold("drive", 16, 2.5)}
`)
