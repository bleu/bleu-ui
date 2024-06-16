import React from "react";

import { cn } from "#/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/Card";
import { Skeleton } from "#/components/ui/Skeleton";

export function CardSkeleton({ className = "" }) {
  return (
    <Card className={cn("bg-background", className)}>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-2.5 w-3/4" />
        </CardTitle>
        <Skeleton className="h-2 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-2 w-full mb-2" />
        <Skeleton className="h-2 w-[85%] mb-2" />
        <Skeleton className="h-2 w-[90%]" />
      </CardContent>
      <CardDescription>
        <Skeleton className="h-10 w-full" />
      </CardDescription>
      <CardFooter>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20 ml-4" />
      </CardFooter>
    </Card>
  );
}
