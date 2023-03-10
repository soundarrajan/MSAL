import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {
  // noinspection JSUnusedGlobalSymbols

  static readonly LoadControlTowerResidueEGCSDifferenceFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerResidueEGCSDifferenceFailed,
      message:
        'Could not load control tower residue EGCS difference list. Please try again later.'
    }
  );

  static readonly LoadControlTowerResidueEGCSDifferenceCountFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerResidueEGCSDifferenceFailed,
      message:
        'Could not load control tower residue EGCS difference count. Please try again later.'
    }
  );

  static readonly LoadControlTowerResidueSludgeDifferenceFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerResidueSludgeDifferenceFailed,
      message:
        'Could not load control tower residue sludge difference list. Please try again later.'
    }
  );

  static readonly LoadControlTowerResidueSludgeDifferenceCountFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerResidueSludgeDifferenceFailed,
      message:
        'Could not load control tower residue sludge difference count. Please try again later.'
    }
  );

  static readonly LoadControlTowerQuantityRobDifferenceFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerQuantityRobDifferenceFailed,
      message:
        'Could not load control tower quantity rob difference list. Please try again later.'
    }
  );

  static readonly LoadControlTowerQuantityRobDifferenceCountFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerQuantityRobDifferenceFailed,
      message:
        'Could not load control tower quantity rob difference count. Please try again later.'
    }
  );

  static readonly LoadControlTowerQuantitySupplyDifferenceFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerQuantitySupplyDifferenceFailed,
      message:
        'Could not load control tower quantity supply difference list. Please try again later.'
    }
  );

  static readonly LoadControlTowerQuantitySupplyDifferenceCountFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerQuantitySupplyDifferenceFailed,
      message:
        'Could not load control tower quantity supply difference count. Please try again later.'
    }
  );

  static readonly LoadControlTowerQuantitySupplyDifferencePopupFailed = new ModuleError(
    {
      code: ErrorCode.LoadControlTowerQuantitySupplyDifferencePopupFailed,
      message:
        'Could not load control tower quantity supply popup. Please try again later.'
    }
  );

  static readonly LoadControlTowerQuantityClaimsFailed = new ModuleError({
    code: ErrorCode.LoadControlTowerQuantityClaimsFailed,
    message:
      'Could not load control tower quantity claims list. Please try again later.'
  });

  static readonly LoadControlTowerQuantityClaimsCountFailed = new ModuleError({
    code: ErrorCode.LoadControlTowerQuantityClaimsFailed,
    message:
      'Could not load control tower quantity claims count. Please try again later.'
  });

  static readonly LoadControlTowerQualityClaimsFailed = new ModuleError({
    code: ErrorCode.LoadControlTowerQualityClaimsFailed,
    message:
      'Could not load control tower quality claims list. Please try again later.'
  });

  static readonly LoadControlTowerQualityClaimsCountFailed = new ModuleError({
    code: ErrorCode.LoadControlTowerQualityClaimsFailed,
    message:
      'Could not load control tower quality claims count. Please try again later.'
  });

  static readonly LoadControlTowerQualityLabsFailed = new ModuleError({
    code: ErrorCode.LoadControlTowerQualityLabsFailed,
    message:
      'Could not load control tower quality labs list. Please try again later.'
  });

  static readonly LoadControlTowerQualityLabsCountFailed = new ModuleError({
    code: ErrorCode.LoadControlTowerQualityLabsFailed,
    message:
      'Could not load control tower quality labs count. Please try again later.'
  });

  static readonly LoadControlTowerQualityLabsPopupFailed = new ModuleError({
    code: ErrorCode.LoadControlTowerQualityLabsPopupFailed,
    message:
      'Could not load control tower quality labs popup. Please try again later.'
  });

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
