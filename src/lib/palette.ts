import { argbFromHex, Hct, hexFromArgb } from "@material/material-color-utilities"

// Tones (HCT lightness, 0 black to 100 white) every picked colour is moved to: bright
// enough to stay vivid, dark enough that white icons read (3.8:1 light, 3.2:1 dark).
const LIGHT_TONE = 55
const DARK_TONE = 60
const HEX = /^#(?:[0-9a-f]{3}){1,2}$/i
const cache = new Map<string, string>()

/**
 * A user-picked colour as Material You would show it: the hue and chroma stay,
 * and the tone is set per theme, so every Category, Monthly Budget and Bank
 * colour sits at the same lightness. Returns a `light-dark()` CSS colour; values
 * that are not hex pass through.
 */
export function themeColor(color: string): string
export function themeColor(color: string | null | undefined): string | undefined
export function themeColor(color: string | null | undefined) {
	if (!color || !HEX.test(color)) return color ?? undefined
	const cached = cache.get(color)
	if (cached) return cached
	const source = Hct.fromInt(argbFromHex(color))
	const tone = (value: number) => hexFromArgb(Hct.from(source.hue, source.chroma, value).toInt())
	const result = `light-dark(${tone(LIGHT_TONE)}, ${tone(DARK_TONE)})`
	cache.set(color, result)
	return result
}
