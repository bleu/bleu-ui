import React from "react";

import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableSearch } from "./DataTableSearch";
import { DataTableFilters } from "./DataTableFilters";

export function DataTableToolbar({
  action,
  showViewOptions = true,
  searchKey = "name",
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-1 items-start space-x-2">
        <DataTableSearch searchKey={searchKey} />
        <DataTableFilters />
      </div>
      <div className="flex items-center space-x-2">
        {action}
        {showViewOptions && <DataTableViewOptions />}
      </div>
    </div>
  );
}
