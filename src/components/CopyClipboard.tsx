/* eslint-disable consistent-return */
import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import copy from "copy-to-clipboard";
import React, { PropsWithChildren, useCallback, useLayoutEffect } from "react";
import { cn } from "#/lib/utils";
import { useToast } from "#/hooks/useToast";

export function ClickToCopy({
  text,
  className,
  children,
}: PropsWithChildren<{
  className?: string;
  text: string;
}>) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  useLayoutEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      toast({
        title: "Copied to clipboard",
        variant: "default",
      });

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <div>
      <CopyToClipboard
        text={text}
        onCopy={() => setCopied(true)}
        className={cn("flex flex-row items-center", className)}
      >
        <>
          <span className="mr-1">{children}</span>
          <ClipboardCopyIcon
            width={18}
            height={18}
            className="text-foreground"
          />
        </>
      </CopyToClipboard>
    </div>
  );
}

function CopyToClipboard({ text, className, onCopy, children }) {
  const [copied, setCopied] = React.useState(false);

  useLayoutEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = useCallback(() => {
    copy(text);
    onCopy?.();
  }, [text, onCopy]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={cn("cursor-pointer", className)} onClick={handleCopy}>
      {children}
    </div>
  );
}
