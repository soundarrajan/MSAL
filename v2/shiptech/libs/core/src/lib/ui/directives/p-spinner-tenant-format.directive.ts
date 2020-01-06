import { Directive, Input, OnInit } from '@angular/core';
import { Spinner } from 'primeng/primeng';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

export type TenantNumberFormatType = 'price' | 'quantity';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'p-spinner[tenant-format]'
})
export class PSpinnerTenantFormatDirective implements OnInit {

  private _formatStyle: TenantNumberFormatType = 'quantity';

  get formatStyle(): TenantNumberFormatType {
    return this._formatStyle;
  }

  @Input('tenant-format') set tenantFormat(value: TenantNumberFormatType) {
    this._formatStyle = value;
    this.spinner.precision = this.formatStyle === 'quantity' ? this.format.quantityPrecision : this.format.pricePrecision;
    this.spinner.formatValue();
  }

  constructor(private spinner: Spinner, private format: TenantFormattingService) {
    this.spinner.step = 0;
    this.spinner.formatInput = true;
    this.spinner.formatValue = this.formatValue.bind(this);
  }

  /**
   * formatValue monkey patched, due to precision being dependent on step, and also not adding trailing zeros
   * Original: https://github.com/primefaces/primeng/blob/master/src/app/components/spinner/spinner.ts
   */
  private formatValue(): void {
    let value = this.spinner.value;

    if (value !== null && value !== undefined) {
      if (this.spinner.formatInput) {
        value = this.formatStyle === 'quantity' ? this.format.quantity(value) : this.format.price(value);
      }

      this.spinner.formattedValue = value?.toString();
    } else {
      this.spinner.formattedValue = null;
    }

    if (this.spinner.inputfieldViewChild && this.spinner.inputfieldViewChild.nativeElement) {
      this.spinner.inputfieldViewChild.nativeElement.value = this.spinner.formattedValue;
    }
  }


  ngOnInit(): void {
  }
}
