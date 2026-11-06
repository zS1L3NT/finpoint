import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DriveOverwriteConfirmation({
	isOpen,
	setIsOpen,
	onConfirm,
}: {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	onConfirm: () => void
}) {
	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Replace the Google Drive backup?</AlertDialogTitle>
					<AlertDialogDescription>
						This replaces the Finpoint data in Google Drive with the data on this
						browser. Changes that exist only in Drive will be lost.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={onConfirm}>
						Replace Drive backup
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
