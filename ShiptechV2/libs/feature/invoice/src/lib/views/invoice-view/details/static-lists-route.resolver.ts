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
import { InvoiceDetailsService } from '../../../services/invoice-details.service';

@Injectable()
export class StaticListsRouteResolver implements Resolve<any> {
  isLoading: boolean;
  options: any;
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private invoiceService: InvoiceDetailsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const ContractIdParam = route.params[KnownInvoiceRoutes.InvoiceIdParam];
    const contractId = Number(ContractIdParam ?? 0);

    if (!Number.isInteger(contractId)) {
      return this.router.navigate([
        KnownPrimaryRoutes.Contract,
        KnownInvoiceRoutes.InvoiceIdParam
      ]);
    }
    return this.invoiceService.getStaticLists([
      'Product',
      'Uom',
      'Currency',
      'Supplier',
      'CostType',
      'Customer',
      'InvoiceCustomStatus'
    ]);
  }
}
