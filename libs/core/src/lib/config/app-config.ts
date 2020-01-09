import { Injectable } from '@angular/core';
import { ILegacyAppConfig } from './legacy-app-config';

@Injectable({
  providedIn: 'root'
})
export class AppConfig implements IAppConfig {
  v1: ILegacyAppConfig;
  agGridLicense: string;
  loggingApi: string;
  baseOrigin: string;
  robApi: string;
  v1ConfigPath: string;
  openLinksInNewTab =  true;
}

// tslint:disable-next-line:no-empty-interface
export interface IAppConfig extends AppConfig {
}


