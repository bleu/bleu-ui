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

  const [grouping, setGrouping] = useState(initialState.grouping || []);

  const state = useMemo(
    () => ({
      pagination,
      rowSelection,
      columnVisibility,
      columnFilters,
      sorting,
      grouping,
    }),
    [
      pagination,
      rowSelection,
      columnVisibility,
      columnFilters,
      sorting,
      grouping,
    ]
  );

  const handlers = useMemo(
    () => ({
      setPagination,
      setRowSelection,
      setColumnVisibility,
      setColumnFilters,
      setSorting,
      setGrouping,
    }),
    [
      setPagination,
      setRowSelection,
      setColumnVisibility,
      setColumnFilters,
      setSorting,
      setGrouping,
    ]
  );

  return {
    tableState: state,
    setTableState: handlers,
  };
}
