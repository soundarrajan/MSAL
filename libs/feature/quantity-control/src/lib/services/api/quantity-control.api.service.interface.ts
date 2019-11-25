import {
  IGetQcReportsListRequest,
  IGetQcReportsListResponse
} from './request-response/qc-reports-list.request-response';
import { Observable } from 'rxjs';
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
import {
  IQcMarkSludgeVerificationRequest,
  IQcMarkSludgeVerificationResponse
} from './request-response/qc-mark-sludge-verification.request-response';

export interface IQuantityControlApiService {
  getReportsList(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse>;

  getSurveyHistoryList(request: IGetQcSurveyHistoryListRequest): Observable<IGetQcSurveyHistoryListResponse>;

  getReportById(request: IGetQcReportDetailsByIdRequest): Observable<IGetQcReportDetailsByIdResponse>;

  getSoundingReportList(request: IGetSoundingReportListRequest): Observable<IGetSoundingReportListResponse>;

  getSoundingReportDetails(request: IGetSoundingReportDetailsRequest): Observable<IGetSoundingReportDetailsResponse>;

  saveReportDetails(request: ISaveReportDetailsRequest): Observable<ISaveReportDetailsResponse>;

  sendEmails(request: ISendEmailsRequest): Observable<ISendEmailsResponse>;

  getOrderProductsList(request: IGetOrderProductsListRequest): Observable<IGetOrderProductsListResponse>;

  verifyReports(request: IQcVerifyReportsRequest): Observable<IQcVerifyReportsResponse>;

  markSludgeVerification(request: IQcMarkSludgeVerificationRequest): Observable<IQcMarkSludgeVerificationResponse>;

  getEventsLog(request: IGetEventsLogRequest): Observable<IGetEventsLogResponse>;
}
