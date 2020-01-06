import { Observable, throwError } from 'rxjs';
import { RootLogger } from '../logging/logger-factory.service';
import { serializeException } from '../logging/serialize-exception';

export function safeCall<TResponse>(methodCall: () => Observable<TResponse>): Observable<TResponse> {
  try {
    return methodCall();
  } catch (e) {
    RootLogger.error('Safe call has failed. See props for error details.', {
      exception: serializeException(e),
      destructure: true
    });
    return throwError(e);
  }
}
