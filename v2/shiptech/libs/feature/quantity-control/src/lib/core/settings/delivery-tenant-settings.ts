import { IModuleTenantSettings } from '@shiptech/core/store/states/tenant/tenant-settings.interface';

export interface IDeliveryTenantSettings extends IModuleTenantSettings {
  maxToleranceLimit: number;
  minToleranceLimit: number;
}
