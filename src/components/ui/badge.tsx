import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        healthy: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
        degraded: "border-amber-500/40 bg-amber-500/15 text-amber-300",
        down: "border-red-500/40 bg-red-500/15 text-red-300",
        neutral: "border-zinc-700 bg-zinc-900 text-zinc-300",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
