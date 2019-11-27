import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { ApiServiceModel } from './api-service.model';
import { UserSettingsApiService } from '../services/user-settings/user-settings-api.service';
import { EntityRelatedLinksService } from '../services/entity-related-links/entity-related-links.service';
import { TenantSettingsService } from '../services/tenant-settings/tenant-settings.service';
import { UserSettingsApiServiceMock } from '../services/user-settings/user-settings-api.service.mock';
import { EntityRelatedLinksApiMock } from '../services/entity-related-links/api/entity-related-links-api.mock';
import { TenantSettingsApiMock } from '../services/tenant-settings/api/tenant-settings-api-mock.service';
import { AppConfig } from '../config/app-config';
import { ICannedResponse } from '../utils/decorators/api-call-settings';
import { API_CALL_KEY, IMethodApiCallSettings } from '../utils/decorators/api-call.decorator';
import { IApiServiceSettings } from './api-service-settings/api-service-settings.inteface';
import { UserProfileApiMock } from '@shiptech/core/services/user-profile/api/user-profile-api-mock.service';
import { UserProfileApi } from '@shiptech/core/services/user-profile/api/user-profile-api.service';
import { LookupsApiService } from '@shiptech/core/services/lookups-api/lookups-api.service';
import { LookupsApiServiceMock } from '@shiptech/core/services/lookups-api/lookups-api.service.mock';
import 'reflect-metadata';

export const DEV_SETTINGS_STORAGE_PREFIX = 'DeveloperToolbar_';

@Injectable({
  providedIn: 'root'
})
export class DeveloperToolbarService implements OnDestroy {

  public apiServices$ = new ReplaySubject<ApiServiceModel[]>(1);
  private _apiServices: ApiServiceModel[] = [];
  private _destroy$ = new Subject();

  public apiSettingsChanged = new Subject<IApiServiceSettings>();

  constructor(private userSettingsApiServiceMock: UserSettingsApiServiceMock,
              private entityRelatedLinksApiMock: EntityRelatedLinksApiMock,
              private tenantSettingsApiMock: TenantSettingsApiMock,
              private userProfileApiMock: UserProfileApiMock,
              private lookupsApiServiceMock: LookupsApiServiceMock,
              private appConfig: AppConfig) {
  }

  public registerApi(apiModel: ApiServiceModel): void {
    this._apiServices = [...this._apiServices, apiModel];

    const storedSettings = this.getApiSettings(apiModel.id);

    // Noted: loaded stored settings, if any
    if (storedSettings && storedSettings.methodSettings) {
      const target = this.getApiCallMetadata(apiModel.instance);
      this.patchCallSettings(target, storedSettings.methodSettings);
    }

    this.apiServices$.next(this._apiServices);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  bootstrap(): void {
    this.registerApi(
      {
        id: UserSettingsApiService.name,
        displayName: 'User Settings Api',
        instance: this.userSettingsApiServiceMock,
        isRealService: false,
        localApiUrl: 'http://localhost:44398',
        devApiUrl: this.appConfig.userSettingsApi,
        qaApiUrl: this.appConfig.userSettingsApi
      });

    this.registerApi(
      {
        id: LookupsApiService.name,
        displayName: 'Lookups Api',
        instance: this.lookupsApiServiceMock,
        isRealService: false,
        localApiUrl: 'http://localhost:44398',
        devApiUrl: this.appConfig.lookupApiUrl,
        qaApiUrl: this.appConfig.lookupApiUrl
      });

    this.registerApi(
      {
        id: EntityRelatedLinksService.name,
        displayName: 'Entity Related Links Api',
        instance: this.entityRelatedLinksApiMock,
        isRealService: false,
        localApiUrl: 'http://localhost:44398',
        devApiUrl: this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE,
        qaApiUrl: this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE
      });

    this.registerApi(
      {
        id: TenantSettingsService.name,
        displayName: 'Tenant Settings Api',
        instance: this.tenantSettingsApiMock,
        isRealService: false,
        localApiUrl: 'http://localhost:44398',
        devApiUrl: this.appConfig.v1.API.BASE_URL_DATA_ADMIN,
        qaApiUrl: this.appConfig.v1.API.BASE_URL_DATA_ADMIN
      });

    this.registerApi(
      {
        id: UserProfileApi.name,
        displayName: 'User Profile Api',
        instance: this.userProfileApiMock,
        isRealService: false,
        localApiUrl: 'http://localhost:44398',
        devApiUrl: this.appConfig.v1.API.BASE_URL_DATA_ADMIN,
        qaApiUrl: this.appConfig.v1.API.BASE_URL_DATA_ADMIN
      });
  }

  /**
   * Patch a set of MethodApiCall settings from another a source
   * @param toSettings
   * @param fromSettings
   */
  public patchCallSettings(toSettings: IMethodApiCallSettings[], fromSettings: IMethodApiCallSettings[]): void {
    toSettings.forEach(toMethod => {
      // Note: If method does not exist anymore, skip it. Storage may have an old version
      const fromMethod = fromSettings.find(f => f.name === toMethod.name);
      if (!fromMethod) {
        return;
      }

      // Note: Check is stored nextResponse still exists. Storage may have an old cannedResponse name.
      const toNextResponse = toMethod.settings.cannedResponses.find(c => c.name === (fromMethod.settings.nextResponse || <ICannedResponse>{}).name);

      // Note: Skip cannedResponses and nextResponse. These need to be fresh and checked if they still exist.
      // noinspection JSUnusedLocalSymbols
      const { cannedResponses, nextResponse, ...otherSettings } = fromMethod.settings;

      Object.assign(toMethod.settings, { ...otherSettings });
      toMethod.settings.nextResponse = toNextResponse || toMethod.settings.nextResponse;
    });
  }

  public getApiSettings(apiServiceId: string): IApiServiceSettings {
    const storedSettingsJson = sessionStorage.getItem(`${DEV_SETTINGS_STORAGE_PREFIX}_${apiServiceId}`);

    if (!storedSettingsJson) {
      return;
    }
    return JSON.parse(storedSettingsJson);
  }

  public saveApiSettings(apiServiceId: string, settings: IApiServiceSettings): void {
    this.apiSettingsChanged.next(settings);

    sessionStorage.setItem(`${DEV_SETTINGS_STORAGE_PREFIX}_${apiServiceId}`, JSON.stringify(settings));
  }

  public deleteApiSettings(apiServiceId: string): void {
    sessionStorage.removeItem(`${DEV_SETTINGS_STORAGE_PREFIX}_${apiServiceId}`);
  }

  public shouldKeepSettings(): boolean {
    return Object.keys(sessionStorage).filter(key => key.startsWith(DEV_SETTINGS_STORAGE_PREFIX)).length > 0;
  }

  public purgeApiSettings(): void {
    Object.keys(sessionStorage)
      .filter(key => key.startsWith(DEV_SETTINGS_STORAGE_PREFIX))
      .forEach(key => sessionStorage.removeItem(key));
  }

  /**
   * Get all MethodApiCallSettings from a service
   * @param source
   */
  public getApiCallMetadata(source: any): IMethodApiCallSettings[] {
    // Note: Only level of inherited methods
    return [...Object.getOwnPropertyNames(Object.getPrototypeOf(source)), ...Object.keys(Object.getPrototypeOf(source))]
      .map(key => <IMethodApiCallSettings>Reflect.getMetadata(API_CALL_KEY, source, key))
      .filter(m => m);
  }
}
