import { Injectable } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable, of, throwError } from 'rxjs';
import {
  IGetQcReportsListRequest,
  IGetQcReportsListResponse
} from './request-response/qc-reports-list.request-response';
import {
  IGetQcReportDetailsByIdRequest,
  IGetQcReportDetailsByIdResponse
} from './request-response/qc-report-details-by-id.request-response';
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
import { getMockQcReportsList } from './mock/qc-reports-list.mock';
import { QcReportsListItemModel } from '../models/qc-reports-list-item.model';
import { QuantityControlApi } from './quantity-control-api';
import { getQcReportDetailsCall } from './mock/qc-report-details.mock';
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
  getReportsList(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse> {
    return of({
      items: getMockQcReportsList(request.pageSize).map(item => new QcReportsListItemModel(item)),
      totalItems: request.pageSize * 5
    });
  }

  @ApiCall()
  getReportById(request: IGetQcReportDetailsByIdRequest): Observable<IGetQcReportDetailsByIdResponse> {
    return of({ report: getQcReportDetailsCall(request.reportId) });
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
  verifyReports(request: IVerifyQcReportsRequest): Observable<IVerifyQcReportsResponse> {
    return throwError('Not implemented');
  }

  @ApiCall()
  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse> {
    return throwError('Not implemented');
  }
}
