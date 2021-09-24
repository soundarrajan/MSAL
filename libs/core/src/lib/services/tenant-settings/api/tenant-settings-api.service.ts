import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObservableException } from '../../../utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '../../../utils/decorators/api-call.decorator';
import { LoggerFactory } from '../../../logging/logger-factory.service';
import { AppConfig } from '../../../config/app-config';
import { ApiServiceBase } from '@shiptech/core/api/api-base.service';
import {
  ITenantSettingsApi,
  ITenantSettingsApiResponse
} from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.interface';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { AppError } from '@shiptech/core/error-handling/app-error';

export namespace TenantSettingsApiPaths {
  export const general = () => `api/admin/generalConfiguration/get`;
  export const delivery = () => `api/admin/deliveryConfiguration/getCached`;
}

@Injectable({
  providedIn: 'root'
})
export class TenantSettingsApi extends ApiServiceBase
  implements ITenantSettingsApi {
  @ApiCallUrl()
  protected _apiUrl: string = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    loggerFactory: LoggerFactory
  ) {
    super(http, loggerFactory.createLogger(TenantSettingsApi.name));
  }

  //TODO: Refactor use Request/Response format
  @ObservableException()
  public get(
    moduleName: TenantSettingsModuleName
  ): Observable<ITenantSettingsApiResponse> {
    return this.http.post<ITenantSettingsApiResponse>(
      `${this._apiUrl}/${this.getApiPathForModuleName(moduleName)}`,
      {
        payload: true
      }
    );
  }

  // noinspection JSMethodCanBeStatic
  private getApiPathForModuleName(
    moduleName: TenantSettingsModuleName
  ): string {
    switch (moduleName) {
      case TenantSettingsModuleName.General:
        return TenantSettingsApiPaths.general();
      case TenantSettingsModuleName.Delivery:
        return TenantSettingsApiPaths.delivery();
      default:
        throw AppError.LoadTenantSettingsFailed(moduleName);
    }
  }
}

export const TENANT_SETTINGS_API = new InjectionToken<ITenantSettingsApi>(
  'ITenantSettingsApi'
);
