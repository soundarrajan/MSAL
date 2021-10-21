import { ErrorCode } from './error-code';
import { ModuleError } from './module-error';
import { ApiErrorCode } from './api-error-code';
import { IApiToAppErrorMap } from '@shiptech/core/error-handling/map-to-app-error.decorator';

export const ErrorMap: IApiToAppErrorMap<ErrorCode, ModuleError> = {
  [ApiErrorCode.PortCallNotFound]: ModuleError.QcReportNotFound()
};
