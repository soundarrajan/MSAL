import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { Observable } from 'rxjs';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { ContractNegotiationApi } from './api/contract-negotiation-api';

@Injectable()
export class ContractNegotiationService extends BaseStoreService
  implements OnDestroy {

  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    private contractNegotiationApi: ContractNegotiationApi
  ) {
    super(store, loggerFactory.createLogger(ContractNegotiationService.name));
  }

  /**
   * @param payload = False
   */
   @ObservableException()
   getStaticLists(payload: any): Observable<unknown> {
     return this.contractNegotiationApi.getStaticLists(payload);
   }

  /* Create Contract Request
   * @param payload =
   */
  @ObservableException()
  createContractRequest(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.createContractRequest(payload);
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
