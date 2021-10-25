import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { KnownDeliverylRoutes } from '../../../known-delivery.routes';
import { catchError, finalize, mapTo } from 'rxjs/operators';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { DeliveryService } from '../../../services/delivery.service';
import { BdnInformationApiService } from '@shiptech/core/delivery-api/bdn-information/bdn-information-api.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';

@Injectable()
export class PumpingRateUomRouteResolver implements Resolve<any> {
  isLoading: boolean;
  options: any;
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private legacyLookupsDatabase: LegacyLookupsDatabase
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const DeliveryIdParam = route.params[KnownDeliverylRoutes.DeliveryIdParam];
    const deliveryId = Number(DeliveryIdParam ?? 0);

    if (!Number.isInteger(deliveryId)) {
      return this.router.navigate([
        KnownPrimaryRoutes.Delivery,
        KnownDeliverylRoutes.DeliveryList
      ]);
    }
    return this.legacyLookupsDatabase.getPumpingRateUom();
  }
}
