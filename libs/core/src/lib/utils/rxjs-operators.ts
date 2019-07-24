import { MonoTypeOperatorFunction, of, OperatorFunction, pipe, throwError, UnaryFunction } from 'rxjs';
import { catchError, pluck as unsafePluck, retry, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

export function prop<T, R, K extends keyof T>(...properties: K[]): OperatorFunction<T, R> {
  return unsafePluck<T, R>(...(<string[]>properties));
}

export const RETURN$ = of(undefined);
export const SKIP$ = of(undefined);
export const EMPTY$ = of(undefined);

/**
 * In case of error the Observable is not retried
 * @param errorHandler If not passed the error will be thrown on another event tick, in order not to unsubscribe the source observable
 */
export function resumeOnError(errorHandler?: (error: any) => void): UnaryFunction<any, any> {
  return pipe(
    catchError(error => {
      if (errorHandler) {
        errorHandler(error);
      } else {
        setTimeout(() => {
          // Note: Let main app error handler treat it
          throw error;
        });
      }
      return throwError(error);
    }),
    retry()
  );
}

/**
 * Shows a Toastr success message
 * @param toastr
 * @param message String or result of Function to show as success message.
 */
export function toastrSuccess<T>(toastr: ToastrService, message: string | ((x: T) => string)): MonoTypeOperatorFunction<T> {
  return tap<T>(x => toastr.success(typeof message === 'string' ? message : message(x)));
}
