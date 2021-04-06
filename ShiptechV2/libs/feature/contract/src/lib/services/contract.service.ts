import { Inject, Injectable, OnDestroy } from '@angular/core';
import { defer, Observable, of, throwError } from 'rxjs';
import { ModuleError } from '../core/error-handling/module-error';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { Store } from '@ngxs/store';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';

import { UrlService } from '@shiptech/core/services/url/url.service';
import { Router } from '@angular/router';
import { ContractApi } from './api/contract-api';


@Injectable()
export class ContractService extends BaseStoreService implements OnDestroy {
  constructor(
    protected store: Store,
    private urlService: UrlService,
    private router: Router,
    loggerFactory: ModuleLoggerFactory,
    private contractApi: ContractApi
  ) {
    super(store, loggerFactory.createLogger(ContractService.name));
  }


  /**
   * @param contractId contractId in case of editing or false in case of new
   */
  @ObservableException()
  loadContractDetails(contractId: number): Observable<unknown> {
    return this.contractApi.getContractDetails(contractId);
  }

  /**
 * @param payload = False 
 */
  @ObservableException()
  getTenantConfiguration(payload: boolean): Observable<unknown> {
    return this.contractApi.getTenantConfiguration(payload);
  }

  
  /**
 * @param payload = False 
 */
   @ObservableException()
   getStaticLists(payload: any): Observable<unknown> {
     return this.contractApi.getStaticLists(payload);
   }

     /**
 * @param counterpartyId 
 */
  @ObservableException()
  getCounterparty(counterpartyId: number): Observable<unknown> {
    return this.contractApi.getCounterparty(counterpartyId);
  }

  
     /**
 * @param payload 
 */
  @ObservableException()
  getAgreementType(payload): Observable<unknown> {
    return this.contractApi.getAgreementType(payload);
  }

  
     /**
 * @param agreementTypeId 
 */
  @ObservableException()
  getAgreementTypeById(agreementTypeId : number): Observable<unknown> {
    return this.contractApi.getAgreementTypeById(agreementTypeId);
  }

   
     /**
 * @param payload 
 */
  @ObservableException()
  getLocationList(payload): Observable<unknown> {
    return this.contractApi.getLocationList(payload);
  }

   
     /**
 * @param payload 
 */
  @ObservableException()
  getProductList(payload): Observable<unknown> {
    return this.contractApi.getProductList(payload);
  }
         
      
     
  
    
  ngOnDestroy(): void {
    super.onDestroy();
  }
}
