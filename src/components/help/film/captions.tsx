import { type CSSProperties, useContext } from "react"
import { interpolate, useCurrentFrame } from "remotion"
import { Cues, useReduced } from "./motion"
import { color, ease, font } from "./theme"

const terms: [RegExp, string][] = [
	[/^Statements?\b/, color.statement],
	[/^Records?\b/, color.record],
	[/^Allocations?\b/, color.allocation],
	[/^Pending\b/, color.pending],
	[/^Budgets?\b/, color.pink],
	[/^buckets?\b/i, color.pink],
	[/^Categor(y|ies)\b/, color.pink],
	[/^treatments?\b/i, color.saving],
]

const isAmount = (word: string) => /[−+]?\$[\d,]/.test(word)
const endsSentence = (word: string) => /[.?!:;]["”’)]?$/.test(word)

/** Groups words into short pages so long narration never becomes a wall of text. */
function paginate(words: string[], maxChars: number) {
	const pages: number[][] = [[]]
	let length = 0
	words.forEach((word, index) => {
		const current = pages[pages.length - 1] ?? []
		const previous = words[index - 1]
		const breakSentence =
			previous !== undefined && endsSentence(previous) && length > maxChars * 0.42
		if (current.length && (length + word.length + 1 > maxChars || breakSentence)) {
			pages.push([index])
			length = word.length
		} else {
			current.push(index)
			length += word.length + 1
		}
	})
	// A last page of one or two words reads as a stutter; fold it back into the page before.
	const last = pages[pages.length - 1] ?? []
	const before = pages[pages.length - 2]
	const size = (page: number[]) => page.reduce((sum, at) => sum + (words[at]?.length ?? 0) + 1, 0)
	if (before && size(last) < maxChars * 0.4 && size(before) + size(last) <= maxChars * 1.35) {
		before.push(...last)
		pages.pop()
	}
	return pages
}

/**
 * Narration as type: the words light up as they are spoken, domain terms take their colour,
 * and long passages turn over a page at a time, the old page clearing before the next arrives.
 */
export function Spoken({
	size = 42,
	maxChars = 84,
	weight = 600,
	lineHeight = 1.32,
	align = "left",
	style,
}: {
	size?: number
	maxChars?: number
	weight?: number
	lineHeight?: number
	align?: CSSProperties["textAlign"]
	style?: CSSProperties
}) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	const { words, frames } = useContext(Cues)
	const pages = paginate(words, maxChars)
	const startOf = (page: number[] | undefined) =>
		page?.[0] === undefined ? 0 : (frames[page[0]] ?? 0) - 8
	let active = 0
	pages.forEach((page, index) => {
		if (index > 0 && frame >= startOf(page)) active = index
	})
	return (
		<div style={{ display: "grid", ...style }}>
			{pages.map((page, index) => {
				if (index < active - 1 || index > active) return null
				// The first page waits out the crossfade from the previous beat's words.
				const enter =
					index === 0
						? interpolate(frame, [8, 18], [0, 1], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
								easing: ease.out,
							})
						: interpolate(frame, [startOf(page) + 2, startOf(page) + 14], [0, 1], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
								easing: ease.out,
							})
				const next = pages[index + 1]
				const leave = next
					? interpolate(frame, [startOf(next) - 6, startOf(next) + 2], [0, 1], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
							easing: ease.out,
						})
					: 0
				return (
					<p
						key={page[0]}
						style={{
							gridArea: "1 / 1",
							margin: 0,
							fontSize: size,
							fontWeight: weight,
							lineHeight,
							letterSpacing: "-0.015em",
							textAlign: align,
							textWrap: "pretty",
							opacity: enter * (1 - leave),
							transform: reduced
								? undefined
								: `translateY(${(1 - enter) * 26 - leave * 26}px)`,
						}}
					>
						{page.map(position => {
							const word = words[position] ?? ""
							const lit = interpolate(
								frame,
								[(frames[position] ?? 0) - 2, (frames[position] ?? 0) + 4],
								[0, 1],
								{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
							)
							const term = terms.find(([pattern]) => pattern.test(word))?.[1]
							const amount = isAmount(word)
							return (
								<span key={position}>
									<span
										style={{
											color: term ?? color.ink,
											opacity: 0.3 + 0.7 * lit,
											fontWeight: amount ? 750 : undefined,
											whiteSpace: amount ? "nowrap" : undefined,
											...(amount ? font.numbers : {}),
										}}
									>
										{word}
									</span>{" "}
								</span>
							)
						})}
					</p>
				)
			})}
		</div>
	)
}
