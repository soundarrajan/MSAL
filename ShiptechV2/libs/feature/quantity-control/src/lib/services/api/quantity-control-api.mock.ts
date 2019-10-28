import { Injectable } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable, of, throwError } from 'rxjs';
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
import { getMockPortCallsList } from './mock/port-calls-list.mock';
import { PortCallListItemModel } from '../models/port-call-list-item.model';
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
  getPortCalls(request: IGetPortCallsRequest): Observable<IGetPortCallsResponse> {
    return of({
      items: getMockPortCallsList(request.pageSize).map(item => new PortCallListItemModel(item)),
      totalItems: request.pageSize * 5
    });
  }

  @ApiCall()
  getPortCallById(request: IGetPortCallByIdRequest): Observable<IGetPortCallByIdResponse> {
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
  verifyPortCalls(request: IVerifyPortCallsRequest): Observable<IVerifyPortCallsResponse> {
    return throwError('Not implemented');
  }

  @ApiCall()
  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse> {
    return throwError('Not implemented');
  }
}
