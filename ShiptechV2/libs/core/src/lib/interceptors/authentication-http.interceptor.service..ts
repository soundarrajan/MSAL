import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { ILogger } from '@shiptech/core/logging/logger';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private logger: ILogger;

  constructor(
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    loggerFactory: LoggerFactory
  ) {
    this.logger = loggerFactory.createLogger(AuthenticationInterceptor.name);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.authService.isInitialized) {
      // return next.handle(req);
      const authorizedRequest = req.clone({
        headers: req.headers.set(
          'Authorization',
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiIzZTdiNDI0MS1iMWU2LTQ3NjktYmI1Yy05ODlkNjQ0NThlNTEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84YmM0YWZlMC0zNTA5LTQyOWEtYWM2ZS1kNzFiZTMyZjIwZjUvIiwiaWF0IjoxNjMyMzg1MzA4LCJuYmYiOjE2MzIzODUzMDgsImV4cCI6MTYzMjM4OTIwOCwiYWlvIjoiQVNRQTIvOFRBQUFBL3NXb2dkSEhIc1lteGxpZU8yQWJ4Tlc5d0EvUDJFT0tHLzVualA5bm16cz0iLCJhbXIiOlsicHdkIl0sImZhbWlseV9uYW1lIjoiVXNlciIsImdpdmVuX25hbWUiOiJTdXBlciIsImlwYWRkciI6IjMxLjUuMTAzLjg2IiwibmFtZSI6IlNoaXB0ZWNoU3VwZXIgVXNlciIsIm5vbmNlIjoiYTg1ODk5ZmYtNzBlZC00ZTdhLThhOWItN2NlY2U0YWE5MDlhIiwib2lkIjoiMGUwZjliZTAtYTY4OC00MDU1LTk5ZjQtYjc2MGU2OTI5ZTQxIiwicmgiOiIwLkFUa0E0S19FaXdrMW1rS3NidGNiNHk4ZzlVRkNlejdtc1dsSHUxeVluV1JGamxFNUFJcy4iLCJzdWIiOiIyeG80azQwQzV3OGNLSjZiRTRISEM3VGhoRFYwZEZ5T3ZHLXdPTVJPaXZrIiwidGlkIjoiOGJjNGFmZTAtMzUwOS00MjlhLWFjNmUtZDcxYmUzMmYyMGY1IiwidW5pcXVlX25hbWUiOiJTdXBlclVzZXJAdHdlbnR5Zm91cnNvZnR3YXJlb3V0bG9vay5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJTdXBlclVzZXJAdHdlbnR5Zm91cnNvZnR3YXJlb3V0bG9vay5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiItT204MnQxN3owU2JTcVo5cDd6VEFBIiwidmVyIjoiMS4wIn0.f_FnhYmrRmpe9OuB5gyuDuZZVUV4vPRWNT-aIaZYeuz5cnflsuySIVUaYbHoLFBSaquraMYZeZYVk6c-OdiK9RFQdwgj6PhG6eyLQkthP3kn8o3VpN6JBppMuTCRxyu52Cn1kiJh7TGhKhB_I0WMwaeCJhXujaZ9Ece-f8UWwbw_2L8A8lZpNB5G1iVxEuwi5GtUR1giUs2SJ2015UffFpfqkwauY4gwOUNS5D13WA5L4KEK3x5h4UW2sPgssfw9ZUulayAOsaEUYUYrwNQUFpgNOv4hp5arEnr7kNtKRAmG9BhgpFeH91QTKn9NeJlerrwPrRTetCpDe-Keosj69w'
        )
      });
      return next.handle(authorizedRequest);
    }

    // get api url from adal config
    const resource = this.authService.getResourceForEndpoint(req.url);

    if (!resource || !this.authService.isAuthenticated) {
      if (!resource)
        this.logger.warn(`Adal returned no endpoint for url: ${req.url}`);

      if (!this.authService.isAuthenticated)
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
            this.toastrService.error(
              'You do not have authorization to perform this action.'
            );
            localStorage.setItem('authorization', '0');
            this.spinner.hide();
            return throwError(error);
          }
        }
        localStorage.setItem('authorization', '1');
        return throwError(error);
      })
    );
  }
}
