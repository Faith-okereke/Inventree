import axios from "axios";

import type {
  CurrentUserResponse,
  ForgotPasswordResponse,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyPasswordResponse,
} from "@/types/auth";
import { api } from "./client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const loginService = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials);

  return response.data;
};

export const registerService = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/register`, credentials);
  return response.data;
};

export const forgotPasswordService = async (email: string): Promise<ForgotPasswordResponse> => {
  const response = await axios.post<ForgotPasswordResponse>(`${API_BASE_URL}/auth/forgot-password`, { email });
  return response.data;
};

export const resetPasswordService = async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
  const payload: ResetPasswordRequest = { token, newPassword };
  const response = await axios.post<ResetPasswordResponse>(`${API_BASE_URL}/auth/reset-password`, payload);
  return response.data;
};

export const verifyPasswordService = async (token: string): Promise<VerifyPasswordResponse> => {
  const response = await axios.get<VerifyPasswordResponse>(`${API_BASE_URL}/auth/verify-password`, {
    params: { token },
  });
  return response.data;
};

export const getMeService = async (): Promise<CurrentUserResponse> => {
  const response = await api.get<CurrentUserResponse>(`${API_BASE_URL}/auth/me`);
  return response.data;
};
