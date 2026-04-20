import { DynamicIcon, IconName, iconNames } from "lucide-react/dynamic"

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
			{iconNames.includes(icon as IconName) ? (
				<DynamicIcon name={icon as IconName} color="white" size={size} />
			) : null}
		</div>
	)
}
