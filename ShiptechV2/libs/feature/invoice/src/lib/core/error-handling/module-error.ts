import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {

  static readonly LoadInvoiceListFailed = new ModuleError({
    code: ErrorCode.LoadInvoiceListFailed,
    message: 'Could not load invoice list. Please try again later.'
  });

  static readonly LoadInvoiceCompleteViewListFailed = new ModuleError({
    code: ErrorCode.LoadInvoiceCompleteViewListFailed,
    message: 'Could not load invoice complete view list. Please try again later.'
  });

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
