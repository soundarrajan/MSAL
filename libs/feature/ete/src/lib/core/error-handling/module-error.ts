import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {
  // noinspection JSUnusedGlobalSymbols
  static readonly LoadPortCallListFailed = new ModuleError({
    code: ErrorCode.LoadPortCallListFailed,
    message: 'Could not load port call list. Please try again later.'
  });

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }

  static EteReportNotFound(reportId?: number): ModuleError {
    return new ModuleError({
      code: ErrorCode.PortCallNotFound,
      treatAsWarning: true,
      message: `Port Call${
        reportId ? ` with id ${reportId} ` : ' '
      }was not found.`
    });
  }

  static LoadReportDetailsFailed(reportId?: number): ModuleError {
    return new ModuleError({
      code: ErrorCode.LoadPortCallDetailsFailed,
      treatAsWarning: true,
      message: `Could not load details for Port Call with id '${reportId}'.`
    });
  }
}
