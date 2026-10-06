import { CircleQuestionMark, type LucideIcon } from "lucide-react"
import type { IconName } from "lucide-react/dynamic"
import dynamicIconImports from "lucide-react/dynamicIconImports"
import { useEffect, useState } from "react"
import { ICONS } from "@/components/icons"
import { cn } from "@/lib/utils"

export const ICON_NAMES = Object.keys(dynamicIconImports) as IconName[]

const iconNameSet = new Set<string>(ICON_NAMES)
const loadedIcons = new Map<IconName, LucideIcon>()
const loadingIcons = new Map<IconName, Promise<LucideIcon>>()

function normalize(name: string) {
	return name.trim().replace(/^lucide:/, "")
}

function loadIcon(name: IconName) {
	const loaded = loadedIcons.get(name)
	if (loaded) return Promise.resolve(loaded)

	const loading = loadingIcons.get(name)
	if (loading) return loading

	const promise = dynamicIconImports[name]()
		.then(module => {
			loadedIcons.set(name, module.default)
			loadingIcons.delete(name)
			return module.default
		})
		.catch(cause => {
			loadingIcons.delete(name)
			throw cause
		})
	loadingIcons.set(name, promise)
	return promise
}

export async function preloadCategoryIcons(icons: string[]) {
	await Promise.allSettled(
		[...new Set(icons.map(normalize))]
			.filter(name => !ICONS[name] && iconNameSet.has(name))
			.map(name => loadIcon(name as IconName)),
	)
}

function DynamicUiIcon({
	name,
	...props
}: { name: IconName } & Omit<React.ComponentProps<"svg">, "name">) {
	const [Component, setComponent] = useState<LucideIcon | null>(
		() => loadedIcons.get(name) ?? null,
	)
	// Fade in only when the icon resolves after mount, so cached icons never flash.
	const [resolvedLate, setResolvedLate] = useState(false)

	useEffect(() => {
		let cancelled = false
		loadIcon(name)
			.then(icon => {
				if (cancelled) return
				setResolvedLate(true)
				setComponent(() => icon)
			})
			.catch(() => undefined)
		return () => {
			cancelled = true
		}
	}, [name])

	// Reserve the icon's box while loading instead of flashing a question mark.
	if (!Component) return <svg aria-hidden {...props} />
	return (
		<Component
			{...props}
			className={cn(
				resolvedLate && "animate-in fade-in duration-150 ease-out",
				props.className,
			)}
		/>
	)
}

/** Drop-in for the old Iconify runtime icon: bundled SVG, same props. */
export function UiIcon({ icon, ...props }: { icon?: string | null } & React.ComponentProps<"svg">) {
	if (!icon?.trim()) return null
	const name = normalize(icon)
	const Component = ICONS[name]

	if (Component) return <Component {...props} />
	if (!iconNameSet.has(name)) return <CircleQuestionMark {...props} />
	const Loaded = loadedIcons.get(name as IconName)
	if (Loaded) return <Loaded {...props} />

	return <DynamicUiIcon key={name} {...props} name={name as IconName} />
}

export default function Icon({
	icon,
	color,
	size = 20,
}: {
	icon?: string | null
	color?: string | null
	size?: number
}) {
	return (
		<div
			className="flex justify-center items-center rounded"
			style={{ width: size * 2, height: size * 2, backgroundColor: color ?? undefined }}
		>
			<UiIcon
				icon={icon ?? "circle-question-mark"}
				color="white"
				width={size}
				height={size}
			/>
		</div>
	)
}
