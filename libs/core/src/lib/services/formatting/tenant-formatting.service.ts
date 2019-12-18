import { Injectable } from '@angular/core';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import moment from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';

@Injectable({
  providedIn: 'root'
})
export class TenantFormattingService {
  public readonly dateFormat: string = 'DDD dd/MM/yyyy HH:mm';
  public readonly quantityPrecision: number = 3;
  public readonly pricePrecision: number = 3;

  private quantityFormatter: Intl.NumberFormat;
  private priceFormatter: Intl.NumberFormat;

  constructor(tenantSettings: TenantSettingsService) {
    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();

    this.dateFormat = generalTenantSettings.tenantFormats.dateFormat.name;
    this.quantityPrecision = generalTenantSettings.defaultValues.quantityPrecision;
    this.pricePrecision = generalTenantSettings.defaultValues.pricePrecision;

    this.quantityFormatter = new Intl.NumberFormat('en', { minimumFractionDigits: this.quantityPrecision, maximumFractionDigits: this.quantityPrecision });
    this.priceFormatter = new Intl.NumberFormat('en', { minimumFractionDigits: this.pricePrecision, maximumFractionDigits: this.pricePrecision });
  }

  public quantity(value: number | string): string | undefined {
    if (value === null || value === undefined)
      return undefined;

    const actualValue = typeof value !== 'number' ? parseFloat(value.toString().replace(',', '')) : value;

    if (isNaN(actualValue))
      return undefined;

    return this.quantityFormatter.format(actualValue);
  }

  public price(value: number | string): string | undefined {
    if (value === null || value === undefined)
      return undefined;

    const actualValue = typeof value !== 'number' ? parseFloat(value.toString().replace(',', '')) : value;

    if (isNaN(actualValue))
      return undefined;

    return this.priceFormatter.format(actualValue);
  }

  public date(value: string): string | undefined {
    if (value === null || value === undefined)
      return undefined;

    return moment(value).format(dateTimeAdapter.fromDotNet(this.dateFormat));
  }
}
