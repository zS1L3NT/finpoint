import { Video } from "@remotion/media"
import { type CSSProperties, useContext } from "react"
import { Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import takeFile from "../../../lib/guide-video-takes.json"
import { Cues, cueFrame, useReduced } from "./motion"
import { alpha, color, ease } from "./theme"

type Box = [number, number, number, number]
type Marker = { t: number; boxes: Record<string, number[]> }
type Take = { width: number; height: number; duration: number; markers: Record<string, Marker> }
const takeMap = takeFile as Record<string, Take>

/**
 * One moment of a filmed demonstration. From `at` (a spoken word, or frames from the start) the
 * take either plays on to marker `play` or rests on marker `hold`; the camera frames `focus`
 * (a control recorded at that marker), and `highlight` rings controls while `note` labels one.
 */
export type DemoKey = {
	at?: string | number
	nth?: number
	play?: string
	/** Where `play` starts: the previous key's moment, or the take's start for the first key. */
	from?: string
	/** Playback speed for long, repetitive stretches like typing. */
	speed?: number
	hold?: string
	focus?: string
	zoom?: number
	highlight?: string | string[]
	note?: { box: string; text: string }
}

/** A beat filmed in one continuous take of the real app. */
export type DemoScene = { take: string; keys: DemoKey[] }

/** The demo window inside the 16:9 film: the same shape as the 1600 × 900 recordings. */
export const demoFrame = { width: 1440, height: 810 } as const

type Camera = { scale: number; x: number; y: number }

/** Width of the app's sidebar in the recordings. */
const sidebar = 290
const fallbackTake: Take = { width: 1600, height: 900, duration: 0, markers: {} }
const markerOf = (key: DemoKey) => key.play ?? key.hold ?? "start"

function boxOf(take: Take, marker: string, key?: string): Box | null {
	const box = key ? take.markers[marker]?.boxes[key] : undefined
	return box && box.length === 4 ? (box as Box) : null
}

/**
 * Where the camera rests for a key. It only ever pushes in a little, in fixed steps, so the frame
 * stays readable and moves feel deliberate rather than restless.
 */
function cameraFor(take: Take, key: DemoKey, size: { width: number; height: number }): Camera {
	const fit = Math.min(size.width / take.width, size.height / take.height)
	const whole = { scale: fit, x: take.width / 2, y: take.height / 2 }
	const box = boxOf(take, markerOf(key), key.focus)
	if (!box) return whole
	const [left, top, width, height] = box
	const wanted = Math.min(
		(size.width * 0.65) / (width * fit),
		(size.height * 0.65) / (height * fit),
	)
	const zoom = key.zoom ?? Math.floor(Math.min(1.5, Math.max(1, wanted)) * 4) / 4
	if (zoom <= 1) return whole
	const scale = fit * zoom
	const halfW = size.width / (2 * scale)
	const halfH = size.height / (2 * scale)
	let x = Math.min(Math.max(left + width / 2, halfW), take.width - halfW)
	// Never cut through the sidebar: show all of it, or start the frame where it ends.
	const edge = x - halfW
	if (edge > 0 && edge < sidebar) {
		const fitsBeside = left - 24 >= sidebar && left + width <= sidebar + halfW * 2
		x = fitsBeside ? sidebar + halfW : halfW
	}
	return {
		scale,
		x,
		y: Math.min(Math.max(top + height / 2, halfH), take.height - halfH),
	}
}

const mix = (a: Camera, b: Camera, t: number): Camera => ({
	scale: a.scale + (b.scale - a.scale) * t,
	x: a.x + (b.x - a.x) * t,
	y: a.y + (b.y - a.y) * t,
})

/** Lays the keys out in time: each starts on its cue, but never before the clip before it ends. */
function schedule(
	take: Take,
	keys: DemoKey[],
	cueAt: (key: DemoKey, index: number) => number,
	fps: number,
) {
	const frameOf = (marker: string) => Math.round((take.markers[marker]?.t ?? 0) * fps)
	const plan: {
		key: DemoKey
		start: number
		end: number
		from: number
		to: number
		/** The marker shown before the clip plays, and after. */
		before: string
		after: string
	}[] = []
	keys.forEach((key, index) => {
		const previous = plan[index - 1]
		const cue = index === 0 ? 0 : cueAt(key, index)
		const start = Math.max(cue, previous?.end ?? 0)
		const after = markerOf(key)
		const before = !key.play ? after : (key.from ?? previous?.after ?? "start")
		const from = frameOf(before)
		const to = frameOf(after)
		const length = Math.max(0, Math.round((to - from) / (key.speed ?? 1)))
		plan.push({ key, start, end: start + length, from, to, before, after })
	})
	return plan
}

const poster = (take: string, marker: string) => staticFile(`guide-takes/${take}/${marker}.jpg`)

/**
 * A real Finpoint screen, filmed in one take: it plays the recording between moments the
 * narration names, rests on them in between, and frames and rings the controls being talked about.
 */
export function UiDemo({
	scene,
	frame: size = demoFrame,
	tint = color.allocation,
	still = false,
	style,
}: {
	scene: DemoScene
	frame?: { width: number; height: number }
	tint?: string
	/** Draws only the final moment, for pictures in Help articles. */
	still?: boolean
	style?: CSSProperties
}) {
	const current = useCurrentFrame()
	const { fps } = useVideoConfig()
	const reduced = useReduced()
	const cues = useContext(Cues)
	const take = takeMap[scene.take] ?? fallbackTake
	const plan = schedule(
		take,
		scene.keys,
		(key, index) =>
			typeof key.at === "number"
				? key.at
				: cueFrame(cues, key.at ?? "", { nth: key.nth, fallback: index * 60 }),
		fps,
	)
	const frame = still ? 1e7 : current
	let active = 0
	plan.forEach((step, index) => {
		if (frame >= step.start) active = index
	})
	const step = plan[active]
	if (!step) return null

	// The camera eases from wherever it was when each key began, so moves never jump.
	let camera = cameraFor(take, plan[0]?.key ?? step.key, size)
	for (let index = 1; index <= active; index++) {
		const item = plan[index]
		const next = plan[index + 1]
		if (!item) break
		const target = cameraFor(take, item.key, size)
		const length = Math.min(75, Math.max(36, item.end - item.start))
		const until = index === active ? frame : (next?.start ?? frame)
		const progress = reduced
			? 1
			: interpolate(until - item.start, [0, length], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: ease.inOut,
				})
		camera = mix(camera, target, progress)
	}
	const project = ([x, y]: [number, number]) => ({
		x: size.width / 2 + (x - camera.x) * camera.scale,
		y: size.height / 2 + (y - camera.y) * camera.scale,
	})

	// Rest on the latest moment reached; a playing clip covers it until it reaches the next one.
	const playing = !still && frame < step.end
	const resting = playing ? step.before : step.after
	const settled = still
		? 1
		: interpolate(frame - step.end, [6, 22], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: ease.out,
			})
	const highlights = (
		Array.isArray(step.key.highlight)
			? step.key.highlight
			: step.key.highlight
				? [step.key.highlight]
				: []
	)
		.map(key => boxOf(take, markerOf(step.key), key))
		.filter((box): box is Box => Boolean(box))
	const noteBox = step.key.note ? boxOf(take, markerOf(step.key), step.key.note.box) : null

	return (
		<div
			style={{
				position: "relative",
				width: size.width,
				height: size.height,
				overflow: "hidden",
				borderRadius: 20,
				background: color.night,
				boxShadow: `0 40px 90px rgba(0,0,0,0.55), 0 0 0 1.5px ${color.line}`,
				...style,
			}}
		>
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					width: take.width,
					height: take.height,
					transformOrigin: "0 0",
					transform: `translate(${size.width / 2 - camera.x * camera.scale}px, ${size.height / 2 - camera.y * camera.scale}px) scale(${camera.scale})`,
				}}
			>
				<Img
					src={poster(scene.take, resting)}
					style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
				/>
				{!still &&
					plan.map(item =>
						item.end > item.start ? (
							<Sequence
								key={`${item.start}-${markerOf(item.key)}`}
								from={item.start}
								durationInFrames={item.end - item.start}
								premountFor={20}
							>
								<Video
									src={staticFile(`guide-takes/${scene.take}.mp4`)}
									trimBefore={item.from}
									playbackRate={item.key.speed ?? 1}
									muted
									style={{
										position: "absolute",
										inset: 0,
										width: "100%",
										height: "100%",
									}}
								/>
							</Sequence>
						) : null,
					)}
			</div>
			{!playing &&
				highlights.map(box => {
					const a = project([box[0], box[1]])
					const b = project([box[0] + box[2], box[1] + box[3]])
					const pad = 6
					return (
						<div
							key={box.join()}
							style={{
								position: "absolute",
								left: a.x - pad,
								top: a.y - pad,
								width: b.x - a.x + pad * 2,
								height: b.y - a.y + pad * 2,
								borderRadius: 12,
								boxShadow: `0 0 0 3px ${tint}, 0 0 0 ${9 * settled}px ${alpha(tint, 0.16)}, 0 0 36px ${alpha(tint, 0.4)}`,
								opacity: settled,
							}}
						/>
					)
				})}
			{!playing && noteBox && step.key.note && (
				<Note
					text={step.key.note.text}
					box={[
						project([noteBox[0], noteBox[1]]),
						project([noteBox[0] + noteBox[2], noteBox[1] + noteBox[3]]),
					]}
					size={size}
					tint={tint}
					progress={settled}
				/>
			)}
		</div>
	)
}

