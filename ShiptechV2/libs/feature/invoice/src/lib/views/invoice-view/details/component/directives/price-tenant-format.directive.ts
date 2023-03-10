import { Directive, ElementRef, HostListener, Inject, Input, OnInit } from '@angular/core';
import { Spinner } from 'primeng/spinner';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { DecimalPipe } from '@angular/common';

export type TenantNumberFormatType = 'price' | 'quantity';
const PADDING = "000000";

@Directive({ selector: "[priceFormat]" })
export class PriceTenantFormatDirective implements OnInit {
  private el: HTMLInputElement;
  format: any;
  DECIMAL_SEPARATOR: string;
  THOUSANDS_SEPARATOR: string;

  @Input() pricePrecision: number;

  constructor(
    private elementRef: ElementRef,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
  ) {
    this.el = this.elementRef.nativeElement;
    this.format = '1.' + this.tenantService.pricePrecision + '-' + this.tenantService.pricePrecision;
      // TODO comes from configuration settings
    this.DECIMAL_SEPARATOR = ".";
    this.THOUSANDS_SEPARATOR = "'";
  }

  ngOnInit() {
    if (this.el) {
      setTimeout(() => this.onBlur(this.el.value));
    }
  }


  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
  
    let viewValue = `${value}`;
    let plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
    if (plainNumber) {
      if(this.pricePrecision == 0) {
        this.el.value = plainNumber;
      } else{
          var numberPrecision = this.tenantService.pricePrecision;
          if((<any>this.el).attributes.precision) {
              var precision = (<any>this.el).attributes.precision.value;
              if(precision) {
                numberPrecision = precision;
              }
          }
        this.el.value = this._decimalPipe.transform(plainNumber, '1.' + numberPrecision + '-' + numberPrecision);
      }
    }
  } 

}
