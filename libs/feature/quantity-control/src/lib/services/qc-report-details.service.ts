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
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction
} from '../store/report-view/qc-report-details.actions';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { QcReportDetailsModel } from './models/qc-report-details.model';

@Injectable()
export class QcReportDetailsService extends BaseStoreService {

  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    @Inject(QUANTITY_CONTROL_API_SERVICE) private api: IQuantityControlApiService) {
    super(store, loggerFactory.createLogger(QcReportDetailsService.name));
  }

  getPortCalls(filter: unknown): Observable<{ items: QcReportsListItemModel[], totalItems: number }> {
    return this.api.getPortCalls({ pageSize: 100 });
  }

  @ObservableException()
  loadPortCallDetails(reportId: number): Observable<unknown> {
    if (!reportId) {
      return throwError(ModuleError.InvalidQcReportId(reportId));
    }
    // Note: apiDispatch is deferred, but the above validation is not, state might change until the caller subscribes
    return this.apiDispatch(
      () => this.api.getPortCallById({ reportId }),
      new LoadReportDetailsAction(reportId),
      (response) => new LoadReportDetailsSuccessfulAction(reportId, new QcReportDetailsModel(response.report)),
      new LoadReportDetailsFailedAction(reportId),
      ModuleError.LoadQcReportDetailsFailed(reportId)
    );
  }
}
