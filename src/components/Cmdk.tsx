import { CircleIcon, FileIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { CommandLoading } from "cmdk";
import useSWR from "swr";
import {
  Button,
  ButtonProps,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "#/components/ui";
import { cn } from "#/lib/utils";
import { useDebounceValue } from "#/hooks/useDebounceValue";

interface Command {
  href: string;
  id?: string;
  result_type?: string;
  title: string;
  type?: string;
}

interface CommandMenuProps {
  commands: {
    mainNav: Command[];
    sidebarNav?: { items: Command[]; title: string }[];
  };
  fetcher: (query: string) => Promise<Command[]>;
  icons?: Record<string, React.ComponentType<{ className: string }>>;
}

export function CommandMenu({
  commands,
  fetcher,
  className,
  icons,
  ...props
}: CommandMenuProps & ButtonProps) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue("", 300);
  const { data: searchResults, isLoading: loading } = useSWR<Command[]>(
    debouncedSearch,
    fetcher
  );

  React.useEffect(() => {
    setDebouncedSearch(search);
  }, [search]);

  const { t } = useTranslation();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          className,
          "text-muted-foreground relative w-full justify-start text-sm sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="inline-flex">{t("Global search")}</span>
        <kbd className="bg-muted top- pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} loading={loading}>
        <CommandInput
          placeholder={t("Type a command or search")}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>
            <Trans>No results found</Trans>.
          </CommandEmpty>

          {loading || searchResults !== undefined ? (
            <>
              {" "}
              <CommandGroup heading={t("Search results")}>
                {loading && (
                  <CommandLoading>
                    <p className="text-muted-foreground">
                      <Trans>Loading...</Trans>
                    </p>
                  </CommandLoading>
                )}{" "}
                {searchResults?.map((result) => {
                  const Icon =
                    icons && result.type ? icons[result.type] : FileIcon;

                  return (
                    <CommandItem
                      key={result.href}
                      value={result.title}
                      onSelect={() => {
                        runCommand(() => navigate(result.href));
                      }}
                    >
                      <p>
                        <Icon className="inline mr-1 h-2 w-2 stroke-1" />
                        <b className="inline">{result.result_type}</b> |{" "}
                        {result.title}
                      </p>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
            </>
          ) : (
            ""
          )}
          <CommandGroup heading="Links">
            {commands.mainNav.map((navItem) => (
              <CommandItem
                key={navItem.href}
                value={navItem.title}
                onSelect={() => {
                  runCommand(() => navigate(navItem.href));
                }}
              >
                <FileIcon className="mr-2 h-2 w-2" />
                {navItem.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          {commands.sidebarNav?.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => navigate(navItem.href));
                  }}
                >
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                    <CircleIcon className="h-3 w-3" />
                  </div>
                  {navItem.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
