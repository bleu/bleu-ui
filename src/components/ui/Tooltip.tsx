import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "bleu-ui-z-50 bleu-ui-overflow-hidden bleu-ui-rounded-md bleu-ui-bg-primary bleu-ui-px-3 bleu-ui-py-1.5 bleu-ui-text-xs bleu-ui-text-primary-foreground bleu-ui-animate-in bleu-ui-fade-in-0 bleu-ui-zoom-in-95 data-[state=closed]:bleu-ui-animate-out data-[state=closed]:bleu-ui-fade-out-0 data-[state=closed]:bleu-ui-zoom-out-95 data-[side=bottom]:bleu-ui-slide-in-from-top-2 data-[side=left]:bleu-ui-slide-in-from-right-2 data-[side=right]:bleu-ui-slide-in-from-left-2 data-[side=top]:bleu-ui-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
