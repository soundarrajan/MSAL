import { Injectable, InjectionToken } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
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
import { map } from 'rxjs/operators';
import { IQcReportsListItemDto } from './dto/qc-reports-list-item.dto';
import * as _ from 'lodash';
import {
  IQcMarkSludgeVerificationRequest,
  IQcMarkSludgeVerificationResponse
} from './request-response/qc-mark-sludge-verification.request-response';

export namespace RobApiPaths {
  export const allRequests = 'api/procurement/request/tableView';
  export const getReportsList = () => `api/quantityControlReport/list`;
  export const verifySludge = () => `api/quantityControlReport/verifySludge`;
  export const verify = () => `api/quantityControlReport/verify`;
}

@Injectable({
  providedIn: 'root'
})
export class QuantityControlApi implements IQuantityControlApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.robApi;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getReportsList(request: IGetQcReportsListRequest): Observable<IGetQcReportsListResponse> {
    return this.http.post<IQcReportsListItemDto[]>(`${this._apiUrl}/${RobApiPaths.getReportsList()}`, { payload: request })
      .pipe(map(r => {
        const items = r || [];
        const firstItem = (_.first(items) || <IQcReportsListItemDto>{});

        return {
          items: items,
          totalItems: items.length,
          nbOfMatched: firstItem.nbOfMatched || 0,
          nbOfMatchedWithinLimit: firstItem.nbOfMatchedWithinLimit || 0,
          nbOfNotMatched: firstItem.nbOfNotMatched || 0
        };
      }));
  }

  @ObservableException()
  getSurveyHistoryList(request: IGetQcSurveyHistoryListRequest): Observable<IGetQcSurveyHistoryListResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getReportById(request: IGetQcReportDetailsByIdRequest): Observable<IGetQcReportDetailsByIdResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  saveReportDetails(request: ISaveReportDetailsRequest): Observable<ISaveReportDetailsResponse> {
    return throwError('Not implemented');
  }


  @ObservableException()
  getSoundingReportList(request: IGetSoundingReportListRequest): Observable<IGetSoundingReportListResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getSoundingReportDetails(request: IGetSoundingReportDetailsRequest): Observable<IGetSoundingReportDetailsResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  sendEmails(request: ISendEmailsRequest): Observable<ISendEmailsResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  getOrderProductsList(request: IGetOrderProductsListRequest): Observable<IGetOrderProductsListResponse> {
    return of(undefined);
  }

  @ObservableException()
  verifyReports(request: IQcVerifyReportsRequest): Observable<IQcVerifyReportsResponse> {
    return this.http.post<IQcMarkSludgeVerificationResponse>(`${this._apiUrl}/${RobApiPaths.verify()}`,
      { payload: { quantityReportControlList: request.reportIds } });
  }

  @ObservableException()
  getEventsLog(request: IGetEventsLogRequest): Observable<IGetEventsLogResponse> {
    return throwError('Not implemented');
  }

  @ObservableException()
  markSludgeVerification(request: IQcMarkSludgeVerificationRequest): Observable<IQcMarkSludgeVerificationResponse> {
    return this.http.post<IQcMarkSludgeVerificationResponse>(`${this._apiUrl}/${RobApiPaths.verifySludge()}`, { payload: request });
  }
}

export const QUANTITY_CONTROL_API_SERVICE = new InjectionToken<IQuantityControlApiService>('QUANTITY_CONTROL_API_SERVICE');
