import { Injectable, InjectionToken } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IGetQcReportsListRequest, IGetQcReportsListResponse } from './request-response/qc-reports-list.request-response';
import { IQcReportDetailsRequest, IQcReportDetailsResponse } from './request-response/qc-report-details-by-id.request-response';
import {
  IGetSoundingReportDetailsRequest,
  IGetSoundingReportDetailsResponse,
  IGetSoundingReportListRequest,
  IGetSoundingReportListResponse
} from './request-response/sounding-reports.request-response';
import { IQcVerifyReportsRequest, IQcVerifyReportsResponse } from './request-response/verify-port-calls.request-response';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { IGetQcSurveyHistoryListRequest, IGetQcSurveyHistoryListResponse } from './request-response/qc-survey-history-list.request-response';
import { IGetEventsLogRequest, IGetEventsLogResponse } from './request-response/events-log.request-response';
import { ISaveReportDetailsRequest, ISaveReportDetailsResponse } from './request-response/report-details-save.request-response';
import { IGetOrderProductsListRequest, IGetOrderProductsListResponse } from './request-response/claims-list.request-response';
import { map } from 'rxjs/operators';
import { IQcReportsListItemDto } from './dto/qc-reports-list-item.dto';
import * as _ from 'lodash';
import { IQcMarkSludgeVerificationRequest, IQcMarkSludgeVerificationResponse } from './request-response/qc-mark-sludge-verification.request-response';
import { IQcSurveyHistoryListItemDto } from './dto/qc-survey-history-list-item.dto';
import { IQcSoundingReportDetailsItemDto, IQcSoundingReportItemDto } from './dto/qc-report-sounding.dto';
import { IQcEventLogListItemDto } from './dto/qc-event-log-list-item.dto';
import { IQcRevertVerifyReportsRequest, IQcRevertVerifyReportsResponse } from './request-response/revert-verify-port-calls.request-response';
import { IQcOrderProductsListItemDto } from './dto/qc-order-products-list-item.dto';
import { IQcLoadPortCallBdnRequest, IQcLoadPortCallBdnResponse } from './request-response/load-bdn-port-call.request-response';

export namespace RobApiPaths {
  export const allRequests = 'api/procurement/request/tableView';
  export const getReportsList = () => `api/quantityControlReport/list`;
  export const getReportDetails = () => `api/quantityControlReport/details`;
  export const loadPortCallBdn = () => `api/quantityControlReport/portCallBdn`;
  export const saveReport = () => `api/quantityControlReport/save`;
  export const getReportEventNotes = () => `api/quantityControlReport/notes`;
  export const getSoundingReportList = () => `api/soundingReport/list`;
  export const getSoundingReportDetails = () => `api/soundingReport/details`;
  export const getSurveyHistoryList = () => `api/quantityControlReport/history`;
  export const verifySludge = () => `api/quantityControlReport/verifySludge`;
  export const verify = () => `api/quantityControlReport/verify`;
  export const revertVerify = () => `api/quantityControlReport/revertVerify`;
  export const getRelatedVoyageOrders = () => `api/quantityControlReport/getRelatedVoyageOrders`;
}

