import { Inject, Injectable, OnDestroy } from '@angular/core';
import { INVOICE_COMPLETE_API_SERVICE } from './api/invoice-complete-api';
import { Observable } from 'rxjs';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { Store } from '@ngxs/store';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { Router } from '@angular/router';
import { IInvoiceCompleteApiService } from './api/invoice-complete.api.service.interface';
import { IGetInvoiceCompletesListResponse } from './api/dto/invoice-complete-list-item.dto';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';

@Injectable()
export class InvoiceCompleteService extends BaseStoreService implements OnDestroy {
  constructor(
    protected store: Store,
    private urlService: UrlService,
    private router: Router,
    loggerFactory: ModuleLoggerFactory,
    @Inject(INVOICE_COMPLETE_API_SERVICE) private api: IInvoiceCompleteApiService) {
    super(store, loggerFactory.createLogger(InvoiceCompleteService.name));
  }

  @ObservableException()
  getReportsList$(gridRequest: IServerGridInfo): Observable<IGetInvoiceCompletesListResponse> {
    return this.api.getReportList({ ...gridRequest });
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
