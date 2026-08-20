export type AuthRole = "admin" | "staff";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  deletedAt: string | null;
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
  role?: AuthRole;
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

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
