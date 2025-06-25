import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none glass border-white/30 placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30 aria-invalid:ring-destructive/20 aria-invalid:border-destructive/50 flex field-sizing-content min-h-20 w-full rounded-xl border px-4 py-3 text-base transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-white/50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
