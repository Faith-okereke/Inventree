export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T = unknown> = {
  status: number;
  data: T;
  pagination?: Pagination;
};
