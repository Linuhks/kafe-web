import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/lib/types"

const statusStyles: Record<OrderStatus, string> = {
  RECEIVED:
    "bg-status-received/15 text-status-received border-status-received/30",
  IN_PREPARATION:
    "bg-status-in-preparation/15 text-status-in-preparation border-status-in-preparation/30",
  READY: "bg-status-ready/15 text-status-ready border-status-ready/30",
  DELIVERED:
    "bg-status-delivered/15 text-status-delivered border-status-delivered/30",
  CANCELLED:
    "bg-status-cancelled/15 text-status-cancelled border-status-cancelled/30",
}

const statusLabels: Record<OrderStatus, string> = {
  RECEIVED: "Received",
  IN_PREPARATION: "In Preparation",
  READY: "Ready",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
}

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  status,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    status?: OrderStatus
  }) {
  if (status) {
    return (
      <span
        data-slot="badge"
        className={cn(
          "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
          statusStyles[status],
          className
        )}
        {...props}
      >
        {statusLabels[status]}
      </span>
    )
  }

  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
