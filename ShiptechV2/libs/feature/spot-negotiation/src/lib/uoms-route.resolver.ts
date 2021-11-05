import { KnownSpotNegotiationRoutes } from './known-spot-negotiation.routes';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router
} from '@angular/router';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';

@Injectable()
export class UomsRouteResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private legacyLookupsDatabase: LegacyLookupsDatabase,

  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
  ): any{
    const idParam = route.params[KnownSpotNegotiationRoutes.idParam];
    const id = Number(idParam ?? 0);

    if (!Number.isInteger(id)) {
      return this.router.navigate([
        KnownSpotNegotiationRoutes.spotNegotiation,
        KnownSpotNegotiationRoutes.idParam,
        KnownSpotNegotiationRoutes.details
      ]);
    }
    return  this.legacyLookupsDatabase.getUomTable();
  }
}
