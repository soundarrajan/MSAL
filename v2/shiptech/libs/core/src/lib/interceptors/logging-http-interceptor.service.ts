import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoggerFactory } from '../logging/logger-factory.service';
import { ILogger } from '../logging/logger';

export const LoggingInterceptorHeader = 'x-client-valid-response-status';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private logger: ILogger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.createLogger(LoggingInterceptor.name);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const newRequest = request.headers.has(LoggingInterceptorHeader)
      ? request.clone({
          headers: request.headers.delete(LoggingInterceptorHeader)
        })
      : request;
    const hasExceptionStatusCodes = request !== newRequest;

    return next.handle(newRequest).pipe(
      tap(
        event => {
          // if (event instanceof HttpResponse) {
          // Note: StatusCode >= 400 come up in the error handler
          // }
        },
        // Operation failed; error is an HttpErrorResponse
        response => {
          if (
            hasExceptionStatusCodes &&
            request.headers
              .get(LoggingInterceptorHeader)
              .split(',')
              .some(h => h === (response.status || '').toString())
          ) {
            return response;
          }

          return this.logger.error(
            'Failed HTTP {Method} request with {StatusCode} ({StatusText}) for {Url}.',
            request.method,
            response.status,
            response.statusText,
            request.urlWithParams,
            {
              request,
              response,
              destructure: true
            }
          );
        }
      )
    );
  }
}
