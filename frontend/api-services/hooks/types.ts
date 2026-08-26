export type ApiEnvelope<T = unknown> = {
  status: number;
  data: T;
  pagination?: Pagination;
};

export type T_ApiResponse<T = unknown> = ApiEnvelope<T>;
export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
