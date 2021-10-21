import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';
import { ErrorCodeEnum } from '@shiptech/core/ui/components/export/error-handling/error-code.enum';

export class ModuleError<T = any> extends AppError<T> {
  static readonly ExportAsExcelFailed = new AppError({
    code: ErrorCodeEnum.ExportAsExcelFailed,
    message: 'Could not export document as Excel. Please try again later.'
  });

  static readonly ExportAsCsvFailed = new AppError({
    code: ErrorCodeEnum.ExportAsCsvFailed,
    message: 'Could not export document as Csv. Please try again later.'
  });

  static readonly ExportAsPdfFailed = new AppError({
    code: ErrorCodeEnum.ExportAsPdfFailed,
    message: 'Could not export document as PDF. Please try again later.'
  });

  static readonly ExportGeneralFailed = new AppError({
    code: ErrorCodeEnum.ExportGeneralFailed,
    message: 'Could not export document. Please try again later.'
  });

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
