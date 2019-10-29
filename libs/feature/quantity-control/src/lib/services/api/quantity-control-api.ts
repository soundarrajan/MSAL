import { Injectable, InjectionToken } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IGetQcReportsListRequest, IGetQcReportsListResponse } from './request-response/port-calls.request-response';
import { IGetQcReportByIdRequest, IGetQcReportByIdResponse } from './request-response/port-call-by-id.request-response';
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
  IVerifyQcReportsRequest,
  IVerifyQcReportsResponse
} from './request-response/verify-port-calls.request-response';
import { IWatchVesselRequest, IWatchVesselResponse } from './request-response/watch-vessel.request-response';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';

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
  getPortCalls(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getPortCallById(request: IGetQcReportByIdRequest): Observable<IGetQcReportByIdResponse> {
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
  verifyPortCalls(request: IVerifyQcReportsRequest): Observable<IVerifyQcReportsResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse> {
    return throwError('Not implemented');
  }
}

export const QUANTITY_CONTROL_API_SERVICE = new InjectionToken<IQuantityControlApiService>('QUANTITY_CONTROL_API_SERVICE');
