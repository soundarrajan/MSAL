// TBU: Update this on NX

import {
  IModuleTenantSettings,
  TenantSettingsModuleName
} from '@shiptech/core/store/states/tenant/tenant.settings.interface';

export type ITenantSettingsState = {
  [K in keyof TenantSettingsModuleName]?: IModuleTenantSettings
}
