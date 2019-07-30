import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.authService.isInitialized) {
      return next.handle(req);
    }

    // get api url from adal config
    const resource = this.authService.getResourceForEndpoint(req.url);
    if (!resource || !this.authService.isAuthenticated) {
      return next.handle(req);
    }

    // merge the bearer token into the existing headers
    return this.authService.acquireToken(resource).pipe(
      mergeMap((token: string) => {
        const authorizedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(authorizedRequest);
      }));
  }
}
