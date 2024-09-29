export type PaginatedRequestProps = {
  q?: string;
  page: number;
  size: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  numberOfPages: number;
  hasNextPage: boolean;
}
