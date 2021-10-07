import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

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

  static readonly LoadReportSurveyHistoryFailed = new ModuleError({
    code: ErrorCode.LoadReportSurveyHistoryFailed,
    message: 'Could not report survey history. Please try again later.'
  });

  static readonly LoadEventsLogFailed = new ModuleError({
    code: ErrorCode.LoadPortCallListFailed,
    message: 'Could not load events log. Please try again later.'
  });

  static readonly PortCallIsRequired = new ModuleError({
    code: ErrorCode.PortCallIsRequired,
    treatAsWarning: true,
    message: 'Port Call is required.'
  });

  static readonly VesselIsRequired = new ModuleError({
    code: ErrorCode.VesselIsRequired,
    treatAsWarning: true,
    message: 'Vessel is required.'
  });

  static SaveReportDetailsFailed = new ModuleError({
    code: ErrorCode.SaveReportDetailsFailed,
    message: 'Could save report details. Please try again later.'
  });

  static LoadPortCallBtnFailed = new ModuleError({
    code: ErrorCode.LoadPortCallBtnFailed,
    message: 'Could load port call BDN values. Please try again later.'
  });

  static VerifyReportFailed = new ModuleError({
    code: ErrorCode.VerifyReportFailed,
    message: 'Mark report for verification has failed. Please try again later.'
  });

  static RevertVerifyReportFailed = new ModuleError({
    code: ErrorCode.RevertVerifyReportFailed,
    message:
      'Revert report for verification has failed. Please try again later.'
  });

  static UpdateVesselToWatch = new ModuleError({
    code: ErrorCode.UpdateVesselToWatch,
    message: 'Update Vessel to Watch has failed. Please try again later.'
  });

  static EventNotesShouldNotBeEmpty = new ModuleError({
    treatAsWarning: true,
    code: ErrorCode.EventNotesAreRequired,
    message:
      'Events note should not be blank. Please fill in the event note or remove it.'
  });

  static readonly LoadInvoiceListFailed = new ModuleError({
    code: ErrorCode.LoadInvoiceListFailed,
    message: 'Could not load invoice list. Please try again later.'
  });

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }

  static QcReportNotFound(reportId?: number): ModuleError {
    return new ModuleError({
      code: ErrorCode.PortCallNotFound,
      treatAsWarning: true,
      message: `Port Call${
        reportId ? ` with id ${reportId} ` : ' '
      }was not found.`
    });
  }

  static InvalidQcReportId(reportId: number): ModuleError {
    return new ModuleError({
      code: ErrorCode.InvalidPortCallId,
      treatAsWarning: true,
      message: `Invalid Port Call id format '${reportId}'.`
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
