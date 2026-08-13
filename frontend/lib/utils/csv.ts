/**
 * Client-side CSV export. The Export buttons in the design have no endpoint
 * behind them, and serialising rows the browser already has needs none.
 */

/** RFC 4180 quoting: wrap the cell only when it contains a delimiter or quote. */
function escapeCell(value: string | number) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/** Pure, so it can be unit-tested without a DOM. */
export function toCsv(
  headers: readonly string[],
  rows: readonly (readonly (string | number)[])[],
) {
  return [headers, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");
}

export function downloadCsv(filename: string, csv: string) {
  // Leading BOM so Excel opens it as UTF-8 rather than the local codepage.
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
