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
import { NavBarApiService } from '@shiptech/core/services/navbar/navbar-api.service';
import { KnownContractRoutes } from '../../../known-contract.routes';

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
    const ContractIdParam =
      route.params[KnownContractRoutes.ContractIdParam];
    const contractId = Number(ContractIdParam ?? 0);

    if (!Number.isInteger(contractId)) {
      return this.router.navigate([
        KnownPrimaryRoutes.Contract,
        KnownContractRoutes.ContractList
      ]);
    }
    let navBar = {
      'contracId': contractId
    };
    return  this.navBarService.getNavBarIdsList(navBar);

  }

}
