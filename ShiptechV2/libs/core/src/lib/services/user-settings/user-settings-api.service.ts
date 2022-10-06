import { Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { IUserSettingsApiService } from './user-settings-api.interface';
import { ApiCallUrl } from '../../utils/decorators/api-call.decorator';
import { HttpClient } from '@angular/common/http';
import {
  IDeleteUserSettingRequest,
  IDeleteUserSettingResponse,
  IPurgeUserSettingsRequest,
  IPurgeUserSettingsResponse,
  IUpsertUserSettingRequest,
  IUpsertUserSettingResponse,
  IUserSettingByKeyRequest,
  IUserSettingResponse
} from './request-response';
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

export namespace UserSettingsApiPaths {
  export const get = (key: string) => `api/user-settings/${key}`;
  export const save = (key: string) => `api/user-settings/save/${key}`;
  export const $delete = (key: string) => `api/user-settings/${key}`;
  export const purge = () => `api/user-settings/purge`;
}

// @dynamic
@Injectable({
  providedIn: 'root'
})
// noinspection JSUnusedGlobalSymbols
export class UserSettingsApiService
  implements IUserSettingsApiService, IPreferenceStorage, OnDestroy {
  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE;
  private _destroy$ = new Subject();

  constructor(private appConfig: AppConfig, private http: HttpClient) {
    // TODO: Remove from here, create a UserSettingService
    fromEvent(window, 'keydown')
      .pipe(takeUntil(this._destroy$))
      .subscribe((event: KeyboardEvent) => this.onKeyPress(event));
  }

  @ObservableException()
  getByKey(
    request: IUserSettingByKeyRequest
  ): Observable<IUserSettingResponse> {
    const requestUrl = `${this._apiUrl}/${UserSettingsApiPaths.get(
      request.key
    )}`;
    return this.getSettingsCached(requestUrl).pipe(
      catchError(e => throwError(AppError.FailedToLoadUserSettings(e)))
    );
  }

  @ObservableException()
  save(
    request: IUpsertUserSettingRequest
  ): Observable<IUpsertUserSettingResponse> {
    const requestUrl = `${this._apiUrl}/${UserSettingsApiPaths.save(
      request.key
    )}`;
    return this.http
      .post<IUpsertUserSettingResponse>(requestUrl, { Payload: request })
      .pipe(catchError(() => throwError(AppError.FailedToSaveUserSettings)));
  }

  @ObservableException()
  delete(
    request: IDeleteUserSettingRequest
  ): Observable<IDeleteUserSettingResponse> {
    const requestUrl = `${this._apiUrl}/${UserSettingsApiPaths.$delete(
      request.key
    )}`;
    return this.http.post<IDeleteUserSettingResponse>(requestUrl, {
      payload: false
    });
  }

  @ObservableException()
  purge(
    request: IPurgeUserSettingsRequest
  ): Observable<IPurgeUserSettingsResponse> {
    const requestUrl = `${this._apiUrl}/${UserSettingsApiPaths.purge()}`;
    return this.http
      .post<IPurgeUserSettingsResponse>(requestUrl, { payload: false })
      .pipe(catchError(() => throwError(AppError.FailedToPurgeUserSettings)));
  }

  @ObservableException()
  get<T>(key: string): Observable<T> {
    return this.getByKey({ key }).pipe(map(response => response.value));
  }

  @ObservableException()
  remove(key: string): Observable<any> {
    return this.delete({ key });
  }

  @ObservableException()
  removeAll(): Observable<any> {
    return this.purge({});
  }

  @ObservableException()
  set(key: string, value: any): Observable<any> {
    return  this.save({
      key,
      value:
        typeof value === 'string' ? (value as string) : JSON.stringify(value)
    });;
  }

  // TODO: Remove from here, create a UserSettingService
  onKeyPress(event: KeyboardEvent): void {
    if (
      event.ctrlKey &&
      event.altKey &&
      event.shiftKey &&
      event.code === 'KeyR'
    ) {
      if (confirm('Are you sure you want to clear all user settings?')) {
        this.removeAll()
          .pipe(finalize(() => window.location.reload()))
          .subscribe();
      }
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  @ObservableException()
  // @Cacheable({
  //   cacheResolver: (oldParameters: any[], newParameters: any[]) => {
  //     // Note: old url and new may refer to different path, since this is a shared method.
  //     const oldUrl = oldParameters[0];
  //     const newUrl = newParameters[0];
  //
  //     // Note: For the same url decide if we should use the cache or not.
  //     // Note: If second parameter _byPassCache is set to true, make a fresh request
  //     const byPassCache = newParameters && newParameters.length > 1 && newParameters[1] === true;
  //     // noinspection UnnecessaryLocalVariableJS
  //     const useFromCache = oldUrl === newUrl && !byPassCache;
  //
  //     return useFromCache;
  //   },
  //   shouldCacheDecider: (response: IUserSettingResponse) => response && !!response.value,
  //   maxAge: 1000 * 60 * 5, // in ms, cache for 5 minutes,
  //   slidingExpiration: true,
  //   maxCacheCount: 100
  // })
  protected getSettingsCached(url: string): Observable<IUserSettingResponse> {
    return this.http
      .get<IUserSettingResponse>(url, {
        observe: 'response',
        // Note: If the interceptor is not installed, the header will go through which might break CORS allowed headers
        headers: { [LoggingInterceptorHeader]: '404' }
      })
      .pipe(
        catchError(response =>
          // Note: 404 is a valid response, the key is missing in the user settings.
          response.status === 404 ? of(response) : throwError(response)
        ),
        switchMap(response =>
          !response.body || !response.body.value
            ? // Note: We need to map a 404 status code to the <IUserSettingResponse> { value: any } format.
              of({ value: undefined })
            : of(response.body)
        )
      );
  }
}

export const USER_SETTINGS_API_SERVICE = new InjectionToken<
  IUserSettingsApiService
>('IUserSettingsApiService');
