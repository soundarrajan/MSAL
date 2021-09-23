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
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiIzZTdiNDI0MS1iMWU2LTQ3NjktYmI1Yy05ODlkNjQ0NThlNTEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84YmM0YWZlMC0zNTA5LTQyOWEtYWM2ZS1kNzFiZTMyZjIwZjUvIiwiaWF0IjoxNjMyMzgxNTY3LCJuYmYiOjE2MzIzODE1NjcsImV4cCI6MTYzMjM4NTQ2NywiYWlvIjoiRTJaZ1lNamNGZkR2aFYzMXR3NnJzOXdlQ1hPaWF6dFQvM2s0MmN1eXlPblBDcEpPL1E4QSIsImFtciI6WyJwd2QiXSwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZ2l2ZW5fbmFtZSI6IlN1cGVyIiwiaXBhZGRyIjoiMzEuNS4xMDMuODYiLCJuYW1lIjoiU2hpcHRlY2hTdXBlciBVc2VyIiwibm9uY2UiOiI3OWNlZTBhYi0xMzMwLTQ5YjAtYWYzZC1mZjBlNjQ1ZWIzZjMiLCJvaWQiOiIwZTBmOWJlMC1hNjg4LTQwNTUtOTlmNC1iNzYwZTY5MjllNDEiLCJyaCI6IjAuQVRrQTRLX0Vpd2sxbWtLc2J0Y2I0eThnOVVGQ2V6N21zV2xIdTF5WW5XUkZqbEU1QUlzLiIsInN1YiI6IjJ4bzRrNDBDNXc4Y0tKNmJFNEhIQzdUaGhEVjBkRnlPdkctd09NUk9pdmsiLCJ0aWQiOiI4YmM0YWZlMC0zNTA5LTQyOWEtYWM2ZS1kNzFiZTMyZjIwZjUiLCJ1bmlxdWVfbmFtZSI6IlN1cGVyVXNlckB0d2VudHlmb3Vyc29mdHdhcmVvdXRsb29rLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6IlN1cGVyVXNlckB0d2VudHlmb3Vyc29mdHdhcmVvdXRsb29rLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6ImJRQ3ZBTjBndGtlZDVFWjk0UlM4QUEiLCJ2ZXIiOiIxLjAifQ.HSROBhM5FRiHrKEvbTOWBAfMSG9gm4XBTg047x_gIo7mwPfiBtiDiz0FHnRDTvRkRhYbx5pDteA_hrJWhpkcS8_MLS7IzJv0UpLo6cZdxf7NxyFBexUadKfV0GdrLPJK9qTFm4Kl-JbydsiFqBrKnXTLEc97TuuX2p9w_EiLyLyr5zmxE3QVL87pM2SL182tJOWF8AP_pidXzrFKYppdqp-SQjwDM5zqUU46iAIHARtFiWixNUm3Qnen9KTNHM1I-aqQMnO_2Eomg4mRk2FXODuF84Ks78HClIIKiousGeS-O0_AabQzkYT2Uk5Eydamqf4TC2UmksyAE_MfBfxTLw'
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
