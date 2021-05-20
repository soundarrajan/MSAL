import { Injectable, InjectionToken, OnDestroy } from '@angular/core';
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
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { IOrderListRequest, IOrderListResponse } from '../request-reponse-dtos/order-list.dtos';
import { IMastersListApiService } from './masters-list-api.interface';
import { IPhysicalSupplierListRequest, IPhysicalSupplierListResponse, IProductListRequest, IProductListResponse } from './masters-list-response';


export namespace MastersApiPaths {
  export const getProductList = () => `api/masters/products/list`;
  export const getPhysicalSupplierList = () => `api/masters/counterparties/listByTypes`;
  export const getSellerList = () => `api/masters/counterparties/listByTypes`;
  export const getCompanyList = () => `api/masters/companies/list`;
  export const getSystemInstumentList = () => `api/masters/systeminstruments/list`;
  export const getCurrencyList = () => `api/masters/currencies/list`;
  export const getFormulaList = () => `api/masters/formulas/list`;


}

// @dynamic
@Injectable({
  providedIn: 'root'
})
// noinspection JSUnusedGlobalSymbols
export class MastersListApiService
  implements IMastersListApiService, OnDestroy {
  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;
  private _destroy$ = new Subject();

  constructor(private appConfig: AppConfig, private http: HttpClient) {
    
  }


  
  @ObservableException()
  getProductList(
    request: IProductListRequest
  ): Observable<IProductListResponse> {
    const requestUrl = `${this._apiUrl}/${MastersApiPaths.getProductList()}`;
    return this.http.post(requestUrl, {'payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the product list'))
    );
  }

  @ObservableException()
  getPhysicalSupplierList(
    request: IPhysicalSupplierListRequest
  ): Observable<IPhysicalSupplierListResponse> {
    const requestUrl = `${this._apiUrl}/${MastersApiPaths.getPhysicalSupplierList()}`;
    return this.http.post(requestUrl, {'payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the physical supplier list'))
    );
  }

  @ObservableException()
  getSellerList(
    request: IPhysicalSupplierListRequest
  ): Observable<IPhysicalSupplierListResponse> {
    const requestUrl = `${this._apiUrl}/${MastersApiPaths.getSellerList()}`;
    return this.http.post(requestUrl, {'payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the seller list'))
    );
  }

  @ObservableException()
  getCompanyList(
    request: IPhysicalSupplierListRequest
  ): Observable<any> {
    const requestUrl = `${this._apiUrl}/${MastersApiPaths.getCompanyList()}`;
    return this.http.post(requestUrl, {'payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the company list'))
    );
  }

  @ObservableException()
  getSystemInstumentList(
    request: IPhysicalSupplierListRequest
  ): Observable<IPhysicalSupplierListResponse> {
    const requestUrl = `${this._apiUrl}/${MastersApiPaths.getSystemInstumentList()}`;
    return this.http.post(requestUrl, {'payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the system instrument list'))
    );
  }

  @ObservableException()
  getCurrencyList(
    request: IPhysicalSupplierListRequest
  ): Observable<IPhysicalSupplierListResponse> {
    const requestUrl = `${this._apiUrl}/${MastersApiPaths.getCurrencyList()}`;
    return this.http.post(requestUrl, {'payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the currency list'))
    );
  }

  @ObservableException()
  getFormulaList(
    request: IPhysicalSupplierListRequest
  ): Observable<IPhysicalSupplierListResponse> {
    const requestUrl = `${this._apiUrl}/${MastersApiPaths.getFormulaList()}`;
    return this.http.post(requestUrl, {'payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the formula list'))
    );
  }

  @ObservableException()
  getList(request: any, URL:string): Observable<any> {
    const requestUrl = `${this._apiUrl}/${URL}`;
    return this.http.post(requestUrl, {'payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the formula list 2'))
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

 

}

export const API_MASTERS_LIST_API_SERVICE = new InjectionToken<
IMastersListApiService
>('IMastersListApiService');
