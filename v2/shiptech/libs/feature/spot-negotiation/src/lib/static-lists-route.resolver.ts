import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { SpotNegotiationService } from './services/spot-negotiation.service';

@Injectable()
export class StaticListsRouteResolver implements Resolve<any> {
  isLoading: boolean;
  options: any;
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private spotNegotiationService: SpotNegotiationService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.spotNegotiationService.getStaticLists(['Seller']);
  }
}
