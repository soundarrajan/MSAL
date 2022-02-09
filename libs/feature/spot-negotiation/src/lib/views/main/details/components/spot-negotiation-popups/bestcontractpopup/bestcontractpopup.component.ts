import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpotNegotiationService } from '../../../../../../services/spot-negotiation.service';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, Select } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
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
  constructor(public dialogRef: MatDialogRef<BestcontractpopupComponent>
    , private spinner: NgxSpinnerService
    , private toastr: ToastrService
    , private store: Store
    , private matIconModule: MatIconModule
    , private tenantService: TenantFormattingService
    , @Inject(MAT_DIALOG_DATA) public requestLocation: any
    , @Inject(MAT_DIALOG_DATA) public data: any
    , @Inject(DecimalPipe) private _decimalPipe
    , private spotNegotiationService: SpotNegotiationService
    , private legacyLookupsDatabase: LegacyLookupsDatabase,) {

    }

    ngOnInit() {
      this.getBestContract();
    }

  roundDown(value, pricePrecision) {
    const intvalue = parseFloat(value);
    const reg = new RegExp('^-?\\d+(?:\\.\\d{0,' + pricePrecision + '})?', 'g');
    const a = intvalue.toString().match(reg)[0];
    const dot = a.indexOf('.');
    const b = pricePrecision - (a.length - dot) + 1;
    return a;
  }

  priceFormatValue(value, type?: any) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }

    if (value == 0) {
      return '--';
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
      if (productPricePrecision) {
        plainNumber = this.roundDown(plainNumber, productPricePrecision);
      } else {
        plainNumber = Math.trunc(plainNumber);
      }

      return plainNumber;
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

