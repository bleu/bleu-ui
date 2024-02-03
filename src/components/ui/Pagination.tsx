import React from "react";

import { Button } from "./Button";

export function Pagination({
  page,
  pageSize,
  totalItems,
  handleNext,
  handlePrev,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const firstItem = pageSize * (page - 1) + 1;
  const lastItem = Math.min(pageSize * page, totalItems);

  return (
    <nav
      className="mx-auto flex w-full items-center justify-between border-t border-gray-200 bg-white px-28 py-3 sm:px-28"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{firstItem}</span> to{" "}
          <span className="font-medium">{lastItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 sm:justify-end">
        <Button onClick={() => handlePrev(page)} disabled={Number(page) === 1}>
          Previous
        </Button>
        <Button
          onClick={() => handleNext(page)}
          disabled={Number(page) === totalPages}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
