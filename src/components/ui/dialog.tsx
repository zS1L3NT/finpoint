"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollBar } from "@/components/ui/scroll-area"

function Dialog({ onOpenChange, ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} onOpenChange={(open, details) => {
    // Radix sheets are portalled outside the Base UI dialog tree. Let the
    // focused sheet handle Escape before closing its underlying editor.
    if (!open && details.reason === "escape-key" && details.event.target instanceof Element && details.event.target.closest('[data-slot="sheet-content"]')) {
      details.cancel()
      details.allowPropagation()
      return
    }
    onOpenChange?.(open, details)
  }} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/50 transition-opacity duration-200 ease-out data-ending-style:duration-150 starting:opacity-0 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-[50vw] z-50 grid max-h-[calc(100svh-1.5rem)] min-w-0 w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-x-hidden overflow-y-auto rounded-xl has-[>[data-slot=dialog-body]]:grid-rows-[auto_minmax(0,1fr)_auto] has-[>[data-slot=dialog-body]]:overflow-y-hidden bg-popover p-4 text-sm text-popover-foreground shadow-2xl ring-1 ring-foreground/10 outline-none transition-[opacity,transform] duration-200 ease-out data-ending-style:duration-150 starting:opacity-0 data-starting-style:opacity-0 data-ending-style:opacity-0 starting:transform-[translateY(6px)] data-starting-style:transform-[translateY(6px)] data-ending-style:transform-[translateY(6px)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:starting:transform-none motion-reduce:data-starting-style:transform-none motion-reduce:starting:opacity-100 motion-reduce:data-starting-style:opacity-100 [&>*]:min-w-0 md:max-h-[calc(100svh-2rem)] md:w-[calc(100vw-2rem)] md:max-w-sm",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" render={<Button variant="ghost" className="absolute top-2 right-2" size="icon-sm"><XIcon /><span className="sr-only">Close</span></Button>} />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

/** Scrolls between a pinned header and footer with an always-drawn scrollbar, so tall forms show they continue. */
function DialogBody({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="dialog-body"
      type="always"
      className="relative -mx-4 -my-1 min-h-0"
    >
      <ScrollAreaPrimitive.Viewport
        className={cn("size-full overscroll-contain px-4 py-1 [&>div]:block!", className)}
        {...props}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar className="data-vertical:w-2 [&>[data-slot=scroll-area-thumb]]:bg-muted-foreground/40" />
    </ScrollAreaPrimitive.Root>
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        // Sticky so the actions stay reachable when a tall dialog scrolls (offset by the
        // dialog's padding to sit flush); the tint is mixed opaque so fields scrolling
        // underneath do not show through.
        "sticky -bottom-4 z-10 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-[color-mix(in_oklab,var(--muted)_50%,var(--popover))] p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline">Close</Button>} />
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "cn-font-heading text-base leading-none font-medium break-words",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground break-words *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
