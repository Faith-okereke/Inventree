export type AuthRole = "admin" | "staff";
export type AuthProvider = "local" | "google";

export interface AuthMembership {
  id: string;
  role: AuthRole;
  businessId: string;
  createdAt?: string;
  updatedAt?: string;
  business?: {
    id: string;
    name: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  provider: AuthProvider;
  providerId: string | null;
  avatar: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  memberships: AuthMembership[];
}

export interface Memberships {
  id: string;
  role: AuthRole;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse extends AuthUser {}

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

export interface AuthSession {
  token: string;
  user: AuthUser | null;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
