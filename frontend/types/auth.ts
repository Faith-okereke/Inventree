export type AuthRole = "admin" | "staff";
export type AuthProvider = "local" | "google";

export interface AuthMembership {
  id: string;
  role: AuthRole;
  businessId: string;
  business?: {
    id: string;
    name: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: AuthRole;
  provider: AuthProvider;
  providerId: string | null;
  avatar: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  memberships: AuthMembership[];
}

export interface AuthSession {
  token: string;
  user: AuthUser | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  user: AuthUser;
  membership: AuthMembership;
}

export interface CurrentUserResponse {
  status: number;
  data: AuthUser;
}

export interface ApiErrorResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  status?: number;
  message: string;
}

export interface ResetPasswordResponse {
  status: number;
  message: string;
}

export interface VerifyPasswordResponse {
  valid: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
