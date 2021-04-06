import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';

import { IDeliveryApiService } from './delivery.api.service.interface';
import { IDeliveryConversionInfoResponse, IDeliveryDetailsRequest, IDeliveryDetailsResponse, IDeliveryInfoForOrderResponse, IDeliveryOrderSummaryResponse, IDeliveryQuantityParametersResponse, IDeliverySpecParametersResponse, IOrderResponse } from './request-response/delivery-by-id.request-response';
import { catchError, map } from 'rxjs/operators';
import { IContractApiService } from './contract.api.service.interface';

export namespace ContractApiPaths {
  export const getContractDetails = () => `api/contract/contract/get`;
  export const getTenantConfiguration = () => `api/admin/tenantConfiguration/get`;
  export const getStaticLists = () =>  `api/infrastructure/static/lists`;
  export const getCounterparty = () =>  `api/masters/counterparties/get`;
  export const getAgreementType = () =>  `api/masters/agreementType/individualLists`;
  export const getAgreementTypeById = () =>  `api/masters/agreementtype/get`;
  export const getLocationList = () =>  `api/masters/locations/list`;
  export const getProductList = () =>  `api/masters/products/list`;

}



@Injectable({
  providedIn: 'root'
})
export class ContractApi implements IContractApiService {

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_CONTRACTS;
  
  @ApiCallUrl()
  private _procurementApiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  @ApiCallUrl()
  private _adminApiUrl = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

  @ApiCallUrl()
  private _infrastructureApiUrl = this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE;

  @ApiCallUrl()
  private _masterApiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}


  @ObservableException()
  getContractDetails(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http.post<IDeliveryDetailsResponse>(
      `${this._apiUrl}/${ContractApiPaths.getContractDetails()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage + ' ' + body.error.Reference))
    );
  }


  
  @ObservableException()
  getTenantConfiguration(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._adminApiUrl}/${ContractApiPaths.getTenantConfiguration()}`,
      { Payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage + ' ' + body.error.Reference))
    );
  }

    
  @ObservableException()
  getStaticLists(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._infrastructureApiUrl}/${ContractApiPaths.getStaticLists()}`,
      { Payload: request }
    ).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body.error.ErrorMessage + ' ' + body.error.Reference))
    );
  }

  @ObservableException()
  getCounterparty(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._masterApiUrl}/${ContractApiPaths.getCounterparty()}`,
      { Payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage + ' ' + body.error.Reference))
    );
  }

  @ObservableException()
  getAgreementType(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._masterApiUrl}/${ContractApiPaths.getAgreementType()}`, request 
    ).pipe(
      map((body: any) => body.payload.contractAgreementTypesList),
      catchError((body: any) => of(body.error.ErrorMessage + ' ' + body.error.Reference))
    );
  }

  @ObservableException()
  getAgreementTypeById(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._masterApiUrl}/${ContractApiPaths.getAgreementTypeById()}`,
      { Payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage + ' ' + body.error.Reference))
    );
  }

  @ObservableException()
  getLocationList(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._masterApiUrl}/${ContractApiPaths.getLocationList()}`,
     request 
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage + ' ' + body.error.Reference))
    );
  }

  @ObservableException()
  getProductList(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._masterApiUrl}/${ContractApiPaths.getProductList()}`,
      request 
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage + ' ' + body.error.Reference))
    );
  }

  
  

}

export const CONTRACT_API_SERVICE = new InjectionToken<
IContractApiService
>('CONTRACT_API_SERVICE');
