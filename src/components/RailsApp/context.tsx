import React, { PropsWithChildren, createContext, useContext } from "react";

export const RailsAppContext = createContext("");

export const RailsAppProvider = ({
  children,
  csrfToken,
}: PropsWithChildren<{ csrfToken: string }>) => (
  <RailsAppContext.Provider value={csrfToken}>
    {children}
  </RailsAppContext.Provider>
);

export const useRailsApp = () => useContext(RailsAppContext);
