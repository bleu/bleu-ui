/* eslint-disable no-restricted-syntax */
import React from "react";
import { flexRender } from "@tanstack/react-table";

import { TableHead, TableHeader, TableRow } from "#/components/ui";

import { useTableContext } from "../TableContext";

export function DataTableHeader() {
  // @ts-expect-error TS(2339) FIXME: Property 'table' does not exist on type '{}'.
  const { table } = useTableContext();

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}
