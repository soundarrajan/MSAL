import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

import { AppConfig } from '@shiptech/core/config/app-config';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { ICommonApiService, ILocationListResponse, IProductListResponse } from './common.api.service.interface';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { catchError, map } from 'rxjs/operators';

export const CommonApiPaths = {
  getSellerRatings: `api/sellerrating/sellerratingreview/getForNegotiation`,
  getProductList: `api/masters/products/list`,
  getLocationList: `api/masters/locations/listVessel`
};

@Injectable({
    providedIn: 'root'
})
export class CommonApiService implements ICommonApiService {
    
    @ApiCallUrl()
    private _sellerApiUrl = this.appConfig.v1.API.BASE_URL_DATA_SELLERRATING;
    protected _masterApiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

    constructor(private http: HttpClient, private appConfig: AppConfig) {}

    handleErrorMessage(body: any) {
        return of(
          body instanceof HttpErrorResponse && body.status != 401
            ? body.error.ErrorMessage
              ? body.error.ErrorMessage
              : (body.error.errors)? body.error.errors : body.error.errorMessage
            : { message: 'Unauthorized' }
        );
    }
    
    @ObservableException()
    getSellerRatingforNegotiation(payload:any) : Observable<any>{
        return this.http
        .post<any>(
            `${this._sellerApiUrl}/${CommonApiPaths.getSellerRatings}`,
            payload
            )
            .pipe(
            map((body: any) => body),
            catchError((body: any) => this.handleErrorMessage(body))
            );
    }

    @ObservableException()
    getProductList(
      request: any
    ): Observable<IProductListResponse> {
      const requestUrl = `${this._masterApiUrl}/${CommonApiPaths.getProductList}`;
      return this.http.post(requestUrl, {'Payload': request}).pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not load the product list'))
      );
    }

    @ObservableException()
    getLocationList(
      request: any
    ): Observable<ILocationListResponse> {
      const requestUrl = `${this._masterApiUrl}/${CommonApiPaths.getLocationList}`;
      return this.http.post(requestUrl, {'Payload': request}).pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not load the product list'))
      );
    }
}

export const COMMON_API_SERVICE = new InjectionToken<ICommonApiService>(
    'COMMON_API_SERVICE'
);