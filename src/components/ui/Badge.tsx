import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { PropsWithChildren } from "react";
import { cn } from "#/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-green dark:text-foreground text-primary-foreground hover:bg-green/80",
        outline: "text-foreground",
        pending:
          "border-transparent bg-orange dark:text-foreground text-primary-foreground hover:bg-orange/80",
        successOutline:
          "border-green border-2 text-green hover:border-green/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({
  className,
  variant,
  ...props
}: PropsWithChildren<BadgeProps>) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);

export { Badge, badgeVariants };
