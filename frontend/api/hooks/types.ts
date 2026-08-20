export type ApiEnvelope<T = unknown> = {
  status: number;
  data: T;
};

export type T_ApiResponse<T = unknown> = ApiEnvelope<T>;