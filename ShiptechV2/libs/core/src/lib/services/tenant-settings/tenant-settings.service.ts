import { Inject, Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { Store } from '@ngxs/store';
import {
  LoadTenantSettingsAction,
  LoadTenantSettingsFailedAction,
  LoadTenantSettingsSuccessfulAction
} from '../../store/states/tenant/load-tenant.actions';
import { AppError } from '../../error-handling/app-error';
import { SKIP$ } from '../../utils/rxjs-operators';
import { IAppState } from '../../store/states/app.state.interface';
import { LoggerFactory } from '../../logging/logger-factory.service';
import { BaseStoreService } from '../base-store.service';
import { TenantSettingsModuleName } from '../../store/states/tenant/tenant-settings.interface';
import { TENANT_SETTINGS_API } from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.service';
import { ITenantSettingsApi } from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.interface';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';

/*
* // Note: TenantSettingsService instance needs to be created after app config is loaded because of the tenant setting api url
*/
@Injectable({
  providedIn: 'root'
})
export class TenantSettingsService extends BaseStoreService {

  constructor(protected store: Store, loggerFactory: LoggerFactory,
              @Inject(TENANT_SETTINGS_API) private tenantSettingsApi: ITenantSettingsApi
  ) {
    super(store, loggerFactory.createLogger(TenantSettingsService.name));
  }

  @ObservableException()
  loadModule(moduleName: TenantSettingsModuleName): Observable<void> {
    if (!moduleName) {
      throw Error('Module name is required.');
    }

    return defer(() => {
      const appState = this.appState;
      // Note: This was added as an investigation to see if there is a race condition between
      // Note: state being initialized and TenantSettings Service begin called to early and RootComponent.Resolve()
      if (!appState || !appState.tenantSettings) {
        this.logger.warn(`TenantSetting.loadModule. AppState or AppState.tenantSettings was null or undefined`);
      }

      const moduleTenantSettings = ((appState || <IAppState>{}).tenantSettings || {})[moduleName];

      const shouldLoadTenantSettings = !(moduleTenantSettings && moduleTenantSettings._hasLoaded);

      const apiDispatch$ = this.apiDispatch(
        () => this.tenantSettingsApi.get(moduleName),
        new LoadTenantSettingsAction(moduleName),
        response => new LoadTenantSettingsSuccessfulAction(moduleName, response.payload),
        new LoadTenantSettingsFailedAction(moduleName),
        AppError.LoadTenantSettingsFailed(moduleName)
      );

      return shouldLoadTenantSettings ? apiDispatch$ : SKIP$;
    });
  }

  getGeneralTenantSettings(): IGeneralTenantSettings {
    const generalSettings = this.appState.tenantSettings[TenantSettingsModuleName.General];

    if (!generalSettings._hasLoaded)
      throw AppError.GeneralTenantSettingsNotLoaded;

    return generalSettings;
  }
}
