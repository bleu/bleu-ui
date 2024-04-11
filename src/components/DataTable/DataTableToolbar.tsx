import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useEffect, useRef } from "react";

import { Trans, useTranslation } from "react-i18next";
import { Button, Input } from "#/components/ui";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { useTableContext } from "./TableContext";

export function DataTableToolbar({
  action,
  showViewOptions = true,
  searchKey = "name",
}) {
  // @ts-expect-error TS(2339) FIXME: Property 'table' does not exist on type '{}'.
  const { table, filters, searchKey: TableSeachKey } = useTableContext();

  const search = TableSeachKey || searchKey;

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

  const { t } = useTranslation();

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-1 items-start space-x-2">
        <Input
          placeholder={t("Search")}
          value={table.getColumn(search)?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn(search)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] dark:border-2"
        />
        <div className="flex flex-wrap gap-1">
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
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            <Trans>Reset</Trans>
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {action}
        {showViewOptions && <DataTableViewOptions />}
      </div>
    </div>
  );
}
