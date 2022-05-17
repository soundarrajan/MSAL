import { Inject, Injectable } from '@angular/core';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import moment from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import _ from 'lodash';
import { DecimalPipe } from '@angular/common';

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
  toastr: any;
  priceFormat: string;

  constructor(
    tenantSettings: TenantSettingsService,
    @Inject(DecimalPipe)
    private _decimalPipe
  ){
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
        ? parseFloat(value.toString().replace(/,/g, ''))
        : value;

    if (isNaN(actualValue)) return undefined;

    return this.amountFormatter.format(actualValue);
  }

  public FormatPriceTrailingZero(value, type?: any){
    if (typeof value == 'undefined' || value == null) {
      return type == 'benchMark' || 'closure' ? '--' : null;
    }
    if (value == 0) {
      return type == 'benchMark' ? value : '--';
    }
    let format = /[^\d|\-+|\.+]/g;
    let plainNumber;
    value = value.toString().replace(/,/g, '');
    if (format.test(value.toString()) && type == 'livePrice') {
      this.toastr.warning('Live price should be a numeric value ');
      plainNumber = '';
    } else {
      plainNumber = value.toString().replace(format, '');
    }
    const number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    let maxPrecision = this.pricePrecision;
    let minPrecision = 0;
    
     //To follow precision set at tenant. Ignore the precision, if the decimal values are only 0s
 
    this.priceFormat = '1.' + minPrecision + '-' + maxPrecision;
    if (plainNumber) {
      if (!maxPrecision) {
      plainNumber = Math.trunc(plainNumber);
      }
      if (type && type == 'benchMark') {
      plainNumber = Math.abs(parseFloat(plainNumber));
      }
      this.priceFormat = '';
      plainNumber = this._decimalPipe.transform(plainNumber, this.priceFormat);
      return plainNumber;
      }
  }

  public quantity(value: number | string): string | undefined {
    if (value === null || value === undefined) return undefined;

    const actualValue =
      typeof value !== 'number'
        ? parseFloat(value.toString().replace(/,/g, ''))
        : value;

    if (isNaN(actualValue)) return undefined;

    return this.quantityFormatter.format(actualValue);
  }

  public price(value: number | string): string | undefined {
    if (value === null || value === undefined) return undefined;

    const actualValue =
      typeof value !== 'number'
        ? parseFloat(value.toString().replace(/,/g, ''))
        : value;

    if (isNaN(actualValue)) return undefined;

    return this.priceFormatter.format(actualValue);
  }

  public liveformat(value: number | string): string | undefined {
    if (value === null || value === undefined) return undefined;

    const actualValue =
      typeof value !== 'number'
        ? parseFloat(value.toString().replace(/,/g, ''))
        : value;

    if (isNaN(actualValue)) return undefined;

    return actualValue.toString();
  }

  public date(value: string): string | undefined {
    if (value === null || value === undefined) return undefined;

    let formattedDate = moment
      .utc(value)
      .format(dateTimeAdapter.fromDotNet(this.dateFormat));
    if (formattedDate.endsWith('00:00')) {
      formattedDate = formattedDate.split('00:00')[0];
    }
    return formattedDate;
  }
  public dateOnly(value: string): string | undefined {
    if (value === null || value === undefined) return undefined;
    let newValue = value.split("T")[0];
    let formattedDate = moment
      .utc(newValue)
      .format(dateTimeAdapter.fromDotNet(this.dateFormat));
    if (formattedDate.endsWith('00:00')) {
      formattedDate = formattedDate.split('00:00')[0];
    }
    return formattedDate;
  }  

  public dateUtc(value: string): string | undefined {
    if (value === null || value === undefined) return undefined;

    let formattedDate = moment(value).format(
      dateTimeAdapter.fromDotNet(this.dateFormat)
    );
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
