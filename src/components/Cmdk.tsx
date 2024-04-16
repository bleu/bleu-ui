import { CommandLoading } from "cmdk";
import { CircleIcon, FileIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import useSWR from "swr";
import {
  Button,
  ButtonProps,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "#/components/ui";
import { cn } from "#/lib/utils";
import { useDebounceValue } from "#/hooks/useDebounceValue";

interface CommandI {
  href: string;
  id?: string;
  result_type?: string;
  title: string;
  type?: string;
}

interface CommandMenuProps {
  commands?: {
    mainNav: CommandI[];
    sidebarNav: { items: CommandI[]; title: string }[];
  };
  fetcher?: (query: string) => Promise<CommandI[]>;
  icons?: Record<string, React.ComponentType<{ className: string }>>;
}

function useGlobalShortcut(setOpen, enableGlobalShortcut) {
  React.useEffect(() => {
    if (!enableGlobalShortcut) {
      return;
    }

    function handleKeyDown(e) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpen]);
}

const SharedCommandContent = ({
  searchResults,
  isLoading,
  icons,
  commands,
  runCommand,
}: Pick<CommandMenuProps, "commands" | "icons"> & {
  isLoading: boolean;
  runCommand: (href: string) => void;
  searchResults?: CommandI[];
}) => {
  const { t } = useTranslation();

  const commandFromNavs = (
    <>
      {commands?.mainNav && commands?.mainNav?.length > 0 && (
        <CommandGroup heading="Links">
          {commands.mainNav.map((navItem) => (
            <CommandItem
              key={navItem.href}
              value={navItem.title}
              onMouseDown={(e) => e.preventDefault()}
              onSelect={() => {
                runCommand(navItem.href);
              }}
            >
              <FileIcon className="mr-2 h-2 w-2" />
              {navItem.title}
            </CommandItem>
          ))}
        </CommandGroup>
      )}

      {commands?.sidebarNav && commands?.sidebarNav?.length > 0 && (
        <>
          <CommandSeparator />

          {commands.sidebarNav?.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(navItem.href);
                  }}
                >
                  <CircleIcon className="mr-2 h-2 w-2" />
                  {navItem.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </>
      )}
    </>
  );

  return (
    <>
      {isLoading || searchResults !== undefined ? (
        <>
          <CommandGroup heading={t("Search results")}>
            {isLoading && (
              <CommandLoading>
                <p className="text-muted-foreground">
                  <Trans>Loading...</Trans>
                </p>
              </CommandLoading>
            )}
            {searchResults?.map((result) => {
              const Icon = icons && result.type ? icons[result.type] : FileIcon;
              return (
                <CommandItem
                  key={result.href}
                  value={result.title}
                  onSelect={() => {
                    runCommand(result.href);
                  }}
                >
                  <Icon className="inline mr-1 h-2 w-2 stroke-1" />
                  <b className="inline">{result.result_type}</b> |{" "}
                  {result.title}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
        </>
      ) : null}

      <CommandEmpty>
        <Trans>No results found</Trans>.
      </CommandEmpty>

      {commandFromNavs}
    </>
  );
};

export const CommandMenu = ({
  commands,
  fetcher,
  icons,
  usePopover = false,
  enableGlobalShortcut = true,
  ...props
}: CommandMenuProps &
  ButtonProps & {
    enableGlobalShortcut?: boolean;
    usePopover?: boolean;
  }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue(search, 300);
  const { data: searchResults, isLoading } = fetcher
    ? useSWR<CommandI[]>(debouncedSearch, fetcher)
    : { data: undefined, isLoading: false };

  React.useEffect(() => {
    setDebouncedSearch(search);
  }, [search, setDebouncedSearch]);

  useGlobalShortcut(setOpen, enableGlobalShortcut);

  const runCommand = (href) => {
    setOpen(false);
    navigate(href);
  };

  return usePopover ? (
    <Popover {...props} open={open} onOpenChange={setOpen}>
      <Command className="w-[600px]">
        <PopoverAnchor asChild>
          <CommandInput
            placeholder={t("Type a command or search")}
            value={search}
            onValueChange={setSearch}
            className={cn(
              "text-muted-foreground justify-center text-sm inline-flex max-w-lg"
            )}
            onKeyDown={(e) => setOpen(e.key !== "Escape")}
            onMouseDown={() => setOpen((isOpen) => !!search && !isOpen)}
          />
        </PopoverAnchor>
        <PopoverContent
          className="w-[600px]"
          side="bottom"
          asChild
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (
              e.target instanceof Element &&
              e.target.hasAttribute("cmdk-input")
            ) {
              e.preventDefault();
            }
          }}
        >
          <CommandList>
            <SharedCommandContent
              searchResults={searchResults}
              isLoading={isLoading}
              icons={icons}
              commands={commands}
              runCommand={runCommand}
            />
          </CommandList>
        </PopoverContent>
      </Command>
    </Popover>
  ) : (
    <>
      <Button
        variant="outline"
        className="text-muted-foreground relative w-full justify-start text-sm sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">{t("Global search")}</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} loading={isLoading}>
        <CommandInput
          placeholder={t("Type a command or search")}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <SharedCommandContent
            searchResults={searchResults}
            isLoading={isLoading}
            icons={icons}
            commands={commands}
            runCommand={runCommand}
          />
        </CommandList>
      </CommandDialog>
    </>
  );
};
