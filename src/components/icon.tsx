import { CircleQuestionMark } from "lucide-react"
import { ICONS } from "@/components/icons"

function resolve(name: string) {
	const value = name.trim().replace(/^lucide:/, "")
	return ICONS[value] ?? CircleQuestionMark
}

/** Drop-in for the old Iconify runtime icon: bundled SVG, same props. */
export function UiIcon({ icon, ...props }: { icon: string } & React.ComponentProps<"svg">) {
	const Component = resolve(icon)
	return <Component {...props} />
}

export default function Icon({
	icon,
	color,
	size = 20,
}: {
	icon: string
	color: string
	size?: number
}) {
	return (
		<div
			className="flex justify-center items-center rounded"
			style={{ width: size * 2, height: size * 2, backgroundColor: color }}
		>
			<UiIcon icon={icon} color="white" width={size} height={size} />
		</div>
	)
}
