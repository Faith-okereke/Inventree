import axios from "axios";

type ErrorResponseBody = {
  message?: unknown;
  error?: unknown;
};

export type ApiErrorDetails = {
  message: string;
  status?: number;
};

export function getApiErrorDetails(error: unknown): ApiErrorDetails {
  if (axios.isAxiosError<ErrorResponseBody>(error)) {
    const body = error.response?.data;
    const message =
      typeof body?.message === "string"
        ? body.message
        : typeof body?.error === "string"
          ? body.error
          : error.message;

    return {
      message: message || "Request failed",
      status: error.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Something went wrong. Please check your connection." };
}

export function getApiErrorMessage(error: unknown): string {
  const details = getApiErrorDetails(error);
  return details.status
    ? `${details.message}`
    : details.message;
}
