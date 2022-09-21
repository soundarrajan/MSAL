import { Injectable } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable, of } from 'rxjs';
import {
  IGetQcReportsListRequest,
  IGetQcReportsListResponse
} from './request-response/qc-reports-list.request-response';
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
import { getMockQcReportsList } from './mock/qc-reports-list.mock';
import { QuantityControlApi } from './quantity-control-api';
import { getQcReportDetailsCall } from './mock/qc-report-details.mock';
import {
  ApiCall,
  ApiCallForwardTo
} from '@shiptech/core/utils/decorators/api-call.decorator';
import { getMockQcSoundingReportList } from './mock/qc-sounding-report-list.mock';
import { getMockQcSoundingReportDetails } from './mock/qc-sounding-report-details.mock';
import { nullable } from '@shiptech/core/utils/nullable';
import {
  IGetQcSurveyHistoryListRequest,
  IGetQcSurveyHistoryListResponse
} from './request-response/qc-survey-history-list.request-response';
import { getMockQcSurveyHistoryList } from './mock/qc-survey-history-list.mock';
import {
  IGetEventsLogRequest,
  IGetEventsLogResponse
} from './request-response/events-log.request-response';
import { getMockQcEventsLog } from './mock/qc-events-log.mock';
import {
  ISaveReportDetailsRequest,
  ISaveReportDetailsResponse
} from './request-response/report-details-save.request-response';
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
import { IQcSurveyHistoryListItemDto } from './dto/qc-survey-history-list-item.dto';
import {
  IQcRevertVerifyReportsRequest,
  IQcRevertVerifyReportsResponse
} from './request-response/revert-verify-port-calls.request-response';
import {
  IQcLoadPortCallBdnRequest,
  IQcLoadPortCallBdnResponse
} from './request-response/load-bdn-port-call.request-response';
import { Chance } from 'chance';
import {
  IVesselToWatchRequest,
  IVesselToWatchResponse
} from './request-response/vessel-to-watch.request-response';

const chance = new Chance();

@Injectable({
  providedIn: 'root'
})
export class QuantityControlApiMock implements IQuantityControlApiService {
  @ApiCallForwardTo() realService: QuantityControlApi;

  constructor(realService: QuantityControlApi) {
    this.realService = realService;
  }

  @ApiCall()
  getReportList(
    request: IGetQcReportsListRequest
  ): Observable<IGetQcReportsListResponse> {
    const items = getMockQcReportsList(request.pagination.take) || [];
    const firstItem = _.first(items) || <IQcReportsListItemDto>{};

    return of({
      items: items,
      totalCount: items.length,
      nbOfMatched: firstItem.nbOfMatched || 0,
      nbOfMatchedWithinLimit: firstItem.nbOfMatchedWithinLimit || 0,
      nbOfNotMatched: firstItem.nbOfNotMatched || 0
    });
  }

  @ApiCall()
  getSurveyHistoryList(
    request: IGetQcSurveyHistoryListRequest
  ): Observable<IGetQcSurveyHistoryListResponse> {
    const items = getMockQcSurveyHistoryList(request.pagination.take) || [];
    const firstItem = _.first(items) || <IQcSurveyHistoryListItemDto>{};

    return of({
      items: items,
      totalCount: items.length,
      nbOfMatched: firstItem.nbOfMatched || 0,
      nbOfMatchedWithinLimit: firstItem.nbOfMatchedWithinLimit || 0,
      nbOfNotMatched: firstItem.nbOfNotMatched || 0
    });
  }

  @ApiCall()
  getReportDetails(
    request: IQcReportDetailsRequest
  ): Observable<IQcReportDetailsResponse> {
    return of(getQcReportDetailsCall(request.id));
  }

  @ApiCall()
  saveReportDetails(
    request: ISaveReportDetailsRequest
  ): Observable<ISaveReportDetailsResponse> {
    return of({
      reportId: 2,
      emailTransactionTypeId: 1,
      productTypes: request.details.map(s => ({
        id: s.id,
        productType: {
          id: s.productTypeId,
          name: 'not used',
          displayName: 'not used'
        }
      }))
    });
  }

  @ApiCall()
  getSoundingReportList(
    request: IGetSoundingReportListRequest
  ): Observable<IGetSoundingReportListResponse> {
    return of({
      items: getMockQcSoundingReportList(request.pagination.take ?? 10),
      totalCount: (request?.pagination?.take ?? 10) * 5
    });
  }

  @ApiCall()
  getSoundingReportDetails(
    request: IGetSoundingReportDetailsRequest
  ): Observable<IGetSoundingReportDetailsResponse> {
    return of({
      items: getMockQcSoundingReportDetails(
        nullable(request.pagination).take || 10
      ),
      totalCount: (request?.pagination?.take ?? 10) * 5
    });
  }

  @ApiCall()
  getOrderProductsList(
    request: IGetOrderProductsListRequest
  ): Observable<IGetOrderProductsListResponse> {
    return of({ items: getQcOrderProductsList(10), totalCount: 10 });
  }

  @ApiCall()
  verifyReports(
    request: IQcVerifyReportsRequest
  ): Observable<IQcVerifyReportsResponse> {
    return of({});
  }

  @ApiCall()
  revertVerifyVessel(
    request: IQcRevertVerifyReportsRequest
  ): Observable<IQcRevertVerifyReportsResponse> {
    return of({});
  }

  @ApiCall()
  getEventsLog(
    request: IGetEventsLogRequest
  ): Observable<IGetEventsLogResponse> {
    const items = getMockQcEventsLog(3);
    return of({
      items: items,
      totalCount: items.length
    });
  }

  @ApiCall()
  markSludgeVerification(
    request: IQcMarkSludgeVerificationRequest
  ): Observable<IQcMarkSludgeVerificationResponse> {
    return of({});
  }

  @ApiCall()
  loadPortCallBdn(
    request: IQcLoadPortCallBdnRequest
  ): Observable<IQcLoadPortCallBdnResponse> {
    return of({
      vesselVoyageDetailsId: request.vesselVoyageDetailsId,
      productTypes: getQcReportDetailsCall(1).productTypeCategories.map(p => ({
        productType: p.productType,
        bdnQuantity: p.deliveredQty.bdnQuantity
      })),
      nbOfClaims: chance.integer({ min: 0, max: 50 }),
      nbOfDeliveries: chance.integer({ min: 0, max: 50 })
    });
  }

  @ApiCall()
  updateVesselToWatch(
    request: IVesselToWatchRequest
  ): Observable<IVesselToWatchResponse> {
    return;
  }

  @ApiCall()
  getReportListExportUrl(): string {
    return '';
  }
}
