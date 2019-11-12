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
import { getMockQcReportsList } from './mock/qc-reports-list.mock';
import { QcReportsListItemModel } from '../models/qc-reports-list-item.model';
import { QuantityControlApi } from './quantity-control-api';
import { getQcReportDetailsCall } from './mock/qc-report-details.mock';
import { ApiCall, ApiCallForwardTo } from '@shiptech/core/utils/decorators/api-call.decorator';
import { getMockQcSoundingReportList } from './mock/qc-sounding-report-list.mock';
import { getMockQcSoundingReportDetails } from './mock/qc-sounding-report-details.mock';
import { nullable } from '@shiptech/core/utils/nullable';
import {
  IGetQcSurveyHistoryListRequest,
  IGetQcSurveyHistoryListResponse
} from './request-response/qc-survey-history-list.request-response';
import { getMockQcSurveyHistoryList } from './mock/qc-survey-history-list.mock';
import { QcSurveyHistoryListItemModel } from '../models/qc-survey-history-list-item.model';
import * as faker from 'faker';
import { IGetEventsLogRequest, IGetEventsLogResponse } from './request-response/events-log.request-response';
import { getMockQcEventsLog } from './mock/qc-events-log.mock';
import {
  ISaveReportDetailsRequest,
  ISaveReportDetailsResponse
} from './request-response/report-details.request-response';

@Injectable({
  providedIn: 'root'
})
export class QuantityControlApiMock implements IQuantityControlApiService {
  @ApiCallForwardTo() realService: QuantityControlApi;

  constructor(realService: QuantityControlApi) {
    this.realService = realService;
  }

  @ApiCall()
  getReportsList(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse> {
    return of({
      items: getMockQcReportsList(request.pagination.take).map(item => new QcReportsListItemModel(item)),
      totalItems: request.pagination.take * 5,
      nbOfMatched: faker.random.number({ min: 5, max: 50 }),
      nbOfNotMatched: faker.random.number({ min: 5, max: 50 }),
      nbOfMatchedWithinLimit: faker.random.number({ min: 5, max: 50 })
    });
  }

  @ApiCall()
  getSurveyHistoryList(request: IGetQcSurveyHistoryListRequest): Observable<IGetQcSurveyHistoryListResponse> {
    return of({
      items: getMockQcSurveyHistoryList(request.pagination.take).map(item => new QcSurveyHistoryListItemModel(item)),
      totalItems: request.pagination.take * 5
    });
  }

  @ApiCall()
  getReportById(request: IGetQcReportDetailsByIdRequest): Observable<IGetQcReportDetailsByIdResponse> {
    return of({ report: getQcReportDetailsCall(request.reportId) });
  }

  @ApiCall()
  saveReportDetails(request: ISaveReportDetailsRequest): Observable<ISaveReportDetailsResponse> {
    return of();
  }

  @ApiCall()
  getSoundingReportList(request: IGetSoundingReportListRequest): Observable<IGetSoundingReportListResponse> {
    return of({
      items: getMockQcSoundingReportList(nullable(request.pagination).take || 10),
      totalItems: (nullable(request.pagination).take || 10) * 5
    });
  }

  @ApiCall()
  getSoundingReportDetails(request: IGetSoundingReportDetailsRequest): Observable<IGetSoundingReportDetailsResponse> {
    return of({
      items: getMockQcSoundingReportDetails(nullable(request.pagination).take || 10),
      totalItems: (nullable(request.pagination).take || 10) * 5
    });
  }

  @ApiCall()
  sendEmails(request: ISendEmailsRequest): Observable<ISendEmailsResponse> {
    return throwError('Not implemented');
  }

  @ApiCall()
  raiseClaim(request: IRaiseClaimRequest): Observable<IRaiseClaimResponse> {
    return of(undefined);
  }

  @ApiCall()
  verifyReports(request: IVerifyQcReportsRequest): Observable<IVerifyQcReportsResponse> {
    return of(undefined);
  }

  @ApiCall()
  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse> {
    return of(undefined);
  }

  @ApiCall()
  getEventsLog(request: IGetEventsLogRequest): Observable<IGetEventsLogResponse> {
    return of({
      items: getMockQcEventsLog(3)
    });
  }
}
