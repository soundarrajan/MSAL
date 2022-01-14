import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { MatSelect } from '@angular/material/select';
import { AdditionalCostViewModel } from './../../../../../../core/models/additional-costs-model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpotNegotiationService } from './../../../../../../services/spot-negotiation.service';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import _ from 'lodash';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { DecimalPipe } from '@angular/common';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
@Component({
  selector: 'app-applicablecostpopup',
  templateUrl: './applicablecostpopup.component.html',
  styleUrls: ['./applicablecostpopup.component.css']
})
export class ApplicablecostpopupComponent implements OnInit {
  disableScrollDown = false;
  public showaddbtn = true;
  isShown: boolean = true; // hidden by default
  isShown2: boolean = true;
  isBtnActive: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;

  locationCosts: any = []; // location specific costs from location master
  locationBasedCosts: AdditionalCostViewModel[] = []; // saved location based costs
  deletedCosts: AdditionalCostViewModel[] = []; // deleted costs
  applicableForItems: any = [];
  totalMaxQuantity: number = 0;
  maxQuantityUomId: number;
  maxQuantityUom: string;
  enableSave: boolean = false;
  costTypeList: any[];
  uomList: any[];
  currencyList: any[];
  generalTenantSettings: IGeneralTenantSettings;
  quantityPrecision: number;
  quantityFormat: string;
  amountFormat: string;
  priceFormat: string;

  constructor(
    public dialogRef: MatDialogRef<ApplicablecostpopupComponent>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public requestLocation: any,
    private spotNegotiationService: SpotNegotiationService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private tenantSettingsService: TenantSettingsService,
    private changeDetectorRef: ChangeDetectorRef,

    private tenantService: TenantFormattingService,
    @Inject(DecimalPipe) private _decimalPipe
  ) {
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.quantityPrecision = this.generalTenantSettings.defaultValues.quantityPrecision;
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
    this.priceFormat =
      '1.' +
      this.tenantService.pricePrecision +
      '-' +
      this.tenantService.pricePrecision;
  }

  ngOnInit() {
    this.buildApplicableForItems();
    this.getLocationCosts();
  }

  getLocationCosts() {
    this.spinner.show();
    this.spotNegotiationService
      .getLocationCosts(this.requestLocation.locationId)
      .subscribe((res: any) => {
        // this.spinner.hide();
        if (res) {
          this.locationCosts = res;
        }
        const payload = {
          requestLocationId: this.requestLocation.id,
          isLocationBased: true
        };
        this.spotNegotiationService
          .getAdditionalCosts(payload)
          .subscribe((response: any) => {
            this.spinner.hide();
            this.locationBasedCosts = this.formatCostItemForDisplay(
              response.locationAdditionalCosts
            );
          });
      });
  }

  saveLocationAdditionalCosts() {
    if (!this.enableSave) {
      this.toastr.warning('No changes are made to perform save.');
      return;
    }

    const payload = {
      additionalCosts: this.locationBasedCosts.concat(this.deletedCosts),
      skipTotalCostUpdate: true
    };
    this.spotNegotiationService
      .saveOfferAdditionalCosts(payload)
      .subscribe((res: any) => {
        if (res.status) {
          this.locationBasedCosts = this.formatCostItemForDisplay(
            res?.costs?.locationAdditionalCosts
          );
          this.toastr.success('Additional cost saved successfully.');
          this.deletedCosts = [];
        } else this.toastr.error('Please try again later.');
      });

    this.enableSave = false;
  }

  formatCostItemForDisplay(locationAdditionalCosts: any) {
    locationAdditionalCosts.forEach((cost: any) => {
      cost.selectedApplicableForId = cost.isAllProductsCost
        ? 0
        : cost.requestProductId;
      cost.costType = this.costTypeList.find(
        c => c.id === cost.costTypeId
      )?.name;
      cost.maxQuantityUom = this.uomList.find(
        c => c.id === cost.maxQuantityUomId
      )?.name;
      cost.currency = this.currencyList.find(
        c => c.id === cost.currencyId
      )?.code;
    });

    return locationAdditionalCosts;
  }

  buildApplicableForItems() {
    this.applicableForItems.push({ id: 0, name: 'All' });
    this.requestLocation.requestProducts.forEach((product: any) => {
      if (product.status !== 'Stemmed') {
        this.applicableForItems.push({
          id: product.id,
          name: product.productName,
          productId: product.productId
        });
        this.totalMaxQuantity = this.totalMaxQuantity + product.maxQuantity;
        this.maxQuantityUomId = product.uomId;
        this.maxQuantityUom = product.uomName;
      }
    });

    this.legacyLookupsDatabase.getTableByName('costType').then(response => {
      this.costTypeList = response;
    });
    this.legacyLookupsDatabase.getTableByName('uom').then(response => {
      this.uomList = response;
    });
    this.legacyLookupsDatabase.getTableByName('currency').then(response => {
      this.currencyList = response;
    });
  }

