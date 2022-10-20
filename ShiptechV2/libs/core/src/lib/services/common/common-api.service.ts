import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

import { AppConfig } from '@shiptech/core/config/app-config';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { ICommonApiService } from './common.api.service.interface';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { catchError, map } from 'rxjs/operators';

export const CommonApiPaths = {
  getSellerRatings: `api/sellerrating/sellerratingreview/getForNegotiation`
};

@Injectable({
    providedIn: 'root'
})
export class CommonApiService implements ICommonApiService {
    
    @ApiCallUrl()
    private _sellerApiUrl = this.appConfig.v1.API.BASE_URL_DATA_SELLERRATING;

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
}

export const COMMON_API_SERVICE = new InjectionToken<ICommonApiService>(
    'COMMON_API_SERVICE'
);