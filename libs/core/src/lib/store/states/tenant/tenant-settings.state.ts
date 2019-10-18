import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { nameof } from '../../../utils/type-definitions';
import { TenantSettingsModel } from './tenant-settings.model';
import { IAppState } from '../app.state.interface';
import { ITenantSettingsState } from './tenant-settings.state.interface';
import {
  LoadTenantSettingsAction,
  LoadTenantSettingsFailedAction,
  LoadTenantSettingsSuccessfulAction
} from './load-tenant.actions';
import { ITenantSettings } from './tenant.settings.interface';
import { LoggerFactory } from '../../../logging/logger-factory.service';
import { ILogger } from '../../../logging/logger';
import { isAction } from '@shiptech/core/utils/ngxs-utils';

// @dynamic
@State<ITenantSettingsState>({
  name: nameof<IAppState>('tenantSettings'),
  defaults: TenantSettingsState.default
})
export class TenantSettingsState {
  // noinspection TsLint
  static default = new TenantSettingsModel();
  private logger: ILogger;

  constructor(logger: LoggerFactory) {
    this.logger = logger.createLogger(TenantSettingsState.name);
  }

  @Selector()
  static byModule(TenantSettingsKey: string): (...args: any[]) => ITenantSettings {
    return createSelector(
      [TenantSettingsState],
      (state: IAppState) => state.tenantSettings[TenantSettingsKey] || {}
    );
  }

  @Action(LoadTenantSettingsAction)
  loadTenantState({ getState, patchState }: StateContext<ITenantSettingsState>, { moduleName }: LoadTenantSettingsAction): void {
    patchState({
      [moduleName]: {
        _isLoading: true,
        _hasLoaded: false
      }
    });
  }

  @Action([LoadTenantSettingsSuccessfulAction, LoadTenantSettingsFailedAction])
  loadTenantStateFinished({ getState, patchState }: StateContext<ITenantSettingsState>, action: LoadTenantSettingsSuccessfulAction | LoadTenantSettingsFailedAction): void {
    if (isAction(action, LoadTenantSettingsSuccessfulAction)) {
      const state = getState();
      const success = <LoadTenantSettingsSuccessfulAction>action;

      if (!success.tenantSettings) {
        this.logger.warn(`TenantSettings for module: {ModuleName} returned falsy.`, action.moduleName);
      }
      patchState({
        [success.moduleName]: {
          ...state[success.moduleName],
          ...success.tenantSettings,
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
