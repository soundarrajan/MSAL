import { Injectable } from '@angular/core';
import { ILegacyAppConfig } from './legacy-app-config';

@Injectable({
  providedIn: 'root'
})
export class AppConfig implements IAppConfig {
  v1: ILegacyAppConfig;
  agGridLicense: string;
  loggingApi: string;
  userSettingsApi: string;
  userSettingsApiUrl: string;
  // TODO: add this to config file
  tenantPublicApiUrl: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IAppConfig extends AppConfig {
}



