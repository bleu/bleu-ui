import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { SectionTitle } from "@/components/SectionTitle";
import { formatDate } from "@/lib/formatDate";
import { serializeQuery } from "@/lib/serializeQuery";
import { useTableState } from "./useTableState";

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

const renderCell = ({ filters, column, row }) => {
  const value = row.getValue(column.columnDef.accessorKey);

  switch (column.columnDef.type) {
    case "text":
      return <div>{value}</div>;
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
    case "number":
      return <div>{value}</div>;
    case "actions":
      return <DataTableRowActions row={row} column={column} />;
    case "image":
      return (
        <img
          className="aspect-ratio-1 h-16 w-16 rounded-sm"
          src={row.getValue("image").url}
          alt={row.getValue("name")}
        />
      );

    default:
      return null;
  }
};

const defaultFilterFn = (row, id, filterValue) =>
  row.getValue(id).includes(filterValue);

const buildColumns = (columnsConfig, filters) => {
  if (!columnsConfig) return [];

  return columnsConfig.map((columnConfig) => ({
    ...columnConfig,
    header: ({ column }) => (
      // @ts-expect-error TS(2741) FIXME: Property 'className' is missing in type '{ column:... Remove this comment to see the full error message
      <DataTableColumnHeader column={column} title={columnConfig.title} />
    ),
    cell: (rest) => renderCell({ filters, ...rest }),
    filterFn: columnConfig.filterable ? defaultFilterFn : null,
  }));
};

export function SWRDataTable({
  fetchPath,
  searchKey = "name",
  defaultParams = {},
  hasDetails = false,
  action,
}) {
  const navigate = useNavigate();
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
  } = useTableState(defaultParams);

  const { pageIndex, pageSize } = pagination;

  const { data, error } = useSWR(
    [fetchPath, { pageIndex, pageSize, sorting, columnFilters }],
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const columns = buildColumns(data?.columns, data?.filters);
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
