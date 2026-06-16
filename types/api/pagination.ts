export type LaravelPaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type LaravelPaginationLinks = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

export type LaravelPaginated<T> = {
  data: T[];
  meta: LaravelPaginationMeta;
  links: LaravelPaginationLinks;
};

export type MemberPaginated<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
};
