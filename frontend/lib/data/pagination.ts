/**
 * Rows per page for the client-side tables.
 *
 * The Figma frames read "Showing 1 to 6 of 245 entries" — 245 is placeholder
 * copy from the design file. With a fixed set of UI fixtures and no API, the
 * range and page count are computed from the rows actually present so the pager
 * works instead of dead-ending on page 2. Swap the fixture arrays for a real
 * response and the same components report the real totals.
 */
export const PAGE_SIZE = 6;

/** Slices `rows` to the current page, clamping a page that no longer exists. */
export function paginate<T>(rows: readonly T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;

  return {
    rows: rows.slice(start, start + PAGE_SIZE),
    page: safePage,
    totalPages,
    /** 1-based, inclusive, for the "Showing X to Y" label. */
    from: rows.length === 0 ? 0 : start + 1,
    to: Math.min(start + PAGE_SIZE, rows.length),
    total: rows.length,
  };
}
