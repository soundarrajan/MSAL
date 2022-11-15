import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { Observable } from 'rxjs';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';

import { CommonApiService } from './common-api.service';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';

@Injectable()
export class CommonService extends BaseStoreService implements OnDestroy {

  constructor(
    protected store: Store,
    loggerFactory: LoggerFactory,
    private commonApiService: CommonApiService
  ) {
    super(store, loggerFactory.createLogger(CommonService.name));
  }

  @ObservableException()
  getSellerRatingforNegotiation(payload: any): Observable<unknown>{
      return this.commonApiService.getSellerRatingforNegotiation(payload)  ;
  }

  ngOnDestroy(): void {
      super.onDestroy();
  }
}