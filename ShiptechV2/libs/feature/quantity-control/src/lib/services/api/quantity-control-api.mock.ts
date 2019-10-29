import { Injectable } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable, of, throwError } from 'rxjs';
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
import { getMockPortCallsList } from './mock/port-calls-list.mock';
import { QcReportsListItemModel } from '../models/qc-reports-list-item.model';
import { QuantityControlApi } from './quantity-control-api';
import { getMockPortCall } from './mock/port-call.mock';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ApiCall, ApiCallForwardTo } from '@shiptech/core/utils/decorators/api-call.decorator';

@Injectable({
  providedIn: 'root'
})
export class QuantityControlApiMock implements IQuantityControlApiService {

  @ApiCallForwardTo() realService: QuantityControlApi;

  constructor(realService: QuantityControlApi, appConfig: AppConfig) {
    this.realService = realService;
  }

  @ApiCall()
  getPortCalls(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse> {
    return of({
      items: getMockPortCallsList(request.pageSize).map(item => new QcReportsListItemModel(item)),
      totalItems: request.pageSize * 5
    });
  }

  @ApiCall()
  getPortCallById(request: IGetQcReportByIdRequest): Observable<IGetQcReportByIdResponse> {
    return of({ portCall: getMockPortCall(request.portCallId) });
  }

  @ApiCall()
  getSoundingReports(request: IGetSoundingReportsRequest): Observable<IGetSoundingReportsResponse> {
    return throwError('Not implemented');
  }

  @ApiCall()
  getSurveyReportHistory(request: IGetSurveyReportHistoryRequest): Observable<IGetSurveyReportHistoryResponse> {
    return throwError('Not implemented');
  }

  @ApiCall()
  sendEmails(request: ISendEmailsRequest): Observable<ISendEmailsResponse> {
    return throwError('Not implemented');
  }

  @ApiCall()
  raiseClaim(request: IRaiseClaimRequest): Observable<IRaiseClaimResponse> {
    return throwError('Not implemented');
  }

  @ApiCall()
  verifyPortCalls(request: IVerifyQcReportsRequest): Observable<IVerifyQcReportsResponse> {
    return throwError('Not implemented');
  }

  @ApiCall()
  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse> {
    return throwError('Not implemented');
  }
}
