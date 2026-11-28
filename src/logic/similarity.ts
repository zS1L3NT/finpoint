// Statement description similarity, shared by learned Record suggestions, Duplicate Statements
// and Pending Statement replacement, so every workflow agrees on when two bank descriptions
// describe the same activity.

/** Statements this alike are the same kind of activity. */
export const SAME_ACTIVITY = 0.8

/** Lower-case words of a bank description in any script; numbers and reference codes drop out. */
export function descriptionTokens(description: string): string[] {
	const tokens = description
		.toLowerCase()
		.match(/[\p{L}\p{M}\p{N}]+/gu)
		?.flatMap(chunk => {
			// Digits only at the edges are part of a name ("7ELEVEN", "25JAN"); letters and
			// digits interleaved make a reference code ("AWBP8DAGWKCFAV"), which says nothing.
			const letters = chunk.match(/^\p{N}*([\p{L}\p{M}]+)\p{N}*$/u)?.[1]
			if (!letters) return []
			// Scripts written without spaces (Chinese, Japanese, Korean) compare by character pairs.
			if (
				/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(
					letters,
				)
			) {
				const chars = [...letters]
				return chars.length === 1
					? chars
					: chars.slice(1).map((char, i) => `${chars[i]}${char}`)
			}
			return letters.length > 1 ? [letters] : []
		})
	return [...new Set(tokens)]
}

/**
 * Words weigh by how rare they are across every Statement (inverse document frequency), so
 * bank boilerplate shared by many merchants ("SGD", "Contactless", "Singapore") counts for
 * little while merchant names decide.
 */
export function descriptionSimilarity(statements: { id: string; description: string }[]) {
	const frequency = new Map<string, number>()
	const tokensOf = new Map<string, string[]>()
	for (const statement of statements) {
		const words = descriptionTokens(statement.description)
		// Blank descriptions (interest credits, some transfers) still resemble each other.
		const tokens = words.length ? words : ["∅"]
		tokensOf.set(statement.id, tokens)
		for (const token of tokens) frequency.set(token, (frequency.get(token) ?? 0) + 1)
	}
	// A word seen only once (a new merchant, or a reference code) cannot match anything, but it
	// still makes a description less like the others, at half the weight of the rarest shared word.
	const weight = (token: string) => {
		const count = frequency.get(token) ?? 0
		// Wording on every Statement counts for almost nothing, yet a workspace with a single
		// merchant still matches it.
		return count < 2
			? Math.log((statements.length + 1) / 2) / 2
			: Math.log(1 + (statements.length - count + 0.5) / (count + 0.5))
	}
	const norm = (tokens: string[]) => tokens.reduce((sum, token) => sum + weight(token), 0)
	const similarity = (a: string[], b: string[]) => {
		const other = new Set(b)
		const shared = a.reduce((sum, token) => sum + (other.has(token) ? weight(token) : 0), 0)
		const scale = Math.sqrt(norm(a) * norm(b))
		return scale ? shared / scale : 0
	}

	return {
		tokensOf,
		weight,
		/** Whether a word appears in more than one Statement, so it can match anything. */
		shared: (token: string) => (frequency.get(token) ?? 0) > 1,
		similarity,
		/** How alike two of the given Statements are, by id. */
		compare: (a: string, b: string) => similarity(tokensOf.get(a) ?? [], tokensOf.get(b) ?? []),
	}
}
