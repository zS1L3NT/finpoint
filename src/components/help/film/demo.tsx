import { type CSSProperties, useContext } from "react"
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion"
import shotFile from "../../../lib/guide-video-shots.json"
import { Cues, cueFrame, useReduced } from "./motion"
import { alpha, color, ease } from "./theme"

type Box = [number, number, number, number]
type Shot = { width: number; height: number; boxes: Record<string, number[]> }
const shotMap = shotFile as Record<string, Shot>

/**
 * One moment of a real-UI demonstration. From `at` (a spoken word, or frames from the start), the
 * camera frames `focus` on screenshot `shot`; the cursor glides to `cursor` and clicks if asked,
 * and `highlight` rings controls while `note` labels one of them.
 */
export type DemoKey = {
	at?: string | number
	nth?: number
	shot: string
	focus?: string
	zoom?: number
	cursor?: string
	click?: boolean
	highlight?: string | string[]
	note?: { box: string; text: string }
}

/** The demo window inside the 16:9 film. */
export const demoFrame = { width: 1744, height: 724 } as const

type Camera = { scale: number; x: number; y: number }

const boxOf = (shot: string, key?: string): Box | null => {
	const box = key ? shotMap[shot]?.boxes[key] : undefined
	return box && box.length === 4 ? (box as Box) : null
}

function cameraFor(key: DemoKey, frame: { width: number; height: number }): Camera {
	const shot = shotMap[key.shot] ?? { width: 1440, height: 900, boxes: {} }
	const fit = frame.width / shot.width
	if (key.focus === "full") {
		const scale = Math.min(frame.width / shot.width, frame.height / shot.height)
		return { scale, x: shot.width / 2, y: shot.height / 2 }
	}
	const box = boxOf(key.shot, key.focus)
	let scale = fit
	let x = shot.width / 2
	let y = frame.height / (2 * fit)
	if (box) {
		const [left, top, width, height] = box
		scale =
			key.zoom ??
			Math.min(
				2.1,
				Math.max(
					fit,
					Math.min((frame.width * 0.62) / width, (frame.height * 0.62) / height),
				),
			)
		x = left + width / 2
		y = top + height / 2
	}
	// Never show past the edges of the screenshot.
	const halfW = frame.width / (2 * scale)
	const halfH = frame.height / (2 * scale)
	x =
		shot.width * scale <= frame.width
			? shot.width / 2
			: Math.min(Math.max(x, halfW), shot.width - halfW)
	y =
		shot.height * scale <= frame.height
			? shot.height / 2
			: Math.min(Math.max(y, halfH), shot.height - halfH)
	return { scale, x, y }
}

const mix = (a: Camera, b: Camera, t: number): Camera => ({
	scale: a.scale + (b.scale - a.scale) * t,
	x: a.x + (b.x - a.x) * t,
	y: a.y + (b.y - a.y) * t,
})

function Cursor({ x, y, press }: { x: number; y: number; press: number }) {
	return (
		<svg
			width={40}
			height={40}
			viewBox="0 0 24 24"
			style={{
				position: "absolute",
				left: x - 6,
				top: y - 4,
				transform: `scale(${1 - press * 0.15})`,
				transformOrigin: "6px 4px",
				filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))",
			}}
			aria-hidden
		>
			<path
				d="M5 3 L5 19.5 L9.5 15.5 L12.4 21.6 L15.3 20.3 L12.5 14.3 L18.6 14.3 Z"
				fill="#ffffff"
				stroke="#111111"
				strokeWidth={1.4}
				strokeLinejoin="round"
			/>
		</svg>
	)
}

