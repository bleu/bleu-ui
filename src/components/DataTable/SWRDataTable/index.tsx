/* eslint-disable no-restricted-syntax */
import React, { useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

import {
  Badge,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { SectionTitle } from "@/components/SectionTitle";
import { formatDate, formatDateTime } from "@/lib/formatDate";
import {
  serializeQuery,
  serializeQueryObject,
  deserializeQuery,
} from "@/lib/serializeQuery";
import { useTableState } from "./useTableState";
import { Link } from "@/components/Link";

import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import { DataTablePagination } from "@/components/DataTable/DataTablePagination";
import { DataTableRowActions } from "@/components/DataTable/DataTableRowActions";
import { DataTableToolbar } from "@/components/DataTable/DataTableToolbar";

function formatRequestParams(originalObj) {
  return {
    ...originalObj,
    columnFilters: originalObj.columnFilters.reduce((acc, filter) => {
      acc[filter.id] = filter.value;
      return acc;
    }, {}),
  };
}

const formatParamsToDataTable = (params, searchKey) => {
  const { columnFilters = {}, pageIndex, pageSize, sorting } = params;

  const sortingObj = sorting ? { sorting: [sorting] } : {};
  const columnFiltersObj =
    Object.keys(columnFilters).length > 0
      ? {
          columnFilters: Object.entries(columnFilters).map(([id, value]) => ({
            id,
            value: Array.isArray(value)
              ? value
              : id === searchKey
                ? value
                : [value],
          })),
        }
      : {};

  const to = {
    ...sortingObj,
    pagination: {
      pageIndex: pageIndex || 0,
      pageSize: !pageSize ? 10 : pageSize > 50 ? 50 : pageSize,
    },
    ...columnFiltersObj,
  };

  return to;
};

const fetcher = async ([url, paramsObject]) => {
  const formattedParams = formatRequestParams(paramsObject);
  // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
  const params = serializeQuery(formattedParams);
  const response = await fetch(`${url}?${params}`, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }
  return response.json();
};

const renderCell = ({ filters, column, row, selectedRows }) => {
  const value = row.getValue(column.columnDef.accessorKey);

  switch (column.columnDef.type) {
    case "text":
      return <div className="max-w-[400px] truncate">{value}</div>;
    case "boolean":
      return value ? (
        <CheckIcon className="size-4 bg-primary text-primary-foreground rounded-full" />
      ) : (
        <Cross2Icon className="size-4 text-muted-foreground" />
      );
    case "badge":
      // TODO: needs to be refactored
      switch (value) {
        case "draft":
          return <Badge variant="pending">Draft</Badge>;
        case "scheduled":
          return <Badge variant="successOutline">Scheduled</Badge>;
        case "active":
          return <Badge variant="success">Active</Badge>;
        case "ended":
          return <Badge variant="destructive">Ended</Badge>;
        default:
          if (column.columnDef.accessorKey !== "is_active") {
            return <Badge>{value}</Badge>;
          }

          // eslint-disable-next-line no-case-declarations
          const status = filters[0].options.find(
            // eslint-disable-next-line no-shadow
            (status) => status.value === row.getValue("is_active")
          );

          if (!status) {
            return null;
          }

          return (
            <Badge variant={status.value === false ? null : "destructive"}>
              {status.label}
            </Badge>
          );
      }
    case "date":
      return <div>{formatDate(value)}</div>;
    case "datetime":
      return <div>{formatDateTime(value)}</div>;
    case "number":
      return <div>{value}</div>;
    case "actions":
      return <DataTableRowActions row={row} column={column} />;
    case "image":
      return (
        <img
          className="aspect-ratio-1 size-16 rounded-sm object-contain"
          src={row.getValue("image").url}
          alt={row.getValue("name")}
        />
      );
    case "link":
      // eslint-disable-next-line no-case-declarations
      const url = row.getValue("details_url");
      if (!url) return <div>{value}</div>;
      return (
        <Link to={url}>
          <span className="underline">{value}</span>
        </Link>
      );

    case "selection":
      return (
        <Checkbox
          checked={selectedRows.some((r) => r.id === row.original.id)}
          onCheckedChange={(checkValue) => row.toggleSelected(!!checkValue)}
          aria-label="Select row"
        />
      );

    default:
      return null;
  }
};

const defaultFilterFn = (row, id, filterValue) =>
  row.getValue(id).includes(filterValue);

const buildColumns = (columnsConfig, filters, selectedRows) => {
  if (!columnsConfig) return [];

  return columnsConfig.map((columnConfig) => ({
    ...columnConfig,
    header: ({ column }) => (
      // @ts-expect-error TS(2741) FIXME: Property 'className' is missing in type '{ column:... Remove this comment to see the full error message
      <DataTableColumnHeader column={column} title={columnConfig.title} />
    ),
    cell: (rest) => renderCell({ filters, ...rest, selectedRows }),
    filterFn: columnConfig.filterable ? defaultFilterFn : null,
  }));
};

export function SWRDataTable({
  fetchPath,
  searchKey = "name",
  defaultParams = {},
  hasDetails = false,
  action,
  setSelectedData,
  selectedRows,
}: {
  action?: React.ReactNode;
  defaultParams?: Record<string, unknown>;
  fetchPath: string;
  hasDetails?: boolean;
  searchKey?: string;
  selectedRows?: any[];
  setSelectedData?: (data: any[]) => void;
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = {
    ...formatParamsToDataTable(
      deserializeQuery(searchParams.toString()),
      searchKey
    ),
    ...defaultParams,
  };

  const {
    pagination,
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
    setPagination,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    setSorting,
  } = useTableState({ ...initialSearch });

  const { pageIndex, pageSize } = pagination;

  useEffect(() => {
    const formattedParams = formatRequestParams({
      columnFilters,
      sorting,
      pageIndex,
      pageSize,
    });

    const params = serializeQueryObject(formattedParams);
    setSearchParams(params);
  }, [pageIndex, pageSize, sorting, columnFilters]);

  const { data, error } = useSWR(
    [fetchPath, { pageIndex, pageSize, sorting, columnFilters }],
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const columns = buildColumns(data?.columns, data?.filters, selectedRows);
  const filters = data?.filters;

  const table = useReactTable({
    data: data?.data ?? [],
    pageCount: Math.ceil((data?.total ?? 0) / pageSize),
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // TODO save selected rows independently of the table page

  useEffect(() => {
    if (setSelectedData)
      setSelectedData(
        table.getSelectedRowModel().flatRows.map((row) => row.original)
      );
  }, [rowSelection, table, setSelectedData]);

  if (error) {
    return (
      <div className="flex items-center justify-between space-y-2">
        <div>
          <SectionTitle>Something went wrong!</SectionTitle>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filters={filters}
        action={action}
        searchKey={searchKey}
      />
      <div className="rounded-md border dark:border-2">
        <Table>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (hasDetails) {
                      // @ts-expect-error TS(2339) FIXME: Property 'id' does not exist on type 'unknown'.
                      navigate(`${row.original.id}`);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
