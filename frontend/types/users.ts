import type { AuthUser } from "./auth";

export type UserResponse = AuthUser & {
  active: boolean;
};
