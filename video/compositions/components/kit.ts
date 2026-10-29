import { readFileSync } from "node:fs"

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;")
const icons = {
	statement: '<path d="m3 9 9-6 9 6M3 21h18M5 10v8m5-8v8m4-8v8m5-8v8"/>',
	record: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6"/>',
	budget: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h3"/>',
	file: '<path d="M14 3H6v18h12V7l-4-4Zm0 0v4h4M9 13h6m-6 4h6"/>',
	bank: '<path d="m3 9 9-6 9 6M3 21h18M5 10v8m5-8v8m4-8v8m5-8v8"/>',
	browser: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
	cloud: '<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8H7Z"/>',
	device: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8m-4-4v4"/>',
	phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
	check: '<path d="m5 12 5 5 9-10"/>',
	cross: '<path d="m6 6 12 12M18 6 6 18"/>',
	rule: '<path d="M4 6h16M4 12h10M4 18h6"/><circle cx="18" cy="16" r="3"/>',
	pending: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
}

export const icon = (name: keyof typeof icons, className = "fp-icon") =>
	`<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`

const kindLabel = { statement: "Statement", record: "Record", budget: "Budget" } as const
type Kind = keyof typeof kindLabel

/**
 * A compact Statement or Record: one line, for lists and labels. Relationship diagrams use the
 * full-size `card`, so the same object keeps one size wherever it's explained.
 */
export function row(id: string, kind: Kind, title: string, value: number, x: number, y: number, meta = "", width = 720) {
	return `<div id="${id}" class="fp-row" data-kind="${kind}" style="left:${x}px;top:${y}px;width:${width}px">
		${icon(kind === "record" ? "record" : "statement")}<div class="fp-row-text"><div class="fp-row-title">${escape(title)}</div>${meta ? `<div class="fp-row-meta">${escape(meta)}</div>` : ""}</div>${amount(value)}
	</div>`
}

/** A Record as a label: what the user calls a payment, attached beside it. */
export function label(id: string, title: string, value: number | null, x: number, y: number) {
	return `<div id="${id}" class="fp-label" style="left:${x}px;top:${y}px">${icon("record")}<span>${escape(title)}</span>${value === null ? "" : amount(value)}</div>`
}

/** A plain object tile: a bank, a file, a device, a place. */
export function tile(id: string, glyph: keyof typeof icons, title: string, x: number, y: number, meta = "", tone = "neutral", width = 400) {
	return `<div id="${id}" class="fp-tile" style="left:${x}px;top:${y}px;width:${width}px;--tone:var(--${tone})">${icon(glyph)}<div><div class="fp-tile-title">${escape(title)}</div>${meta ? `<div class="fp-tile-meta">${escape(meta)}</div>` : ""}</div></div>`
}

/** A drawn arrow between two points, with no amount: for order, movement and cause. */
export function arrow(id: string, from: [number, number], to: [number, number], tone = "neutral", bend: "h" | "v" = "h") {
	const [mx, my] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
	const d = bend === "h" ? `M${from} C${mx},${from[1]} ${mx},${to[1]} ${to}` : `M${from} C${from[0]},${my} ${to[0]},${my} ${to}`
	const angle = bend === "h" ? (to[0] >= from[0] ? 0 : 180) : to[1] >= from[1] ? 90 : -90
	return `<div id="${id}" class="fp-flow fp-arrow-only" data-layout-allow-overlap style="--tone:var(--${tone})">
		<svg viewBox="0 0 1920 1080" aria-hidden="true"><path class="fp-path" d="${d}"/><path class="fp-arrow" transform="translate(${to}) rotate(${angle})" d="m-14,-10 14,10 -14,10"/></svg>
	</div>`
}

export function amount(value: number, chip = false) {
	return `<span class="fp-amount${chip ? " fp-chip" : ""}">${value < 0 ? "−" : value > 0 ? "+" : ""}$${Math.abs(value).toLocaleString("en-US")}</span>`
}

export function badge(text: string, tone = "pending") {
	return `<span class="fp-badge" style="--tone:var(--${tone})">${escape(text)}</span>`
}

