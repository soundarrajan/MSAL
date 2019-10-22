import { Injectable, InjectionToken } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiCallUrl, AppConfig, ObservableException } from '@shiptech/core';
import { IGetPortCallsRequest, IGetPortCallsResponse } from './request-response/port-calls.request-response';
import { IGetPortCallByIdRequest, IGetPortCallByIdResponse } from './request-response/port-call-by-id.request-response';
import {
  IGetSoundingReportsRequest,
  IGetSoundingReportsResponse
} from './request-response/sounding-reports.request-response';
import {
  IGetSurveyReportHistoryRequest,
  IGetSurveyReportHistoryResponse
} from './request-response/survey-report-history.request-response';
import { ISendEmailsRequest, ISendEmailsResponse } from './request-response/send-emails.request-response';
import { IRaiseClaimRequest, IRaiseClaimResponse } from './request-response/raise-claim.request-response';
import {
  IVerifyPortCallsRequest,
  IVerifyPortCallsResponse
} from './request-response/verify-port-calls.request-response';
import { IWatchVesselRequest, IWatchVesselResponse } from './request-response/watch-vessel.request-response';

export namespace ProcurementApiPaths {
  export const allRequests = 'api/procurement/request/tableView';
}

@Injectable({
  providedIn: 'root'
})
export class QuantityControlApiService implements IQuantityControlApiService {

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getPortCalls(request: IGetPortCallsRequest): Observable<IGetPortCallsResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getPortCallById(request: IGetPortCallByIdRequest): Observable<IGetPortCallByIdResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getSoundingReports(request: IGetSoundingReportsRequest): Observable<IGetSoundingReportsResponse> {
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
  raiseClaim(request: IRaiseClaimRequest): Observable<IRaiseClaimResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  verifyPortCalls(request: IVerifyPortCallsRequest): Observable<IVerifyPortCallsResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse> {
    return throwError('Not implemented');
  }
}

export const QUANTITY_CONTROL_API_SERVICE = new InjectionToken<IQuantityControlApiService>('QUANTITY_CONTROL_API_SERVICE');
