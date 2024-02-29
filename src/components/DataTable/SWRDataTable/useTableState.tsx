import { TableOptions } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export function useTableState(
  initialState: TableOptions<unknown[]>["state"] = {}
) {
  const [pagination, setPagination] = useState(
    initialState.pagination || { pageIndex: 0, pageSize: 10 }
  );
  const [rowSelection, setRowSelection] = useState(
    initialState.rowSelection || {}
  );
  const [columnVisibility, setColumnVisibility] = useState(
    initialState.columnVisibility || {}
  );
  const [columnFilters, setColumnFilters] = useState(
    initialState.columnFilters || []
  );
  const [sorting, setSorting] = useState(initialState.sorting || []);

  const state = useMemo(
    () => ({
      pagination,
      rowSelection,
      columnVisibility,
      columnFilters,
      sorting,
    }),
    [pagination, rowSelection, columnVisibility, columnFilters, sorting]
  );

  const handlers = useMemo(
    () => ({
      setPagination,
      setRowSelection,
      setColumnVisibility,
      setColumnFilters,
      setSorting,
    }),
    [
      setPagination,
      setRowSelection,
      setColumnVisibility,
      setColumnFilters,
      setSorting,
    ]
  );

  return { ...state, ...handlers };
}
