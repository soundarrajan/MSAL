import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {
  // noinspection JSUnusedGlobalSymbols

  static readonly LoadControlTowerQuantityRobDifferenceFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerQuantityRobDifferenceFailed,
      message:
        'Could not load control tower quantity rob difference list. Please try again later.'
    }
  );

  static readonly LoadControlTowerQuantitySupplyDifferenceFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerQuantitySupplyDifferenceFailed,
      message:
        'Could not load control tower quantity supply difference list. Please try again later.'
    }
  );

  static readonly LoadControlTowerQuantityClaimsFailed = new ModuleError({
    code: ErrorCode.LoadControlTowerQuantityClaimsFailed,
    message:
      'Could not load control tower quantity claims list. Please try again later.'
  });

  static readonly LoadControlTowerQualityClaimsFailed = new ModuleError({
    code: ErrorCode.LoadControlTowerQualityClaimsFailed,
    message:
      'Could not load control tower quality claims list. Please try again later.'
  });

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
