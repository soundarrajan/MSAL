import { Inject, Injectable, OnDestroy } from '@angular/core';
import { defer, Observable, of, throwError } from 'rxjs';
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

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
