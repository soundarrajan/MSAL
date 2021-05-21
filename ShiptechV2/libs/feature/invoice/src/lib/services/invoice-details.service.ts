import { Injectable, OnDestroy } from "@angular/core";
import { Store } from "@ngxs/store";
import { BaseStoreService } from "@shiptech/core/services/base-store.service";
import { ObservableException } from "@shiptech/core/utils/decorators/observable-exception.decorator";
import { Observable } from "rxjs";
import { ModuleLoggerFactory } from "../core/logging/module-logger-factory";
import { IInvoiceDetailsItemRequest, IInvoiceDetailsItemResponse,INewInvoiceDetailsItemRequest } from "./api/dto/invoice-details-item.dto";
import { InvoiceCompleteApi } from "./api/invoice-complete-api";

@Injectable()
export class InvoiceDetailsService extends BaseStoreService
  implements OnDestroy {
  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    private api: InvoiceCompleteApi
  ) {
    super(store, loggerFactory.createLogger(InvoiceDetailsService.name));
  }

  @ObservableException()
  getInvoicDetails(invoiceId: number): Observable<IInvoiceDetailsItemResponse> {
    return this.api.getInvoicDetails(invoiceId);
  }

  @ObservableException()
  getNewInvoicDetails(invoiceFromDelivery : any): Observable<IInvoiceDetailsItemResponse> {
    return this.api.getNewInvoicDetails(invoiceFromDelivery);
  }

     /**
   * Save invoice
   *  @param formValues
   */
  @ObservableException()
  saveInvoice(formValues: any): Observable<unknown>  {
      return this.api.createInvoice(formValues);
  }

  /**
   * Update invoice
   *  @param formValues
   */
  @ObservableException()
  updateInvoice(formValues: any): Observable<IInvoiceDetailsItemResponse> {
    return this.api.updateInvoice(formValues);
  }

  @ObservableException()
  approveInvoiceItem(formValues: any): Observable<IInvoiceDetailsItemResponse> {
    return this.api.approveInvoiceItem(formValues);
  }

  @ObservableException()
  productListOnInvoice(pageFilters: any): Observable<any> {
    return this.api.productListOnInvoice(pageFilters);
  }

  @ObservableException()
  submitapproval(payload: any): Observable<any> {
    return this.api.submitapproval(payload);
  }

  @ObservableException()
  cancelInvoiceItem(invoiceId: number): Observable<any> {
    return this.api.cancelInvoiceItem(invoiceId);
  }

  @ObservableException()
  acceptInvoiceItem(invoiceId: number): Observable<any> {
    return this.api.acceptInvoiceItem(invoiceId);
  }

  @ObservableException()
  revertInvoiceItem(invoiceId: number): Observable<any> {
    return this.api.revertInvoiceItem(invoiceId);
  }

  @ObservableException()
  rejectInvoiceItem(invoiceId: number): Observable<any> {
    return this.api.rejectInvoiceItem(invoiceId);
  }

  @ObservableException()
  submitForReview(invoiceId: number): Observable<any> {
    return this.api.submitForReview(invoiceId);
  }

   /**
 * @param payload = False
 */
  @ObservableException()
  getStaticLists(payload: any): Observable<unknown> {
    return this.api.getStaticLists(payload);
  }


    /**
 * @param payload
 */
  @ObservableException()
  getUomConversionFactor(payload: any): Observable<unknown> {
    return this.api.getUomConversionFactor(payload);
  }


    /**
 * @param payload
 */
  @ObservableException()
  calculateProductRecon(payload: any): Observable<unknown> {
    return this.api.calculateProductRecon(payload);
  }

      /**
 * @param payload
 */
  @ObservableException()
  calculateCostRecon(payload: any): Observable<unknown> {
    return this.api.calculateCostRecon(payload);
  }


     /**
 * @param payload
 */
  @ObservableException()
  addTransaction(payload: any): Observable<unknown> {
    return this.api.addTransaction(payload);
  }

      /**
 * @param payload
 */
  @ObservableException()
  computeInvoiceTotalConversion(payload: any): Observable<unknown> {
    return this.api.computeInvoiceTotalConversion(payload);
  }

  /**
 * @param payload
 */
  @ObservableException()
  getAdditionalCostsComponentTypes(payload: any): Observable<unknown> {
    return this.api.getAdditionalCostsComponentTypes(payload);
  }

  @ObservableException()
  getFinalInvoiceDueDates(payload: any): Observable<IInvoiceDetailsItemResponse> {
    return this.api.getFinalInvoiceDueDates(payload);
  }

    /**
 * @param payload
 */
  @ObservableException()
  getApplyForList(payload: any): Observable<unknown> {
    return this.api.getApplyForList(payload);
  }
   


  @ObservableException()
  getBankAccountNumber(counterPartyId: number): Observable<IInvoiceDetailsItemResponse> {
    return this.api.getBankAccountNumber(counterPartyId);
  }
  /**
 * @param payload = False 
 */
  @ObservableException()
  getTenantConfiguration(payload: boolean): Observable<IInvoiceDetailsItemResponse> {
    return this.api.getTenantConfiguration(payload);
  }


      /**
 * @param payload
 */
  @ObservableException()
  notesAutoSave(payload: any): Observable<unknown> {
    return this.api.notesAutoSave(payload);
  }

        /**
 * @param payload
 */
  @ObservableException()
  getAdditionalCostsPerPort(payload: any): Observable<unknown> {
    return this.api.getAdditionalCostsPerPort(payload);
  }


        
  ngOnDestroy(): void {
    super.onDestroy();
  }

}
