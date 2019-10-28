import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant.settings.interface';
import { QuantityControlApi } from './services/api/quantity-control-api';
import { QuantityControlApiMock } from './services/api/quantity-control-api.mock';
import { AppConfig } from '@shiptech/core/config/app-config';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';

@Injectable()
export class QuantityControlRouteResolver implements Resolve<any> {
  constructor(
    private tenantService: TenantSettingsService,
    mockApi: QuantityControlApiMock, appConfig: AppConfig, devService: DeveloperToolbarService
  ) {
    // TODO: Workaround to jump start creation of the Mock Service in order for it to register it with the developer toolbar.
    // Note: It's important to register this only once, and in the root module. We currently don't support multiple services in child providers
    devService.registerApi({
      id: QuantityControlApi.name,
      displayName: 'Quantity Control Api',
      instance: mockApi,
      isRealService: false,
      localApiUrl: 'http://localhost:44398',
      devApiUrl: appConfig.quantityControlApi,
      qaApiUrl: appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE
    });
  }

  resolve(): Observable<any> {
    return this.tenantService.loadModule(TenantSettingsModuleName.Delivery)
      .pipe(catchError(() => of(AppError.LoadTenantSettingsFailed(TenantSettingsModuleName.Delivery))));
  }
}
