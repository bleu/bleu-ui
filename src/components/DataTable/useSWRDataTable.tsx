import useSWR from "swr";
import { useTableState } from "./useTableState";
import { constructFullUrlWithParams } from "#/lib/constructFullUrlWithParams";

function formatRequestParams(originalObj) {
  return {
    ...originalObj,
    sorting: originalObj?.sorting?.length > 0 ? originalObj.sorting[0] : null,
    columnFilters: originalObj.columnFilters.reduce((acc, filter) => {
      acc[filter.id] = filter.value;
      return acc;
    }, {}),
  };
}

const dataTableFetcher = async ([url, paramsObject]) => {
  const formattedParams = formatRequestParams(paramsObject);

  const fullUrl = constructFullUrlWithParams(url, formattedParams);

  const response = await fetch(fullUrl, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }
  return response.json();
};

export function useSWRDataTable(path, initialSearch = {}, options = {}) {
  const { tableState, setTableState } = useTableState({ ...initialSearch });

  const { data, error, isLoading } = useSWR(
    [
      path,
      {
        pageIndex: tableState.pagination.pageIndex,
        pageSize: tableState.pagination.pageSize,
        sorting: tableState.sorting,
        columnFilters: tableState.columnFilters,
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
  };
}
