import { icons } from "@/components/ui/app-icon";
import type { Product } from "@/lib/data/types";

/**
 * Static UI fixtures matching the Figma frames. No API layer by request —
 * swap these reads for real calls when the backend is wired up.
 */
export const products: Product[] = [
  {
    sku: "BRG-7721-X",
    name: "Heavy Duty Ball Bearing Assembly",
    category: "Mechanical",
    price: 145,
    stock: 124,
    status: "In Stock",
    icon: icons.box,
  },
  {
    sku: "SRV-MTR-09",
    name: "Precision Servo Motor V2",
    category: "Electrical",
    price: 890.5,
    stock: 4,
    status: "Low Stock",
    icon: icons.settings,
  },
  {
    sku: "PNM-VLV-44",
    name: "Pneumatic Control Valve (Discontinued)",
    category: "Hydraulics",
    price: 210,
    stock: 0,
    status: "Out of Stock",
    icon: icons.compass,
    discontinued: true,
  },
  {
    sku: "CBL-CAT6-BL",
    name: "Industrial Ethernet Cable Spool (1000ft)",
    category: "Networking",
    price: 340,
    stock: 15,
    status: "In Stock",
    icon: icons.history,
  },
  {
    sku: "PCB-CTRL-A1",
    name: "Main Logic Controller Board",
    category: "Electronics",
    price: 1250,
    stock: 8,
    status: "In Stock",
    icon: icons.dashboard,
  },
  {
    sku: "SNS-LSR-99",
    name: "Long Range Laser Distance Sensor",
    category: "Sensors",
    price: 550.25,
    stock: 2,
    status: "Low Stock",
    icon: icons.search,
  },
  {
    sku: "MNT-BRK-ST",
    name: "Universal Steel Mounting Bracket",
    category: "Hardware",
    price: 45,
    stock: 350,
    status: "In Stock",
    icon: icons.panelLeft,
  },
];

export const productStats = [
  { label: "Total Products", value: "1,248" },
  { label: "Low Stock (≤5)", value: "42", tone: "warn" as const },
  { label: "Out of Stock", value: "18", tone: "danger" as const },
  { label: "Est. Inventory Value", value: "$2.4M" },
];

export const productCategories = [
  "Mechanical",
  "Electrical",
  "Hydraulics",
  "Networking",
  "Electronics",
  "Sensors",
  "Hardware",
] as const;

/** Matches the "Showing 1 to 6 of 245 entries" copy in the design. */
export const PRODUCTS_TOTAL_ENTRIES = 245;
