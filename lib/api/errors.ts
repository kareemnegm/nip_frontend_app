export type ApiValidationErrors = Record<string, string[]>;

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: ApiValidationErrors;

  constructor(
    message: string,
    status: number,
    errors?: ApiValidationErrors,
    code?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getFieldError(
  errors: ApiValidationErrors | undefined,
  field: string,
): string | undefined {
  return errors?.[field]?.[0];
}
