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
}



@Injectable({
  providedIn: 'root'
})
export class ContractApi implements IDeliveryApiService {

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_CONTRACTS;
  
  @ApiCallUrl()
  private _procurementApiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  @ApiCallUrl()
  private _adminApiUrl = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

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
      catchError(() => of('Error, could not load the contract'))
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
      catchError(() => of('Error, could not load the tenant config'))
    );
  }

  
  

}

export const CONTRACT_API_SERVICE = new InjectionToken<
IContractApiService
>('CONTRACT_API_SERVICE');
