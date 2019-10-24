import {
  IModuleTenantSettings,
  ITenantSettingsState, TenantSettingsModuleName, moduleSettings
} from '@shiptech/core/store/states/tenant/tenant-settings.state.interface';

export interface IDeliveryTenantSettings extends IModuleTenantSettings {
  myProp: number;
}

export function deliverySettings(tenantSettings: ITenantSettingsState): IDeliveryTenantSettings {
  return moduleSettings<IDeliveryTenantSettings>(TenantSettingsModuleName.Delivery, tenantSettings);
}
