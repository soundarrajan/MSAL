import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {
  // noinspection JSUnusedGlobalSymbols

  static readonly LoadInvoiceListFailed = new ModuleError({
    code: ErrorCode.LoadInvoiceListFailed,
    message: 'Could not load invoice list. Please try again later.'
  });

  static readonly LoadControlTowerQuantityRobDifferenceFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerQuantityRobDifferenceFailed,
      message:
        'Could not load control tower quantity rob difference list. Please try again later.'
    }
  );

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
