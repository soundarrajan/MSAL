import { ITenantSettings } from './tenant.settings.interface';
import { ILookupDto } from '../../../lookups/lookup-dto.interface';

export interface ISharedTenantSettings extends ITenantSettings {
  // Note: These are tenant default settings, in each module these may be overridden
  UomDefault?: ILookupDto;
  CurrencyDefault?: ILookupDto;
  DateTimeFormat?: string;
  DateFormat?: string;
}
