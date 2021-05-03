import { Injectable, OnDestroy } from "@angular/core";
import { Store } from "@ngxs/store";
import { BaseStoreService } from "@shiptech/core/services/base-store.service";
import { ObservableException } from "@shiptech/core/utils/decorators/observable-exception.decorator";
import { Observable } from "rxjs";
import { ModuleLoggerFactory } from "../core/logging/module-logger-factory";
import { IInvoiceDetailsItemRequest, IInvoiceDetailsItemResponse } from "./api/dto/invoice-details-item.dto";
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

  ngOnDestroy(): void {
    super.onDestroy();
  }

}