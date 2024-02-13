import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useCommandState } from "cmdk";
import React from "react";
import {
  Badge,
  Button,
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const SubItem = ({ tags, onSelect, ...props }) => {
  const search = useCommandState((state) => state.search);
  if (!search) return null;

  const tagExists = tags.some((tag) => tag.value === search);
  if (tagExists) return null;

  return (
    <CommandItem onSelect={() => onSelect({ tag: search })} {...props}>
      {search}
    </CommandItem>
  );
};

export const TaggablePopover = ({ tags, selectedTags, onSelect }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="my-4 h-8 border-dashed dark:border-2"
      >
        <PlusCircledIcon className="mr-2 h-4 w-4" />
        Tags
        {selectedTags?.length > 0 && (
          <>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal lg:hidden"
            >
              {selectedTags.length}
            </Badge>
            <div className="hidden space-x-1 lg:flex">
              {selectedTags.length > 2 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedTags.length} tags
                </Badge>
              ) : (
                tags
                  .filter((option) => selectedTags.includes(option.value))
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))
              )}
            </div>
          </>
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0" align="start">
      <Command>
        <CommandInput placeholder="tags" />
        <CommandList>
          {tags
            .sort(
              (a, b) =>
                selectedTags.includes(b.value) -
                  selectedTags.includes(a.value) ||
                a.label.localeCompare(b.label)
            )
            .map((option) => {
              const isSelected = selectedTags.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={(tag) => onSelect({ tag })}
                >
                  <div
                    className={cn(
                      "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon className={cn("h-4 w-4")} />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          <SubItem tags={tags} onSelect={onSelect} />
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
);
