import { Injectable } from '@angular/core';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import moment from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TenantFormattingService {
  public readonly dateFormat: string = 'DDD dd/MM/yyyy HH:mm';
  public readonly quantityPrecision: number = 3;
  public readonly pricePrecision: number = 3;
  public readonly amountPrecision: number = 3;

  private quantityFormatter: Intl.NumberFormat;
  private priceFormatter: Intl.NumberFormat;
  private amountFormatter: Intl.NumberFormat;

  constructor(tenantSettings: TenantSettingsService) {
    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();

    this.dateFormat = generalTenantSettings.tenantFormats.dateFormat.name;
    this.quantityPrecision =
      generalTenantSettings.defaultValues.quantityPrecision;
    this.pricePrecision = generalTenantSettings.defaultValues.pricePrecision;
    this.amountPrecision = generalTenantSettings.defaultValues.amountPrecision;

    this.quantityFormatter = new Intl.NumberFormat('en', {
      minimumFractionDigits: this.quantityPrecision,
      maximumFractionDigits: this.quantityPrecision
    });
    this.priceFormatter = new Intl.NumberFormat('en', {
      minimumFractionDigits: this.pricePrecision,
      maximumFractionDigits: this.pricePrecision
    });
    this.amountFormatter = new Intl.NumberFormat('en', {
      minimumFractionDigits: this.amountPrecision,
      maximumFractionDigits: this.amountPrecision
    });
  }

  public amount(value: number | string): string | undefined {
    if (value === null || value === undefined) return undefined;

    const actualValue =
      typeof value !== 'number'
        ? parseFloat(value.toString().replace(',', ''))
        : value;

    if (isNaN(actualValue)) return undefined;

    return this.amountFormatter.format(actualValue);
  }

  public quantity(value: number | string): string | undefined {
    if (value === null || value === undefined) return undefined;

    const actualValue =
      typeof value !== 'number'
        ? parseFloat(value.toString().replace(',', ''))
        : value;

    if (isNaN(actualValue)) return undefined;

    return this.quantityFormatter.format(actualValue);
  }

  public price(value: number | string): string | undefined {
    if (value === null || value === undefined) return undefined;

    const actualValue =
      typeof value !== 'number'
        ? parseFloat(value.toString().replace(',', ''))
        : value;

    if (isNaN(actualValue)) return undefined;

    return this.priceFormatter.format(actualValue);
  }

  public date(value: string): string | undefined {
    if (value === null || value === undefined) return undefined;

    let formattedDate = moment(value).format(
      dateTimeAdapter.fromDotNet(this.dateFormat)
    );
    if (formattedDate.endsWith('00:00')) {
      formattedDate = formattedDate.split('00:00')[0];
    }
    return formattedDate;
  }

  public dateUtc(value: string): string | undefined {
    if (value === null || value === undefined) return undefined;

    let formattedDate = moment
      .utc(value)
      .format(dateTimeAdapter.fromDotNet(this.dateFormat));
    if (formattedDate.endsWith('00:00')) {
      formattedDate = formattedDate.split('00:00')[0];
    }
    return formattedDate;
  }

  htmlDecode(str: string): string {
    var decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };

    return decode(_.unescape(str));
  }
}
