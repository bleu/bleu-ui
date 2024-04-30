import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { PropsWithChildren } from "react";
import { cn } from "#/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      color: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success: "bg-green text-primary-foreground hover:bg-green/80",
        pending: "bg-orange text-primary-foreground hover:bg-orange/80",
      },
      outline: {
        none: "",
        outline: "border-2 hover:border-current/80", // General outline class, border color will match the `color` variant
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    compoundVariants: [
      {
        color: "primary",
        outline: "outline",
        className: "border-primary",
      },
      {
        color: "secondary",
        outline: "outline",
        className: "border-secondary",
      },
      {
        color: "destructive",
        outline: "outline",
        className: "border-destructive",
      },
      {
        color: "success",
        outline: "outline",
        className: "border-green",
      },
      {
        color: "pending",
        outline: "outline",
        className: "border-orange",
      },
    ],
    defaultVariants: {
      color: "primary",
      outline: "none",
      size: "xs",
    },
  }
);

export interface BadgeProps
  extends React.PropsWithChildren<
    VariantProps<typeof badgeVariants> & {
      className?: string;
    }
  > {}

const Badge = ({
  className,
  color,
  outline,
  size,
  ...props
}: PropsWithChildren<BadgeProps>) => (
  <div
    className={cn(badgeVariants({ color, outline, size }), className)}
    {...props}
  />
);

export { Badge, badgeVariants };