export function card(id: string, kind: Kind, title: string, value: number, x: number, y: number, meta = "", footer = "") {
	return `<div id="${id}" class="fp-card" data-kind="${kind}" style="left:${x}px;top:${y}px">
		<div class="fp-card-label"><svg class="fp-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[kind]}</svg>${kindLabel[kind]}</div>
		<div class="fp-card-title">${escape(title)}</div>
		<div class="fp-card-row"><div class="fp-card-meta">${escape(meta)}</div>${amount(value)}</div>${footer}
	</div>`
}

export function connector(id: string, from: [number, number], to: [number, number], value: number | null, tone = "allocation") {
	const mid = (from[0] + to[0]) / 2
	return `<div id="${id}" class="fp-flow" data-layout-allow-overlap style="--tone:var(--${tone})">
		<svg viewBox="0 0 1920 1080" aria-hidden="true"><path class="fp-path" d="M${from} C${mid},${from[1]} ${mid},${to[1]} ${to}"/>
		<circle class="fp-pulse" r="6" fill="var(--ink)"/><circle class="fp-port" cx="${from[0]}" cy="${from[1]}" r="7"/><path class="fp-arrow" d="m${to[0] - 12},${to[1] - 9} 12,9 -12,9"/></svg>
		${tone === "allocation" ? `<div class="fp-flow-label" style="left:${mid - 70}px;top:${(from[1] + to[1]) / 2 - 82}px">Allocation</div>` : ""}<div class="fp-packet">${value === null ? "" : amount(value, true)}</div>
	</div>`
}

/** Split and merge share edge ports; each branch gets an independent spoken cue. */
export function split(id: string, values: [number, number]) {
	return connector(`${id}-1`, [752, 510], [1168, 410], values[0]) + connector(`${id}-2`, [752, 510], [1168, 650], values[1])
}
export function merge(id: string, values: [number, number]) {
	return connector(`${id}-1`, [752, 410], [1168, 510], values[0]) + connector(`${id}-2`, [752, 650], [1168, 510], values[1])
}

export function meter(id: string, tone = "record") {
	return `<div class="fp-meter" style="--tone:var(--${tone})"><div id="${id}" class="fp-meter-fill"></div></div>`
}

export function dashboard(id: string, x: number, y: number, title: string, note: string) {
	return `<div id="${id}" class="fp-dashboard" style="left:${x}px;top:${y}px"><h2>${escape(title)}</h2><span id="${id}-value" class="fp-value">$0</span>${meter(`${id}-meter`, "spending")}<p style="margin-top:24px">${escape(note)}</p></div>`
}

export function callout(id: string, text: string, tone = "allocation") {
	return `<div id="${id}" class="fp-callout" style="--tone:var(--${tone})">${escape(text)}</div>`
}

export function steps(id: string, labels: string[]) {
	return `<div id="${id}" class="fp-steps">${labels.map((label, index) => `<div class="fp-step"><b>${index + 1}</b>${escape(label)}</div>`).join("")}</div>`
}

export function scene(id: string, duration: number, kicker: string, title: string, body: string, animation: string) {
	const palette = readFileSync(new URL("../../look.css", import.meta.url), "utf8").match(/:root \{[\s\S]*?\}/)![0].replace(":root", "#root")
	const css = readFileSync(new URL("./kit.css", import.meta.url), "utf8")
	const motion = readFileSync(new URL("./motion.js", import.meta.url), "utf8")
	return `<html data-composition-variables='[{"id":"cues","type":"string","label":"Cues","default":"{}"},{"id":"tone","type":"string","label":"Level colour","default":"#4c9bff"}]'>
<!-- Generated by bun video/scripts/visual-scenes.ts. Edit that source and compositions/components/. -->
<template>
<style>${palette}\n${css}</style>
<div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" data-duration="${duration}">
	<div id="${id}-art" class="clip" data-start="0" data-duration="${duration}" data-track-index="1" data-track-kind="graphics" data-hold>
		<header id="heading" class="fp-heading"><div class="fp-kicker">${escape(kicker)}</div><h1>${escape(title)}</h1></header>
		${body}
	</div>
</div>
<script>${motion}\n${animation}\nwindow.__timelines["${id}"] = tl;</script>
</template>
</html>\n`.replace(/[\t ]+$/gm, "")
}
