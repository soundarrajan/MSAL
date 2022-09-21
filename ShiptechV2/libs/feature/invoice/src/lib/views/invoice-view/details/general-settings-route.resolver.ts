import { ContractService } from 'libs/feature/contract/src/lib/services/contract.service';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
} from '@angular/router';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { KnownInvoiceRoutes } from './../../../known-invoice.routes';

@Injectable()
export class GeneralSettingsRouteResolver implements Resolve<any> {
  isLoading: boolean;
  options: any;
  constructor(
    private router: Router,
    private contractService: ContractService,

  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
  ): any{
    const InvoiceIdParam = route.params[KnownInvoiceRoutes.InvoiceIdParam];
    const invoiceId = Number(InvoiceIdParam ?? 0);

    if (!Number.isInteger(invoiceId)) {
      return this.router.navigate([
        KnownPrimaryRoutes.Invoices,
        KnownInvoiceRoutes.InvoiceList
      ]);
    }

    return this.contractService.getTenantConfiguration(false);
  }

}