/** A real Finpoint screen, filmed: camera moves, cursor, clicks and highlights, keyed to the narration. */
export function UiDemo({
	keys,
	frame: size = demoFrame,
	tint = color.allocation,
	style,
}: {
	keys: DemoKey[]
	frame?: { width: number; height: number }
	tint?: string
	style?: CSSProperties
}) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	const cues = useContext(Cues)
	const times = keys.map((key, index) =>
		index === 0
			? 0
			: typeof key.at === "number"
				? key.at
				: cueFrame(cues, key.at ?? "", { nth: key.nth, fallback: index * 60 }),
	)
	let active = 0
	times.forEach((time, index) => {
		if (frame >= time) active = index
	})
	const current = keys[active] ?? keys[0]
	if (!current) return null
	const previous = keys[Math.max(0, active - 1)] ?? current
	const since = frame - (times[active] ?? 0)
	const move = reduced
		? 1
		: interpolate(since, [0, 26], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: ease.inOut,
			})
	const camera =
		active === 0
			? cameraFor(current, size)
			: mix(cameraFor(previous, size), cameraFor(current, size), move)
	const project = ([x, y]: [number, number]) => ({
		x: size.width / 2 + (x - camera.x) * camera.scale,
		y: size.height / 2 + (y - camera.y) * camera.scale,
	})
	const fade = interpolate(since, [0, 10], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	})
	const layers =
		active > 0 && previous.shot !== current.shot
			? [
					{ shot: previous.shot, opacity: 1 },
					{ shot: current.shot, opacity: fade },
				]
			: [{ shot: current.shot, opacity: 1 }]

	// The cursor glides between the latest two targets it was given.
	const cursorKeys = keys
		.map((key, index) => ({ key, time: times[index] ?? 0 }))
		.filter(({ key, time }) => key.cursor && time <= frame && key.shot === current.shot)
	const target = cursorKeys[cursorKeys.length - 1]
	const before = cursorKeys[cursorKeys.length - 2]
	const centre = (shot: string, key?: string): [number, number] | null => {
		const box = boxOf(shot, key)
		return box ? [box[0] + box[2] * 0.42, box[1] + box[3] * 0.55] : null
	}
	let cursor: { x: number; y: number; press: number; ripple: number } | null = null
	if (target) {
		const end = centre(target.key.shot, target.key.cursor)
		const start = before ? centre(before.key.shot, before.key.cursor) : null
		const glide = interpolate(frame - target.time, [0, 22], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: ease.inOut,
		})
		if (end) {
			const from = start ?? [end[0] + 220, end[1] + 160]
			const point = project([
				from[0] + (end[0] - from[0]) * glide,
				from[1] + (end[1] - from[1]) * glide,
			])
			const clickAt = target.time + 24
			const press = target.key.click
				? interpolate(frame, [clickAt, clickAt + 4, clickAt + 10], [0, 1, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					})
				: 0
			const ripple = target.key.click
				? interpolate(frame, [clickAt, clickAt + 20], [0, 1], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					})
				: 0
			cursor = { ...point, press, ripple }
		}
	}

	const ring = interpolate(since, [14, 28], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: ease.out,
	})
	const highlights = (
		Array.isArray(current.highlight)
			? current.highlight
			: current.highlight
				? [current.highlight]
				: []
	)
		.map(key => boxOf(current.shot, key))
		.filter((box): box is Box => Boolean(box))
	const noteBox = current.note ? boxOf(current.shot, current.note.box) : null

	return (
		<div
			style={{
				position: "relative",
				width: size.width,
				height: size.height,
				overflow: "hidden",
				borderRadius: 22,
				background: "#ffffff",
				boxShadow: `0 40px 90px rgba(0,0,0,0.55), 0 0 0 1.5px ${color.line}`,
				...style,
			}}
		>
			{layers.map(layer => {
				const shot = shotMap[layer.shot] ?? { width: 1440, height: 900, boxes: {} }
				return (
					<Img
						key={layer.shot}
						src={staticFile(`guide-shots/${layer.shot}.jpg`)}
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							width: shot.width,
							height: shot.height,
							maxWidth: "none",
							opacity: layer.opacity,
							transformOrigin: "0 0",
							transform: `translate(${size.width / 2 - camera.x * camera.scale}px, ${size.height / 2 - camera.y * camera.scale}px) scale(${camera.scale})`,
						}}
					/>
				)
			})}
			{highlights.map(box => {
				const a = project([box[0], box[1]])
				const b = project([box[0] + box[2], box[1] + box[3]])
				const pad = 8
				return (
					<div
						key={box.join()}
						style={{
							position: "absolute",
							left: a.x - pad,
							top: a.y - pad,
							width: b.x - a.x + pad * 2,
							height: b.y - a.y + pad * 2,
							borderRadius: 14,
							boxShadow: `0 0 0 4px ${tint}, 0 0 0 ${10 * ring}px ${alpha(tint, 0.18)}, 0 0 40px ${alpha(tint, 0.45)}`,
							opacity: ring,
							transform: `scale(${1.04 - 0.04 * ring})`,
						}}
					/>
				)
			})}
			{noteBox && current.note && (
				<div
					style={(() => {
						const a = project([noteBox[0], noteBox[1]])
						const b = project([noteBox[0] + noteBox[2], noteBox[1] + noteBox[3]])
						const below = b.y + 120 < size.height
						return {
							position: "absolute",
							left: Math.min(Math.max(24, a.x), size.width - 560),
							top: below ? b.y + 22 : a.y - 92,
							maxWidth: 540,
							padding: "16px 22px",
							borderRadius: 16,
							background: color.night,
							color: color.ink,
							fontSize: 28,
							fontWeight: 600,
							lineHeight: 1.3,
							boxShadow: `0 18px 40px rgba(0,0,0,0.45), inset 0 0 0 2px ${tint}`,
							opacity: ring,
							transform: `translateY(${(1 - ring) * (below ? -10 : 10)}px)`,
						} satisfies CSSProperties
					})()}
				>
					{current.note.text}
				</div>
			)}
			{cursor && (
				<>
					{cursor.ripple > 0 && cursor.ripple < 1 && (
						<div
							style={{
								position: "absolute",
								left: cursor.x - 40 * cursor.ripple,
								top: cursor.y - 40 * cursor.ripple,
								width: 80 * cursor.ripple,
								height: 80 * cursor.ripple,
								borderRadius: 999,
								border: `4px solid ${tint}`,
								opacity: 1 - cursor.ripple,
							}}
						/>
					)}
					<Cursor x={cursor.x} y={cursor.y} press={cursor.press} />
				</>
			)}
		</div>
	)
}
