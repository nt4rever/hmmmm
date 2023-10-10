export type PageMeta = {
  readonly page: number;
  readonly per_page: number;
  readonly item_count: number;
  readonly page_count: number;
  readonly has_next: boolean;
  readonly has_prev: boolean;
};

export type PaginateResponse<T> = {
  meta: PageMeta;
  items: T[];
};
