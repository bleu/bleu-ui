import React from "react";
import { Skeleton } from "./ui/Skeleton";

function BarSet() {
  return (
    <>
      <Skeleton className="h-48 w-10" />
      <Skeleton className="h-64 w-10" />
      <Skeleton className="h-56 w-10" />
      <Skeleton className="h-64 w-10" />
    </>
  );
}
export function ChartSkeleton({ barsSetCount = 3, className = "" }) {
  const barSet = new Array(barsSetCount).fill(null);

  return (
    <div className={`${className} p-4`}>
      <div className="flex flex-col items-center">
        <div className="flex items-end space-x-2">
          <span className="sr-only">Loading...</span>
          {barSet.map((_, barIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <BarSet key={barIndex} />
          ))}
        </div>
      </div>
    </div>
  );
}
