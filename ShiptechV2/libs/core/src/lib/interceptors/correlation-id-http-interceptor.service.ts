import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppContext } from '../app-context';

@Injectable()
export class CorrelationIdHttpInterceptor implements HttpInterceptor {
  constructor(private appContext: AppContext) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({
      setHeaders: {
        'x-correlation-id': this.appContext.sessionId
      }
    });

    return next.handle(request);
  }
}
