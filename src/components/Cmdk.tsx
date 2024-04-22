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
  commands?: CommandI[];
  fetcher?: (query: string) => Promise<CommandI[]>;
  icons?: Record<string, React.ComponentType<{ className: string }>>;
  placeholder?: string;
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

  const commandList = commands && commands?.length > 0 && (
    <CommandGroup heading="Links">
      {commands.map((navItem) => (
        <CommandItem
          key={navItem.href}
          value={navItem.title}
          onMouseDown={(e) => e.preventDefault()}
          onSelect={() => {
            runCommand(navItem.href);
          }}
        >
          <CircleIcon className="mr-2 h-2 w-2" />
          {navItem.title}
        </CommandItem>
      ))}
    </CommandGroup>
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
            <div className="grid grid-cols-[auto_1fr]">
              {searchResults?.map((result) => {
                const Icon =
                  icons && result.type ? icons[result.type] : FileIcon;

                return (
                  <CommandItem
                    key={result.href}
                    value={result.title}
                    onSelect={() => {
                      runCommand(result.href);
                    }}
                    className="grid grid-cols-subgrid col-span-2 gap-2"
                  >
                    <div>
                      <Icon className="inline-flex h-4 w-4 mr-1 stroke-1" />
                      <b>{result.result_type}</b>
                    </div>
                    <div>{result.title}</div>
                  </CommandItem>
                );
              })}
            </div>
          </CommandGroup>
          <CommandSeparator />
        </>
      ) : null}

      <CommandEmpty>
        <Trans>No results found</Trans>.
      </CommandEmpty>

      {commandList}
    </>
  );
};

export const CommandMenu = ({
  commands,
  fetcher,
  icons,
  placeholder,
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
      <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
        <PopoverAnchor asChild>
          <CommandInput
            placeholder={placeholder || t("Type a command or search")}
            value={search}
            onValueChange={setSearch}
            className={cn(
              "text-muted-foreground justify-center text-sm inline-flex",
              props.className
            )}
            onKeyDown={(e) => setOpen(e.key !== "Escape")}
            onMouseDown={() => setOpen((isOpen) => !!search && !isOpen)}
            loading={isLoading}
          />
        </PopoverAnchor>
        <PopoverContent
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
          placeholder={placeholder || t("Type a command or search")}
          value={search}
          onValueChange={setSearch}
          className={cn(props.className)}
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
