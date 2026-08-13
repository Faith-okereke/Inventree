const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const decimal = new Intl.NumberFormat("en-US");

/**
 * Pinned to UTC on purpose. The fixtures are date-only strings, so formatting in
 * the viewer's zone could render the previous day on the client and disagree
 * with the server HTML.
 */
const shortDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** Intl instances are created once at module scope — they are expensive to build. */
export const formatCurrency = (value: number) => currency.format(value);
export const formatCompactCurrency = (value: number) =>
  compactCurrency.format(value);
export const formatNumber = (value: number) => decimal.format(value);
export const formatDate = (iso: string) => shortDate.format(new Date(iso));
export const formatPercent = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
