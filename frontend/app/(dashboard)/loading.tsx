import { Card } from "@/components/ui/card";
import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";

/**
 * Streaming fallback for the dashboard segment. It renders inside the shell, so
 * the sidebar and topbar paint immediately while the page below resolves — the
 * layout never shifts when the real content lands.
 */
export default function DashboardLoading() {
  return (
    <>
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-28" />
            <Skeleton className="mt-2 h-3 w-16" />
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <TableSkeleton />
      </Card>
    </>
  );
}
