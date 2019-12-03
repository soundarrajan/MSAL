import { IModuleTenantSettings } from '@shiptech/core/store/states/tenant/tenant-settings.interface';

export interface IShiptechDateFormat {
  name: string;
}

export interface ITenantFormatsSettings {
  dateFormat: IShiptechDateFormat;
}

export interface ITenantDefaultValuesSettings {
  pricePrecision: number;
  quantityPrecision: number;
}

export interface IGeneralTenantSettings extends IModuleTenantSettings {
  tenantFormats: ITenantFormatsSettings;
  defaultValues: ITenantDefaultValuesSettings;
}
