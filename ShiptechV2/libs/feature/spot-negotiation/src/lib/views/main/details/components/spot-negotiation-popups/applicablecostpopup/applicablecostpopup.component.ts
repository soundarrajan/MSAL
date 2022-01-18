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
import { finalize } from 'rxjs/operators';

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
  productList: any = [];
  additionalCostList: any = [];
  additionalCostTypes: any = [];
  requestLocation: any;
  sellers: any;
  saveButtonClicked: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ApplicablecostpopupComponent>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
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

    this.requestLocation = data.reqLocation;
    this.sellers = data.sellers;
  }

  ngOnInit() {
    this.legacyLookupsDatabase.getTableByName('costType').then(response => {
      this.costTypeList = response;
    });
    this.legacyLookupsDatabase.getTableByName('uom').then(response => {
      this.uomList = response;
    });
    this.legacyLookupsDatabase.getTableByName('currency').then(response => {
      this.currencyList = response;
    });
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

    this.spotNegotiationService
      .getMasterAdditionalCosts({})
      .subscribe((response: any) => {
        if (typeof response === 'string') {
          this.toastr.error(response);
        } else {
          this.additionalCostList = _.cloneDeep(response.payload);
          this.createAdditionalCostTypes();
        }
      });
  }

  createAdditionalCostTypes() {
    for (let i = 0; i < this.additionalCostList.length; i++) {
      if (
        typeof this.additionalCostTypes[this.additionalCostList[i].id] ==
        'undefined'
      ) {
        this.additionalCostTypes[this.additionalCostList[i].id] = [];
      }
      this.additionalCostTypes[
        this.additionalCostList[i].id
      ] = this.additionalCostList[i];
    }
  }

  saveLocationAdditionalCosts() {
    if (!this.enableSave) {
      this.toastr.warning('No changes are made to perform save.');
      return;
    }

    this.saveButtonClicked = true;
    let locationBasedCostsRequiredString = this.checkRequiredFields();
    if (locationBasedCostsRequiredString != '') {
      this.toastr.error(locationBasedCostsRequiredString);
      return;
    }

    const payload = {
      additionalCosts: this.locationBasedCosts.concat(this.deletedCosts)
    };
    this.spotNegotiationService
      .saveOfferAdditionalCosts(payload)
      .subscribe((res: any) => {
        if (res.status) {
          this.locationBasedCosts = this.formatCostItemForDisplay(
            res?.costs?.locationAdditionalCosts
          );
          this.toastr.success('Additional cost saved successfully.');
          this.enableSave = false;
        } else this.toastr.error('Please try again later.');
      });
  }

  formatCostItemForDisplay(locationAdditionalCosts: any) {
    locationAdditionalCosts.forEach((cost: any) => {
      cost.selectedApplicableForId = cost.isAllProductsCost
        ? 0
        : cost.requestProductId;
      cost.costType = this.costTypeList.find(
        c => c.id === cost.costTypeId
      )?.name;

      this.checkIfLineIsApplicableToStemmedProduct(cost);
    });

    return locationAdditionalCosts;
  }

  checkIfLineIsApplicableToStemmedProduct(locationAdditionalCost) {
    let findProductIndex = _.findIndex(
      this.requestLocation.requestProducts,
      function(product: any) {
        return (
          product.id == locationAdditionalCost.requestProductId &&
          product.status == 'Stemmed'
        );
      }
    );
    if (findProductIndex != -1) {
      locationAdditionalCost.hasStemmedProduct = true;
      locationAdditionalCost.product = {
        name: this.requestLocation.requestProducts[findProductIndex]
          .productName,
        id: this.requestLocation.requestProducts[findProductIndex].productId
      };
    }
  }

  checkIfSelectedApplicableIdExistsInapplicableForItems(
    locationAdditionalCost
  ) {
    let findIndex = _.findIndex(this.applicableForItems, function(object: any) {
      return object.id == locationAdditionalCost.selectedApplicableForId;
    });
    if (
      findIndex == -1 &&
      locationAdditionalCost.id &&
      !locationAdditionalCost.selectedApplicableForId
    ) {
      return false;
    }
    return true;
  }

  buildApplicableForItems() {
    let applicableForItemsArray = [];
    this.requestLocation.requestProducts.forEach((product: any) => {
      if (product.status !== 'Stemmed') {
        applicableForItemsArray.push({
          id: product.id,
          name: product.productName,
          productId: product.productId
        });

        this.productList.push(product);

        this.totalMaxQuantity = this.totalMaxQuantity + product.maxQuantity;
        this.maxQuantityUomId = product.uomId;
        this.maxQuantityUom = product.uomName;
      }
    });

    if (applicableForItemsArray.length > 1) {
      const allElement = { id: 0, name: 'All' };
      this.applicableForItems = _.cloneDeep(
        [allElement].concat(applicableForItemsArray)
      );
    } else {
      this.applicableForItems = _.cloneDeep(applicableForItemsArray);
    }

    console.log(this.applicableForItems);
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

    cost.priceUomId = selectedCost.priceUomId;
    cost.price = selectedCost.price;

    cost.currencyId = selectedCost.currencyId;
    cost.extras = selectedCost.extrasPercentage;

    // Check if selected cost type is equal with Unit
    if (cost?.costTypeId == 2) {
      this.addPriceUomChanged(cost);
    } else {
      this.calculateCostAmount(cost);
      this.recalculatePercentAdditionalCosts(this.locationBasedCosts);
    }
    this.enableSave = true;
  }

  getRequestProductIds(selectedApplicableForId) {
    let requestProductsIds = [];

    if (selectedApplicableForId > 0) {
      requestProductsIds.push(selectedApplicableForId);
    } else {
      for (let i = 0; i < this.requestLocation.requestProducts.length; i++) {
        requestProductsIds.push(this.requestLocation.requestProducts[i].id);
      }
    }
    return requestProductsIds.join(',');
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
    cost.requestProductIds = this.getRequestProductIds(
      cost.selectedApplicableForId
    );

    cost.isAllProductsCost = cost.requestProductId ? false : true;

    const maxQtyDetails = this.getMaxQuantityByApplicableFor(
      selectedApplicableForId
    );
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUom = maxQtyDetails.maxQtyUom;
    cost.maxQuantityUomId = maxQtyDetails.maxQtyUomId;

    cost.priceUomId = cost.priceUomId ? cost.priceUomId : null;

    // Check if selected cost type is equal with Unit
    if (cost?.costTypeId == 2) {
      this.addPriceUomChanged(cost);
    } else {
      this.calculateCostAmount(cost);
      this.recalculatePercentAdditionalCosts(this.locationBasedCosts);
    }
    this.enableSave = true;
  }

  recalculatePercentAdditionalCosts(locationBasedCosts) {
    for (let i = 0; i < locationBasedCosts.length; i++) {
      if (!locationBasedCosts[i].isDeleted) {
        if (locationBasedCosts[i].costTypeId == COST_TYPE_IDS.PERCENT) {
          locationBasedCosts[i].totalAmount = 0;
          this.calculateCostAmount(locationBasedCosts[i]);
        }
      }
    }
  }

  calculateCostAmount(cost: any) {
    cost.amount = this.getCostAmountByType(cost);
    cost.extraAmount = cost.extras ? cost.amount * (cost.extras / 100) : 0;
    cost.totalAmount = cost.amount + cost.extraAmount;
    cost.ratePerUom = cost.totalAmount / cost.maxQuantity;
    console.log(cost);
  }

  getCostAmountByType(cost: any) {
    let costAmount = 0,
      productComponent = false;
    switch (cost.costType) {
      case 'Flat':
        costAmount = cost.price;
        break;
      case 'Unit':
        if (
          cost.priceUomId &&
          cost.prodConv &&
          cost.prodConv.length == this.productList.length
        ) {
          for (let i = 0; i < this.productList.length; i++) {
            let product = this.productList[i];
            if (cost.isAllProductsCost || product.id == cost.requestProductId) {
              costAmount =
                costAmount +
                product.maxQuantity * cost.prodConv[i] * parseFloat(cost.price);
            }
          }
        }
        break;
      case 'Percent':
        productComponent = this.isProductComponent(cost);
        let productAmount = 0;
        if (cost.isAllProductsCost || !productComponent) {
          let requestOffers = this.getRequestOffers(this.sellers);
          productAmount = this.sumProductAmounts(requestOffers);
        } else {
          let requestOffers = this.getRequestOffers(this.sellers);
          let filterRequestOffersByProductId = _.filter(requestOffers, function(
            offer
          ) {
            return offer.requestProductId == cost.requestProductId;
          });
          productAmount = this.sumProductAmounts(
            filterRequestOffersByProductId
          );
        }
        if (productComponent) {
          costAmount = (productAmount * cost.price) / 100;
        } else {
          let taxAmount = this.sumProductComponentAdditionalCostAmounts(
            this.locationBasedCosts
          );
          console.log(productAmount);
          console.log(taxAmount);
          let totalAmount = productAmount + taxAmount;
          costAmount = (totalAmount * cost.price) / 100;
        }
        console.log(costAmount);
        break;
      case 'Range':
      case 'Total':
        this.getRangeTotalAdditionalCosts(cost);
        break;
    }
    return costAmount;
  }

  addPriceUomChanged(additionalCost) {
    if (!additionalCost.priceUomId) {
      return;
    }
    additionalCost.prodConv = _.cloneDeep([]);

    for (let i = 0; i < this.productList.length; i++) {
      let prod = this.productList[i];
      this.setConvertedAddCost(prod, additionalCost, i);
    }
  }

  setConvertedAddCost(prod, additionalCost, i) {
    this.getConvertedUOM(
      prod.productId,
      1,
      prod.uomId,
      additionalCost.priceUomId,
      additionalCost,
      i
    );
  }

  getConvertedUOM(productId, quantity, fromUomId, toUomId, additionalCost, i) {
    let payload = {
      Payload: {
        ProductId: productId,
        Quantity: quantity,
        FromUomId: fromUomId,
        ToUomId: toUomId
      }
    };

    if (toUomId == fromUomId) {
      additionalCost.prodConv[i] = 1;
      if (
        additionalCost.priceUomId &&
        additionalCost.prodConv &&
        additionalCost.prodConv.length == this.productList.length
      ) {
        this.calculateCostAmount(additionalCost);
        this.recalculatePercentAdditionalCosts(this.locationBasedCosts);
      }
    } else {
      this.spotNegotiationService
        .getUomConversionFactor(payload)
        .pipe(finalize(() => {}))
        .subscribe((result: any) => {
          if (typeof result == 'string') {
            this.toastr.error(result);
          } else {
            additionalCost.prodConv[i] = _.cloneDeep(result);
            if (
              additionalCost.priceUomId &&
              additionalCost.prodConv &&
              additionalCost.prodConv.length == this.productList.length
            ) {
              this.calculateCostAmount(additionalCost);
              this.recalculatePercentAdditionalCosts(this.locationBasedCosts);
            }
          }
        });
    }
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
          cost.currencyId = response.currencyId;
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

  /**
   * Checks if the given additional cost belongs
   * to the ProductComponent category.
   */
  isProductComponent(additionalCost) {
    if (!additionalCost.additionalCostId) {
      return false;
    }
    additionalCost.isTaxComponent = false;
    if (
      this.additionalCostTypes[additionalCost.additionalCostId].componentType
    ) {
      additionalCost.isTaxComponent = !(
        this.additionalCostTypes[additionalCost.additionalCostId].componentType
          .id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT
      );
      if (additionalCost.isTaxComponent) {
        // console.log("Tax:" + additionalCost.additionalCost.name)
      } else {
        additionalCost.isTaxComponent = false;
      }
      return (
        this.additionalCostTypes[additionalCost.additionalCostId].componentType
          .id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT
      );
    }

    return null;
  }

  /**
   * Sum the Amount field of all products.
   */
  sumProductAmounts(products) {
    let result = 0;
    for (let i = 0; i < products.length; i++) {
      result = result + Number(products[i].amount);
    }
    return result;
  }

  /**
   * Sum the amounts of all additional costs that are NOT tax component additional costs.
   */
  sumProductComponentAdditionalCostAmounts(additionalCostList) {
    let result = 0;
    if (!additionalCostList.length) {
      return;
    }
    for (let i = 0; i < additionalCostList.length; i++) {
      if (!additionalCostList[i].isDeleted) {
        if (
          this.isProductComponent(additionalCostList[i]) ||
          additionalCostList[i].costTypeId !== COST_TYPE_IDS.PERCENT
        ) {
          result = result + additionalCostList[i].totalAmount;
        }
      }
    }
    return result;
  }

  getRequestOffers(sellers) {
    let requestOffers = [];
    for (let i = 0; i < sellers.length; i++) {
      if (sellers[i]?.requestOffers) {
        for (let j = 0; j < sellers[i]?.requestOffers.length; j++) {
          requestOffers.push(sellers[i]?.requestOffers[j]);
        }
      }
    }
    return requestOffers;
  }

  checkRequiredFields(): string {
    let locationBasedCostsRequired = [];
    for (let i = 0; i < this.locationBasedCosts.length; i++) {
      if (
        !this.locationBasedCosts[i].additionalCostId &&
        !this.locationBasedCosts[i].isDeleted
      ) {
        locationBasedCostsRequired.push('Cost name is required!');
      }
    }
    let locationBasedCostsRequiredString = '';
    for (let i = 0; i < locationBasedCostsRequired.length; i++) {
      locationBasedCostsRequiredString += locationBasedCostsRequired[i] + ',';
    }
    if (
      locationBasedCostsRequiredString[
        locationBasedCostsRequiredString.length - 1
      ] == ','
    ) {
      locationBasedCostsRequiredString = locationBasedCostsRequiredString.substring(
        0,
        locationBasedCostsRequiredString.length - 1
      );
    }
    return locationBasedCostsRequiredString;
  }

  addNewLocationCost() {
    if (this.locationCosts.length === 0)
      this.toastr.warning('No location specific additional cost is available.');
    else {
      const additionalCost = {
        selectedApplicableForId: this.applicableForItems[0]?.id
      } as AdditionalCostViewModel;
      this.locationBasedCosts.push(additionalCost);
      this.onApplicableForChange(
        additionalCost.selectedApplicableForId,
        this.locationBasedCosts.length - 1
      );
    }
    this.enableSave = true;
  }

  removeLocationCost(key: number) {
    if (this.locationBasedCosts[key].id) {
      this.locationBasedCosts[key].isDeleted = true;
    } else {
      this.locationBasedCosts.splice(key, 1);
    }
    this.recalculatePercentAdditionalCosts(this.locationBasedCosts);
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
