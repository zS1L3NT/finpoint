import { useState } from "react"

export function useDialogCloseAnimation(isOpen: boolean, onOpenChange: (open: boolean) => void) {
	const [isClosing, setIsClosing] = useState(false)

	return {
		open: isOpen && !isClosing,
		setIsOpen: (open: boolean) => {
			setIsClosing(!open)
			if (open) onOpenChange(true)
		},
		onOpenChangeComplete: (open: boolean) => {
			if (!open) {
				// Parents may unmount the editor when the selection is cleared.
				onOpenChange(false)
				setIsClosing(false)
			}
		},
	}
}
