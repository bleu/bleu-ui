import React from "react";
import { KpiCard } from "#/components/ui/KpiCard";
import { Skeleton } from "#/components/ui";

export function KpiSkeleton() {
  return (
    <KpiCard>
      <KpiCard.Header>
        <KpiCard.Title>
          <Skeleton className="h-3.5 w-[100px]" />
        </KpiCard.Title>
        <Skeleton className="h-3.5 w-[100px]" />
      </KpiCard.Header>
      <KpiCard.Content className="text-3xl">
        <Skeleton className="h-3.5 w-[100px]" />
      </KpiCard.Content>
      <KpiCard.FooterNote>
        <Skeleton className="h-3.5 w-[100px]" />
      </KpiCard.FooterNote>
    </KpiCard>
  );
}
