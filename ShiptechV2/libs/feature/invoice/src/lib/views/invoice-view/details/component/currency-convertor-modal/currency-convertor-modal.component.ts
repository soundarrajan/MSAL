import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  Inject,
  ChangeDetectorRef,
  Renderer2,
  Optional
} from '@angular/core';

import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { InvoiceDetailsService } from 'libs/feature/invoice/src/lib/services/invoice-details.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'shiptech-currency-convertor-modal',
  templateUrl: './currency-convertor-modal.component.html',
  styleUrls: ['./currency-convertor-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CurrencyConvertorModalComponent implements OnInit {
  deliveryProducts: any;
  switchTheme;
  selectedProduct;
  formValues: any;
  splitDeliveryInLimit: any[];
  uoms: any;
  disabledSplitBtn;
  quantityFormat: string;
  currencyList: any;
  conversionTo: any;
  convertedAmount: any;
  conversionRoe: any;
  roeDisabled: any;
  changedFromCurrency: boolean = false;
  amountFormat: string;
  constructor(
    public dialogRef: MatDialogRef<CurrencyConvertorModalComponent>,
    private ren: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private invoiceService: InvoiceDetailsService,
    private router: Router,
    private toastr: ToastrService,
    private tenantService: TenantFormattingService,
    @Inject(DecimalPipe) private _decimalPipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formValues = data.formValues;
    this.currencyList = data.currencyList;
    this.convertedAmount = data.convertedAmount;
    this.conversionTo = data.conversionTo;
    this.conversionRoe = data.conversionRoe;
    this.roeDisabled = data.roeDisabled;
    this.amountFormat =
      '1.' +
      this.tenantService.amountPrecision +
      '-' +
      this.tenantService.amountPrecision;
  }

  ngOnInit() {}

  closeClick(): void {
    this.dialogRef.close();
  }

  closeModal() {
    this.dialogRef.close(this);
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  computeInvoiceTotalConversion(conversionRoe, conversionTo) {
    if (this.formValues.invoiceRateCurrency.id == this.conversionTo.id) {
      this.roeDisabled = true;
      this.conversionRoe = 1;
    } else {
      this.roeDisabled = false;
    }
    this.changeDetectorRef.detectChanges();
    if (
      !conversionRoe ||
      !conversionTo /* || !$scope.formValues.invoiceSummary*/
    ) {
      return false;
    }
    if (typeof this.changedFromCurrency == 'undefined') {
      this.changedFromCurrency = false;
    }

    if (!this.formValues.invoiceSummary) {
      return;
    }

    let payloadData = {
      Amount: this.formValues.invoiceSummary.invoiceAmountGrandTotal,
      CurrencyId: this.formValues.invoiceRateCurrency.id,
      ROE: conversionRoe,
      ToCurrencyId: conversionTo.id,
      CompanyId: this.formValues.orderDetails.carrierCompany.id,
      GetROE: this.changedFromCurrency
    };

    this.invoiceService
      .computeInvoiceTotalConversion(payloadData)
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          if (this.changedFromCurrency && !result.getROE) {
            this.toastr.warning(
              'There is no conversion rate available for current selection'
            );
          } else {
            this.convertedAmount = this.amountFormatValue(
              result.convertedAmount
            );
            this.conversionRoe = result.roe;
            this.changeDetectorRef.detectChanges();
          }
        }
      });
    this.changedFromCurrency = false;
    this.changeDetectorRef.detectChanges();
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
}
