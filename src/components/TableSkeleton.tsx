/* eslint-disable react/no-array-index-key */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/Table";
import { Skeleton } from "./ui/Skeleton";

export function TableSkeleton({
  rowsCount = 4,
  columnsCount = 4,
  className = "",
}) {
  const columns = new Array(columnsCount).fill(null);
  const rows = new Array(rowsCount).fill(null);

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((_, columnIndex) => (
              <TableHead
                key={columnIndex}
                className={columnIndex === columnsCount - 1 ? "text-right" : ""}
              >
                <Skeleton className="h-3.5 w-[100px]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((v, columnIndex) => (
                <TableCell
                  key={columnIndex}
                  className={
                    columnIndex === columnsCount - 1 ? "text-right" : ""
                  }
                >
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
