import { Injectable, InjectionToken } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  IGetQcReportsListRequest,
  IGetQcReportsListResponse
} from './request-response/qc-reports-list.request-response';
import {
  IGetQcReportDetailsByIdRequest,
  IGetQcReportDetailsByIdResponse
} from './request-response/qc-report-details-by-id.request-response';
import {
  IGetSoundingReportDetailsRequest,
  IGetSoundingReportDetailsResponse,
  IGetSoundingReportListRequest,
  IGetSoundingReportListResponse
} from './request-response/sounding-reports.request-response';
import {
  IGetSurveyReportHistoryRequest,
  IGetSurveyReportHistoryResponse
} from './request-response/survey-report-history.request-response';
import { ISendEmailsRequest, ISendEmailsResponse } from './request-response/send-emails.request-response';
import { IRaiseClaimRequest, IRaiseClaimResponse } from './request-response/raise-claim.request-response';
import {
  IVerifyQcReportsRequest,
  IVerifyQcReportsResponse
} from './request-response/verify-port-calls.request-response';
import { IWatchVesselRequest, IWatchVesselResponse } from './request-response/watch-vessel.request-response';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import {
  IGetQcSurveyHistoryListRequest,
  IGetQcSurveyHistoryListResponse
} from './request-response/qc-survey-history-list.request-response';
import { IGetEventsLogRequest, IGetEventsLogResponse } from './request-response/events-log.request-response';
import {
  ISaveReportDetailsRequest,
  ISaveReportDetailsResponse
} from './request-response/report-details.request-response';
import {
  IGetOrderProductsListRequest,
  IGetOrderProductsListResponse
} from './request-response/claims-list.request-response';

export namespace ProcurementApiPaths {
  export const allRequests = 'api/procurement/request/tableView';
}

@Injectable({
  providedIn: 'root'
})
export class QuantityControlApi implements IQuantityControlApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getReportsList(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getSurveyHistoryList(request: IGetQcSurveyHistoryListRequest): Observable<IGetQcSurveyHistoryListResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getReportById(request: IGetQcReportDetailsByIdRequest): Observable<IGetQcReportDetailsByIdResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  saveReportDetails(request: ISaveReportDetailsRequest): Observable<ISaveReportDetailsResponse> {
    return throwError('Not implemented');
  }


  @ObservableException()
  getSoundingReportList(request: IGetSoundingReportListRequest): Observable<IGetSoundingReportListResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getSoundingReportDetails(request: IGetSoundingReportDetailsRequest): Observable<IGetSoundingReportDetailsResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getSurveyReportHistory(request: IGetSurveyReportHistoryRequest): Observable<IGetSurveyReportHistoryResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  sendEmails(request: ISendEmailsRequest): Observable<ISendEmailsResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getOrderProductsList(request: IGetOrderProductsListRequest): Observable<IGetOrderProductsListResponse> {
    return of(undefined);
  }

  @ObservableException()
  raiseClaim(request: IRaiseClaimRequest): Observable<IRaiseClaimResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  verifyReports(request: IVerifyQcReportsRequest): Observable<IVerifyQcReportsResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getEventsLog(request: IGetEventsLogRequest): Observable<IGetEventsLogResponse> {
    return throwError('Not implemented');
  }
}

export const QUANTITY_CONTROL_API_SERVICE = new InjectionToken<IQuantityControlApiService>('QUANTITY_CONTROL_API_SERVICE');
