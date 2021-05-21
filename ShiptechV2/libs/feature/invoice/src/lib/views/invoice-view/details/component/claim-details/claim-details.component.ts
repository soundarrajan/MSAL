import { DecimalPipe, KeyValue } from '@angular/common';
import { TenantFormattingService } from './../../../../../../../../../core/src/lib/services/formatting/tenant-formatting.service';
import { Component, OnInit, ChangeDetectionStrategy, Input, Inject, Output, EventEmitter } from '@angular/core';

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
  @Output() amountChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(private tenantService: TenantFormattingService,
      @Inject(DecimalPipe) private _decimalPipe) {
    this.baseOrigin = new URL(window.location.href).origin;
    this.quantityFormat = '1.' + this.tenantService.quantityPrecision + '-' + this.tenantService.quantityPrecision;
    this.amountFormat = '1.' + this.tenantService.amountPrecision + '-' + this.tenantService.amountPrecision;
   }

  ngOnInit(): void {
  }

  openClaimLink(claimId) {
    return `${this.baseOrigin}/#/claims/claim/edit/${claimId}`;
  }

  amountFormatValue(value) {
    if (typeof value == 'undefined') {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if(this.tenantService.amountPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.amountFormat);
      }
    }
  }

  quantityFormatValue(value) {
    if(typeof value !== "string"){
      return null;
    }

    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if(this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }

  originalOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return 0;
  }

  invoiceAmountChange(index){
    this.calculateGrand(this.formValues);
  }

  calculateGrand(formValues) {
    if (!formValues.invoiceSummary) {
        formValues.invoiceSummary = {};
    }
    // formValues.invoiceSummary.provisionalInvoiceAmount = $scope.calculateprovisionalInvoiceAmount(formValues){}
    formValues.invoiceSummary.invoiceAmountGrandTotal = this.calculateInvoiceGrandTotal(formValues);
    formValues.invoiceSummary.invoiceAmountGrandTotal -= formValues.invoiceSummary.provisionalInvoiceAmount;
    // formValues.invoiceSummary.estimatedAmountGrandTotal = this.calculateInvoiceEstimatedGrandTotal(formValues);
    formValues.invoiceSummary.totalDifference = this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.invoiceAmountGrandTotal) - this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.estimatedAmountGrandTotal);
    formValues.invoiceSummary.netPayable = this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.invoiceAmountGrandTotal) - this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.deductions);
    // this.changeDetectorRef.detectChanges();
    this.amountChanged.emit(true);
    console.log(formValues);
  }

  calculateInvoiceGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.invoiceClaimDetails.forEach((v, k) => {
        if (typeof v.invoiceAmount != 'undefined') {
            grandTotal = grandTotal + this.convertDecimalSeparatorStringToNumber(v.invoiceAmount);
        }
    });
    return grandTotal;
  }

  convertDecimalSeparatorStringToNumber(number) {
    var numberToReturn = number;
    var decimalSeparator, thousandsSeparator;
    if (typeof number == 'string') {
        if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
          if (number.indexOf(',') > number.indexOf('.')) {
            decimalSeparator = ',';
            thousandsSeparator = '.';
          } else {
            thousandsSeparator = ',';
            decimalSeparator = '.';
          }
          numberToReturn = parseFloat(number.split(decimalSeparator)[0].replace(new RegExp(thousandsSeparator, 'g'), '')) + parseFloat(`0.${number.split(decimalSeparator)[1]}`);
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
