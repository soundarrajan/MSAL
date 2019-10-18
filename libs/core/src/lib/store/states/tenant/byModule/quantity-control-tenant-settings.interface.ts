import { ITenantSettingsState } from '@shiptech/core/store/states/tenant/tenant-settings.state.interface';
import { ITenantSettings } from '@shiptech/core/store/states/tenant/tenant.settings.interface';
import { nameof } from '@shiptech/core';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';


export interface IQuantityControlTenantSettings extends ITenantSettings {
  UomDefault?: ILookupDto;
  CurrencyDefault?: ILookupDto;
  DateTimeFormat?: string;
  DateFormat?: string;
}

export const TenantSettingsKey = nameof<ITenantSettingsState>('quantityControl');
