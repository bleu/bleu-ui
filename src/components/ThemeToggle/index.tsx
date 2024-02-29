import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import React from "react";
import { Trans } from "react-i18next";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui";
import { useTheme } from "./context";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === "dark" ? (
            <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : (
            <SunIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          )}
          <span className="sr-only">
            <Trans>Toggle theme</Trans>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Trans>Light</Trans>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Trans>Dark</Trans>
          <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
            <Trans>Beta</Trans>
          </span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export * from "./context";
