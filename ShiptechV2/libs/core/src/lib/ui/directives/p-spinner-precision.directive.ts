import { Directive, Input, OnInit } from '@angular/core';
import { Spinner } from 'primeng/primeng';
import _ from 'lodash';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'p-spinner[precision]'
})
export class PSpinnerPrecisionDirective implements OnInit {
  get precision(): number {
    return this._precision;
  }

  @Input() set precision(value: number) {
    this._precision = value;

    this.spinner.precision = this.precision ?? 3;
    this.spinner.formatValue();
  }

  private _precision: number;

  constructor(private spinner: Spinner) {
    this.spinner.formatValue = this.formatValue.bind(this);
  }

  /**
   * formatValue monkey patched, due to precision being dependent on step, and also not adding trailing zeros
   * Original: https://github.com/primefaces/primeng/blob/master/src/app/components/spinner/spinner.ts
   */
  private formatValue(): void {
    let value = this.spinner.value;

    if (value != null) {
      if (this.spinner.formatInput) {
        value = value.toLocaleString(undefined, { maximumFractionDigits: 20 });

        if (this.spinner.decimalSeparator && this.spinner.thousandSeparator) {
          value = value.split(this.spinner.localeDecimalSeparator);

          if (this.precision && value[1]) {
            value[1] = (this.spinner.decimalSeparator || this.spinner.localeDecimalSeparator) + _.padEnd(value[1], this.precision, '0');
          }

          if (this.spinner.thousandSeparator && value[0].length > 3) {
            value[0] = value[0].replace(new RegExp(`[${this.spinner.localeThousandSeparator}]`, 'gim'), this.spinner.thousandSeparator);
          }

          value = value.join('');
        }
      }

      this.spinner.formattedValue = value.toString();
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
