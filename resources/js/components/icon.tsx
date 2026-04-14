import { DynamicIcon, IconName, iconNames } from "lucide-react/dynamic"
import React from "react"

export default function Icon({
	name,
	color,
	size = 20,
}: {
	name: string
	color: string
	size?: number
}) {
	return (
		<div
			className="d-flex justify-content-center align-items-center rounded-circle"
			style={{ width: size * 2, height: size * 2, backgroundColor: color }}
		>
			{iconNames.includes(name as IconName) ? (
				<DynamicIcon name={name as IconName} color="white" size={size} />
			) : null}
		</div>
	)
}
