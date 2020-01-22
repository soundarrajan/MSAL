import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {

  static readonly LoadEmailLogsFailed = new AppError({
    code: ErrorCode.LoadEmailLogsFailed,
    message: 'Could not load email list. Please try again later.'
  });

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
