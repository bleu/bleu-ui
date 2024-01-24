import React from "react";
import { cn } from "@/lib/utils";

import BlurredBackgroundLogo from "./BlurredBackgroundLogo";

export type DivProps = React.HTMLAttributes<HTMLDivElement>;

const Root = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "max-w-xs overflow-hidden rounded-xl bg-white pb-2 font-sans shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Root.displayName = "CardRoot";

const Logo = React.forwardRef<
  HTMLDivElement,
  { bgLogo?: string; className?: string; src: string }
>(({ className = "", bgLogo = null, src, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex min-h-[10rem] items-center justify-center",
      className
    )}
    {...props}
  >
    <BlurredBackgroundLogo.Root>
      <BlurredBackgroundLogo.Background src={bgLogo || src} />
      <BlurredBackgroundLogo.Logo
        src={src}
        className="rounded-md bg-white p-1"
      />
    </BlurredBackgroundLogo.Root>
    <div className="absolute left-[-10%] top-[-10%] h-[110%] w-[120%] max-w-[unset] border-2 border-dashed border-black/25" />
  </div>
));
Logo.displayName = "CardLogo";

const Header = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
Header.displayName = "CardHeader";

const Content = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={cn("px-3 py-1", className)} {...props}>
      {children}
    </div>
  )
);
Content.displayName = "CardContent";

const Title = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "no-outline mt-2 list-disc pl-4 text-left text-sm font-bold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Title.displayName = "CardTitle";

const Description = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-2 py-2 font-sans text-xs font-normal", className)}
      {...props}
    >
      {children}
    </div>
  )
);
Description.displayName = "CardDescription";

const Footer = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-2 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
);
Footer.displayName = "CardFooter";

export const Card = {
  Root,
  Header,
  Logo,
  Content,
  Title,
  Description,
  Footer,
};
