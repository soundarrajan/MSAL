import { ITenantSettingsResponseDto } from './tenant-settings.service.interface';

export function getMockTenantSettings(): ITenantSettingsResponseDto {
  return {
    settings: {
      dateFormat: 'MM/DD/YYYY',
      dateTimeFormat: 'MM/DD/YYYY HH:mm',
      uomIdDefault: '4',
      currencyIdDefault: '1',
      uomNameDefault: 'BBL',
      currencyNameDefault: 'USD'
    }
  };
}
