import { KnownSpotNegotiationRoutes } from './../../../known-spot-negotiation.routes';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
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
    const ContractIdParam =
      route.params[KnownSpotNegotiationRoutes.idParam];
    const contractId = Number(ContractIdParam ?? 0);

    if (!Number.isInteger(contractId)) {
      return this.router.navigate([
        KnownPrimaryRoutes.SpotNegotiationt,
        KnownSpotNegotiationRoutes.spotNegotiationList
      ]);
    }
    let navBar = {
      'ContractId': contractId
    };
    return  this.navBarService.getNavBarIdsList(navBar);

  }

}
