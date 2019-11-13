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

export interface IQuantityControlApiService {
  getReportsList(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse>;

  getSurveyHistoryList(request: IGetQcSurveyHistoryListRequest): Observable<IGetQcSurveyHistoryListResponse>;

  getReportById(request: IGetQcReportDetailsByIdRequest): Observable<IGetQcReportDetailsByIdResponse>;

  getSoundingReportList(request: IGetSoundingReportListRequest): Observable<IGetSoundingReportListResponse>;

  getSoundingReportDetails(request: IGetSoundingReportDetailsRequest): Observable<IGetSoundingReportDetailsResponse>;

  getSurveyReportHistory(request: IGetSurveyReportHistoryRequest): Observable<IGetSurveyReportHistoryResponse>;

  saveReportDetails(request: ISaveReportDetailsRequest): Observable<ISaveReportDetailsResponse>;

  sendEmails(request: ISendEmailsRequest): Observable<ISendEmailsResponse>;

  getOrderProductsList(request: IGetOrderProductsListRequest): Observable<IGetOrderProductsListResponse>;

  raiseClaim(request: IRaiseClaimRequest): Observable<IRaiseClaimResponse>;

  verifyReports(request: IVerifyQcReportsRequest): Observable<IVerifyQcReportsResponse>;

  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse>;

  getEventsLog(request: IGetEventsLogRequest): Observable<IGetEventsLogResponse>;
}
