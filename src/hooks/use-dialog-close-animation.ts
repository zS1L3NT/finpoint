import { useState } from "react"

export function useDialogCloseAnimation(isOpen: boolean, onOpenChange: (open: boolean) => void) {
	const [isClosing, setIsClosing] = useState(false)
	// AnimatePresence can retain the parent's last open props during its own exit.
	// Keep the close latched until the parent actually supplies a closed state.
	if (isClosing && !isOpen) setIsClosing(false)

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
			}
		},
	}
}
