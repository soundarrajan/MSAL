import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, mapTo } from 'rxjs/operators';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { BdnInformationApiService } from '@shiptech/core/delivery-api/bdn-information/bdn-information-api.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { KnownInvoiceRoutes } from '../../../known-invoice.routes';

@Injectable()
export class ScheduleDashboardLabelsRouteResolver implements Resolve<any> {
  isLoading: boolean;
  options: any;
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private legacyLookupsDatabase: LegacyLookupsDatabase,

  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any{
    const invoiceIdParam =
      route.params[KnownInvoiceRoutes.InvoiceIdParam];
    const invoiceId = Number(invoiceIdParam ?? 0);
    return  this.legacyLookupsDatabase.getScheduleDashboardLabelConfiguration();

  }

}
