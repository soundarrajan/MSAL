import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { ILogger } from '@shiptech/core/logging/logger';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  private logger: ILogger;

  constructor(private authService: AuthenticationService, loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.createLogger(AuthenticationInterceptor.name)
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.authService.isInitialized) {
      return next.handle(req);
    }

    // get api url from adal config
    const resource = this.authService.getResourceForEndpoint(req.url);

    if (!resource || !this.authService.isAuthenticated) {

      if(!resource)
        this.logger.warn(`Adal returned no endpoint for url: ${req.url}`);

      if(!this.authService.isAuthenticated)
        this.logger.warn(`User not authenticated. Redirecting to login. `);

      this.authService.login();

      return new Observable<HttpEvent<any>>(() => {
        // Note: Intentionally left blank, this obs should never complete so we don't see a glimpse of the application before redirected to login.
      });
    }

    // merge the bearer token into the existing headers
    return this.authService.acquireToken(resource).pipe(
      mergeMap((token: string) => {
        const authorizedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(authorizedRequest);
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.logger.warn(`Api not authenticated. Logging out. `);
            this.authService.logout();
          }
        }

        return throwError(error);
      })
    );
  }
}
