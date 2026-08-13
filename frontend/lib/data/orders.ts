import type { Order } from "@/lib/data/types";

export const orders: Order[] = [
  {
    id: "ORD-7492",
    date: "2 hours ago",
    customer: "Acme Manufacturing Corp.",
    items: 14,
    total: 3450,
    status: "PENDING",
  },
  {
    id: "ORD-7491",
    date: "5 hours ago",
    customer: "Globex Logistics",
    items: 2,
    total: 120.5,
    status: "FULFILLED",
  },
  {
    id: "ORD-7490",
    date: "Yesterday",
    customer: "Stark Industries",
    items: 105,
    total: 24900,
    status: "PENDING",
  },
  {
    id: "ORD-7489",
    date: "Yesterday",
    customer: "Wayne Enterprises",
    items: 8,
    total: 1250.75,
    status: "CANCELLED",
  },
  {
    id: "ORD-7488",
    date: "Oct 24, 2023",
    customer: "Cyberdyne Systems",
    items: 42,
    total: 8750,
    status: "FULFILLED",
  },
  {
    id: "ORD-7487",
    date: "Oct 23, 2023",
    customer: "Massive Dynamic",
    items: 1,
    total: 55,
    status: "FULFILLED",
  },
];

export const ORDERS_TOTAL_ENTRIES = 245;
