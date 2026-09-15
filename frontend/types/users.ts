import type { AuthUser } from "./auth";

export type UserResponse = AuthUser & {
  active: boolean;
  invitation: {
    id: string;
    email: string;
    status: "pending" | "accepted" | "revoked" | "expired" | "declined";
    createdAt: string;
  } | null;
};
