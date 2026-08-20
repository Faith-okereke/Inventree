

/**
 * Static UI fixtures matching the Figma frames. No API layer by request —
 * swap these reads for real calls when the backend is wired up.
**/

export const productStats = [
  { label: "Total Products", value: "1,248" },
  { label: "Low Stock (≤5)", value: "42", tone: "warn" as const },
  { label: "Out of Stock", value: "18", tone: "danger" as const },
  { label: "Est. Inventory Value", value: "$2.4M" },
];


