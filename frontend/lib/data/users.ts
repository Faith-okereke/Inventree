import type { User } from "@/lib/data/types";

export const users: User[] = [
  {
    id: "u-1",
    name: "Eleanor Vance",
    email: "e.vance@inventree.co",
    role: "Admin",
    active: true,
    createdAt: "2023-10-12",
  },
  {
    id: "u-2",
    name: "Theodore Crain",
    email: "t.crain@inventree.co",
    role: "Staff",
    active: true,
    createdAt: "2023-11-05",
  },
  {
    id: "u-3",
    name: "Shirley Crain",
    email: "s.crain@inventree.co",
    role: "Staff",
    active: true,
    createdAt: "2023-11-20",
  },
  {
    id: "u-4",
    name: "Steven Crain",
    email: "st.crain@inventree.co",
    role: "Staff",
    active: false,
    createdAt: "2023-12-01",
  },
];

export const USERS_TOTAL_ENTRIES = 245;
