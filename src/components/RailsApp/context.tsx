import React, { createContext, useContext } from "react";

export const RailsAppContext = createContext("");

export const RailsAppProvider = ({ children, csrfToken }) => (
  <RailsAppContext.Provider value={csrfToken}>
    {children}
  </RailsAppContext.Provider>
);

export const useRailsApp = () => useContext(RailsAppContext);
