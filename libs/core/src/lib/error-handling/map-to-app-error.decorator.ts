import { MethodDecoratorFactory } from '../utils/type-definitions';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from './api/api-error';
import { HttpErrorResponse } from '@angular/common/http';
import { AppError } from './app-error';

export interface IApiToAppErrorMap<TErrorCode extends number = number, TAppError extends AppError = AppError> {
  [key: number]: AppError;
}

// TODO: Create per class decorator to avoid repetition
export function MapToAppError(errorMap: IApiToAppErrorMap): MethodDecoratorFactory {
  return (target: any, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const oldMethod = descriptor.value;

    descriptor.value = function(...args: any[]): any {
      return <Observable<any>>oldMethod.apply(this, args).pipe(
        catchError((httpError: HttpErrorResponse) => {
          const unknownApiError = ApiError.UnknownWithDetails(httpError);

          const apiError = (httpError ? httpError.error : unknownApiError) || unknownApiError;

          let appError = (errorMap || {})[apiError.errorCode];

          // Note: If map was successful we want to preserve the details of the error set in the map, but we want also the data property to contain the original api error.
          // Note: This will give a nice chain of inner exceptions.
          if (appError) {
            appError = new AppError({ ...appError, data: apiError });
          }

          return throwError(appError || AppError.UnknownServerErrorWithData(apiError));
        })
      );
    };
    return descriptor;
  };
}
