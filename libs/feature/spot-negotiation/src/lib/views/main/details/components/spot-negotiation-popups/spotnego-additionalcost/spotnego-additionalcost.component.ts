import { DecimalPipe } from '@angular/common';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdditionalCostViewModel } from '../../../../../../core/models/additional-costs-model';

export const COMPONENT_TYPE_IDS = {
  TAX_COMPONENT: 1,
  PRODUCT_COMPONENT: 2
};

export const COST_TYPE_IDS = {
  FLAT: 1,
  UNIT: 2,
  PERCENT: 3,
  RANGE: 4,
  TOTAL: 5
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-spotnego-additionalcost',
  templateUrl: './spotnego-additionalcost.component.html',
  styleUrls: ['./spotnego-additionalcost.component.css']
})
export class SpotnegoAdditionalcostComponent implements OnInit {
  requestOptions = [
    {
      request: 'Req 12321',
      vessel: 'Merlion',
      selected: true
    },
    {
      request: 'Req 12322',
      vessel: 'Afif',
      selected: true
    }
  ];
  disableScrollDown = false;
  public showaddbtn = true;
  isShown: boolean = true; // hidden by default
  isShown2: boolean = true;
  isBtnActive: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;

  locationCosts: any = []; // location specific costs from location master
  // locationBasedCosts: AdditionalCostViewModel[] = []; // saved location based costs
  applicableForItems: any = [];
  totalMaxQuantity: number = 0;
  maxQuantityUomId: number;
  maxQuantityUom: string;
  enableSave: boolean = false;
  requestLocation: any;
  costTypeList: any[];
  productList: any[];
  additionalCostList: any;
  offerAdditionalCostList: AdditionalCostViewModel[] = [];
  locationAdditionalCostsList: AdditionalCostViewModel[] = [];
  rowData: any;
  generalTenantSettings: any;
  quantityPrecision: any;
  quantityFormat: string;
  amountFormat: string;
  currency: IDisplayLookupDto;
  uomList: any[];
  currencyList: any[];
  priceFormat: string;
  offerId: number;

  constructor(
    public dialogRef: MatDialogRef<SpotnegoAdditionalcostComponent>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spotNegotiationService: SpotNegotiationService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private tenantSettingsService: TenantSettingsService,

    private tenantService: TenantFormattingService,
    @Inject(DecimalPipe) private _decimalPipe
  ) {
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.quantityPrecision = this.generalTenantSettings.defaultValues.quantityPrecision;
    this.currency = this.generalTenantSettings.tenantFormats.currency;
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
    this.requestLocation = data.requestLocation;
    this.rowData = data.rowData;
  }

  ngOnInit() {
    this.buildApplicableForItems();
    this.getAdditionalCosts();
  }

  getAdditionalCosts() {
    this.legacyLookupsDatabase.getTableByName('costType').then(response => {
      this.costTypeList = response;
    });
    this.legacyLookupsDatabase.getTableByName('product').then(response => {
      console.log(response);
      this.productList = response;
    });
    this.legacyLookupsDatabase.getTableByName('uom').then(response => {
      console.log(response);
      this.uomList = response;
    });

    this.legacyLookupsDatabase.getTableByName('currency').then(response => {
      console.log(response);
      this.currencyList = response;
    });

    this.spotNegotiationService
      .getMasterAdditionalCosts({})
      .subscribe((response: any) => {
        if (typeof response === 'string') {
          this.toastr.error(response);
        } else {
          console.log(response);
          this.additionalCostList = _.cloneDeep(response.payload);
          console.log(this.additionalCostList);
        }
      });

    if (this.rowData?.requestOffers?.length > 0) {
      const firstOffer = this.rowData.requestOffers[0];
      this.offerId = firstOffer.offerId;
      const payload = {
        offerId: firstOffer.offerId,
        requestLocationId: this.rowData.requestLocationId,
        isLocationBased: false
      };
      this.spotNegotiationService
        .getAdditionalCosts(payload)
        .subscribe((response: any) => {
          if (typeof response === 'string') {
            this.toastr.error(response);
          } else {
            console.log(response);
            this.offerAdditionalCostList = _.cloneDeep(
              response.offerAdditionalCosts
            );
            this.locationAdditionalCostsList = _.cloneDeep(
              response.locationAdditionalCostsList
            );
          }
        });
    }
  }

