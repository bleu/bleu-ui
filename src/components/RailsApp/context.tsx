import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

export function loadCSRFFromMetaTag() {
  if (window === undefined || window.document === undefined) {
    return "";
  }

  const metaTag = window.document.querySelector('meta[name="csrf-token"]');
  const content = metaTag?.getAttribute("content") || "";

  return content;
}

interface RailsAppContextProps {
  csrfToken: string;
}

export const RailsAppContext = createContext<RailsAppContextProps>({
  csrfToken: "",
});

export const RailsAppProvider = ({
  children,
  csrfToken,
}: PropsWithChildren<{ csrfToken?: string }>) => {
  const value = useMemo(
    () => ({ csrfToken: csrfToken || loadCSRFFromMetaTag() }),
    [csrfToken]
  );

  return (
    <RailsAppContext.Provider value={value}>
      {children}
    </RailsAppContext.Provider>
  );
};

export const useRailsApp = () => useContext(RailsAppContext);
