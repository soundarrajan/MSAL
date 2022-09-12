import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { KnownInvoiceRoutes } from './../../../known-invoice.routes';
import { NavBarApiService } from '@shiptech/core/services/navbar/navbar-api.service';

@Injectable()
export class NavBarResolver implements Resolve<any> {
  isLoading: boolean;
  options: any;
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private navBarService: NavBarApiService

  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any{
    const InvoiceIdParam = route.params[KnownInvoiceRoutes.InvoiceIdParam];
    const invoiceId = Number(InvoiceIdParam ?? 0);

    if (!Number.isInteger(invoiceId)) {
      return this.router.navigate([
        KnownPrimaryRoutes.Invoices,
        KnownInvoiceRoutes.InvoiceList
      ]);
    }
    let navBar = {
      'invoiceId': invoiceId
    };
    return  this.navBarService.getNavBarIdsList(navBar);

  }

}
