import { IModuleTenantSettings } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IShiptechDateFormat {
  name: string;
}

export interface ITenantFormatsSettings {
  dateFormat: IShiptechDateFormat;
  uom: IDisplayLookupDto;
  timeZone: IDisplayLookupDto;
}

export interface ITenantDefaultValuesSettings {
  pricePrecision: number;
  quantityPrecision: number;
}

export interface IGeneralTenantSettings extends IModuleTenantSettings {
  tenantFormats: ITenantFormatsSettings;
  defaultValues: ITenantDefaultValuesSettings;
}
