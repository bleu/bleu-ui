import * as React from "react";
import { cn } from "#/lib";

const KpiCard = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    {...props}
    className={cn(
      "mb-2 flex w-full flex-col rounded-md border dark:border-2 bg-background p-4 shadow-sm hover:shadow-lg",
      className
    )}
  >
    {children}
  </div>
);

const Header = ({
  children,
  className,
}: React.PropsWithChildren<{
  className?: string;
}>) => (
  <div className={cn("mb-1 flex justify-between items-center", className)}>
    {children}
  </div>
);

const Title = ({
  children,
  className,
}: React.PropsWithChildren<{
  className?: string;
}>) => (
  <span className={cn("text-base text-foreground", className)}>{children}</span>
);

const Content = ({
  children,
  className,
}: React.PropsWithChildren<{
  className?: string;
}>) => (
  <div className={cn("mb-1 flex flex-col", className)}>
    <span className={cn("text-xl font-bold text-foreground", className)}>
      {children}
    </span>
  </div>
);

const FooterNote = ({
  children,
  className,
}: React.PropsWithChildren<{
  className?: string;
}>) => (
  <span className={cn("text-xs text-muted-foreground", className)}>
    {children}
  </span>
);

KpiCard.Header = Header;
KpiCard.Title = Title;
KpiCard.Content = Content;
KpiCard.FooterNote = FooterNote;

export default KpiCard;
