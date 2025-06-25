import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "glass-primary text-white border-blue-300/30",
        secondary:
          "glass text-foreground/80 border-white/30",
        destructive:
          "glass-error text-white border-red-300/30",
        outline:
          "glass border-white/30 text-foreground/80 hover:border-white/50",
        success:
          "glass-success text-white border-green-300/30",
        warning:
          "glass-warning text-white border-yellow-300/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
