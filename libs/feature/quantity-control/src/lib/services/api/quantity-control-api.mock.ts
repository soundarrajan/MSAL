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
import { ISendEmailsRequest, ISendEmailsResponse } from './request-response/send-emails.request-response';
import {
  IQcVerifyReportsRequest,
  IQcVerifyReportsResponse
} from './request-response/verify-port-calls.request-response';
import { getMockQcReportsList } from './mock/qc-reports-list.mock';
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
import { IGetEventsLogRequest, IGetEventsLogResponse } from './request-response/events-log.request-response';
import { getMockQcEventsLog } from './mock/qc-events-log.mock';
import {
  ISaveReportDetailsRequest,
  ISaveReportDetailsResponse
} from './request-response/report-details.request-response';
import {
  IGetOrderProductsListRequest,
  IGetOrderProductsListResponse
} from './request-response/claims-list.request-response';
import { getQcOrderProductsList } from './mock/qc-order-products-list.mock';
import * as _ from 'lodash';
import { IQcReportsListItemDto } from './dto/qc-reports-list-item.dto';
import {
  IQcMarkSludgeVerificationRequest,
  IQcMarkSludgeVerificationResponse
} from './request-response/qc-mark-sludge-verification.request-response';

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
    const items = getMockQcReportsList(request.pagination.take) || [];
    const firstItem = (_.first(items) || <IQcReportsListItemDto>{});

    return of({
      items: items,
      totalItems: items.length,
      nbOfMatched: firstItem.nbOfMatched || 0,
      nbOfMatchedWithinLimit: firstItem.nbOfMatchedWithinLimit || 0,
      nbOfNotMatched: firstItem.nbOfNotMatched || 0
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
    return of(undefined);
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
  getOrderProductsList(request: IGetOrderProductsListRequest): Observable<IGetOrderProductsListResponse> {
    return of({ items: getQcOrderProductsList(10), totalItems: 10 });
  }

  @ApiCall()
  verifyReports(request: IQcVerifyReportsRequest): Observable<IQcVerifyReportsResponse> {
    return of({});
  }

  @ApiCall()
  getEventsLog(request: IGetEventsLogRequest): Observable<IGetEventsLogResponse> {
    return of({
      items: getMockQcEventsLog(3)
    });
  }

  @ApiCall()
  markSludgeVerification(request: IQcMarkSludgeVerificationRequest): Observable<IQcMarkSludgeVerificationResponse> {
    return of({});
  }
}
