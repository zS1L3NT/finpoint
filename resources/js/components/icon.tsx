import { Icon as IconifyIcon } from "@iconify/react"

const ICONIFY_PREFIX = "lucide"
const FALLBACK_ICON = `${ICONIFY_PREFIX}:circle-question-mark`

function toIconifyName(icon: string) {
	const value = icon.trim()

	if (!value) {
		return FALLBACK_ICON
	}

	return value.includes(":") ? value : `${ICONIFY_PREFIX}:${value}`
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
	const name = toIconifyName(icon)

	return (
		<div
			className="flex justify-center items-center rounded"
			style={{ width: size * 2, height: size * 2, backgroundColor: color }}
		>
			<IconifyIcon
				icon={name}
				color="white"
				width={size}
				height={size}
				fallback={
					name === FALLBACK_ICON ? null : (
						<IconifyIcon
							icon={FALLBACK_ICON}
							color="white"
							width={size}
							height={size}
						/>
					)
				}
			/>
		</div>
	)
}