/** A label pinned beside a control, kept inside the frame whichever side the control is on. */
function Note({
	text,
	box: [a, b],
	size,
	tint,
	progress,
}: {
	text: string
	box: [{ x: number; y: number }, { x: number; y: number }]
	size: { width: number; height: number }
	tint: string
	progress: number
}) {
	const margin = 24
	const below = b.y + 110 < size.height
	const rightHalf = (a.x + b.x) / 2 > size.width / 2
	return (
		<div
			style={{
				position: "absolute",
				...(rightHalf
					? { right: Math.max(margin, size.width - b.x) }
					: { left: Math.max(margin, a.x) }),
				...(below
					? { top: b.y + 18 }
					: { bottom: Math.max(margin, size.height - a.y + 18) }),
				maxWidth: Math.min(520, size.width - margin * 2),
				padding: "14px 20px",
				borderRadius: 14,
				background: alpha(color.raised, 0.96),
				color: color.ink,
				fontSize: 26,
				fontWeight: 600,
				lineHeight: 1.3,
				textWrap: "balance",
				boxShadow: `0 18px 40px rgba(0,0,0,0.5), inset 0 0 0 2px ${tint}`,
				opacity: progress,
				transform: `translateY(${(1 - progress) * (below ? -8 : 8)}px)`,
			}}
		>
			{text}
		</div>
	)
}
