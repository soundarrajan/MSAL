import {
  Action,
  createSelector,
  Selector,
  State,
  StateContext
} from '@ngxs/store';
import { nameof } from '../../../utils/type-definitions';
import { TenantSettingsModel } from './tenant-settings.model';
import { IAppState } from '../app.state.interface';
import {
  LoadTenantSettingsAction,
  LoadTenantSettingsFailedAction,
  LoadTenantSettingsSuccessfulAction
} from './load-tenant.actions';
import {
  IModuleTenantSettings,
  TenantSettingsModuleName
} from './tenant-settings.interface';
import { LoggerFactory } from '../../../logging/logger-factory.service';
import { ILogger } from '../../../logging/logger';
import { isAction } from '../../../utils/ngxs-utils';
import { ITenantSettingsState } from './tenant-settings.state.interface';
import { Injectable } from '@angular/core';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';

// @dynamic
@State<ITenantSettingsState>({
  name: nameof<IAppState>('tenantSettings'),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  defaults: TenantSettingsState.default
})
@Injectable()
export class TenantSettingsState {
  // noinspection TsLint
  static default = new TenantSettingsModel();
  private logger: ILogger;

  constructor(logger: LoggerFactory) {
    this.logger = logger.createLogger(TenantSettingsState.name);
  }

  @Selector([TenantSettingsState])
  static byModule<T extends IModuleTenantSettings>(
    module: TenantSettingsModuleName
  ): (...args: any[]) => T {
    return createSelector(
      [TenantSettingsState],
      (state: IAppState) => <T>(state.tenantSettings[module] || {})
    );
  }

  @Selector([TenantSettingsState])
  static general(state: ITenantSettingsState): IGeneralTenantSettings {
    return state[TenantSettingsModuleName.General];
  }

  @Selector([TenantSettingsState])
  static delivery(state: ITenantSettingsState): IGeneralTenantSettings {
    return state[TenantSettingsModuleName.Delivery];
  }

  @Action(LoadTenantSettingsAction)
  loadTenantState(
    { getState, patchState }: StateContext<ITenantSettingsState>,
    { moduleName }: LoadTenantSettingsAction
  ): void {
    patchState({
      [moduleName]: {
        _isLoading: true,
        _hasLoaded: false
      }
    });
  }

  @Action([LoadTenantSettingsSuccessfulAction, LoadTenantSettingsFailedAction])
  loadTenantStateFinished(
    { getState, patchState }: StateContext<TenantSettingsState>,
    action: LoadTenantSettingsSuccessfulAction | LoadTenantSettingsFailedAction
  ): void {
    if (isAction(action, LoadTenantSettingsSuccessfulAction)) {
      const state = getState();
      const success = <LoadTenantSettingsSuccessfulAction>action;

      if (!success.settings) {
        this.logger.warn(
          `TenantSettings for module: {ModuleName} returned falsy.`,
          action.moduleName
        );
        // TODO: we should probably throw here, if the tenant settings are not loaded
      }
      patchState({
        [success.moduleName]: {
          ...state[success.moduleName],
          ...success.settings,
          _isLoading: false,
          _hasLoaded: true
        }
      });
    } else if (isAction(action, LoadTenantSettingsFailedAction)) {
      patchState({
        [action.moduleName]: {
          _hasLoaded: false,
          _isLoading: false
        }
      });
    }
  }
}
