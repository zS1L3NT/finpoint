import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import type { Select as RadixSelect } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({ children, value, defaultValue, onValueChange, ...props }: React.ComponentProps<typeof RadixSelect.Root>) {
  const items: { value: string; label: React.ReactNode }[] = []
  const collect = (children: React.ReactNode) => React.Children.forEach(children, child => {
    if (!React.isValidElement<{ value?: string; children?: React.ReactNode }>(child)) return
    if (child.type === SelectItem && child.props.value !== undefined) items.push({ value: child.props.value, label: child.props.children })
    else collect(child.props.children)
  })
  collect(children)
  return <SelectPrimitive.Root {...props} modal={false} items={items} value={value === "" ? null : value} defaultValue={defaultValue === "" ? null : defaultValue} onValueChange={next => { if (next !== null) onValueChange?.(next) }}>{children}</SelectPrimitive.Root>
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadixSelect.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof RadixSelect.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof RadixSelect.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit min-w-0 max-w-full cursor-pointer items-center justify-between gap-1.5 rounded-md border border-border bg-input/20 bg-clip-padding px-2 py-1.5 text-xs/relaxed whitespace-nowrap transition-[color,background-color,border-color,box-shadow] duration-120 ease-out outline-none hover:bg-input/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-7 data-[size=sm]:h-6 *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon className="pointer-events-none size-3.5 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  collisionPadding = 8,
  variant = "default",
  ...props
}: React.ComponentProps<typeof RadixSelect.Content> & {
  variant?: "default" | "filter"
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner className="z-50" align={align} side={side} sideOffset={sideOffset} alignOffset={alignOffset} collisionPadding={collisionPadding} alignItemWithTrigger={false}>
      <SelectPrimitive.Popup
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "relative z-50 max-h-(--available-height) max-w-(--available-width) min-w-32 origin-(--transform-origin) overflow-x-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 ease-out data-[open]:duration-150 data-[closed]:duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-96 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-96 motion-reduce:animate-none",
          position === "popper" &&
            "min-w-[min(var(--anchor-width),var(--available-width))]",
          variant === "filter" &&
            "min-w-(--anchor-width) rounded-xl border border-border p-1 shadow-lg ring-0 [&_[data-slot=select-group]]:p-1 [&_[data-slot=select-item]]:px-2.5 [&_[data-slot=select-item]]:py-1.5 [&_[data-slot=select-item][data-state=checked]]:bg-accent [&_[data-slot=select-item][data-state=checked]]:text-accent-foreground",
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.List
          data-slot="select-viewport"
          data-position={position}
          className={cn(
            "max-h-[min(24rem,var(--available-height))] w-full min-w-0 max-w-(--available-width) overflow-y-auto overscroll-contain",
            position === "popper" && ""
          )}
        >
          {children}
        </SelectPrimitive.List>
        <SelectScrollDownButton />
      </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof RadixSelect.Label>) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadixSelect.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      label={props.textValue}
      render={(attributes, state) => <div {...attributes} data-state={state.selected ? "checked" : "unchecked"} />}
      className={cn(
        "relative flex min-h-7 w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText className="flex items-center gap-2">{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof RadixSelect.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-border/50",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof RadixSelect.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-pointer items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof RadixSelect.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-pointer items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
