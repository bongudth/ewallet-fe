export type ApiMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type ApiResponseList<T> = T[];

export type ApiResponseData<T> = T;

export type ApiResponseErrorMessage = {
  error: string;
  message: string;
  statusCode: number;
};

export type ApiResponseError = {
  message: ApiResponseErrorMessage;
  statusCode: number;
  errors: Array<{
    field: string;
    code: string;
    message: string;
  }>;
  formErrors: Record<string, string>;
};

export type ApiResponseFile = {
  file_name: string;
};

export type ApiRequestParams = {
  page: number;
  limit: number;
  search: string | (string | null)[];
  filter: string[];
  sort: string[];
};
