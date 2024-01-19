import { useMemo, useState } from "react";

export function useTableState(initialState = {}) {
  const [pagination, setPagination] = useState(
    // @ts-expect-error TS(2339) FIXME: Property 'pagination' does not exist on type '{}'.
    initialState.pagination || { pageIndex: 0, pageSize: 10 }
  );
  const [rowSelection, setRowSelection] = useState(
    // @ts-expect-error TS(2339) FIXME: Property 'rowSelection' does not exist on type '{}... Remove this comment to see the full error message
    initialState.rowSelection || {}
  );
  const [columnVisibility, setColumnVisibility] = useState(
    // @ts-expect-error TS(2339) FIXME: Property 'columnVisibility' does not exist on type... Remove this comment to see the full error message
    initialState.columnVisibility || []
  );
  const [columnFilters, setColumnFilters] = useState(
    // @ts-expect-error TS(2339) FIXME: Property 'columnFilters' does not exist on type '{... Remove this comment to see the full error message
    initialState.columnFilters || []
  );
  // @ts-expect-error TS(2339) FIXME: Property 'sorting' does not exist on type '{}'.
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
