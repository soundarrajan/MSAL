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
import { QcProductTypeEditableProps } from '../views/delivery/details/components/port-call-grid/view-model/product-details.view-model';
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
import { IQcReportState } from '../store/report/qc-report.state.model';
import { IDeliveryApiService } from './api/delivery.api.service.interface';
import { DeliveryApi, DELIVERY_API_SERVICE } from './api/delivery-api';
import {
  LoadDeliveryDetailsAction,
  LoadDeliveryDetailsFailedAction,
  LoadDeliveryDetailsSuccessfulAction
} from '../store/delivery/delivery-details.actions';

@Injectable()
export class DeliveryService extends BaseStoreService implements OnDestroy {
  constructor(
    protected store: Store,
    private urlService: UrlService,
    private router: Router,
    loggerFactory: ModuleLoggerFactory,
    private deliveryApi: DeliveryApi
  ) {
    super(store, loggerFactory.createLogger(DeliveryService.name));
  }

  /**
   * @param deliveryId deliveryId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadDeliverytDetails(deliveryId: number): Observable<unknown> {
    return this.deliveryApi.getDeliveryDetails(deliveryId);
  }

  /**
   * Load related deliveries
   * @param orderId deliveryId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadDeliveryInfoForOrder(orderId: number): Observable<unknown> {
    return this.deliveryApi.getDeliveryInfoForOrder(orderId);
  }

  /**
   * Load order summary
   * @param orderId deliveryId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadDeliveryOrderSummary(orderId: number): Observable<unknown> {
    return this.deliveryApi.getDeliveryOrderSummary(orderId);
  }

  /**
   * Load order details
   * @param orderId deliveryId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadOrder(orderId: number): Observable<unknown> {
    return this.deliveryApi.getOrder(orderId);
  }

  /**
   * Load  Delivery Spec Parameters
   * @param OrderProductId SpecGroupId
   */
  @ObservableException()
  loadDeliverySpecParameters(payload): Observable<unknown> {
    return this.deliveryApi.getDeliverySpecParameters(payload);
  }

  /**
   * Load Delivery Quantity Parameters
   *  @param OrderProductId SpecGroupId
   */
  @ObservableException()
  loadDeliveryQuantityParameters(payload): Observable<unknown> {
    return this.deliveryApi.getDeliveryQuantityParameters(payload);
  }

  /**
   * Load conversion info
   *  @param productId
   */
  @ObservableException()
  loadConversionInfo(productId: number): Observable<unknown> {
    return this.deliveryApi.getConversionInfo(productId);
  }

  /**
   * Save delivery
   *  @param formValues
   */
  @ObservableException()
  saveDeliveryInfo(formValues: any): Observable<unknown> {
    return this.deliveryApi.saveDelivery(formValues);
  }

  /**
   * Update delivery
   *  @param formValues
   */
  @ObservableException()
  updateDeliveryInfo(formValues: any): Observable<unknown> {
    return this.deliveryApi.updateDelivery(formValues);
  }

  /**
   * Verify delivery
   *  @param formValues
   */
  @ObservableException()
  verifyDelivery(formValues: any): Observable<unknown> {
    return this.deliveryApi.verifyDelivery(formValues);
  }

  /**
   * Revert verify delivery
   *  @param deliveryId
   */
  @ObservableException()
  revertVerifyDelivery(deliveryId: any) {
    return this.deliveryApi.revertVerifyDelivery(deliveryId);
  }

  /**
   * Get split delivery limits
   *  @param
   */
  @ObservableException()
  getSplitDeliveryLimits(payload: any) {
    return this.deliveryApi.getSplitDeliveryLimits(payload);
  }

  /**
   * Raise claim
   *  @param
   */
  @ObservableException()
  raiseClaim(payload: any) {
    return this.deliveryApi.raiseClaim(payload);
  }

  /**
   * Delete Delivery Product
   *  @param
   */
  @ObservableException()
  deleteDeliveryProduct(payload: any) {
    return this.deliveryApi.deleteDeliveryProduct(payload);
  }

  /**
   * Send Email to labs
   *  @param
   */
  @ObservableException()
  sendLabsTemplateEmail(payload: any) {
    return this.deliveryApi.sendLabsTemplateEmail(payload);
  }

  /**
   * Send Email to labs
   *  @param
   */
  @ObservableException()
  getStaticLists(payload: any) {
    return this.deliveryApi.getStaticLists(payload);
  }

  /**
   * Send Email to labs
   *  @param
   */
  @ObservableException()
  notesAutoSave(payload: any) {
    return this.deliveryApi.notesAutoSave(payload);
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
