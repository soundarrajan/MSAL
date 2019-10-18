import { ISharedTenantSettings } from '../../../store/states/tenant/shared-tenant-settings.interface';
import { LookupModel } from '../../../lookups/lookup-model';
import { IBunkertechSettingsDto, ITenantSettingsDto } from '../tenant-settings.service.interface';

export function TransformTenantSettingsResponse(settings: ITenantSettingsDto): ISharedTenantSettings {
  return {
    CurrencyDefault: new LookupModel(parseInt(settings.currencyIdDefault, 10), settings.currencyNameDefault),
    UomDefault: new LookupModel(parseInt(settings.uomIdDefault, 10), settings.uomNameDefault),
    DateFormat: settings.dateFormat,
    DateTimeFormat: settings.dateTimeFormat
  };
}

export function TransformBunkertechSettingsResponse(settings: IBunkertechSettingsDto): ISharedTenantSettings {
  return {
    sendEmailToCounterparty: JSON.parse(settings.sendEmailToCounterparty.toLowerCase())
  };
}
