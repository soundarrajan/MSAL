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
import * as faker from 'faker';
import { PortCallListItemModel } from '../models/port-call-list-item.model';

@Injectable()
export class QuantityControlMockApiService implements IQuantityControlApiService {

  constructor() {
  }

  getPortCalls(request: IGetPortCallsRequest): Observable<IGetPortCallsResponse> {
    return of({
      items: getMockPortCallsList(request.pageSize).map(item => new PortCallListItemModel(item)),
      totalItems: faker.random.number(5) * request.pageSize
    });
  }

  getPortCallById(request: IGetPortCallByIdRequest): Observable<IGetPortCallByIdResponse> {
    return throwError('Not implemented');
  }

  getSoundingReports(request: IGetSoundingReportsRequest): Observable<IGetSoundingReportsResponse> {
    return throwError('Not implemented');
  }

  getSurveyReportHistory(request: IGetSurveyReportHistoryRequest): Observable<IGetSurveyReportHistoryResponse> {
    return throwError('Not implemented');
  }

  sendEmails(request: ISendEmailsRequest): Observable<ISendEmailsResponse> {
    return throwError('Not implemented');
  }

  raiseClaim(request: IRaiseClaimRequest): Observable<IRaiseClaimResponse> {
    return throwError('Not implemented');
  }

  verifyPortCalls(request: IVerifyPortCallsRequest): Observable<IVerifyPortCallsResponse> {
    return throwError('Not implemented');
  }

  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse> {
    return throwError('Not implemented');
  }
}
