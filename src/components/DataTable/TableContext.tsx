import React from "react";

export const TableContext = React.createContext({});

export function useTableContext() {
  const context = React.useContext(TableContext);
  if (context === undefined) {
    throw new Error(
      "useMediaTableContext must be used within a MediaTableProvider"
    );
  }
  return context;
}
