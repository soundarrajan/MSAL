import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiCall, ApiCallForwardTo } from '../../../utils/decorators/api-call.decorator';
import { ObservableException } from '../../../utils/decorators/observable-exception.decorator';
import { Store } from '@ngxs/store';
import {
  ITenantSettingsApi,
  ITenantSettingsApiResponse
} from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.interface';
import { TenantSettingsApi } from '@shiptech/core/services/tenant-settings/api/tenant-settings-api';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant.settings.interface';
import * as generalTenantSettings from './general-tenant-settings.mock.json';
import * as deliveryTenantSettings from './delivery-tenant-settings.mock.json';

@Injectable({
  providedIn: 'root'
})
export class TenantSettingsApiMock implements ITenantSettingsApi {
  @ApiCallForwardTo() realService: TenantSettingsApi;

  constructor(private store: Store, realService: TenantSettingsApi) {
    this.realService = realService;
  }

  @ObservableException()
  @ApiCall()
  get(moduleName: TenantSettingsModuleName): Observable<ITenantSettingsApiResponse>{
    switch (moduleName) {
      case TenantSettingsModuleName.General:
        return of(generalTenantSettings);
      case TenantSettingsModuleName.Delivery:
        return of(deliveryTenantSettings);
    }

    return of();
  }
}
