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
import { KnownSpotNegotiationRoutes } from '../../../known-spot-negotiation.routes';
import { SpotNegotiationService } from '../../../services/spot-negotiation.service';

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
    const ContractIdParam = route.params[KnownSpotNegotiationRoutes.ContractIdParam];
    const contractId = Number(ContractIdParam ?? 0);

    if (!Number.isInteger(contractId)) {
      return this.router.navigate([
        KnownPrimaryRoutes.Contract,
        KnownSpotNegotiationRoutes.ContractList
      ]);
    }
    return this.spotNegotiationService.getStaticLists([
      'Company',
      'Seller',
      'PaymentTerm',
      'Incoterm',
      'ApplyTo',
      'ContractualQuantityOption',
      'Uom',
      'UomMass',
      'UomVolume',
      'ContractConversionFactorOptions',
      'SpecParameter',
      'FormulaType',
      'SystemInstrument',
      'MarketPriceType',
      'FormulaPlusMinus',
      'FormulaFlatPercentage',
      'Currency',
      'FormulaOperation',
      'FormulaFunction',
      'MarketPriceType',
      'PricingSchedule',
      'HolidayRule',
      'PricingSchedulePeriod',
      'Event',
      'DayOfWeek',
      'BusinessCalendar',
      'FormulaEventInclude',
      'ContractTradeBook',
      'QuantityType',
      'Product',
      'Location',
      'AdditionalCost',
      'CostType',
      'Customer'
    ]);
  }
}
