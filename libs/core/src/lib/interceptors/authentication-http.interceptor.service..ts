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
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiIzZTdiNDI0MS1iMWU2LTQ3NjktYmI1Yy05ODlkNjQ0NThlNTEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84YmM0YWZlMC0zNTA5LTQyOWEtYWM2ZS1kNzFiZTMyZjIwZjUvIiwiaWF0IjoxNjMyMzg5NTQwLCJuYmYiOjE2MzIzODk1NDAsImV4cCI6MTYzMjM5MzQ0MCwiYWlvIjoiRTJaZ1lQaG5OdDg2NSsvbkc0OU4xMDNPeUhFOG5aNHd4VjQzb2lFdXUwZitlVmI3cFU0QSIsImFtciI6WyJwd2QiXSwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZ2l2ZW5fbmFtZSI6IlN1cGVyIiwiaXBhZGRyIjoiMzEuNS4xMDMuODYiLCJuYW1lIjoiU2hpcHRlY2hTdXBlciBVc2VyIiwibm9uY2UiOiIyYmY4ZmM4ZC03YzYyLTRjZmEtOTI5OC1hOTBmN2U5ZTBkYmQiLCJvaWQiOiIwZTBmOWJlMC1hNjg4LTQwNTUtOTlmNC1iNzYwZTY5MjllNDEiLCJyaCI6IjAuQVRrQTRLX0Vpd2sxbWtLc2J0Y2I0eThnOVVGQ2V6N21zV2xIdTF5WW5XUkZqbEU1QUlzLiIsInN1YiI6IjJ4bzRrNDBDNXc4Y0tKNmJFNEhIQzdUaGhEVjBkRnlPdkctd09NUk9pdmsiLCJ0aWQiOiI4YmM0YWZlMC0zNTA5LTQyOWEtYWM2ZS1kNzFiZTMyZjIwZjUiLCJ1bmlxdWVfbmFtZSI6IlN1cGVyVXNlckB0d2VudHlmb3Vyc29mdHdhcmVvdXRsb29rLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6IlN1cGVyVXNlckB0d2VudHlmb3Vyc29mdHdhcmVvdXRsb29rLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IjBudEpGaWxqcFVTNWViSlZEQjhUQUEiLCJ2ZXIiOiIxLjAifQ.qsh-5Qld3mS-_Fpdhk6PL8FI8KNchDpk3__EpBDZZkcL1bqUyT25RmK_rNJZTh7Pl7QoJQN1jEJGHc-ApZKllQSrFY-tvFjxFVSgb0yPsr9h7gwNh2T4RVla0PKd2PnJSpfPnAKsYGKHfj2XYjuOLuH9EE1xW2_ws1m2DNRFQQwALfxmnUqEkjA20jXjZgCUtKGJ34HTG5I_NVdghEgiNgOXOjvM87CZaoO0U1Cn5TlMazG1QU2Lp-EOYO7vSLulIaex4ir5CCrn6Mik8YFIR7PYb4s1dcbAOg3wNeG81l79KdvpeQ8m3BFnK3G12MP60akeNdEdIZ1cCTFPWQivAg'
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