  /**
   * Create Applicable For dropdown values
   */

  buildApplicableForItems() {
    this.applicableForItems.push({ id: 0, name: 'All' });
    this.requestLocation.requestProducts.forEach((product: any) => {
      if (product.status !== 'Stemmed') {
        this.applicableForItems.push({
          id: product.id,
          name: product.productName
        });
        this.totalMaxQuantity = this.totalMaxQuantity + product.maxQuantity;
        this.maxQuantityUomId = product.uomId;
        this.maxQuantityUom = product.uomName;
      }
    });
  }

  onCostSelectionChange(additionalCost: any, selectedIndex: number) {
    let cost = this.offerAdditionalCostList[selectedIndex];
    cost.requestLocationId = this.requestLocation.id;
    cost.isLocationBased = false;
    cost.additionalCostId = additionalCost.id;
    const maxQtyDetails = this.getMaxQuantityByApplicableFor(
      cost.selectedApplicableForId
    );
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUom = maxQtyDetails.maxQtyUom;
    cost.priceUomId = maxQtyDetails.maxQtyUomId;
    this.calculateAdditionalCostAmounts(cost);
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
    let cost = this.offerAdditionalCostList[selectedIndex];
    cost.requestProductId =
      selectedApplicableForId === 0 ? null : cost.selectedApplicableForId;
    cost.isAllProductsCost = cost.requestProductId ? false : true;

    const maxQtyDetails = this.getMaxQuantityByApplicableFor(
      selectedApplicableForId
    );
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUom = maxQtyDetails.maxQtyUom;
    cost.priceUomId = maxQtyDetails.maxQtyUomId;
    this.calculateAdditionalCostAmounts(cost);
    this.enableSave = true;
  }

  addNew() {
    const additionalCost = {
      selectedApplicableForId: 0,
      currency: this.currency,
      offerId: this.offerId
    } as AdditionalCostViewModel;
    this.offerAdditionalCostList.push(additionalCost);
  }

