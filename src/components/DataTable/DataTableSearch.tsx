import React from "react";

import { useTranslation } from "react-i18next";
import { Input } from "#/components/ui";

import { useTableContext } from "./TableContext";

export function DataTableSearch({ searchKey = "name", placeholder = "" }) {
  // @ts-expect-error TS(2339) FIXME: Property 'table' does not exist on type '{}'.
  const { table, searchKey: TableSeachKey } = useTableContext();

  const search = TableSeachKey || searchKey;

  const { t } = useTranslation();

  return (
    <Input
      placeholder={placeholder || t("Search")}
      value={table.getColumn(search)?.getFilterValue() ?? ""}
      onChange={(event) =>
        table.getColumn(search)?.setFilterValue(event.target.value)
      }
      className="h-8 w-[150px] lg:w-[250px] dark:border-2"
    />
  );
}
