"use client";

import { useEffect } from "react";

import { AppIcon, icons } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

/**
 * Segment-level boundary. `error.tsx` wraps the pages below it but not the layout
 * in the same segment, so a failure inside a page keeps the sidebar and topbar
 * on screen and the user keeps their place in the app.
 */
export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="animate-fade-up">
      <CardBody className="flex flex-col items-center gap-4 py-14 text-center">
        <span className="grid size-12 place-items-center rounded-xl bg-danger-50 text-danger-600">
          <AppIcon name={icons.alert} className="size-6" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink-900">
            This section didn&apos;t load
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Nothing else is affected — you can retry just this panel.
          </p>
        </div>
        <Button size="sm" onClick={retry}>
          Try again
        </Button>
      </CardBody>
    </Card>
  );
}
