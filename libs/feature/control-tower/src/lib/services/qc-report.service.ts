import { Inject, Injectable, OnDestroy } from '@angular/core';
import { QUANTITY_CONTROL_API_SERVICE } from './api/quantity-control-api';
import { IQuantityControlApiService } from './api/quantity-control.api.service.interface';
import { defer, Observable, of, throwError } from 'rxjs';
import { ModuleError } from '../core/error-handling/module-error';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { Store } from '@ngxs/store';
import {
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction
} from '../store/report/qc-report-details.actions';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../store/report/details/qc-report-details.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IGetQcReportsListResponse } from './api/request-response/qc-reports-list.request-response';
import {
  IGetSoundingReportDetailsResponse,
  IGetSoundingReportListResponse
} from './api/request-response/sounding-reports.request-response';
import { UpdateProductTypeAction } from '../store/report/details/actions/update-product-type.actions';
import {
  UpdateActiveBunkerVesselResponseAction,
  UpdateActiveSludgeVesselResponseAction
} from '../store/report/details/actions/qc-vessel-response.actions';
import { UpdateQcReportComment } from '../store/report/details/actions/qc-comment.action';
import { IGetQcSurveyHistoryListResponse } from './api/request-response/qc-survey-history-list.request-response';
import {
  QcAddEventLogAction,
  QcLoadEventsLogAction,
  QcLoadEventsLogFailedAction,
  QcLoadEventsLogSuccessfulAction,
  QcRemoveEventLogAction,
  QcUpdateEventLogAction
} from '../store/report/details/actions/qc-events-log.action';
import { IGetOrderProductsListResponse } from './api/request-response/claims-list.request-response';
import {
  QcSaveReportDetailsAction,
  QcSaveReportDetailsFailedAction,
  QcSaveReportDetailsSuccessfulAction
} from '../store/report/details/actions/save-report.actions';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { Router } from '@angular/router';
import {
  QcVerifyReportAction,
  QcVerifyReportFailedAction,
  QcVerifyReportSuccessfulAction
} from '../store/report/details/actions/verify-report.actions';
import {
  LoadReportListAction,
  LoadReportListFailedAction,
  LoadReportListSuccessfulAction
} from '../store/reports-list/qc-report-list.actions';
import {
  LoadReportSurveyHistoryAction,
  LoadReportSurveyHistoryFailedAction,
  LoadReportSurveyHistorySuccessfulAction
} from '../store/report/qc-report-survey-history.actions';
import {
  QcVesselResponseBunkerStateModel,
  QcVesselResponseSludgeStateModel
} from '../store/report/details/qc-vessel-responses.state';
import { values } from 'lodash';
import { IQcEventLogDeletedListItemDto } from './api/dto/qc-event-log-list-item.dto';
import {
  QcRevertVerifyReportAction,
  QcRevertVerifyReportFailedAction,
  QcRevertVerifyReportSuccessfulAction
} from '../store/report/details/actions/revert-verify-report.actions';
import { IQcReportState } from '../store/report/qc-report.state.model';
import { IVesselToWatchLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import {
  UpdateQcReportPortCall,
  UpdateQcReportVessel
} from '../store/report/details/actions/qc-vessel.action';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { IQcVesselPortCallDto } from './api/dto/qc-vessel-port-call.interface';
import { map } from 'rxjs/operators';
import {
  QcClearPortCallBdnAction,
  QcUpdatePortCallAction,
  QcUpdatePortCallFailedAction,
  QcUpdatePortCallSuccessfulAction
} from '../store/report/details/actions/update-port-call-bdn.actions';
import {
  UpdateVesselToWatchAction,
  UpdateVesselToWatchFailedAction,
  UpdateVesselToWatchSuccessfulAction
} from '../store/report/details/actions/update-vessel-to-watch.action';
import { QcProductTypeEditableProps } from '../views/control-tower/details/components/port-call-grid/view-model/product-details.view-model';

@Injectable()
export class QcReportService extends BaseStoreService implements OnDestroy {
  constructor(
    protected store: Store,
    private urlService: UrlService,
    private router: Router,
    loggerFactory: ModuleLoggerFactory,
    @Inject(QUANTITY_CONTROL_API_SERVICE)
    private api: IQuantityControlApiService
  ) {
    super(store, loggerFactory.createLogger(QcReportService.name));
  }

  protected get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }

  protected get reportState(): IQcReportState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report;
  }

  @ObservableException()
  getReportsList$(
    gridRequest: IServerGridInfo
  ): Observable<IGetQcReportsListResponse> {
    return this.apiDispatch(
      () => this.api.getReportList({ ...gridRequest }),
      new LoadReportListAction(gridRequest),
      response =>
        new LoadReportListSuccessfulAction(
          response.nbOfMatched,
          response.nbOfNotMatched,
          response.nbOfMatchedWithinLimit,
          response.totalCount
        ),
      LoadReportListFailedAction,
      ModuleError.LoadReportListFailed
    );
  }

  @ObservableException()
  getSurveyHistoryList$(
    vesselId: number,
    gridRequest: IServerGridInfo
  ): Observable<IGetQcSurveyHistoryListResponse> {
    return this.apiDispatch(
      () => this.api.getSurveyHistoryList({ id: vesselId, ...gridRequest }),
      new LoadReportSurveyHistoryAction(gridRequest),
      response =>
        new LoadReportSurveyHistorySuccessfulAction(
          response.nbOfMatched,
          response.nbOfNotMatched,
          response.nbOfMatchedWithinLimit,
          response.totalCount
        ),
      LoadReportSurveyHistoryFailedAction,
      ModuleError.LoadReportSurveyHistoryFailed
    );
  }

  /**
   * Load report details for e specific or new report
   * @param reportId reportId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadReportDetails$(reportId: number): Observable<unknown> {
    // Note: apiDispatch is deferred, but the above validation is not, state might change until the caller subscribes
    return this.apiDispatch(
      () => this.api.getReportDetails({ id: reportId }),
      new LoadReportDetailsAction(reportId),
      response => new LoadReportDetailsSuccessfulAction(reportId, response),
      new LoadReportDetailsFailedAction(reportId),
      ModuleError.LoadReportDetailsFailed(reportId)
    );
  }

  @ObservableException()
  getSoundingReportList$(
    gridRequest: IServerGridInfo
  ): Observable<IGetSoundingReportListResponse> {
    return this.api.getSoundingReportList({
      id: this.reportDetailsState.vessel.id,
      reference: this.reportDetailsState.portCall.voyageReference,
      ...gridRequest
    });
  }

  @ObservableException()
  getSoundingReportListItemDetails$(
    soundingReportId: number,
    gridRequest: IServerGridInfo
  ): Observable<IGetSoundingReportDetailsResponse> {
    return this.api.getSoundingReportDetails({
      ...gridRequest,
      id: soundingReportId
    });
  }

  @ObservableException()
  updateProductType$(
    productTypeId: number,
    prop: QcProductTypeEditableProps,
    value: number
  ): Observable<unknown> {
    return this.store.dispatch(
      new UpdateProductTypeAction(productTypeId, prop, value)
    );
  }

  @ObservableException()
  updateActiveSludgeVesselResponse$(
    key: keyof QcVesselResponseSludgeStateModel,
    value: any
  ): Observable<unknown> {
    return this.store.dispatch(
      new UpdateActiveSludgeVesselResponseAction(key, value)
    );
  }

  @ObservableException()
  updateActiveBunkerVesselResponse$(
    key: keyof QcVesselResponseBunkerStateModel,
    value: any
  ): Observable<unknown> {
    return this.store.dispatch(
      new UpdateActiveBunkerVesselResponseAction(key, value)
    );
  }

  @ObservableException()
  updateReportComment$(content: string): Observable<unknown> {
    return this.store.dispatch(new UpdateQcReportComment(content));
  }

  @ObservableException()
  updateVessel$(vessel: IVesselToWatchLookupDto): Observable<unknown> {
    return this.store.dispatch(new UpdateQcReportVessel(vessel));
  }

  @ObservableException()
  updatePortCallId$(portCall: IQcVesselPortCallDto): Observable<unknown> {
    return this.store.dispatch(new UpdateQcReportPortCall(portCall));
  }

  @ObservableException()
  verifyVesselReports$(reportIds: number[]): Observable<unknown> {
    if (this.reportDetailsState.isNew) return EMPTY$;

    return this.apiDispatch(
      () => this.api.verifyReports({ reportIds }),
      QcVerifyReportAction,
      __ => QcVerifyReportSuccessfulAction,
      QcVerifyReportFailedAction,
      ModuleError.VerifyReportFailed
    );
  }

  @ObservableException()
  revertVerifyVessel$(reportIds: number[]): Observable<unknown> {
    if (this.reportDetailsState.isNew) return EMPTY$;

    return this.apiDispatch(
      () => this.api.revertVerifyVessel({ reportIds }),
      QcRevertVerifyReportAction,
      __ => QcRevertVerifyReportSuccessfulAction,
      QcRevertVerifyReportFailedAction,
      ModuleError.RevertVerifyReportFailed
    );
  }

  @ObservableException()
  markSludgeVerification$(
    reportId: number,
    verify: boolean
  ): Observable<unknown> {
    return this.api.markSludgeVerification({
      id: reportId,
      IsVerifiedSludge: verify
    });
  }

  @ObservableException()
  getOrderProductsList$(): Observable<IGetOrderProductsListResponse> {
    return this.api.getOrderProductsList({
      vesselVoyageDetailId: this.reportDetailsState.portCall
        .vesselVoyageDetailId
    });
  }

  raiseClaim$(orderProductId: number, orderId: number): Observable<unknown> {
    if (this.reportDetailsState.isNew) return EMPTY$;

    return defer(() =>
      of(
        window.open(this.urlService.newClaim(orderProductId, orderId), '_blank')
      )
    );
  }

  previewEmail$(
    reportId: number,
    emailTransactionTypeId: number
  ): Observable<unknown> {
    return defer(
      () =>
        (window.location.href = this.urlService.previewEmail({
          reportId: reportId,
          emailTransactionTypeId: emailTransactionTypeId
        }))
    );
  }

  @ObservableException()
  loadEventsLog$(): Observable<unknown> {
    const reportId = this.reportDetailsState.id;

    if (this.reportDetailsState.isNew) return EMPTY$;
    return this.apiDispatch(
      () => this.api.getEventsLog({ id: reportId }),
      new QcLoadEventsLogAction(),
      response => new QcLoadEventsLogSuccessfulAction(response.items),
      new QcLoadEventsLogFailedAction(),
      ModuleError.LoadEventsLogFailed
    );
  }

  addEventLog(): void {
    this.addEventLog$().subscribe();
  }

  @ObservableException()
  addEventLog$(eventDetails?: string): Observable<unknown> {
    return this.store.dispatch(new QcAddEventLogAction(eventDetails));
  }

  removeEventLog(id: number): void {
    this.removeEventLog$(id).subscribe();
  }

  @ObservableException()
  removeEventLog$(id: number): Observable<unknown> {
    return this.store.dispatch(new QcRemoveEventLogAction(id));
  }

  updateEventLog(id: number, newEventDetails: string): void {
    this.updateEventLog$(id, newEventDetails).subscribe();
  }

  @ObservableException()
  updateEventLog$(id: number, newEventDetails: string): Observable<unknown> {
    return this.store.dispatch(new QcUpdateEventLogAction(id, newEventDetails));
  }

  // updateVesselToWatch(id: number, vesselToWatchFlag: boolean): void {
  //   this.updateVesselToWatch$(id, vesselToWatchFlag).subscribe();
  // }

  @ObservableException()
  updateVesselToWatch$(
    newVessel: IVesselToWatchLookupDto
  ): Observable<unknown> {
    return this.apiDispatch(
      () => {
        const toSend = {
          id: newVessel.id,
          vesselToWatchFlag: newVessel.vesselToWatchFlag
        };
        return this.api.updateVesselToWatch(toSend);
      },
      new UpdateVesselToWatchAction(),
      () => new UpdateVesselToWatchSuccessfulAction(newVessel),
      new UpdateVesselToWatchFailedAction(),
      ModuleError.UpdateVesselToWatch
    );
  }

  saveReport(): void {
    this.saveReport$().subscribe();
  }

  @ObservableException()
  saveReport$(): Observable<number> {
    if (!this.reportDetailsState.vessel)
      return throwError(ModuleError.VesselIsRequired);

    if (!this.reportDetailsState.portCall)
      return throwError(ModuleError.PortCallIsRequired);

    if (this.reportDetailsState.eventsLog.items.length) {
      const eventsToBeChecked = this.reportDetailsState.eventsLog.itemsById;
      let error = false;
      Object.keys(eventsToBeChecked).filter(item => {
        if (
          (!eventsToBeChecked[item].eventDetails ||
            eventsToBeChecked[item].eventDetails.replace(/\s/g, '') === '') &&
          !error
        ) {
          error = true;
        }
      });
      if (error) {
        return throwError(ModuleError.EventNotesShouldNotBeEmpty);
      }
    }

    return this.apiDispatch(
      () => {
        const reportDetailsState = this.reportDetailsState;
        const vesselResponse = reportDetailsState.vesselResponse;
        const newNotes = [];
        values(reportDetailsState.eventsLog.itemsById).filter(s => {
          if (s.isNew) {
            s = {
              ...s,
              id: undefined
            };
          } else {
            s = { ...s };
          }
          newNotes.push(s);
        });
        return this.api.saveReportDetails({
          id: reportDetailsState.id,
          portCall: reportDetailsState.portCall,
          isVerifiedSludgeQty: vesselResponse.sludge.sludgeVerified,
          sludgePercentage: vesselResponse.sludge.sludge,
          comments: reportDetailsState.comment,
          sludgeVesselResponseDescription: vesselResponse.sludge.description,
          bunkerVesselResponseDescription: vesselResponse.bunker.description,
          bunkerVesselResponseCategory: vesselResponse.bunker.activeCategory,
          sludgeVesselResponseCategory: vesselResponse.sludge.activeCategory,
          details: values(reportDetailsState.productTypesById).map(s => ({
            id: s.id,
            productTypeId: s.productType.id,
            logBookRobQtyBeforeDelivery: s.robBeforeDeliveryLogBookROB,
            measuredRobQtyBeforeDelivery: s.robBeforeDeliveryMeasuredROB,
            beforeDeliveryQtyUomId: reportDetailsState.robBeforeDeliveryUom?.id,
            measuredRobDeliveredQty: s.measuredDeliveredQty,
            deliveredQtyUomId: reportDetailsState.deliveredQtyUom?.id,
            logBookRobQtyAfterDelivery: s.robAfterDeliveryLogBookROB,
            measuredRobQtyAfterDelivery: s.robAfterDeliveryMeasuredROB,
            afterDeliveryQtyUomId: reportDetailsState.robAfterDeliveryUom?.id
          })),
          notes: [
            ...values(newNotes),
            ...(reportDetailsState.eventsLog.deletedItemIds ?? []).map(
              s =>
                <IQcEventLogDeletedListItemDto>{
                  id: s,
                  isDeleted: true
                }
            )
          ]
        });
      },
      new QcSaveReportDetailsAction(),
      response =>
        new QcSaveReportDetailsSuccessfulAction(
          response.reportId,
          response.emailTransactionTypeId,
          response.productTypes
        ),
      new QcSaveReportDetailsFailedAction(),
      ModuleError.SaveReportDetailsFailed
    ).pipe(map(response => response.reportId));
  }

  @ObservableException()
  loadPortCallBdn$(portCall: IQcVesselPortCallDto): Observable<unknown> {
    if (!portCall) {
      return this.store.dispatch(QcClearPortCallBdnAction);
    }

    return this.apiDispatch(
      () =>
        this.api.loadPortCallBdn({
          vesselVoyageDetailsId: portCall.vesselVoyageDetailId
        }),
      new QcUpdatePortCallAction(),
      response =>
        new QcUpdatePortCallSuccessfulAction(
          response.vesselVoyageDetailsId,
          response.productTypes,
          response.nbOfClaims,
          response.nbOfDeliveries
        ),
      new QcUpdatePortCallFailedAction(),
      ModuleError.LoadPortCallBtnFailed
    );
  }

  @ObservableException()
  getQcReportListExportUrl(): string {
    return this.api.getReportListExportUrl();
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
