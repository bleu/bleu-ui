import React from "react";

import { cn } from "#/lib/utils";
import { Card } from "#/components/ui/Card";
import { Skeleton } from "#/components/ui/Skeleton";

export function CardSkeleton({ className = "" }) {
  return (
    <Card.Root className={cn("bg-background", className)}>
      <Card.Header>
        <Card.Title>
          <Skeleton className="h-2.5 w-3/4" />
        </Card.Title>
        <Skeleton className="h-2 w-1/2" />
      </Card.Header>
      <Card.Content>
        <Skeleton className="h-2 w-full mb-2" />
        <Skeleton className="h-2 w-[85%] mb-2" />
        <Skeleton className="h-2 w-[90%]" />
      </Card.Content>
      <Card.Description>
        <Skeleton className="h-10 w-full" />
      </Card.Description>
      <Card.Footer>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20 ml-4" />
      </Card.Footer>
    </Card.Root>
  );
}