  onCostSelectionChange(selectedCostId: number, selectedIndex: number) {
    let cost = this.locationBasedCosts[selectedIndex];
    const selectedCost = this.locationCosts.find((cost: any) => {
      return cost.id === selectedCostId;
    });
    cost.requestLocationId = this.requestLocation.id;
    cost.isLocationBased = true;
    cost.additionalCostId = selectedCost.additionalCostId;
    cost.requestProductId =
      cost.selectedApplicableForId === 0 ? null : cost.selectedApplicableForId;
    cost.isAllProductsCost = cost.requestProductId ? false : true;

    cost.costName = selectedCost.costName;
    cost.costTypeId = selectedCost.costTypeId;
    cost.costType = selectedCost.costType;

    const maxQtyDetails = this.getMaxQuantityByApplicableFor(
      cost.selectedApplicableForId
    );
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUomId = maxQtyDetails.maxQtyUomId;

    cost.priceUomId = maxQtyDetails.maxQtyUomId;
    cost.price = selectedCost.price;

    cost.currencyId = selectedCost.currencyId;
    cost.extras = selectedCost.extrasPercentage;
    this.calculateCostAmount(cost);
    this.enableSave = true;
  }

  getMaxQuantityByApplicableFor(requestProductId: any) {
    if (requestProductId > 0) {
      const product = this.requestLocation.requestProducts.find(
        (item: any) => item.id === requestProductId
      );
      return {
        maxQty: product.maxQuantity,
        maxQtyUomId: product.uomId,
        maxQtyUom: product.uomName
      };
    } else
      return {
        maxQty: this.totalMaxQuantity,
        maxQtyUomId: this.maxQuantityUomId,
        maxQtyUom: this.maxQuantityUom
      };
  }

  onApplicableForChange(
    selectedApplicableForId: number,
    selectedIndex: number
  ) {
    let cost = this.locationBasedCosts[selectedIndex];
    cost.requestProductId =
      selectedApplicableForId === 0 ? null : cost.selectedApplicableForId;
    cost.isAllProductsCost = cost.requestProductId ? false : true;

    const maxQtyDetails = this.getMaxQuantityByApplicableFor(
      selectedApplicableForId
    );
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUom = maxQtyDetails.maxQtyUom;
    cost.maxQuantityUomId = maxQtyDetails.maxQtyUomId;
    cost.priceUomId = maxQtyDetails.maxQtyUomId;
    this.calculateCostAmount(cost);
    this.enableSave = true;
  }

  calculateCostAmount(cost: any) {
    cost.amount = this.getCostAmountByType(cost);
    cost.extraAmount = cost.extras ? cost.amount * (cost.extras / 100) : 0;
    cost.totalAmount = cost.amount + cost.extraAmount;
    cost.ratePerUom = cost.totalAmount / cost.maxQuantity;
  }

  getCostAmountByType(cost: any) {
    var costAmount = 0;
    switch (cost.costType) {
      case 'Flat':
        costAmount = cost.price;
        break;
      case 'Unit':
        costAmount = cost.maxQuantity * cost.price;
        break;
      case 'Percent':
        costAmount = cost.price;
        break;
      case 'Range':
      case 'Total':
        this.getRangeTotalAdditionalCosts(cost);
        break;
    }
    return costAmount;
  }

  getRangeTotalAdditionalCosts(cost: any) {
    let productId = cost.requestProductId
      ? this.applicableForItems.find(
          (item: any) => item.id == cost.requestProductId
        )?.productId
      : 1;
    const payload = {
      Payload: {
        Filters: [
          {
            ColumnName: 'ProductId',
            Value: productId ?? 1
          },
          {
            ColumnName: 'LocationId',
            Value: this.requestLocation.locationId
          },
          {
            ColumnName: 'AdditionalCostId',
            Value: cost.locationAdditionalCostId
          },
          {
            ColumnName: 'Qty',
            Value: cost.maxQuantity
          },
          {
            ColumnName: 'QtyUomId',
            Value: cost.maxQuantityUomId
          }
        ],
        Pagination: {
          Skip: 0,
          Take: 25
        },
        SearchText: null
      }
    };

    this.spinner.show();
    this.spotNegotiationService
      .getRangeTotalAdditionalCosts(payload)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          cost.price = response.price;
          cost.amount = response.price;

          cost.extraAmount = cost.extras
            ? cost.amount * (cost.extras / 100)
            : 0;
          cost.totalAmount = cost.amount + cost.extraAmount;
          cost.ratePerUom = cost.totalAmount / cost.maxQuantity;

          let locationBasedCost = this.locationBasedCosts.find(
            (c: any) => c.id == cost.id
          );
          locationBasedCost = cost;
        }
      });
  }

  addNewLocationCost() {
    if (this.locationCosts.length === 0)
      this.toastr.warning('No location specific additional cost is available.');
    else {
      const additionalCost = {
        selectedApplicableForId: 0
      } as AdditionalCostViewModel;
      this.locationBasedCosts.push(additionalCost);
    }
  }

  removeLocationCost(key: number) {
    if (this.locationBasedCosts[key].id) {
      this.locationBasedCosts[key].isDeleted = true;
    } else {
      this.locationBasedCosts.splice(key, 1);
    }
    this.enableSave = true;
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

  amountFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }
    const plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    const number = parseFloat(plainNumber);
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

  priceFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }
    const plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    const number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.tenantService.pricePrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.priceFormat);
      }
    }
  }

  getCurrencyCode(currencyId) {
    let findCurrencyIndex = _.findIndex(this.currencyList, function(object) {
      return object.id == currencyId;
    });
    if (findCurrencyIndex !== -1) {
      return this.currencyList[findCurrencyIndex]?.code;
    }
  }

  getUomName(maxQuantityUomId) {
    let findMaxQuantityUomIndex = _.findIndex(this.uomList, function(object) {
      return object.id == maxQuantityUomId;
    });
    if (findMaxQuantityUomIndex !== -1) {
      return this.uomList[findMaxQuantityUomIndex]?.name;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
