import { icons } from "@/components/ui/app-icon";
import type {
  LowStockAlert,
  OrderStatusSlice,
  StatCard,
  TopProduct,
} from "@/lib/data/types";

export const overviewStats: StatCard[] = [
  {
    label: "Total Orders",
    value: "1,284",
    delta: "↑12%",
    deltaTone: "success",
    icon: icons.receipt,
  },
  {
    label: "Total Revenue",
    value: "$84.2K",
    delta: "↑4.1%",
    deltaTone: "success",
    icon: icons.wallet,
  },
  {
    label: "Pending Fulfillments",
    value: "142",
    delta: "Requires attention",
    deltaTone: "warn",
    icon: icons.truck,
  },
  {
    label: "Low Stock Items",
    value: "28",
    delta: "8 out of stock",
    deltaTone: "danger",
    icon: icons.alert,
  },
];

export const orderStatusBreakdown: OrderStatusSlice[] = [
  { label: "Fulfilled", percent: 65, colorVar: "var(--color-success-500)" },
  { label: "Pending", percent: 25, colorVar: "var(--color-warn-500)" },
  { label: "Cancelled", percent: 10, colorVar: "var(--color-brand-600)" },
];

export const ORDER_STATUS_TOTAL = 1284;

export const topMovingProducts: TopProduct[] = [
  { name: "Industrial Widget A", units: 842 },
  { name: "Heavy Duty Bearing", units: 620 },
  { name: "Aluminum Casing v2", units: 490 },
  { name: "Copper Coil Standard", units: 315 },
  { name: "Synthetic Lubricant Gal", units: 180 },
];

export const lowStockAlerts: LowStockAlert[] = [
  {
    sku: "SKU-7742",
    name: "Titanium Fastener 10mm",
    currentQty: 0,
    reorderPoint: 50,
    status: "Stock Out",
  },
  {
    sku: "SKU-8911",
    name: "Rubber Gasket Ring",
    currentQty: 2,
    reorderPoint: 25,
    status: "Low Stock",
  },
  {
    sku: "SKU-2204",
    name: "Circuit Board Micro-A",
    currentQty: 4,
    reorderPoint: 15,
    status: "Low Stock",
  },
  {
    sku: "SKU-5590",
    name: "Polymer Housing Cap",
    currentQty: 5,
    reorderPoint: 100,
    status: "Low Stock",
  },
];
