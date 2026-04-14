import { DynamicIcon, IconName, iconNames } from "lucide-react/dynamic"
import React from "react"

export default function Icon({ name, color }: { name: string; color: string }) {
	return (
		<div
			className="d-flex justify-content-center align-items-center rounded-circle"
			style={{ width: 40, height: 40, backgroundColor: color }}
		>
			{iconNames.includes(name as IconName) ? (
				<DynamicIcon name={name as IconName} color="white" size={20} />
			) : null}
		</div>
	)
}
