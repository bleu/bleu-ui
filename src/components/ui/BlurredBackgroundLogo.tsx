import React from "react";
import { cn } from "@/lib/utils";

const Root = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-full min-h-[10rem] w-full items-center justify-center overflow-hidden",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

const Background = React.forwardRef(
  ({ className = "", src, ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt="background"
      style={{ filter: "blur(80px)", transform: "scale(2)" }}
      className={cn(
        "absolute h-[500%] w-[500%] max-w-[unset] object-cover opacity-100",
        className
      )}
      {...props}
    />
  )
);

const Logo = React.forwardRef(({ className = "", src, ...props }, ref) => (
  <img
    ref={ref}
    src={src}
    alt="logo"
    style={{ zIndex: 1 }}
    className={cn("max-h-28 w-full max-w-[18rem] object-contain", className)}
    {...props}
  />
));

const BlurredBackgroundLogo = {
  Root,
  Background,
  Logo,
};

export default BlurredBackgroundLogo;
