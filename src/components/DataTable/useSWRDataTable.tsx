import useSWR from "swr";
import { useTableState } from "./useTableState";
import { constructFullUrlWithParams } from "#/lib/constructFullUrlWithParams";

function formatRequestParams(originalObj) {
  return {
    ...originalObj,
    grouping: originalObj.grouping.length > 0 ? originalObj.grouping[0] : null,
    sorting: originalObj?.sorting?.length > 0 ? originalObj.sorting[0] : null,
    columnFilters: originalObj.columnFilters.reduce((acc, filter) => {
      acc[filter.id] = filter.value;
      return acc;
    }, {}),
  };
}

class FetchError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

const dataTableFetcher = async ([pathOrUrl, paramsObject]) => {
  const formattedParams = formatRequestParams(paramsObject);
  const fullUrl = constructFullUrlWithParams(pathOrUrl, formattedParams);
  const response = await fetch(fullUrl, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new FetchError("Failed to fetch", response);
  }
  return response.json();
};

export function useSWRDataTable(path, initialSearch = {}, options = {}) {
  const { tableState, setTableState } = useTableState(initialSearch);
  const { data, error, isLoading, mutate } = useSWR(
    [
      path,
      {
        pageIndex: tableState.pagination.pageIndex,
        pageSize: tableState.pagination.pageSize,
        sorting: tableState.sorting,
        columnFilters: tableState.columnFilters,
        grouping: tableState.grouping,
      },
    ],
    dataTableFetcher,
    { keepPreviousData: true, ...options }
  );

  return {
    data,
    error,
    isLoading,
    tableState,
    setTableState,
    mutate,
  };
}
