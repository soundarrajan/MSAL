import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { QcReportService } from '../../../services/qc-report.service';
import { KnownQuantityControlRoutes } from '../../../known-quantity-control.routes';
import { catchError, map, mapTo } from 'rxjs/operators';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';

@Injectable()
export class QcReportDetailsRouteResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private reportService: QcReportService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const reportIdParam = route.params[KnownQuantityControlRoutes.ReportIdParam];

    return this.reportService.loadReportDetails(reportIdParam)
      .pipe(
        catchError(error => {
          // Note: If the user navigated directly to this route, we need to redirect to root and show and error
          if (!state.root.component) {
            this.appErrorHandler.handleError(error);
            return this.router.navigate([KnownPrimaryRoutes.QuantityControl, KnownQuantityControlRoutes.ReportList]);
          } else {
            // Note: if the application is already loaded (something visible on the screen) and we navigate to a bad route we need to "cancel" the navigation and show an error
            return throwError(error);
          }
        }),
        mapTo(reportIdParam)
      );
  }
}
