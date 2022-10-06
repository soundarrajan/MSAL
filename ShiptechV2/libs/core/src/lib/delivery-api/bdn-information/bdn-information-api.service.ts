import { Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { IBdnInformationApiService } from './bdn-information-api.interface';
import { HttpClient } from '@angular/common/http';

import { fromEvent, Observable, of, Subject, throwError } from 'rxjs';

import {
  catchError,
  finalize,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { IGetForTransactionForSearchRequest, IGetForTransactionForSearchResponse } from './bdn-information-response';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { IOrderListRequest, IOrderListResponse } from '../request-reponse-dtos/order-list.dtos';


export namespace BdnInformationApiPaths {
  export const getTransactionForSearch = () => `api/procurement/order/getForTransactionForSearch`;
  export const getOrderList = () => `api/procurement/order/list`;

}

// @dynamic
@Injectable({
  providedIn: 'root'
})
// noinspection JSUnusedGlobalSymbols
export class BdnInformationApiService
  implements IBdnInformationApiService, OnDestroy {
  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;
  private _destroy$ = new Subject();

  constructor(private appConfig: AppConfig, private http: HttpClient) {
    
  }

  @ObservableException()
  getForTransactionForSearch(
    request: any
  ): Observable<IGetForTransactionForSearchResponse[]> {
    const requestUrl = `${this._apiUrl}/${BdnInformationApiPaths.getTransactionForSearch()}`;
    return this.http.post(requestUrl, request).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the navbarIds'))
    );
  }

  
  @ObservableException()
  getOrderList(
    request: any
  ): Observable<IOrderListResponse> {
    const requestUrl = `${this._apiUrl}/${BdnInformationApiPaths.getOrderList()}`;
    return this.http.post(requestUrl, {'payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the navbarIds'))
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

 

}

export const BDN_INFORMATION_API_SERVICE = new InjectionToken<
IBdnInformationApiService
>('IBdnInformationApiService');
