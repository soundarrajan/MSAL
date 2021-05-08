import { Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { INavBarApiService } from './navbar-api.interface';
import { ApiCallUrl } from '../../utils/decorators/api-call.decorator';
import { HttpClient } from '@angular/common/http';
import {
  INavBarRequest,
  INavBarResponse
} from './navbar-response';
import { fromEvent, Observable, of, Subject, throwError } from 'rxjs';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { IPreferenceStorage } from '../preference-storage/preference-storage.interface';
import {
  catchError,
  finalize,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { AppError } from '../../error-handling/app-error';
import { AppConfig } from '../../config/app-config';
import { LoggingInterceptorHeader } from '../../interceptors/logging-http-interceptor.service';

export namespace NavBarApiPaths {
  export const get = () => `api/infrastructure/navbar/navbaridslist`;

}

// @dynamic
@Injectable({
  providedIn: 'root'
})
// noinspection JSUnusedGlobalSymbols
export class NavBarApiService
  implements INavBarApiService, OnDestroy {
  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE;
  private _destroy$ = new Subject();

  constructor(private appConfig: AppConfig, private http: HttpClient) {

  }

  @ObservableException()
  getNavBarIdsList(
    request: any
  ): Observable<INavBarResponse> {
    const requestUrl = `${this._apiUrl}/${NavBarApiPaths.get()}`;
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

export const NAV_BAR_API_SERVICE = new InjectionToken<INavBarApiService>('INavBarApiService');
