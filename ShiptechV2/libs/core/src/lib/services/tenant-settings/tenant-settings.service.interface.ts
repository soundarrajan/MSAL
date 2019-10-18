import { Observable } from 'rxjs';
import { ILoadModuleOptions, ITransformTenantSettings } from './tenant-settings.service';

export interface ITenantSettingsService {
  loadModule(moduleName: string): Observable<any>;

  // tslint:disable-next-line:unified-signatures
  loadModule(moduleName: string, desiredName: string): Observable<any>;

  // tslint:disable-next-line:unified-signatures
  loadModule<T>(moduleName: string, transform: ITransformTenantSettings<T>): Observable<T>;

  // tslint:disable-next-line:unified-signatures
  loadModule<T>(moduleName: string, desiredName: string, transform: ITransformTenantSettings<T>): Observable<T>;

  // tslint:disable-next-line:unified-signatures
  loadModule(moduleName: string, options: ILoadModuleOptions): Observable<any>;

  // tslint:disable-next-line:unified-signatures
  loadModule(moduleName: string, ...args: any[]): Observable<any>;
}

export interface IGenericTenantSettings {
  [key: string]: any;
}

export interface ITenantSettingsDto extends IGenericTenantSettings {
  dateFormat: string;
  dateTimeFormat: string;
  uomIdDefault: string;
  currencyIdDefault: string;
  uomNameDefault: string;
  currencyNameDefault: string;
}

export interface IBunkertechSettingsDto {
  sendEmailToCounterparty: string;
}

export interface ITenantSettingsResponseDto {
  settings: ITenantSettingsDto;
}
