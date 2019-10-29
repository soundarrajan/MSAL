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

export interface IQuantityControlApiService {
  getPortCalls(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse>;

  getPortCallById(request: IGetQcReportDetailsByIdRequest): Observable<IGetQcReportDetailsByIdResponse>;

  getSoundingReports(request: IGetSoundingReportsRequest): Observable<IGetSoundingReportsResponse>;

  getSurveyReportHistory(request: IGetSurveyReportHistoryRequest): Observable<IGetSurveyReportHistoryResponse>;

  sendEmails(request: ISendEmailsRequest): Observable<ISendEmailsResponse>;

  raiseClaim(request: IRaiseClaimRequest): Observable<IRaiseClaimResponse>;

  verifyPortCalls(request: IVerifyQcReportsRequest): Observable<IVerifyQcReportsResponse>;

  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse>;
}
