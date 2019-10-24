import { ITenantSettingsState } from './tenant/tenant-settings.state.interface';

// TBU: Update this on NX

export interface IAppState {
  tenantSettings: ITenantSettingsState;
  //TODO: set module interface
  quantityControl: unknown;
}
