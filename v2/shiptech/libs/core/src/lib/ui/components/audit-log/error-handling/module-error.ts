import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {

  static readonly LoadAuditLogFailed = new AppError({
    code: ErrorCode.LoadAuditLogFailed,
    message: 'Could not load audit log list. Please try again later.'
  });

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
