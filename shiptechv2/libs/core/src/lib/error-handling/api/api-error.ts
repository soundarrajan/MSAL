export interface IApiError<T = any> {
  readonly developerMessage: string;
  readonly errorCode: number;
  readonly statusCode: number;
  readonly details?: T;
}

export enum ApiErrorCode {
  Mock = -1,
  Unknown = 0,

  LookupsItemsPropertyMissing = 10001
}

export class ApiError<T = any> implements IApiError<T> {
  // noinspection JSUnusedGlobalSymbols
  static readonly Unknown = new ApiError();
  static readonly MockError = new ApiError({
    errorCode: ApiErrorCode.Mock,
    developerMessage: 'Mock error.'
  });

  readonly developerMessage: string;
  readonly errorCode: number;
  readonly statusCode: number;
  readonly details?: T;

  constructor({
    errorCode,
    developerMessage,
    details,
    statusCode
  }: Partial<IApiError> = {}) {
    this.errorCode = errorCode || ApiErrorCode.Unknown;
    this.developerMessage =
      developerMessage ||
      'An unknown server error has occurred. Please try again later.';
    this.details = details;
    this.statusCode = statusCode || 500;
  }

  static LookupsItemsPropertyMissing(response: any): ApiError {
    return new ApiError({
      errorCode: ApiErrorCode.LookupsItemsPropertyMissing,
      developerMessage: `Response did not contain 'items' property.`,
      details: response
    });
  }

  static UnknownWithDetails<T = any>(details: T): ApiError<T> {
    return new ApiError<T>({ details });
  }
}
