// Build-time components leave ordinary, editable HTML for HyperFrames; nothing creates timed DOM at runtime.
import { writeFileSync } from "node:fs"
import { badge, callout, card, connector, dashboard, merge, meter, scene, split, steps } from "../compositions/components/kit"

const model = `
	${steps("patterns", ["Split", "Combine", "One to one"])}
	<div id="words" class="fp-stage">
		<div id="word-s" class="fp-card" data-kind="statement" style="left:192px;top:430px;width:460px"><div class="fp-card-label">Statement</div><div class="fp-card-title">What your bank says</div></div>
		<div id="word-a" class="fp-card" style="--tone:var(--allocation);left:730px;top:430px;width:460px"><div class="fp-card-label">Allocation</div><div class="fp-card-title">The amount linking them</div></div>
		<div id="word-r" class="fp-card" data-kind="record" style="left:1268px;top:430px;width:460px"><div class="fp-card-label">Record</div><div class="fp-card-title">Your explanation</div></div>
	</div>
	<div id="split" class="fp-stage">
		${card("supermarket", "statement", "NTUC FAIRPRICE", -80, 192, 418, "OCBC · 5 Oct")}
		${card("groceries", "record", "Groceries", -50, 1168, 318)}
		${card("gift", "record", "Birthday gift", -30, 1168, 558)}
		${split("split-flow", [-50, -30])}
		${callout("split-note", "One Statement → two Records. −$50 + −$30 = −$80.")}
	</div>
	<div id="merge" class="fp-stage">
		${card("dinner-payment", "statement", "SAKURA", -90, 192, 318, "Dinner · 10 Oct")}
		${card("repayment", "statement", "PAYNOW", 60, 192, 558, "From Sam · 17 Oct")}
		${card("dinner-record", "record", "Dinner", -30, 1168, 418, "Your share")}
		${merge("merge-flow", [-90, 60])}
		${callout("merge-note", "Two Statements → one Record. −$90 + $60 = −$30.")}
	</div>
	<div id="lunch" class="fp-stage">
		${card("kopi", "statement", "KOPI & CO", -12, 192, 418, "OCBC · 3 Oct")}
		${card("lunch-record", "record", "Lunch", -12, 1168, 418)}
		${connector("lunch-flow", [752, 510], [1168, 510], -12)}
		${callout("lunch-note", "One Statement → one Record. The same idea, with one link.")}
	</div>`

writeFileSync(new URL("../compositions/scenes/model-diagram.html", import.meta.url), scene("model-diagram", 90,
	"The basics · three words", "Bank activity, explained by you.", model, `
enter("#heading", T("three", 0.3));
enter("#word-s", T("wS", 1));
enter("#word-r", T("wR", 2));
enter("#word-a", T("wA", 3));
leave("#words", T("stmt", 8) - 0.35);
steps("#patterns", [T("stmt", 8), T("comb", 28), T("simp", 40)]);
enter("#supermarket", T("stmt", 8), -32);
enter("#groceries", T("rec", 12), 32);
enter("#gift", T("rec2", 14), 32);
flow("#split-flow-1", T("alloc", 18));
flow("#split-flow-2", T("alloc2", 20));
emphasis("#groceries", T("alloc", 18) + 0.8);
emphasis("#gift", T("alloc2", 20) + 0.8);
enter("#split-note", T("pat", 24));
leave("#split", T("comb", 28) - 0.35);
enter("#dinner-payment", T("comb", 28), -32);
enter("#repayment", T("comb", 28) + 0.25, -32);
enter("#dinner-record", T("dinner", 32), 32);
flow("#merge-flow-1", T("dinner", 32));
flow("#merge-flow-2", T("share", 36));
emphasis("#dinner-record", T("share", 36) + 0.8);
enter("#merge-note", T("share", 36) + 0.4);
leave("#merge", T("simp", 40) - 0.35);
enter("#kopi", T("simp", 40), -32);
enter("#lunch-record", T("lunch", 42), 32);
flow("#lunch-flow", T("lunch", 42));
enter("#lunch-note", T("lunch", 42) + 0.6);
tl.set({}, {}, T("lunch", 42) + 2);
`))

const pending = `
	<section id="mismatch" class="fp-reason" style="left:192px">
		<h2>1. Amounts do not tally</h2>
		${card("concert", "record", "Concert", -100, 0, 0, "", badge("! Pending · mismatch"))}
		<div class="fp-comparison"><span>Record <b>−$100</b></span><span>Allocated <b>−$200</b></span></div>
		${meter("mismatch-meter", "pending")}
	</section>
	<section id="unconfirmed" class="fp-reason" style="left:1008px">
		<h2>2. Bank confirmation is missing</h2>
		${card("bank-pending", "statement", "Card payment", -45, 0, 0, "Amounts can tally", badge("◷ Pending Statement"))}
		<div id="pending-status" style="margin-top:30px">${badge("! Record stays Pending")}</div>
	</section>
	${callout("pending-note", "Either reason keeps the Record Pending.", "pending")}`

writeFileSync(new URL("../compositions/scenes/pending-reasons.html", import.meta.url), scene("pending-reasons", 24,
	"Pending · two different checks", "What still needs your attention?", pending, `
enter("#heading", T("two", 0.3));
enter("#mismatch", T("tally", 2));
meter("#mismatch-meter", 0.5, T("tally", 2) + 0.3);
emphasis("#concert .fp-badge", T("tally", 2) + 0.7);
enter("#unconfirmed", T("stmts", 5));
enter("#pending-status", T("conf", 8));
emphasis("#bank-pending .fp-badge", T("conf", 8));
enter("#pending-note", T("conf", 8) + 0.3);
tl.set({}, {}, T("conf", 8) + 1.5);
`))

const source = `
	${card("dinner", "record", "Dinner", -30, 192, 300, "Your share")}
	${card("grocery", "record", "Groceries", -50, 192, 540)}
	${dashboard("dashboard", 1168, 330, "Dashboard · Spending", "$30 dinner + $50 groceries")}
	${connector("dinner-flow", [752, 392], [1168, 450], -30, "record")}
	${connector("grocery-flow", [752, 632], [1168, 520], -50, "record")}
	<div id="unexplained" class="fp-stage">
		${card("unexplained-card", "statement", "KOPI & CO", -12, 192, 540, "Unexplained · not in the total")}
	</div>
	${callout("source-note", "Records explain your spending.", "record")}`

writeFileSync(new URL("../compositions/scenes/dashboard-source.html", import.meta.url), scene("dashboard-source", 24,
	"Dashboard · where the numbers come from", "Records make the numbers meaningful.", source, `
enter("#heading", T("recs", 0.3));
enter("#dinner", T("recs", 0.3), -32);
enter("#grocery", T("recs", 0.3) + 0.2, -32);
enter("#dashboard", T("dash", 3));
flow("#dinner-flow", T("calc", 4));
flow("#grocery-flow", T("calc", 4) + 0.2);
count("#dashboard-value", 80, T("calc", 4) + 0.65);
meter("#dashboard-meter", 1, T("calc", 4) + 0.65);
leave("#grocery", T("imp", 9) - 0.35);
leave("#grocery-flow", T("imp", 9) - 0.35);
enter("#unexplained", T("imp", 9));
enter("#source-note", T("imp", 9) + 0.4);
emphasis("#dashboard", T("expl", 12));
tl.set({}, {}, T("expl", 12) + 1.3);
`))
