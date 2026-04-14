import { DynamicIcon, IconName, iconNames } from "lucide-react/dynamic"
import React, { useEffect, useRef } from "react"

export default function Icon({
	name,
	icon,
	color,
	size = 20,
}: {
	name: string
	icon: string
	color: string
	size?: number
}) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (ref.current) {
			try {
				;new (window as any).bootstrap.Tooltip(ref.current)
			} catch {
				//
			}
		}
	}, [ref.current])

	return (
		<div
			ref={ref}
			className="d-flex justify-content-center align-items-center rounded-circle"
			style={{ width: size * 2, height: size * 2, backgroundColor: color }}
			data-bs-toggle="tooltip"
			data-bs-title={name}
		>
			{iconNames.includes(icon as IconName) ? (
				<DynamicIcon name={icon as IconName} color="white" size={size} />
			) : null}
		</div>
	)
}
