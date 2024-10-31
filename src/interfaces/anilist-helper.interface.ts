interface SearchVariables {
  page?: number;
  perPage?: number;
  sort?: string;
  search?: string;
  onList?: boolean;
  status?: string;
  status_not?: string;
  season?: string;
  year?: number;
  genre?: string;
  format?: string;
}

export type { SearchVariables };
