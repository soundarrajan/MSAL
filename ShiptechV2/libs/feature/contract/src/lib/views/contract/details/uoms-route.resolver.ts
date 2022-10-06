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
import { KnownContractRoutes } from '../../../known-contract.routes';

@Injectable()
export class UomsRouteResolver implements Resolve<any> {
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
    const ContractIdParam =
      route.params[KnownContractRoutes.ContractIdParam];
    const contractId = Number(ContractIdParam ?? 0);

    if (!Number.isInteger(contractId)) {
      return this.router.navigate([
        KnownPrimaryRoutes.Contract,
        KnownContractRoutes.ContractList
      ]);
    }
    return  this.legacyLookupsDatabase.getUomTable();

  }

}
