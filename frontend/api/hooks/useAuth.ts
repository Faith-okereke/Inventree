"use client";

import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";


import {
  forgotPasswordService,
  loginService,
  registerService,
  resetPasswordService,
  verifyPasswordService,
} from "../services/auth.service";
import { clearAuthSession, saveAuthSession } from "@/lib/auth/session";
import type {
  ForgotPasswordResponse,
  LoginCredentials,
  LoginResponse,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyPasswordResponse,
} from "@/types/auth";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth, setAuth } from "@/store/slices/auth.slice";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === "string") {
      return response.data.message;
    }
  }

  return "Something went wrong";
};

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation<LoginResponse, unknown, LoginCredentials>({
    mutationFn: loginService,
    onSuccess: (res) => {
      const authData = { token: res.token, user: res.user };
      saveAuthSession(authData);
      dispatch(setAuth(authData));
      toast.success("Login successful!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
      clearAuthSession();
      dispatch(clearAuth());
    },
  });
};

export const useRegister = () => {
  return useMutation<RegisterResponse, unknown, { name: string; email: string; password: string; role?: "admin" | "staff" }>({
    mutationFn: registerService,
    onSuccess: () => {
      toast.success("Account created successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};


export const useVerifyResetPassword = () => {
  return useMutation<VerifyPasswordResponse, unknown, string>({
    mutationFn: verifyPasswordService,
    onSuccess: () => {
      toast.success("Code verified successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, unknown, string>({
    mutationFn: forgotPasswordService,
    onSuccess: (res) => {
      toast.success(`Verification code sent! ${res.message}`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, unknown, ResetPasswordRequest>({
    mutationFn: ({ token, newPassword }) => resetPasswordService(token, newPassword),
    onSuccess: () => {
      toast.success("Password reset successful!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useAuth = useLogin;
