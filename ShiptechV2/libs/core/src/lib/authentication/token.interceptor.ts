import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AdalService } from 'adal-angular-wrapper';
import { Observable } from 'rxjs';
import { AuthenticationContext } from './authentication-context';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private adal: AdalService, private authContext: AuthenticationContext) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authContext.token}`
      }
    });

    return next.handle(request);
  }
}
