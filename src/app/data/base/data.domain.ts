export const BASE_PATH = "https://datacare.staging.dvb.solutions";

export interface PaginationResponse<Dto> {
  count: number;
  elements: Dto[];
}

export interface Pagination {
  offset: number;
  limit: number;
}

export interface IdHolder<T> {
  id: T;
}
