import { IGetPortCallsRequest, IGetPortCallsResponse } from './request-response/port-calls.request-response';
import { Observable } from 'rxjs';
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

export interface IQuantityControlApiService {
  getPortCalls(request: IGetPortCallsRequest): Observable<IGetPortCallsResponse>;

  getPortCallById(request: IGetPortCallByIdRequest): Observable<IGetPortCallByIdResponse>;

  getSoundingReports(request: IGetSoundingReportsRequest): Observable<IGetSoundingReportsResponse>;

  getSurveyReportHistory(request: IGetSurveyReportHistoryRequest): Observable<IGetSurveyReportHistoryResponse>;

  sendEmails(request: ISendEmailsRequest): Observable<ISendEmailsResponse>;

  raiseClaim(request: IRaiseClaimRequest): Observable<IRaiseClaimResponse>;

  verifyPortCalls(request: IVerifyPortCallsRequest): Observable<IVerifyPortCallsResponse>;

  watchVessel(request: IWatchVesselRequest): Observable<IWatchVesselResponse>;
}
