import { Inject, Injectable, OnDestroy } from '@angular/core';
import { QUANTITY_CONTROL_API_SERVICE } from './api/quantity-control-api';
import { IQuantityControlApiService } from './api/quantity-control.api.service.interface';
import { Observable, throwError } from 'rxjs';
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
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../store/report-view/details/qc-report-details.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IGetQcReportsListResponse } from './api/request-response/qc-reports-list.request-response';
import {
  IGetSoundingReportDetailsResponse,
  IGetSoundingReportListResponse
} from './api/request-response/sounding-reports.request-response';

@Injectable()
export class QcReportDetailsService extends BaseStoreService implements OnDestroy {

  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    @Inject(QUANTITY_CONTROL_API_SERVICE) private api: IQuantityControlApiService) {
    super(store, loggerFactory.createLogger(QcReportDetailsService.name));
  }

  @ObservableException()
  getReportsList(gridRequest: IServerGridInfo): Observable<IGetQcReportsListResponse> {
    return this.api.getReportsList(gridRequest);
  }

  @ObservableException()
  loadReportDetails(reportId: number): Observable<unknown> {
    if (!reportId) {
      return throwError(ModuleError.InvalidQcReportId(reportId));
    }
    // Note: apiDispatch is deferred, but the above validation is not, state might change until the caller subscribes
    return this.apiDispatch(
      () => this.api.getReportById({ reportId }),
      new LoadReportDetailsAction(reportId),
      (response) => new LoadReportDetailsSuccessfulAction(reportId, response.report),
      new LoadReportDetailsFailedAction(reportId),
      ModuleError.LoadQcReportDetailsFailed(reportId)
    );
  }

  @ObservableException()
  getSoundingReportList(gridRequest: IServerGridInfo): Observable<IGetSoundingReportListResponse> {
    return this.api.getSoundingReportList({ ...gridRequest, reportId: this.reportDetailsState.id });
  }

  @ObservableException()
  getSoundingReportListItemDetails(reportId: number, gridRequest: IServerGridInfo): Observable<IGetSoundingReportDetailsResponse> {
    return this.api.getSoundingReportDetails({ ...gridRequest, reportId });
  }

  protected get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
