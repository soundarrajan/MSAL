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
   * @param deliveryId deliveryId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadDeliverytDetails(deliveryId: number): Observable<unknown> {
    return this.contractApi.getDeliveryDetails(deliveryId);
  }

  /**
   * Load related deliveries
   * @param orderId deliveryId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadDeliveryInfoForOrder(orderId: number): Observable<unknown> {
    return this.contractApi.getDeliveryInfoForOrder(orderId);
  }


  /**
   * Load order summary
   * @param orderId deliveryId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadDeliveryOrderSummary(orderId: number): Observable<unknown> {
    return this.contractApi.getDeliveryOrderSummary(orderId);
  }

  /**
   * Load order details
   * @param orderId deliveryId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadOrder(orderId: number): Observable<unknown> {
    return this.contractApi.getOrder(orderId);
  }

  /**
   * Load  Delivery Spec Parameters
   * @param OrderProductId SpecGroupId
   */
  @ObservableException()
  loadDeliverySpecParameters(payload): Observable<unknown> {
    return this.contractApi.getDeliverySpecParameters(payload);
  }


  /**
   * Load Delivery Quantity Parameters
   *  @param OrderProductId SpecGroupId
   */
  @ObservableException()
  loadDeliveryQuantityParameters(payload): Observable<unknown>  {
    return this.contractApi.getDeliveryQuantityParameters(payload);
  }

  
    /**
   * Load conversion info
   *  @param productId 
   */
  @ObservableException()
  loadConversionInfo(productId: number): Observable<unknown>  {
    return this.contractApi.getConversionInfo(productId);
  }

    /**
   * Save delivery
   *  @param formValues 
   */
  @ObservableException()
  saveDeliveryInfo(formValues: any): Observable<unknown>  {
    return this.contractApi.saveDelivery(formValues);
  }

     /**
   * Update delivery
   *  @param formValues 
   */
  @ObservableException()
  updateDeliveryInfo(formValues: any): Observable<unknown>  {
    return this.contractApi.updateDelivery(formValues);
  }

  
      /**
   * Verify delivery
   *  @param formValues 
   */
  @ObservableException()
  verifyDelivery(formValues: any): Observable<unknown>  {
    return this.contractApi.verifyDelivery(formValues);
  }

  
  /**
   * Revert verify delivery
   *  @param deliveryId 
  */
  @ObservableException()
  revertVerifyDelivery(deliveryId: any) {
    return this.contractApi.revertVerifyDelivery(deliveryId);
  }

    
  /**
   * Get split delivery limits
   *  @param  
  */
   @ObservableException()
   getSplitDeliveryLimits(payload: any) {
     return this.contractApi.getSplitDeliveryLimits(payload);
   }


   /**
   * Raise claim
   *  @param  
  */
   @ObservableException()
   raiseClaim(payload: any) {
      return this.contractApi.raiseClaim(payload);
  }
 

  
   /**
   * Delete Delivery Product
   *  @param  
  */
    @ObservableException()
    deleteDeliveryProduct(payload: any) {
       return this.contractApi.deleteDeliveryProduct(payload);
   }

  
    
  ngOnDestroy(): void {
    super.onDestroy();
  }
}
