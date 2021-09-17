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
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiIzZTdiNDI0MS1iMWU2LTQ3NjktYmI1Yy05ODlkNjQ0NThlNTEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84YmM0YWZlMC0zNTA5LTQyOWEtYWM2ZS1kNzFiZTMyZjIwZjUvIiwiaWF0IjoxNjMxODczMDg1LCJuYmYiOjE2MzE4NzMwODUsImV4cCI6MTYzMTg3Njk4NSwiYWlvIjoiQVNRQTIvOFRBQUFBMklqVWVJS2tXZG5INmRGc1I5Q2p1eEY0VGduSWNiQVVxRkM1c1c3c3JGZz0iLCJhbXIiOlsicHdkIl0sImZhbWlseV9uYW1lIjoiVXNlciIsImdpdmVuX25hbWUiOiJTdXBlciIsImlwYWRkciI6Ijc5LjExOS45MC4yMSIsIm5hbWUiOiJTaGlwdGVjaFN1cGVyIFVzZXIiLCJub25jZSI6IjYzYmYwOWQ0LTNiYjMtNDIwOS05MTk3LWY4ZjgyYzNmYjdiMCIsIm9pZCI6IjBlMGY5YmUwLWE2ODgtNDA1NS05OWY0LWI3NjBlNjkyOWU0MSIsInJoIjoiMC5BVGtBNEtfRWl3azFta0tzYnRjYjR5OGc5VUZDZXo3bXNXbEh1MXlZbldSRmpsRTVBSXMuIiwic3ViIjoiMnhvNGs0MEM1dzhjS0o2YkU0SEhDN1RoaERWMGRGeU92Ry13T01ST2l2ayIsInRpZCI6IjhiYzRhZmUwLTM1MDktNDI5YS1hYzZlLWQ3MWJlMzJmMjBmNSIsInVuaXF1ZV9uYW1lIjoiU3VwZXJVc2VyQHR3ZW50eWZvdXJzb2Z0d2FyZW91dGxvb2sub25taWNyb3NvZnQuY29tIiwidXBuIjoiU3VwZXJVc2VyQHR3ZW50eWZvdXJzb2Z0d2FyZW91dGxvb2sub25taWNyb3NvZnQuY29tIiwidXRpIjoiYVFPTzUzQTh4a1dkYm5DdmMxTU1BQSIsInZlciI6IjEuMCJ9.XinlSx4cGS6XLfI6sWfboHlp3ngXP-NebJSBquMOa8W2idST6hZXd9FGrTOXiNjkMEIOBiJ8HoYBastpDYjjscjo_gmkTytct0silwspKXIGt-hnEH9YKq3S9aEqL5DKBbLjEW_R6GasOBJ9-pI9wiqqguBrn2al0vjBFKUJtFoC4Msb_VTGzSWdknFdG7wxyJcj4pEDmjwVL-GOSyS-5IrLI1vsiaAUi4DHJAaM0tv5YWb62DRG0G8hqblK2TFbHEqcGR0SgS5pG3e-paN3AGtfYZsTs5jOTMKahefDSM5OYxEJ1CANWcA_nwDVAPMcjge_5bXtDgDoqrV5MviZEQ'
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
        // this.spinner.hide();
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.toastrService.error(
              'You do not have authorization to perform this action.'
            );
            localStorage.setItem('authorization', '0');
            return throwError(error);
          }
        }
        localStorage.setItem('authorization', '1');
        return throwError(error);
      })
    );
  }
}
