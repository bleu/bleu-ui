import React from "react";
import { cn } from "#/lib/utils";

type SectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className,
}) => (
  <h2
    className={cn(
      "pt-8 text-2xl font-bold tracking-tigh text-foreground",
      className
    )}
  >
    {children}
  </h2>
);
