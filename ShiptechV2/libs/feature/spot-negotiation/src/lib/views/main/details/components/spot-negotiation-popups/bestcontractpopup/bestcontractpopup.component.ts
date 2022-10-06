import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import _ from 'lodash';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-bestcontractpopup',
  templateUrl: './bestcontractpopup.component.html',
  styleUrls: ['./bestcontractpopup.component.scss']
})
export class BestcontractpopupComponent implements OnInit {
  bestContracts: any;
  currentRequestInfo: any;
  public priceFormat = '';
  quantityFormat =
    '1.' +
    this.tenantService.quantityPrecision +
    '-' +
    this.tenantService.quantityPrecision;
  constructor(
    public dialogRef: MatDialogRef<BestcontractpopupComponent>,
    private tenantService: TenantFormattingService,
    @Inject(MAT_DIALOG_DATA) public requestLocation: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DecimalPipe) private _decimalPipe
  ) {}

  ngOnInit() {
    this.getBestContract();
  }

  priceFormatValue(value, type?: any) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }

    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');

    const number = parseFloat(plainNumber);

    if (isNaN(number)) {
      return null;
    }

    let productPricePrecision = this.tenantService.pricePrecision;

    let num = plainNumber.split('.', 2);
    this.priceFormat =
      '1.' + productPricePrecision + '-' + productPricePrecision;

    if (plainNumber) {
        if (!productPricePrecision) {
          plainNumber = Math.trunc(plainNumber);
        }
        return this._decimalPipe.transform(plainNumber, this.priceFormat);
      }
  }

  quantityFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }
    const plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    const number = parseFloat(plainNumber);
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

  getBestContract() {
    this.bestContracts = this.data.data;
    this.data.info.locationName = this.data.data[0].requestProductLocationName;
    // let payload = this.currentRequestInfo.id;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
