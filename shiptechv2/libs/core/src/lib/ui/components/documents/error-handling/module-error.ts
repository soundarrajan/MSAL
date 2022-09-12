import { ErrorCode } from './error-code';
import { AppError, IAppError } from '@shiptech/core/error-handling/app-error';

export class ModuleError<T = any> extends AppError<T> {
  static readonly LoadDocumentsFailed = new AppError({
    code: ErrorCode.LoadDocumentsFailed,
    message: 'Could not load document list. Please try again later.'
  });

  static readonly DeleteDocumentFailed = new AppError({
    code: ErrorCode.DeleteDocumentFailed,
    message: 'Could not delete the document. Please try again later.'
  });

  static readonly UpdateIsVerifiedDocumentFailed = new AppError({
    code: ErrorCode.UpdateIsVerifiedDocumentFailed,
    message:
      'Could not update the verification of the document. Please try again later.'
  });

  static readonly UpdateNotesDocumentFailed = new AppError({
    code: ErrorCode.UpdateNotesDocumentFailed,
    message:
      'Could not update the notes of the document. Please try again later.'
  });

  static readonly UploadDocumentFailed = new AppError({
    code: ErrorCode.UploadDocumentFailed,
    message: 'Could not upload the document. Please try again later.'
  });

  static readonly DocumentTypeNotSelected = new AppError({
    code: ErrorCode.DocumentTypeNotSelected,
    message: 'Please select a Document Type and upload a file again.',
    treatAsWarning: true
  });

  static readonly DocumentDownloadError = new AppError({
    code: ErrorCode.DocumentDownloadError,
    message: 'Could not download the document. Please try again later.'
  });

  static readonly DocumentsTypeLoadError = new AppError({
    code: ErrorCode.DocumentsTypeLoadError,
    message: 'Could not load documents types list. Please try again later.'
  });

  constructor(appError: Partial<IAppError> = {}) {
    super(appError);
  }
}
