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
import { ApiCall, ApiCallForwardTo, AppConfig } from '@shiptech/core';
import { QuantityControlApiService } from './quantity-control.api.service';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';
import { getMockPortCall } from './mock/port-call.mock';

@Injectable({
  providedIn: 'root'
})
export class QuantityControlMockApiService implements IQuantityControlApiService {

  @ApiCallForwardTo() realService: QuantityControlApiService;

  constructor(realService: QuantityControlApiService, appConfig: AppConfig, devService: DeveloperToolbarService) {
    this.realService = realService;

    // Note: It's important to register this only once, and in the root module. We currently don't support multiple services in child providers
    devService.registerApi({
      id: QuantityControlApiService.name,
      displayName: 'Quantity Control Api',
      instance: this,
      isRealService: false,
      localApiUrl: 'http://localhost:44398',
      devApiUrl: appConfig.quantityControlApi,
      qaApiUrl: appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE
    });
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
