import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { ILogger } from '@shiptech/core/logging/logger';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private logger: ILogger;

  constructor(
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    loggerFactory: LoggerFactory,
    public authService: AuthService
  ) {
    this.logger = loggerFactory.createLogger(AuthenticationInterceptor.name);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
          }
        },
        error => {
          console.log(error);
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastrService.error(
                'You do not have authorization to perform this action.'
              );
              localStorage.setItem('authorization', '0');
              this.spinner.hide();
              if (error.url.indexOf('api/admin/user/info') != -1) {
                localStorage.setItem('userIsNotAuth', '1');
              }
              return throwError(error);
            }
          }
          localStorage.setItem('authorization', '1');
          return throwError(error);
        }
      )
    );
  }
}
