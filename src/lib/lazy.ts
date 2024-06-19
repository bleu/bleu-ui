import React from "react";

export const lazy = (componentImportFn: Function) =>
  React.lazy(async () => {
    const obj = await componentImportFn();
    return typeof obj.default === "function" ? obj : obj.default;
  });
