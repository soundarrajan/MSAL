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
import { UpdateProductTypeAction } from '../store/report-view/details/actions/update-product-type.actions';
import { QcProductTypeEditableProps } from '../views/qc-report/details/components/port-call-grid/view-model/product-details.view-model';
import {
  QcVesselResponseBaseStateItem,
  QcVesselResponseSludgeStateItem
} from '../store/report-view/details/qc-vessel-responses.state';
import {
  UpdateActiveBunkerVesselResponse,
  UpdateActiveSludgeVesselResponse
} from '../store/report-view/details/actions/qc-vessel-response.actions';
import { UpdateQcReportComment } from '../store/report-view/details/actions/qc-comment.action';
import { tap } from 'rxjs/operators';
import { UpdateQcReportsListSummaryAction } from '../store/reports-list/qc-report-list-summary/qc-report-list-summary.actions';
import { IGetQcSurveyHistoryListResponse } from './api/request-response/qc-survey-history-list.request-response';

@Injectable()
export class QcReportDetailsService extends BaseStoreService implements OnDestroy {

  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    @Inject(QUANTITY_CONTROL_API_SERVICE) private api: IQuantityControlApiService) {
    super(store, loggerFactory.createLogger(QcReportDetailsService.name));
  }

  protected get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }

  @ObservableException()
  getReportsList(gridRequest: IServerGridInfo): Observable<IGetQcReportsListResponse> {
    return this.api.getReportsList(gridRequest).pipe(
      tap(({ nbOfMatched, nbOfMatchedWithinLimit, nbOfNotMatched }) => this.store.dispatch(new UpdateQcReportsListSummaryAction({
        nbOfMatched,
        nbOfMatchedWithinLimit,
        nbOfNotMatched
      })))
    );
  }

  @ObservableException()
  getSurveyHistoryList(portCallId: string, gridRequest: IServerGridInfo): Observable<IGetQcSurveyHistoryListResponse> {
    return this.api.getSurveyHistoryList({ portCallId, ...gridRequest });
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

  @ObservableException()
  updateProductType(productTypeId: number, prop: QcProductTypeEditableProps, value: number): Observable<unknown> {
    return this.store.dispatch(new UpdateProductTypeAction(productTypeId, prop, value));
  }

  @ObservableException()
  updateActiveSludgeVesselResponse(key: keyof QcVesselResponseSludgeStateItem, value: any): Observable<unknown> {
    // if (!_.keys(this.reportDetailsState.vesselResponse.sludge[categoryId]).some(vesselResponseKey => vesselResponseKey === key)) {
    //   return throwError('Invalid argument provided for updateSludgeVesselResponse');
    // }

    return this.store.dispatch(new UpdateActiveSludgeVesselResponse(key, value));
  }

  @ObservableException()
  updateActiveBunkerVesselResponse(key: keyof QcVesselResponseBaseStateItem, value: any): Observable<unknown> {
    // if (!_.keys(this.reportDetailsState.vesselResponse.bunker[categoryId]).some(vesselResponseKey => vesselResponseKey === key)) {
    //   return throwError('Invalid argument provided for updateBunkerVesselResponse');
    // }

    return this.store.dispatch(new UpdateActiveBunkerVesselResponse(key, value));
  }

  @ObservableException()
  updateReportComment(content: string): Observable<unknown> {
    return this.store.dispatch(new UpdateQcReportComment(content));
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
