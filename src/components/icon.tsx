import { CircleQuestionMark } from "lucide-react"
import { DynamicIcon, type IconName, iconNames } from "lucide-react/dynamic"
import { ICONS } from "@/components/icons"

export const ICON_NAMES = iconNames

const iconNameSet = new Set<string>(iconNames)

function normalize(name: string) {
	return name.trim().replace(/^lucide:/, "")
}

/** Drop-in for the old Iconify runtime icon: bundled SVG, same props. */
export function UiIcon({ icon, ...props }: { icon?: string | null } & React.ComponentProps<"svg">) {
	if (!icon?.trim()) return null
	const name = normalize(icon)
	const Component = ICONS[name]

	if (Component) return <Component {...props} />
	if (!iconNameSet.has(name)) return <CircleQuestionMark {...props} />

	return (
		<DynamicIcon
			{...props}
			name={name as IconName}
			fallback={() => <CircleQuestionMark {...props} />}
		/>
	)
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
