"use client";

import { Pagination } from "@/components/ui/pagination";
import { useAppDispatch } from "@/store/hooks";
import { setPage, type TableId } from "@/store/slices/filters.slice";

export interface TableFooterProps {
  table: TableId;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** "Showing X to Y of N entries" plus the pager. Shared by all three tables. */
export function TableFooter({
  table,
  total,
  page,
  pageSize,
  totalPages,
}: TableFooterProps) {
  const dispatch = useAppDispatch();
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 px-4 py-3.5 sm:px-5">
      <p aria-live="polite" className="text-xs text-ink-500">
        Showing <span className="font-semibold text-ink-700">{from}</span> to{" "}
        <span className="font-semibold text-ink-700">{to}</span> of{" "}
        <span className="font-semibold text-ink-700">{total}</span> entries
      </p>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(next) => dispatch(setPage({ table, page: next }))}
      />
    </div>
  );
}
