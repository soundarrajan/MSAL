import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, Observable } from 'rxjs';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import {
  ITenantSettingsDto,
  ITenantSettingsResponseDto,
  ITenantSettingsService
} from './tenant-settings.service.interface';
import { Store } from '@ngxs/store';
import {
  LoadTenantSettingsAction,
  LoadTenantSettingsFailedAction,
  LoadTenantSettingsSuccessfulAction
} from '../../store/states/tenant/load-tenant.actions';
import { ApiCallUrl } from '../../utils/decorators/api-call.decorator';
import { AppError } from '../../error-handling/app-error';
import { SKIP$ } from '../../utils/rxjs-operators';
import { IAppState } from '../../store/states/app.state.interface';
import { LoggerFactory } from '../../logging/logger-factory.service';
import { map } from 'rxjs/operators';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { AppConfig } from '@shiptech/core';

export type ITransformTenantSettings<T = any> = (settingsDto: Partial<ITenantSettingsDto>) => T;

export const TenantSettingsApiPaths = {
  byModule: (moduleName: string) => `api/TenantSettings/ByModule?Module=${moduleName}`
};

export interface ILoadModuleOptions {
  name: string;
  transform: ITransformTenantSettings;
}

@Injectable()
export class TenantSettingsService extends BaseStoreService implements ITenantSettingsService {
  @ApiCallUrl()
  protected _apiUrl = this.appConfig.tenantPublicApiUrl;

  constructor(private http: HttpClient, private appConfig: AppConfig, protected store: Store, loggerFactory: LoggerFactory) {
    super(store, loggerFactory.createLogger(TenantSettingsService.name));
  }

  loadModule(moduleName: string): Observable<any>;
  // tslint:disable-next-line:unified-signatures
  loadModule(moduleName: string, desiredName: string): Observable<any>;
  // tslint:disable-next-line:unified-signatures
  loadModule(moduleName: string, transform: ITransformTenantSettings): Observable<any>;
  // tslint:disable-next-line:unified-signatures
  loadModule(moduleName: string, desiredName: string, transform: ITransformTenantSettings): Observable<any>;
  // tslint:disable-next-line:unified-signatures
  loadModule(moduleName: string, options: ILoadModuleOptions): Observable<any>;
  @ObservableException()
  loadModule(moduleName: string, ...args: any[]): Observable<any> {
    if (!moduleName) {
      throw Error('Module name is required.');
    }

    return defer(() => {
      const appState = this.appState;

      let desiredName;
      let transform: ITransformTenantSettings;

      if (args && args[0]) {
        if (typeof args[0] === 'string') {
          desiredName = args[0];

          if (args[1] && typeof args[1] === 'function') {
            transform = args[1];
          }
        } else if (typeof args[0] === 'function') {
          transform = args[0];
        } else if (typeof args[0] === 'object') {
          desiredName = (<ILoadModuleOptions>args[0]).name;
          transform = (<ILoadModuleOptions>args[0]).transform;
        }
      }

      desiredName = desiredName || moduleName;
      transform = transform || (s => s);

      // Note: This was added as an investigation to see if there is a race condition between
      // Note: state being initialized and TenantSettings Service begin called to early and RootComponent.Resolve()
      if (!appState || !appState.tenantSettings) {
        this.logger.warn(`TenantSetting.loadModule. AppState or AppState.tenantSettings was null or undefined`);
      }

      const moduleTenantSettings = ((appState || <IAppState>{}).tenantSettings || {})[desiredName];

      const shouldLoadTenantSettings = !(moduleTenantSettings && moduleTenantSettings._hasLoaded);

      const tenantSettingsApiCall = this.loadTenantSettingsApi(moduleName).pipe(map(r => transform(r.settings)));

      const apiDispatch$ = this.apiDispatch(
        () => tenantSettingsApiCall,
        new LoadTenantSettingsAction(desiredName),
        (response: any) => new LoadTenantSettingsSuccessfulAction(desiredName, response),
        new LoadTenantSettingsFailedAction(desiredName),
        AppError.LoadTenantSettingsFailed
      );

      return shouldLoadTenantSettings ? apiDispatch$ : SKIP$;
    });
  }

  @ObservableException()
  private loadTenantSettingsApi(moduleName: string): Observable<ITenantSettingsResponseDto> {
    return this.http.get<ITenantSettingsResponseDto>(`${this._apiUrl}/${TenantSettingsApiPaths.byModule(moduleName)}`);
  }
}

export const TENANT_SETTINGS_SERVICE = new InjectionToken<ITenantSettingsService>('ITenantSettingsService');