  removeCost(j: number, cost: any) {
    this.offerAdditionalCostList.splice(j, 1);
    cost.isDeleted = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  /**
   * Change the cost type to the default for the respective additional cost.
   */
  additionalCostNameChanged(additionalCost) {
    console.log(additionalCost);
    additionalCost.costTypeId = this.getAdditionalCostDefaultCostType(
      additionalCost
    ).id;
  }

  /**
   * Get the corresponding component type ID for a given additional cost.
   */
  getAdditionalCostDefaultCostType(additionalCost) {
    if (!additionalCost.additionalCostId) {
      return false;
    }
    let index = _.findIndex(this.additionalCostList, function(object: any) {
      return object.id == additionalCost.additionalCostId;
    });
    if (index != -1) {
      if (this.additionalCostList[index].costType) {
        if (
          this.additionalCostList[index].costType.id == 1 ||
          this.additionalCostList[index].costType.id == 2
        ) {
          additionalCost.allowedCostTypes = [];
          this.costTypeList.forEach(v => {
            if (v.id == 1 || v.id == 2) {
              additionalCost.allowedCostTypes.push(v);
            }
          });
        } else if (this.additionalCostList[index].costType.id == 3) {
          additionalCost.allowedCostTypes = [];
          this.costTypeList.forEach(v => {
            if (v.id == 3) {
              additionalCost.allowedCostTypes.push(v);
            }
          });
        } else if (this.additionalCostList[index].costType.id == 4) {
          additionalCost.allowedCostTypes = [];
          this.costTypeList.forEach(v => {
            if (v.id == 4) {
              additionalCost.allowedCostTypes.push(v);
            }
          });
        } else if (this.additionalCostList[index].costType.id == 5) {
          additionalCost.allowedCostTypes = [];
          this.costTypeList.forEach(v => {
            if (v.id == 5) {
              additionalCost.allowedCostTypes.push(v);
            }
          });
        }
        return this.additionalCostList[index].costType;
      }
    }

    return false;
  }

  /**
   * Determines whether the Additional Cost's Price UOM field should be enabled.
   * It should only be enabled when the Additional Cost's costType is "Unit" (business rule).
   */
  additionalCostPriceUomEnabled(additionalCost) {
    return additionalCost.costTypeId == 2;
  }

  /**
   * Calculates the amount-related fields of an additional cost, as per FSD p. 139: Amount, Extras Amount, Total Amount.
   */
  calculateAdditionalCostAmounts(additionalCost) {
    let totalAmount, productComponent;
    if (!additionalCost.costType) {
      return additionalCost;
    }
    switch (additionalCost.costType.id) {
      case COST_TYPE_IDS.FLAT:
        additionalCost.amount = parseFloat(additionalCost.price);
        productComponent = this.isProductComponent(additionalCost);
        break;
    }

    if (isNaN(additionalCost.amount)) {
      additionalCost.amount = null;
    }

    additionalCost.extraAmount =
      (additionalCost.extras / 100) * additionalCost.amount;

    if (isNaN(additionalCost.extraAmount)) {
      additionalCost.extraAmount = null;
    }

    additionalCost.totalAmount =
      additionalCost.amount + additionalCost.extraAmount || 0;
    if (isNaN(additionalCost.totalAmount)) {
      additionalCost.totalAmount = null;
    }

    additionalCost.rate =
      additionalCost.totalAmount / additionalCost.maxQuantity;
    if (isNaN(additionalCost.rate)) {
      additionalCost.rate = null;
    }
    console.log(additionalCost);
  }

  /**
   * Checks if the given additional cost belongs
   * to the ProductComponent category.
   */
  isProductComponent(additionalCost) {
    if (!additionalCost.additionalCost) {
      return false;
    }
    additionalCost.isTaxComponent = false;
    if (
      this.additionalCostList[additionalCost.additionalCost.id].componentType
    ) {
      additionalCost.isTaxComponent = !(
        this.additionalCostList[additionalCost.additionalCost.id].componentType
          .id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT
      );
      if (additionalCost.isTaxComponent) {
        // console.log("Tax:" + additionalCost.additionalCost.name)
      } else {
        additionalCost.isTaxComponent = false;
      }
      return (
        this.additionalCostList[additionalCost.additionalCost.id].componentType
          .id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT
      );
    }

    return null;
  }

  saveAdditionalCosts() {
    if (!this.enableSave) {
      this.toastr.warning('No changes are made to perform save.');
      return;
    }
    let offerAdditionalCostArray = [];
    for (let i = 0; i < this.offerAdditionalCostList.length; i++) {
      if (this.rowData?.requestOffers?.length > 0) {
        const firstOffer = this.rowData.requestOffers[0];
        let elem = {
          offerId: firstOffer.offerId,
          additionalCostId: this.offerAdditionalCostList[i].additionalCost
        };
      }
    }
    console.log(this.offerAdditionalCostList);
    let payload = {
      offerAdditionalCosts: [
        {
          offerId: 169525,
          additionalCostId: 1,
          costTypeId: 1,
          currencyId: 1,
          price: 1200,
          extraAmount: 0,
          totalAmount: 12000,
          ratePerUom: 0,
          maxQuantity: 0,
          priceUomId: null,
          maxQtyUomId: null,
          extras: 6,
          comment: '',
          isAllProductsCost: true,
          isDeleted: false,
          IsLocationBased: false
        }
      ]
    };

    // const payload = { additionalCosts: this.locationBasedCosts };
    // this.spotNegotiationService
    //   .saveOfferAdditionalCosts(payload)
    //   .subscribe((res: any) => {
    //     if (res.status) {
    //       // let locationAdditionalCosts = res?.costs?.locationAdditionalCosts;
    //       // locationAdditionalCosts.forEach((cost: any) => {
    //       //   cost.selectedApplicableForId = cost.requestProductId ?? 0;
    //       // });
    //       // this.locationBasedCosts = locationAdditionalCosts;
    //       this.toastr.success('Additional cost saved successfully.');
    //     } else this.toastr.error('Please try again later.');
    //   });

    this.enableSave = false;
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
}
