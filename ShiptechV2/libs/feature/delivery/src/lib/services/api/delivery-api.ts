import { Injectable, InjectionToken } from '@angular/core';
import { IQuantityControlApiService } from './quantity-control.api.service.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
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
import { IDeliveryApiService } from './delivery.api.service.interface';
import { IDeliveryConversionInfoResponse, IDeliveryDetailsRequest, IDeliveryDetailsResponse, IDeliveryInfoForOrderResponse, IDeliveryOrderSummaryResponse, IDeliveryQuantityParametersResponse, IDeliverySpecParametersResponse, IOrderResponse } from './request-response/delivery-by-id.request-response';
import { catchError, map } from 'rxjs/operators';

export namespace DeliveryApiPaths {
  export const getDeliveryDetails = () => `api/delivery/get`;
  export const getDeliveryInfoForOrder = () => `api/delivery/deliveryInfoForOrder`;
  export const getDeliveryOrderSummary = () => `api/delivery/summary`;
  export const getOrder = () => `api/procurement/order/get`;
  export const getDeliverySpecParameters = () => `api/delivery/getDeliverySpecParameters`;
  export const getDeliveryQuantityParameters = () => `api/delivery/getDeliveryQuantityParameters`;
  export const getConversionInfo = () => `api/delivery/getConversionInfo`;
  export const saveDelivery = () =>  `api/delivery/create`;
  export const updateDelivery = () =>  `api/delivery/update`;
  export const verifyDelivery = () =>  `api/delivery/verify`;
  export const revertVerifyDelivery = () =>  `api/delivery/revert`;
  export const getSplitDeliveryLimits = () =>  `api/delivery/getDeliverySplitLimits`;
  export const raiseClaim = () =>  `api/claims/new`;
  export const deleteDeliveryProduct = () =>  `api/delivery/products/delete`;
  export const sendLabsTemplateEmail = () =>  `api/delivery/SendLabsTemplateEmail`;
  export const getStaticLists = () =>  `api/infrastructure/static/lists`;


}



@Injectable({
  providedIn: 'root'
})
export class DeliveryApi implements IDeliveryApiService {

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_DELIVERY;
  
  @ApiCallUrl()
  private _procurementApiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  @ApiCallUrl()
  private _claimsApiUrl = this.appConfig.v1.API.BASE_URL_DATA_CLAIMS;

  @ApiCallUrl()
  private _infrastructureApiUrl = this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getDeliveryDetails(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http.post<IDeliveryDetailsResponse>(
      `${this._apiUrl}/${DeliveryApiPaths.getDeliveryDetails()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the delivery'))
    );
  }

  @ObservableException()
  getDeliveryInfoForOrder(
    request: any
  ): Observable<IDeliveryInfoForOrderResponse[]> {
    return this.http.post<IDeliveryInfoForOrderResponse[]>(
      `${this._apiUrl}/${DeliveryApiPaths.getDeliveryInfoForOrder()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the related deliveries'))
    );
  }

  @ObservableException()
  getDeliveryOrderSummary(
    request: any
  ): Observable<IDeliveryOrderSummaryResponse> {
    return this.http.post<IDeliveryOrderSummaryResponse>(
      `${this._apiUrl}/${DeliveryApiPaths.getDeliveryOrderSummary()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the related deliveries'))
    );
  }

  @ObservableException()
  getOrder(
    request: any
  ): Observable<IOrderResponse> {
    return this.http.post<IOrderResponse>(
      `${this._procurementApiUrl}/${DeliveryApiPaths.getOrder()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the related deliveries'))
    );
  }

  @ObservableException()
  getDeliverySpecParameters(
    request: any
  ): Observable<IDeliverySpecParametersResponse[]> {
    return this.http.post<IDeliverySpecParametersResponse[]>(
      `${this._apiUrl}/${DeliveryApiPaths.getDeliverySpecParameters()}`, request
    ).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the related deliveries'))
    );
  }

  @ObservableException()
  getDeliveryQuantityParameters(
    request: any
  ): Observable<IDeliveryQuantityParametersResponse[]> {
    return this.http.post<IDeliveryQuantityParametersResponse[]>(
      `${this._apiUrl}/${DeliveryApiPaths.getDeliveryQuantityParameters()}`, request
    ).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the related deliveries'))
    );
  }

  @ObservableException()
  getConversionInfo(
    request: any
  ): Observable<IDeliveryConversionInfoResponse> {
    return this.http.post<IDeliveryQuantityParametersResponse[]>(
      `${this._apiUrl}/${DeliveryApiPaths.getConversionInfo()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the related deliveries'))
    );
  }

  @ObservableException()
  saveDelivery(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http.post<IDeliveryDetailsResponse>(
      `${this._apiUrl}/${DeliveryApiPaths.saveDelivery()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.upsertedId),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  updateDelivery(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http.post<IDeliveryDetailsResponse>(
      `${this._apiUrl}/${DeliveryApiPaths.updateDelivery()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }


  @ObservableException()
  verifyDelivery(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http.post<IDeliveryDetailsResponse>(
      `${this._apiUrl}/${DeliveryApiPaths.verifyDelivery()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not verify the delivery'))
    );
  }

  revertVerifyDelivery(
    request: any
  ): Observable<any> {
    return this.http.post<IDeliveryDetailsResponse>(
      `${this._apiUrl}/${DeliveryApiPaths.revertVerifyDelivery()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of('Error, could not revert verify the delivery'))
    );
  }

  getSplitDeliveryLimits(
    request: any
  ): Observable<any> {
    return this.http.post<IDeliveryDetailsResponse>(
      `${this._apiUrl}/${DeliveryApiPaths.getSplitDeliveryLimits()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of('Error, could not get split delivery limits'))
    );
  }

  raiseClaim(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._claimsApiUrl}/${DeliveryApiPaths.raiseClaim()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of('Error, could not raise note of protest'))
    );
  }

  deleteDeliveryProduct(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${DeliveryApiPaths.deleteDeliveryProduct()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  sendLabsTemplateEmail(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${DeliveryApiPaths.sendLabsTemplateEmail()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  getStaticLists(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._infrastructureApiUrl}/${DeliveryApiPaths.getStaticLists()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }




  

}

export const DELIVERY_API_SERVICE = new InjectionToken<
  IDeliveryApiService
>('DELIVERY_API_SERVICE');
