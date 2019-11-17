import { Inject, Injectable, OnDestroy } from '@angular/core';
import { QUANTITY_CONTROL_API_SERVICE } from './api/quantity-control-api';
import { IQuantityControlApiService } from './api/quantity-control.api.service.interface';
import { Observable, of, throwError } from 'rxjs';
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
  UpdateActiveBunkerVesselResponseAction,
  UpdateActiveSludgeVesselResponseAction
} from '../store/report-view/details/actions/qc-vessel-response.actions';
import { UpdateQcReportComment } from '../store/report-view/details/actions/qc-comment.action';
import { tap } from 'rxjs/operators';
import { UpdateQcReportsListSummaryAction } from '../store/reports-list/qc-report-list-summary/qc-report-list-summary.actions';
import { IGetQcSurveyHistoryListResponse } from './api/request-response/qc-survey-history-list.request-response';
import {
  QcAddEventLogAction,
  QcLoadEventsLogAction,
  QcLoadEventsLogFailedAction,
  QcLoadEventsLogSuccessfulAction,
  QcRemoveEventLogAction,
  QcUpdateEventLogAction
} from '../store/report-view/details/actions/qc-events-log.action';
import { IGetOrderProductsListResponse } from './api/request-response/claims-list.request-response';
import {
  QcSaveReportDetailsAction, QcSaveReportDetailsFailedAction,
  QcSaveReportDetailsSuccessfulAction
} from '../store/report-view/details/actions/save-report.actions';
import { QcReportState } from '../store/report-view/qc-report.state';

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
      response => new LoadReportDetailsSuccessfulAction(reportId, response.report),
      new LoadReportDetailsFailedAction(reportId),
      ModuleError.LoadQcReportDetailsFailed(reportId)
    );
  }

  @ObservableException()
  getSoundingReportList(gridRequest: IServerGridInfo): Observable<IGetSoundingReportListResponse> {
    return this.api.getSoundingReportList({ ...gridRequest, portCallId: this.reportDetailsState.id });
  }

  @ObservableException()
  getSoundingReportListItemDetails(soundingReportId: number, gridRequest: IServerGridInfo): Observable<IGetSoundingReportDetailsResponse> {
    return this.api.getSoundingReportDetails({ ...gridRequest, soundingReportId });
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

    return this.store.dispatch(new UpdateActiveSludgeVesselResponseAction(key, value));
  }

  @ObservableException()
  updateActiveBunkerVesselResponse(key: keyof QcVesselResponseBaseStateItem, value: any): Observable<unknown> {
    // if (!_.keys(this.reportDetailsState.vesselResponse.bunker[categoryId]).some(vesselResponseKey => vesselResponseKey === key)) {
    //   return throwError('Invalid argument provided for updateBunkerVesselResponse');
    // }

    return this.store.dispatch(new UpdateActiveBunkerVesselResponseAction(key, value));
  }

  @ObservableException()
  updateReportComment(content: string): Observable<unknown> {
    return this.store.dispatch(new UpdateQcReportComment(content));
  }

  @ObservableException()
  flagVesselForReport(reportId: number): Observable<unknown> {
    return this.api.watchVessel({ reportId });
  }

  @ObservableException()
  verifyVesselReports(reportIds: number[]): Observable<unknown> {
    return this.api.verifyReports({ reportIds });
  }

  @ObservableException()
  getOrderProductsList(): Observable<IGetOrderProductsListResponse> {
    return this.api.getOrderProductsList({});
  }

  @ObservableException()
  raiseClaim(reportIds: number[]): Observable<unknown> {
    return this.api.raiseClaim({});
  }

  @ObservableException()
  loadEventsLog(): Observable<unknown> {
    const reportId = this.reportDetailsState.id;

    return this.apiDispatch(
      () => this.api.getEventsLog({ reportId }),
      new QcLoadEventsLogAction(),
      response => new QcLoadEventsLogSuccessfulAction(response.items),
      new QcLoadEventsLogFailedAction(),
      ModuleError.LoadEventsLogFailed
    );
  }

  addEventLog(eventDetails?: string): void {
    this.addEventLog$().subscribe();
  }

  @ObservableException()
  addEventLog$(eventDetails?: string): Observable<unknown> {
    return this.store.dispatch(new QcAddEventLogAction(eventDetails))
  }

  removeEventLog(id: number): void {
    this.removeEventLog$(id).subscribe();
  }

  @ObservableException()
  removeEventLog$(id: number): Observable<unknown> {
    return this.store.dispatch(new QcRemoveEventLogAction(id))
  }

  updateEventLog(id: number, newEventDetails: string): void {
    this.updateEventLog$(id, newEventDetails).subscribe();
  }

  @ObservableException()
  updateEventLog$(id: number, newEventDetails: string):  Observable<unknown> {
    return this.store.dispatch(new QcUpdateEventLogAction(id, newEventDetails))
  }

  saveReport(): void {
    this.saveReport$().subscribe();
  }

  @ObservableException()
  saveReport$(): Observable<unknown> {
    return this.apiDispatch(
      () => this.api.saveReportDetails({ }),
      new QcSaveReportDetailsAction(),
      response => new QcSaveReportDetailsSuccessfulAction(),
      new QcSaveReportDetailsFailedAction(),
      ModuleError.SaveReportDetailsFailed
    );
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
