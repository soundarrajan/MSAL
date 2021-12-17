import { DecimalPipe, KeyValue } from '@angular/common';
import { TenantFormattingService } from './../../../../../../../../../core/src/lib/services/formatting/tenant-formatting.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Inject,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { InvoiceDetailsService } from 'libs/feature/invoice/src/lib/services/invoice-details.service';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'shiptech-invoice-claim-details',
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimDetailsComponent implements OnInit {
  switchTheme; //false-Light Theme, true- Dark Theme
  formValues: any;
  baseOrigin: string;
  amountFormat: string;
  quantityFormat: string;
  currencyList: any;

  @Input('model') set _setFormValues(formValues) {
    if (!formValues) {
      return;
    }
    this.formValues = formValues;
  }

  @Input('currencyList') set _setCurrencyList(currencyList) {
    if (!currencyList) {
      return;
    }
    this.currencyList = currencyList;
  }
  @Output() claimDetailChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private tenantService: TenantFormattingService,
    private invoiceService: InvoiceDetailsService,
    @Inject(DecimalPipe) private _decimalPipe,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    this.baseOrigin = new URL(window.location.href).origin;
    this.quantityFormat =
      '1.' +
      this.tenantService.quantityPrecision +
      '-' +
      this.tenantService.quantityPrecision;
    this.amountFormat =
      '1.' +
      this.tenantService.amountPrecision +
      '-' +
      this.tenantService.amountPrecision;
  }

  ngOnInit(): void {}

  openClaimLink(claimId) {
    return `${this.baseOrigin}/#/claims/claim/edit/${claimId}`;
  }

  amountFormatValue(value) {
    if (typeof value == 'undefined' || !value) {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.tenantService.amountPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.amountFormat);
      }
    }
  }

  quantityFormatValue(value) {
    if (typeof value != 'string') {
      return null;
    }

    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }

  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return 0;
  };

  invoiceAmountChange(index) {
    const data = {
      payload: {
        filters: [
          {
            columnName: 'FromCurrencyId',
            value: this.formValues.invoiceClaimDetails[index]
              ?.invoiceAmountCurrency?.id
          },
          {
            columnName: 'ToCurrencyId',
            value: this.formValues.invoiceClaimDetails[index]?.orderCurrency?.id
          },
          {
            columnName: 'ExchangeDate',
            value: this.formValues.invoiceDate
          },
          {
            columnName: 'Amount',
            value: this.formValues.invoiceClaimDetails[index]?.invoiceAmount
          }
        ]
      }
    };

    console.log(data);
    this.invoiceService
      .exchangeRatesConvert(data)
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.spinner.hide();
          this.toastr.error(result);
        } else {
          console.log(result);
          this.formValues.invoiceClaimDetails[
            index
          ].orderCurrencyAmount = result;
        }
      });
    this.claimDetailChanged.emit(this.formValues.invoiceClaimDetails);
  }

  convertDecimalSeparatorStringToNumber(number) {
    let numberToReturn = number;
    let decimalSeparator, thousandsSeparator;
    if (typeof number == 'string') {
      if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
        if (number.indexOf(',') > number.indexOf('.')) {
          decimalSeparator = ',';
          thousandsSeparator = '.';
        } else {
          thousandsSeparator = ',';
          decimalSeparator = '.';
        }
        numberToReturn =
          parseFloat(
            number
              .split(decimalSeparator)[0]
              .replace(new RegExp(thousandsSeparator, 'g'), '')
          ) + parseFloat(`0.${number.split(decimalSeparator)[1]}`);
      } else {
        numberToReturn = parseFloat(number);
      }
    }
    if (isNaN(numberToReturn)) {
      numberToReturn = 0;
    }
    return parseFloat(numberToReturn);
  }
}
