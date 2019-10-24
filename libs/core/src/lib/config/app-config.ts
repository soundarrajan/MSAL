import { Injectable, InjectionToken } from '@angular/core';
import { ILegacyAppConfig } from './legacy-app-config';
import { ITenantSettingsApi } from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfig implements IAppConfig {
  v1: ILegacyAppConfig;
  agGridLicense: string;
  loggingApi: string;
  userSettingsApi: string;
  quantityControlApi: string;
  // TODO: add this to config file,  check first if they are not in the infrastructure api
  tenantPublicApiUrl: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IAppConfig extends AppConfig {
}


