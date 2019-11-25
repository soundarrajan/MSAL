import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';
import { QcVerifyReportFailedAction } from '../../store/report-view/details/actions/verify-report.actions';

export class ModuleError<T = any> extends AppError<T> {
  // noinspection JSUnusedGlobalSymbols
  static readonly LoadPortCallListFailed = new ModuleError({
    code: ErrorCode.LoadPortCallListFailed,
    message: 'Could not load port call list. Please try again later.'
  });

  static readonly LoadReportListFailed = new ModuleError({
    code: ErrorCode.LoadReportListFailed,
    message: 'Could not load report list. Please try again later.'
  });

  static readonly LoadEventsLogFailed = new ModuleError({
    code: ErrorCode.LoadPortCallListFailed,
    message: 'Could not load events log. Please try again later.'
  });

  static SaveReportDetailsFailed = new ModuleError({
    code: ErrorCode.SaveReportDetailsFailed,
    message: 'Could save report details. Please try again later.'
  });

  static VerifyReportFailed = new ModuleError({
    code: ErrorCode.VerifyReportFailed,
    message: 'Mark report for verification has failed. Please try again later.'
  });

  static QcReportNotFound(reportId?: number): ModuleError {
    return new ModuleError({
      code: ErrorCode.PortCallNotFound,
      treatAsWarning: true,
      message: `Port Call${reportId ? ` with id ${reportId} ` : ' '}was not found.`
    });
  }

  static InvalidQcReportId(reportId: number): ModuleError {
    return new ModuleError({
      code: ErrorCode.InvalidPortCallId,
      treatAsWarning: true,
      message: `Invalid Port Call id format '${reportId}'.`
    });
  }

  static LoadQcReportDetailsFailed(reportId?: number): ModuleError {
    return new ModuleError({
      code: ErrorCode.LoadPortCallDetailsFailed,
      treatAsWarning: true,
      message: `Could not load details for Port Call with id '${reportId}'.`
    });
  }

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
