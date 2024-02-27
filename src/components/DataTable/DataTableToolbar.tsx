import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useEffect, useRef } from "react";
import { Button, Input } from "@/components/ui";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";

export function DataTableToolbar({
  table,
  filters,
  action,
  searchKey = "name",
}) {
  if (!table || !filters) {
    return null;
  }

  const isFiltered =
    table.getState().columnFilters.filter((filter) => filter.value.length > 0)
      .length > 0;

  const initialFilterSet = useRef(false);

  useEffect(() => {
    if (filters && !initialFilterSet.current) {
      filters.map((filter) => {
        const column = table.getColumn(filter.value);
        if (column) {
          column.setFilterValue(
            filter.options
              .filter((option) => option.defaultSelected)
              .map((option) => option.value)
          );
        }
        return null;
      });
      initialFilterSet.current = true;
    }
  }, [filters, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={table.getColumn(searchKey)?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] dark:border-2"
        />
        {filters.map(
          (filter) =>
            table.getColumn(filter.value) && (
              <DataTableFacetedFilter
                key={filter.title}
                column={table.getColumn(filter.value)}
                title={filter.title}
                options={filter.options}
              />
            )
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {action}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
