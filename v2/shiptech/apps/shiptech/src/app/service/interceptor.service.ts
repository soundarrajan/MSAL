import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { MyMonitoringService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!(<any>window).openedScreenLoaders && !(<any>window).qcActions) {
      (<any>window).openedScreenLoaders = 0;
      (<any>window).firstCall = Date.now();
    }
    (<any>window).openedScreenLoaders += 1;
    return next.handle(req).pipe(
      map(resp => {
        if (resp instanceof HttpResponse && !(<any>window).qcActions) {
          (<any>window).lastCall = Date.now();
          let visibleLoader = document.getElementById('loading-bar');
          if (visibleLoader) {
            (<any>window).visibleLoader = true;
          } else if ((<any>window).visibleLoader) {
            this.loaderService.isLoading.next(true);
          }
          if (
            resp.url.indexOf('admin/audit/get') != -1 ||
            resp.url.indexOf('masters/emaillogs/list') != -1 ||
            resp.url.indexOf('masters/documentupload/list') != -1 ||
            resp.url.indexOf('quantityControlReport/details') != -1
          ) {
            this.loaderService.isLoading.next(true);
          }
          return resp;
        } else {
          return resp;
        }
      })
    );
  }
}
