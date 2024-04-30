import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "#/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 rounded-md bg-primary/80 px-3 py-1.5 text-xs max-w-96 text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

function Tooltip({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipPrimitive.TooltipContentProps & TooltipPrimitive.TooltipProps) {
  if (!content) return children;

  return (
    <TooltipProvider>
      <TooltipRoot
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top" align="center" {...props}>
          {/* eslint-disable-next-line react/no-danger */}
          <span dangerouslySetInnerHTML={{ __html: content }} />
          {/* <TooltipPrimitive.Arrow color="primary" width={11} height={5} /> */}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
export {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
};
