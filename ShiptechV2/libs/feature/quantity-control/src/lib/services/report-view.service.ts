import { Inject, Injectable } from '@angular/core';
import { QUANTITY_CONTROL_API_SERVICE } from './api/quantity-control-api';
import { IQuantityControlApiService } from './api/quantity-control.api.service.interface';
import { Observable, throwError } from 'rxjs';
import { QcReportsListItemModel } from './models/qc-reports-list-item.model';
import { ModuleError } from '../core/error-handling/module-error';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { Store } from '@ngxs/store';
import {
  LoadReportViewAction,
  LoadReportViewFailedAction,
  LoadReportViewSuccessfulAction
} from '../store/report-view/qc-report-view.actions';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { QcReportItemViewModel } from './models/qc-report-item-view.model';

@Injectable()
export class ReportViewService extends BaseStoreService {

  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    @Inject(QUANTITY_CONTROL_API_SERVICE) private api: IQuantityControlApiService) {
    super(store, loggerFactory.createLogger(ReportViewService.name));
  }

  getPortCalls(filter: unknown): Observable<{ items: QcReportsListItemModel[], totalItems: number }> {
    return this.api.getPortCalls({ pageSize: 100 });
  }

  @ObservableException()
  loadPortCallDetails(portCallId: string): Observable<unknown> {
    if (!portCallId) {
      return throwError(ModuleError.InvalidPortCallId(portCallId));
    }
    // Note: apiDispatch is deferred, but the above validation is not, state might change until the caller subscribes
    return this.apiDispatch(
      () => this.api.getPortCallById({ portCallId }),
      new LoadReportViewAction(portCallId),
      (response) => new LoadReportViewSuccessfulAction(portCallId, new QcReportItemViewModel(response.portCall)),
      new LoadReportViewFailedAction(portCallId),
      ModuleError.LoadPortCallDetailsFailed(portCallId)
    );
  }
}
