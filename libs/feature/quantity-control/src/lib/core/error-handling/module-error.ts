import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {
  // noinspection JSUnusedGlobalSymbols
  static readonly LoadPortCallListFailed = new ModuleError({
    code: ErrorCode.LoadPortCallListFailed,
    message: 'Could not load port call list. Please try again later.'
  });

  static PortCallNotFound(portCallId?: string): ModuleError {
    return new ModuleError({
      code: ErrorCode.PortCallNotFound,
      treatAsWarning: true,
      message: `Port Call${portCallId ? ` with id ${portCallId} ` : ' '}was not found.`
    });
  }

  static InvalidPortCallId(portCallId: string): ModuleError {
    return new ModuleError({
      code: ErrorCode.InvalidPortCallId,
      treatAsWarning: true,
      message: `Invalid Port Call id format '${portCallId}'.`
    });
  }

  static LoadPortCallDetailsFailed(portCallId?: string): ModuleError {
    return new ModuleError({
      code: ErrorCode.LoadPortCallDetailsFailed,
      treatAsWarning: true,
      message: `Could not load details for Port Call with id '${portCallId}'.`
    });
  }

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
