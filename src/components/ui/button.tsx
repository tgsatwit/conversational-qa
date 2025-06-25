import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "glass-primary text-primary-foreground hover:shadow-lg hover:shadow-blue-500/25",
        destructive:
          "glass-error text-destructive-foreground hover:shadow-lg hover:shadow-red-500/25",
        outline:
          "glass-button text-foreground hover:shadow-lg hover:shadow-black/10",
        secondary:
          "glass text-secondary-foreground hover:shadow-lg hover:shadow-black/10",
        ghost:
          "hover:glass-button hover:shadow-lg hover:shadow-black/10 text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "glass-success text-white hover:shadow-lg hover:shadow-green-500/25",
        warning: "glass-warning text-white hover:shadow-lg hover:shadow-yellow-500/25",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-5",
        sm: "h-8 rounded-lg gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
