import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit
} from '@angular/core';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { DecimalPipe } from '@angular/common';

export type TenantNumberFormatType = 'price' | 'quantity';
@Directive({ selector: '[priceFormat]' })
export class PriceTenantFormatDirective implements OnInit {
  format: any;
  DECIMAL_SEPARATOR: string;
  THOUSANDS_SEPARATOR: string;

  @Input() pricePrecision: number;
  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService
  ) {
    this.el = this.elementRef.nativeElement;
    this.format =
      '1.' +
      this.tenantService.pricePrecision +
      '-' +
      this.tenantService.pricePrecision;
    // TODO comes from configuration settings
    this.DECIMAL_SEPARATOR = '.';
    this.THOUSANDS_SEPARATOR = "'";
  }

  ngOnInit() {
    if (this.el) {
      setTimeout(() => this.onBlur(this.el.value));
    }
  }

  roundDown(value, pricePrecision) {
    let precisionFactor = 1;
    let response = 0;
    const intvalue = parseFloat(value);
    if (pricePrecision === 1) {
      precisionFactor = 10;
    }
    if (pricePrecision === 2) {
      precisionFactor = 100;
    }
    if (pricePrecision === 3) {
      precisionFactor = 1000;
    }
    if (pricePrecision === 4) {
      precisionFactor = 10000;
    }
    response = Math.floor(intvalue * precisionFactor) / precisionFactor;
    return response.toString();
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    const viewValue = `${value}`;
    var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
    if (plainNumber) {
      plainNumber = this.roundDown(plainNumber, this.pricePrecision);
      // this.el.value = this.roundDown(plainNumber, this.pricePrecision);
      this.el.value = this._decimalPipe.transform(
        plainNumber,
        '1.' + this.pricePrecision + '-' + this.pricePrecision
      );
    }
  }
}
