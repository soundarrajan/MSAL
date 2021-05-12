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

  getInvoicDetails( gridRequest : IInvoiceDetailsItemRequest ): Observable<IInvoiceDetailsItemResponse> {
    return this.api.getInvoicDetails(gridRequest);
  }
  getNewInvoicDetails( gridRequest : INewInvoiceDetailsItemRequest ): Observable<IInvoiceDetailsItemResponse> {
    return this.api.getNewInvoicDetails(gridRequest);
  }

  @ObservableException()
  updateInvoiceItem( gridRequest : IInvoiceDetailsItemRequest ): Observable<IInvoiceDetailsItemResponse> {
    return this.api.updateInvoiceItem(gridRequest);
  }
  @ObservableException()
  approveInvoiceItem( gridRequest : IInvoiceDetailsItemRequest ): Observable<IInvoiceDetailsItemResponse> {
    return this.api.approveInvoiceItem(gridRequest);
  }
  @ObservableException()
  productListOnInvoice( gridRequest :any ): Observable<any> {
    return this.api.productListOnInvoice(gridRequest);
  }
  @ObservableException()
  submitapproval( gridRequest :any ): Observable<any> {
    return this.api.submitapproval(gridRequest);
  }
  @ObservableException()
  cancelInvoiceItem( gridRequest :any ): Observable<any> {
    return this.api.cancelInvoiceItem(gridRequest);
  }
  @ObservableException()
  acceptInvoiceItem( gridRequest :any ): Observable<any> {
    return this.api.acceptInvoiceItem(gridRequest);
  }
  @ObservableException()
  revertInvoiceItem( gridRequest :any ): Observable<any> {
    return this.api.revertInvoiceItem(gridRequest);
  }
  @ObservableException()
  rejectInvoiceItem( gridRequest :any ): Observable<any> {
    return this.api.rejectInvoiceItem(gridRequest);
  }
  @ObservableException()
  submitReview( gridRequest :any ): Observable<any> {
    return this.api.submitReview(gridRequest);
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
   
  

  ngOnDestroy(): void {
    super.onDestroy();
  }

}