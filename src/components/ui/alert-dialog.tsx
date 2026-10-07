"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
	return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
	return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogPortal({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
	return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
	return (
		<AlertDialogPrimitive.Overlay
			data-slot="alert-dialog-overlay"
			className={cn(
				"fixed inset-0 isolate z-50 bg-black/20 ease-out data-[state=open]:duration-200 data-[state=closed]:duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none",
				className,
			)}
			{...props}
		/>
	)
}

function AlertDialogContent({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				data-slot="alert-dialog-content"
				className={cn(
					"fixed inset-x-3 top-1/2 z-50 grid max-h-[calc(100svh-1.5rem)] min-w-0 -translate-y-1/2 gap-4 overflow-x-hidden overflow-y-auto rounded-xl bg-popover p-4 text-sm text-popover-foreground shadow-2xl ring-1 ring-foreground/10 ease-out outline-none data-[state=open]:duration-220 data-[state=closed]:duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-96 data-[state=open]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-98 motion-reduce:animate-none [&>*]:min-w-0 md:right-auto md:left-1/2 md:max-h-[calc(100svh-2rem)] md:w-full md:max-w-sm md:-translate-x-1/2",
					className,
				)}
				{...props}
			/>
		</AlertDialogPortal>
	)
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-dialog-header"
			className={cn("flex min-w-0 flex-col gap-2", className)}
			{...props}
		/>
	)
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-dialog-footer"
			className={cn(
				"-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	)
}

function AlertDialogTitle({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			className={cn("cn-font-heading text-base leading-none font-medium break-words", className)}
			{...props}
		/>
	)
}

function AlertDialogDescription({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			className={cn("text-sm text-muted-foreground break-words", className)}
			{...props}
		/>
	)
}

function AlertDialogAction({
	className,
	variant = "default",
	size = "default",
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
	Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
	return (
		<Button variant={variant} size={size} asChild>
			<AlertDialogPrimitive.Action
				data-slot="alert-dialog-action"
				className={cn(className)}
				{...props}
			/>
		</Button>
	)
}

function AlertDialogCancel({
	className,
	variant = "outline",
	size = "default",
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
	Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
	return (
		<Button variant={variant} size={size} asChild>
			<AlertDialogPrimitive.Cancel
				data-slot="alert-dialog-cancel"
				className={cn(className)}
				{...props}
			/>
		</Button>
	)
}

export {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogTitle,
	AlertDialogTrigger,
}
