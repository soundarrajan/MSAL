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
import { IQcMarkSludgeVerificationRequest, IQcMarkSludgeVerificationResponse } from './request-response/qc-mark-sludge-verification.request-response';
import { IQcEventLogListItemDto } from './dto/qc-event-log-list-item.dto';
import { IQcRevertVerifyReportsRequest, IQcRevertVerifyReportsResponse } from './request-response/revert-verify-port-calls.request-response';
import { IQcLoadPortCallBdnRequest, IQcLoadPortCallBdnResponse } from './request-response/load-bdn-port-call.request-response';
import {
  IGetQcReportDetailsAuditLogRequest,
  IGetQcReportDetailsAuditLogResponse
} from "./request-response/qc-report-details-audit-log.request-response";
import { IGetQcEmailLogsRequest, IGetQcEmailLogsResponse } from "./request-response/qc-emails-list.request-response";

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
  export const getAuditLog = () => 'api/admin/audit/get';
}

export namespace MasterApiPaths {
  export const getEmailLogs = () => `api/masters/emaillogs/list`;
}

@Injectable({
  providedIn: 'root'
})
export class QuantityControlApi implements IQuantityControlApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.robApi;
  private _masterApiUrl = this.appConfig.masterApi;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getReportList(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse> {
    return this.http.post<IGetQcReportsListResponse>(`${this._apiUrl}/${RobApiPaths.getReportsList()}`, { payload: request });
  }

  @ObservableException()
  getSurveyHistoryList(request: IGetQcSurveyHistoryListRequest): Observable<IGetQcSurveyHistoryListResponse> {
    return this.http.post<IGetQcSurveyHistoryListResponse>(`${this._apiUrl}/${RobApiPaths.getSurveyHistoryList()}`, { payload: request });
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
    return this.http.post<IGetSoundingReportListResponse>(`${this._apiUrl}/${RobApiPaths.getSoundingReportList()}`, { payload: request });
  }

  @ObservableException()
  getSoundingReportDetails(request: IGetSoundingReportDetailsRequest): Observable<IGetSoundingReportDetailsResponse> {
    return this.http.post<IGetSoundingReportDetailsResponse>(`${this._apiUrl}/${RobApiPaths.getSoundingReportDetails()}`, { payload: request });
  }

  @ObservableException()
  getOrderProductsList(request: IGetOrderProductsListRequest): Observable<IGetOrderProductsListResponse> {
    return this.http.post<IGetOrderProductsListResponse>(`${this._apiUrl}/${RobApiPaths.getRelatedVoyageOrders()}`, { payload: request.vesselVoyageDetailId });
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
    return this.http.post<IGetEventsLogResponse>(`${this._apiUrl}/${RobApiPaths.getReportEventNotes()}`, { payload: request });
  }

  @ObservableException()
  markSludgeVerification(request: IQcMarkSludgeVerificationRequest): Observable<IQcMarkSludgeVerificationResponse> {
    return this.http.post<IQcMarkSludgeVerificationResponse>(`${this._apiUrl}/${RobApiPaths.verifySludge()}`, { payload: request });
  }

  @ObservableException()
  loadPortCallBdn(request: IQcLoadPortCallBdnRequest): Observable<IQcLoadPortCallBdnResponse> {
    return this.http.post<IQcLoadPortCallBdnResponse>(`${this._apiUrl}/${RobApiPaths.loadPortCallBdn()}`, { payload: request });
  }

  @ObservableException()
  getAuditLog(request: IGetQcReportDetailsAuditLogRequest): Observable<IGetQcReportDetailsAuditLogResponse> {
    return this.http.post<IGetQcReportDetailsAuditLogResponse>(`${this._apiUrl}/${RobApiPaths.getAuditLog()}`, { payload: {...request, Filters: [{ColumnName: 'BusinessId', Value: '1'}, {ColumnName: 'Transaction', Value: 'QuantityControlReport'}]} });
  }

  @ObservableException()
  getEmailLogs(request: IGetQcEmailLogsRequest): Observable<IGetQcEmailLogsResponse> {
    return this.http.post<IGetQcEmailLogsResponse>(`${this._masterApiUrl}/${MasterApiPaths.getEmailLogs()}`, { payload: request });
  }
}

export const QUANTITY_CONTROL_API_SERVICE = new InjectionToken<IQuantityControlApiService>('QUANTITY_CONTROL_API_SERVICE');
