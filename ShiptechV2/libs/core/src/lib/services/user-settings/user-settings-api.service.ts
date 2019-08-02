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
  IUserSettingResponse,
  IUserSettingsRequest
} from './request-response';
import { fromEvent, Observable, of, Subject, throwError } from 'rxjs';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { toQueryString } from '../../utils/QueryString';
import { IPreferenceStorage } from '../preference-storage/preference-storage.interface';
import { catchError, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { Cacheable } from 'ngx-cacheable';
import { ApiError } from '../../error-handling/api/api-error';
import { AppError } from '../../error-handling/app-error';
import { AppConfig } from '@shiptech/core';

export namespace UserSettingsApiPaths {
  export const userSettingByKey = (key: string) => `api/${key}`;
  export const userSettingList = (keys: string[]) => `api/list?${toQueryString({ keys }, { indices: false })}`;
  export const upsertUserSetting = () => `api/save`;
  export const deleteUserSetting = (key: string) => `api/delete/${key}`;
  export const purgeUserSettings = () => `api/purge`;
}

// @dynamic
@Injectable()
// noinspection JSUnusedGlobalSymbols
export class UserSettingsApiService implements IUserSettingsApiService, IPreferenceStorage, OnDestroy {
  private _destroy$ = new Subject();

  @ApiCallUrl()
  protected _apiUrl = this.appConfig.userSettingsApiUrl;

  constructor(private appConfig: AppConfig, private http: HttpClient) {
    fromEvent(window, 'keydown')
      .pipe(takeUntil(this._destroy$))
      .subscribe((event: KeyboardEvent) => this.onKeyPress(event));
  }

  @ObservableException()
  getByKey(request: IUserSettingByKeyRequest): Observable<IUserSettingResponse> {
    const requestUrl = `${this._apiUrl}/${UserSettingsApiPaths.userSettingByKey(request.key)}`;
    return this.getSettings(requestUrl).pipe(catchError(() => throwError(AppError.FailedToLoadUserSettings)));
  }

  @ObservableException()
  getList(request: IUserSettingsRequest): Observable<IUserSettingResponse> {
    const requestUrl = `${this._apiUrl}/${UserSettingsApiPaths.userSettingList(request.keys)}`;
    return this.getSettings(requestUrl);
  }

  @ObservableException()
  save(request: IUpsertUserSettingRequest): Observable<IUpsertUserSettingResponse> {
    const requestUrl = `${this._apiUrl}/${UserSettingsApiPaths.upsertUserSetting()}`;
    return this.http.post<IUpsertUserSettingResponse>(requestUrl, request).pipe(catchError(() => throwError(AppError.FailedToSaveUserSettings)));
  }

  @ObservableException()
  delete(request: IDeleteUserSettingRequest): Observable<IDeleteUserSettingResponse> {
    const requestUrl = `${this._apiUrl}/${UserSettingsApiPaths.deleteUserSetting(request.key)}`;
    return this.http.delete<IDeleteUserSettingResponse>(requestUrl);
  }

  @ObservableException()
  purge(request: IPurgeUserSettingsRequest): Observable<IPurgeUserSettingsResponse> {
    const requestUrl = `${this._apiUrl}/${UserSettingsApiPaths.purgeUserSettings()}`;
    return this.http.delete<IPurgeUserSettingsResponse>(requestUrl).pipe(catchError(() => throwError(AppError.FailedToPurgeUserSettings)));
  }

  get<T>(key: string): Observable<T> {
    return this.getByKey({ key }).pipe(map(response => <T>response.value[key]));
  }

  // NOTE: this need further testing
  getMultiple<T>(keys: string[]): Observable<T[]> {
    return this.getList({ keys }).pipe(map(response => <T[]>response.value));
  }

  remove(key: string): Observable<any> {
    return this.delete({ key });
  }

  removeAll(): Observable<any> {
    return this.purge({});
  }

  set(key: string, value: any): Observable<any> {
    return this.save({ key, value: typeof value === 'string' ? value : JSON.stringify(value) });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.ctrlKey && event.altKey && event.shiftKey && event.code === 'KeyR') {
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
  protected getSettings(requestUrl: string): Observable<IUserSettingResponse> {
    return this.apiCachedRequest(requestUrl, false);
  }

  @ObservableException()
  @Cacheable({
    cacheResolver: (oldParameters: any[], newParameters: any[]) => {
      // Note: old url and new may refer to different path, since this is a shared method.
      const oldUrl = oldParameters[0];
      const newUrl = newParameters[0];

      // Note: For the same url decide if we should use the cache or not.
      // Note: If second parameter _byPassCache is set to true, make a fresh request
      const byPassCache = newParameters && newParameters.length > 1 && newParameters[1] === true;
      // noinspection UnnecessaryLocalVariableJS
      const useFromCache = oldUrl === newUrl && !byPassCache;

      return useFromCache;
    },
    shouldCacheDecider: (response: IUserSettingResponse) => response && !!response.value,
    maxAge: 1000 * 60 * 5, // in ms, cache for 5 minutes,
    slidingExpiration: true,
    maxCacheCount: 100
  })
  protected apiCachedRequest(url: string, _byPassCache: boolean): Observable<IUserSettingResponse> {
    return this.http.get<IUserSettingResponse>(url).pipe(switchMap(response => (!response || !response.value ? throwError(ApiError.LookupsItemsPropertyMissing(response)) : of(response))));
  }
}

export const USER_SETTINGS_API_SERVICE = new InjectionToken<IUserSettingsApiService>('IUserSettingsApiService');
