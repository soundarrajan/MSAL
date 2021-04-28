import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {
  //**Error Messages without Parameters */
  static readonly LoadBunkeringPlanDetailsFailedAction = new ModuleError({
    code: ErrorCode.LoadBunkeringPlanDetailsFailedAction,
    message: 'Could not load bunker plan details. Please try again later.'
  });

  
  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
//***Error Messages with Parameter*/
//   static QcReportNotFound(reportId?: number): ModuleError {
//     return new ModuleError({
//       code: ErrorCode.PortCallNotFound,
//       treatAsWarning: true,
//       message: `Port Call${
//         reportId ? ` with id ${reportId} ` : ' '
//       }was not found.`
//     });
//   }


}