@Injectable({
  providedIn: 'root'
})
export class QuantityControlApi implements IQuantityControlApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.robApi;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getReportList(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse> {
    return this.http.post<IQcReportsListItemDto[]>(`${this._apiUrl}/${RobApiPaths.getReportsList()}`, { payload: request })
      .pipe(map(r => {
        const items = r || [];
        const firstItem = (_.first(items) || <IQcReportsListItemDto>{});

        return {
          items: items,
          totalItems: firstItem?.totalCount ?? 0,
          nbOfMatched: firstItem.nbOfMatched || 0,
          nbOfMatchedWithinLimit: firstItem.nbOfMatchedWithinLimit || 0,
          nbOfNotMatched: firstItem.nbOfNotMatched || 0
        };
      }));
  }

  @ObservableException()
  getSurveyHistoryList(request: IGetQcSurveyHistoryListRequest): Observable<IGetQcSurveyHistoryListResponse> {
    return this.http.post<IQcSurveyHistoryListItemDto[]>(`${this._apiUrl}/${RobApiPaths.getSurveyHistoryList()}`, { payload: request })
      .pipe(map(r => {
        const items = r || [];
        const firstItem = (_.first(items) || <IQcSurveyHistoryListItemDto>{});

        return {
          items: items,
          totalItems: items.length,
          nbOfMatched: firstItem.nbOfMatched || 0,
          nbOfMatchedWithinLimit: firstItem.nbOfMatchedWithinLimit || 0,
          nbOfNotMatched: firstItem.nbOfNotMatched || 0
        };
      }));
  }

  @ObservableException()
  getReportDetails(request: IQcReportDetailsRequest): Observable<IQcReportDetailsResponse> {
    return this.http.post<IQcReportDetailsResponse>(`${this._apiUrl}/${RobApiPaths.getReportDetails()}`, { payload: request });
  }

  @ObservableException()
  saveReportDetails(request: ISaveReportDetailsRequest): Observable<ISaveReportDetailsResponse> {
    return this.http.post<ISaveReportDetailsResponse>(`${this._apiUrl}/${RobApiPaths.saveReport()}`, { payload: request });
  }

  @ObservableException()
  getSoundingReportList(request: IGetSoundingReportListRequest): Observable<IGetSoundingReportListResponse> {
    return this.http.post<IQcSoundingReportItemDto[]>(`${this._apiUrl}/${RobApiPaths.getSoundingReportList()}`, { payload: request })
      .pipe(map(r => ({
        items: r || [],
        totalItems: (r || []).length
      })));
  }

  @ObservableException()
  getSoundingReportDetails(request: IGetSoundingReportDetailsRequest): Observable<IGetSoundingReportDetailsResponse> {
    return this.http.post<IQcSoundingReportDetailsItemDto[]>(`${this._apiUrl}/${RobApiPaths.getSoundingReportDetails()}`, { payload: request })
      .pipe(map(r => ({
        items: r || [],
        totalItems: (r || []).length
      })));
  }

  @ObservableException()
  getOrderProductsList(request: IGetOrderProductsListRequest): Observable<IGetOrderProductsListResponse> {
    return this.http.post<IQcOrderProductsListItemDto[]>(`${this._apiUrl}/${RobApiPaths.getRelatedVoyageOrders()}`, { payload: request.vesselVoyageDetailId })
      .pipe(map(r => ({
        items: r || [],
        totalItems: (r || []).length
      })));
  }

  @ObservableException()
  verifyReports(request: IQcVerifyReportsRequest): Observable<IQcVerifyReportsResponse> {
    return this.http.post<IQcMarkSludgeVerificationResponse>(`${this._apiUrl}/${RobApiPaths.verify()}`,
      { payload: request });
  }

  @ObservableException()
  revertVerifyVessel(request: IQcRevertVerifyReportsRequest): Observable<IQcRevertVerifyReportsResponse> {
    return this.http.post<IQcMarkSludgeVerificationResponse>(`${this._apiUrl}/${RobApiPaths.revertVerify()}`,
      { payload: request });
  }

  @ObservableException()
  getEventsLog(request: IGetEventsLogRequest): Observable<IGetEventsLogResponse> {
    return this.http.post<IQcEventLogListItemDto[]>(`${this._apiUrl}/${RobApiPaths.getReportEventNotes()}`,
      { payload: request })
      .pipe(map(r => ({
        items: r || [],
        totalItems: (r || []).length
      })));
  }

  @ObservableException()
  markSludgeVerification(request: IQcMarkSludgeVerificationRequest): Observable<IQcMarkSludgeVerificationResponse> {
    return this.http.post<IQcMarkSludgeVerificationResponse>(`${this._apiUrl}/${RobApiPaths.verifySludge()}`, { payload: request });
  }

  @ObservableException()
  loadPortCallBdn(request: IQcLoadPortCallBdnRequest): Observable<IQcLoadPortCallBdnResponse> {
    return this.http.post<IQcLoadPortCallBdnResponse>(`${this._apiUrl}/${RobApiPaths.loadPortCallBdn()}`, { payload: request });
  }
}

export const QUANTITY_CONTROL_API_SERVICE = new InjectionToken<IQuantityControlApiService>('QUANTITY_CONTROL_API_SERVICE');
