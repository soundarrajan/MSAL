import { Inject, Injectable, OnDestroy } from '@angular/core';
import { defer, Observable, of, Subject, throwError } from 'rxjs';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { Store } from '@ngxs/store';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';

import { UrlService } from '@shiptech/core/services/url/url.service';
import { Router } from '@angular/router';
import { SpotNegotiationApi } from './api/spot-negotiation-api';

@Injectable()
export class SpotNegotiationService extends BaseStoreService
  implements OnDestroy {
  private futureSetTabIndex = new Subject<any>();

  constructor(
    protected store: Store,
    private urlService: UrlService,
    private router: Router,
    loggerFactory: ModuleLoggerFactory,
    private spotNegotiationApi: SpotNegotiationApi
  ) {
    super(store, loggerFactory.createLogger(SpotNegotiationService.name));
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getTenantConfiguration(payload: boolean): Observable<unknown> {
    return this.spotNegotiationApi.getTenantConfiguration(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getStaticLists(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getStaticLists(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getCounterpartyList(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getCounterpartyList(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getPriceDetails(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getPriceDetails(payload);
  }

  /**
   * @param payload = False
   */
   @ObservableException()
   addCounterparties(payload: any): Observable<unknown> {
     return this.spotNegotiationApi.AddCounterparties(payload);
   }

  /**
   * Get group of request when window loads.
   * @param payload = int
   */
  @ObservableException()
  getGroupOfSellers(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getGroupOfSellers(payload);
  }

  @ObservableException()
  getRequestGroup(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getRequestGroup(payload);
  }

  /**
   * @param payload = True
   */
  //  {
  //   Offers: [
  //     {
  //       id: 19, <- row id,
  //       totalOffer: 1500,
  //       requestOffers: [
  //         {
  //           Id: 14, <- product id
  //           totalPrice: 150,
  //           amount: 15000,
  //           targetDifference: 15,
  //           price: 145
  //         }
  //       ]
  //     },
  //     {
  //       id: 20,
  //       totalOffer: 1250,
  //       requestOffers: [
  //         {
  //           Id: 15,
  //           totalPrice: 120,
  //           amount: 12000,
  //           targetDifference: 15,
  //           price: 125
  //         }
  //       ]
  //     }
  //   ]
  // };
   @ObservableException()
   updatePrices(payload: any): Observable<unknown> {
     return this.spotNegotiationApi.updatePrices(payload);
   }

  /**
   * @param payload = False
   */
   @ObservableException()
   saveTragetPrice(payload: any): Observable<unknown> {
     return this.spotNegotiationApi.SaveTragetPrice(payload);
   }


  /**
   * Fake populate rows
   */
  public getSpotDataJSON(): any {
    return this.store.selectSnapshot(state => {
      return state.spotNegotiation.rows;
    });
  }

  public getFutureSettlementTabChange(): Observable<any> {
    return this.futureSetTabIndex.asObservable();
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
