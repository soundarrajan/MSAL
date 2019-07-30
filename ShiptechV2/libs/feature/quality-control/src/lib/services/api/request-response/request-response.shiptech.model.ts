export interface IBaseShiptechRequest {}

export interface IBaseShiptechResponse<T> {
  deletedCount: number;
  error: string;
  errorMessage: string;
  isAcknowledged: boolean;
  isModifiedCountAvailable: boolean;
  isSuccess: boolean;
  matchedCount: number;
  message: string;
  modifiedCount: number;
  payload: T[]
  status: number;
  upsertedId: number;
}
