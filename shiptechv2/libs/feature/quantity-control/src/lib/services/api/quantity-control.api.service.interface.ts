import {
  IGetQcReportsListRequest,
  IGetQcReportsListResponse
} from './request-response/qc-reports-list.request-response';
import { Observable } from 'rxjs';
import {
  IQcReportDetailsRequest,
  IQcReportDetailsResponse
} from './request-response/qc-report-details-by-id.request-response';
import {
  IGetSoundingReportDetailsRequest,
  IGetSoundingReportDetailsResponse,
  IGetSoundingReportListRequest,
  IGetSoundingReportListResponse
} from './request-response/sounding-reports.request-response';
import {
  IQcVerifyReportsRequest,
  IQcVerifyReportsResponse
} from './request-response/verify-port-calls.request-response';
import {
  IGetQcSurveyHistoryListRequest,
  IGetQcSurveyHistoryListResponse
} from './request-response/qc-survey-history-list.request-response';
import {
  IGetEventsLogRequest,
  IGetEventsLogResponse
} from './request-response/events-log.request-response';
import {
  ISaveReportDetailsRequest,
  ISaveReportDetailsResponse
} from './request-response/report-details-save.request-response';
import {
  IGetOrderProductsListRequest,
  IGetOrderProductsListResponse
} from './request-response/claims-list.request-response';
import {
  IQcMarkSludgeVerificationRequest,
  IQcMarkSludgeVerificationResponse
} from './request-response/qc-mark-sludge-verification.request-response';
import {
  IQcRevertVerifyReportsRequest,
  IQcRevertVerifyReportsResponse
} from './request-response/revert-verify-port-calls.request-response';
import {
  IQcLoadPortCallBdnRequest,
  IQcLoadPortCallBdnResponse
} from './request-response/load-bdn-port-call.request-response';
import {
  IVesselToWatchRequest,
  IVesselToWatchResponse
} from './request-response/vessel-to-watch.request-response';

export interface IQuantityControlApiService {
  getReportList(
    request: IGetQcReportsListRequest
  ): Observable<IGetQcReportsListResponse>;

  getSurveyHistoryList(
    request: IGetQcSurveyHistoryListRequest
  ): Observable<IGetQcSurveyHistoryListResponse>;

  getReportDetails(
    request: IQcReportDetailsRequest
  ): Observable<IQcReportDetailsResponse>;

  getSoundingReportList(
    request: IGetSoundingReportListRequest
  ): Observable<IGetSoundingReportListResponse>;

  getSoundingReportDetails(
    request: IGetSoundingReportDetailsRequest
  ): Observable<IGetSoundingReportDetailsResponse>;

  saveReportDetails(
    request: ISaveReportDetailsRequest
  ): Observable<ISaveReportDetailsResponse>;

  loadPortCallBdn(
    request: IQcLoadPortCallBdnRequest
  ): Observable<IQcLoadPortCallBdnResponse>;

  getOrderProductsList(
    request: IGetOrderProductsListRequest
  ): Observable<IGetOrderProductsListResponse>;

  verifyReports(
    request: IQcVerifyReportsRequest
  ): Observable<IQcVerifyReportsResponse>;

  revertVerifyVessel(
    request: IQcRevertVerifyReportsRequest
  ): Observable<IQcRevertVerifyReportsResponse>;

  markSludgeVerification(
    request: IQcMarkSludgeVerificationRequest
  ): Observable<IQcMarkSludgeVerificationResponse>;

  getEventsLog(
    request: IGetEventsLogRequest
  ): Observable<IGetEventsLogResponse>;

  updateVesselToWatch(
    request: IVesselToWatchRequest
  ): Observable<IVesselToWatchResponse>;

  getReportListExportUrl(): string;
}
