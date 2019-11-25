import { ITenantSettingsState } from '../../store/states/tenant/tenant-settings.state.interface';

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

export interface IGeneralTenantSettings extends ITenantSettingsState {
  tenantFormats: ITenantFormatsSettings;
  defaultValues: ITenantDefaultValuesSettings;
}
