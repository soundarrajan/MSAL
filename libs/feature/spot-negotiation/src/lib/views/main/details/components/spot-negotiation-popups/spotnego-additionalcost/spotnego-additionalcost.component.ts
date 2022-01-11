import { DecimalPipe } from '@angular/common';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
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
import { finalize } from 'rxjs/operators';
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
  productList: any[] = [];
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
  additionalCostTypes: any = {};
  saveButtonClicked: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SpotnegoAdditionalcostComponent>,
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
    this.getAdditionalCosts();
  }

  getAdditionalCosts() {
    this.legacyLookupsDatabase.getTableByName('costType').then(response => {
      this.costTypeList = response;
    });
    this.legacyLookupsDatabase.getTableByName('uom').then(response => {
      console.log(response);
      this.uomList = response;
    });

    this.legacyLookupsDatabase.getTableByName('currency').then(response => {
      console.log(response);
      this.currencyList = response;
    });

    this.spinner.show();
    this.spotNegotiationService
      .getMasterAdditionalCosts({})
      .subscribe((response: any) => {
        if (typeof response === 'string') {
          this.spinner.hide();
          this.toastr.error(response);
        } else {
          this.spinner.hide();
          this.additionalCostList = _.cloneDeep(response.payload);
          this.createAdditionalCostTypes();
        }
      });
    if (this.rowData?.requestOffers?.length > 0) {
      const firstOffer = this.rowData.requestOffers[0];
      this.buildApplicableForItems(this.rowData);
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

  /**
   * Create Applicable For dropdown values
   */

  buildApplicableForItems(rowData) {
    let applicableForItemsArray = [];
    this.requestLocation.requestProducts.forEach((product: any, index) => {
      if (product.status != 'Stemmed') {
        let findRowDataOfferIndex = _.findIndex(rowData.requestOffers, function(
          object: any
        ) {
          return object.requestProductId == product.id;
        });
        if (findRowDataOfferIndex != -1) {
          applicableForItemsArray.push({
            id: product.id,
            name: product.productName,
            productId: product.productId
          });
          this.maxQuantityUomId = product.uomId;
          this.maxQuantityUom = product.uomName;

          this.totalMaxQuantity = this.totalMaxQuantity + product.maxQuantity;

          this.productList.push(product);
        }
      }
    });
    if (applicableForItemsArray.length > 1) {
      const allElement = { id: 0, name: 'All' };
      this.applicableForItems = _.cloneDeep(
        [allElement].concat(applicableForItemsArray)
      );
      console.log(this.applicableForItems);
    } else {
      this.applicableForItems = _.cloneDeep(applicableForItemsArray);
    }
  }

  onCostSelectionChange(additionalCostId: number, selectedIndex: number) {
    let cost = this.offerAdditionalCostList[selectedIndex];
    cost.requestProductId =
      cost.selectedApplicableForId === 0 ? null : cost.selectedApplicableForId;
    cost.isAllProductsCost = cost.requestProductId ? false : true;
    cost.isLocationBased = false;
    cost.additionalCostId = additionalCostId;
    const maxQtyDetails = this.getMaxQuantityByApplicableFor(
      cost.selectedApplicableForId
    );
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUom = maxQtyDetails.maxQtyUom;
    cost.maxQtyUomId = maxQtyDetails.maxQtyUomId;
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
  }

  addNewAdditionalCostLine() {
    const additionalCost = {
      additionalCostId: null,
      costTypeId: null,
      price: null,
      selectedApplicableForId: this.applicableForItems[0].id,
      currencyId: this.currency.id,
      currency: this.currency,
      offerId: this.offerId,
      requestLocationId: this.rowData.requestLocationId,
      isDeleted: false,
      id: 0
    } as AdditionalCostViewModel;
    this.offerAdditionalCostList.push(additionalCost);
    this.onApplicableForChange(
      additionalCost.selectedApplicableForId,
      this.offerAdditionalCostList.length - 1
    );
  }

  removeAdditionalCost(key: number) {
    if (this.offerAdditionalCostList[key].id) {
      this.offerAdditionalCostList[key].isDeleted = true;
    } else {
      this.offerAdditionalCostList.splice(key, 1);
    }
    this.recalculatePercentAdditionalCosts();
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
  additionalCostNameChanged(additionalCost, skipDefault, skipDefaultPriceUom) {
    this.enableSave = true;
    console.log(additionalCost);
    if (!skipDefault) {
      additionalCost.costTypeId = this.getAdditionalCostDefaultCostType(
        additionalCost
      ).id;
    }

    if (!skipDefaultPriceUom) {
      if (additionalCost.costTypeId != 2) {
        additionalCost.priceUomId = null;
      } else {
        const maxQtyDetails = this.getMaxQuantityByApplicableFor(
          additionalCost.selectedApplicableForId
        );
        additionalCost.priceUomId = maxQtyDetails.maxQtyUomId;
      }
    }

    if (additionalCost.costTypeId == 2) {
      this.addPriceUomChanged(additionalCost);
    } else {
      this.calculateAdditionalCostAmounts(additionalCost);
      this.recalculatePercentAdditionalCosts();
    }
  }

  recalculatePercentAdditionalCosts() {
    for (let i = 0; i < this.offerAdditionalCostList.length; i++) {
      if (!this.offerAdditionalCostList[i].isDeleted) {
        if (
          this.offerAdditionalCostList[i].costTypeId == COST_TYPE_IDS.PERCENT
        ) {
          this.calculateAdditionalCostAmounts(this.offerAdditionalCostList[i]);
        }
      }
    }
  }

  addPriceUomChanged(additionalCost) {
    if (!additionalCost.priceUomId) {
      return;
    }
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

    additionalCost.prodConv = _.cloneDeep([]);

    if (toUomId == fromUomId) {
      additionalCost.prodConv[i] = 1;
      if (
        additionalCost.priceUomId &&
        additionalCost.prodConv &&
        additionalCost.prodConv.length == this.productList.length
      ) {
        this.calculateAdditionalCostAmounts(additionalCost);
        this.recalculatePercentAdditionalCosts();
      }
    } else {
      this.spotNegotiationService
        .getUomConversionFactor(payload)
        .pipe(finalize(() => {}))
        .subscribe((result: any) => {
          if (typeof result == 'string') {
            this.toastr.error(result);
          } else {
            console.log(result);
            additionalCost.prodConv[i] = _.cloneDeep(result);
            if (
              additionalCost.priceUomId &&
              additionalCost.prodConv &&
              additionalCost.prodConv.length == this.productList.length
            ) {
              this.calculateAdditionalCostAmounts(additionalCost);
              this.recalculatePercentAdditionalCosts();
            }
          }
        });
    }
  }

  /**
   * Get the corresponding component type ID for a given additional cost.
   */
  getAdditionalCostDefaultCostType(additionalCost) {
    if (!additionalCost.additionalCostId) {
      return false;
    }

    if (this.additionalCostTypes[additionalCost.additionalCostId].costType) {
      if (
        this.additionalCostTypes[additionalCost.additionalCostId].costType.id ==
          1 ||
        this.additionalCostTypes[additionalCost.additionalCostId].costType.id ==
          2
      ) {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 1 || v.id == 2) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      } else if (
        this.additionalCostTypes[additionalCost.additionalCostId].costType.id ==
        3
      ) {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 3) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      } else if (
        this.additionalCostTypes[additionalCost.additionalCostId].costType.id ==
        4
      ) {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 4) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      } else if (
        this.additionalCostTypes[additionalCost.additionalCostId].costType.id ==
        5
      ) {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 5) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      }
      return this.additionalCostTypes[additionalCost.additionalCostId].costType;
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
    if (!additionalCost.costTypeId) {
      return additionalCost;
    }
    switch (additionalCost.costTypeId) {
      case COST_TYPE_IDS.FLAT:
        additionalCost.amount = parseFloat(additionalCost.price);
        productComponent = this.isProductComponent(additionalCost);
        break;

      case COST_TYPE_IDS.UNIT:
        additionalCost.amount = 0;
        productComponent = this.isProductComponent(additionalCost);
        if (
          additionalCost.priceUomId &&
          additionalCost.prodConv &&
          additionalCost.prodConv.length == this.productList.length
        ) {
          for (let i = 0; i < this.productList.length; i++) {
            let product = this.productList[i];
            if (
              additionalCost.isAllProductsCost ||
              product.id == additionalCost.requestProductId
            ) {
              additionalCost.amount =
                additionalCost.amount +
                product.maxQuantity *
                  additionalCost.prodConv[i] *
                  parseFloat(additionalCost.price);
            }
          }
        }
        break;

      case COST_TYPE_IDS.PERCENT:
        productComponent = this.isProductComponent(additionalCost);
        if (additionalCost.isAllProductsCost || !productComponent) {
          totalAmount = this.sumProductAmounts(this.rowData.requestOffers);
        } else {
          let findProductIndex = _.findIndex(
            this.rowData.requestOffers,
            function(object: any) {
              return object.requestProductId == additionalCost.requestProductId;
            }
          );
          if (findProductIndex != -1) {
            let product = this.rowData.requestOffers[findProductIndex];
            totalAmount = product.amount;
          }
        }
        console.log(productComponent);
        console.log(totalAmount);
        if (productComponent) {
          additionalCost.amount = (totalAmount * additionalCost.price) / 100;
        } else {
          totalAmount =
            totalAmount + this.sumProductComponentAdditionalCostAmounts();
          additionalCost.amount =
            (totalAmount * parseFloat(additionalCost.price)) / 100;
        }
        break;
      case COST_TYPE_IDS.RANGE:
      case COST_TYPE_IDS.TOTAL:
        additionalCost.amount = parseFloat(additionalCost.price) || 0;
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

    additionalCost.ratePerUom =
      additionalCost.totalAmount / additionalCost.maxQuantity;
    if (isNaN(additionalCost.ratePerUom)) {
      additionalCost.ratePerUom = null;
    }
    console.log(additionalCost);
    console.log(additionalCost.amount);
    console.log(additionalCost.extraAmount);
    console.log(additionalCost.totalAmount);

    this.changeDetectorRef.detectChanges();
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
  sumProductComponentAdditionalCostAmounts() {
    let result = 0;
    if (!this.offerAdditionalCostList.length) {
      return;
    }
    for (let i = 0; i < this.offerAdditionalCostList.length; i++) {
      if (
        this.isProductComponent(this.offerAdditionalCostList[i]) ||
        this.offerAdditionalCostList[i].costTypeId !== COST_TYPE_IDS.PERCENT
      ) {
        result = result + this.offerAdditionalCostList[i].totalAmount;
      }
    }
    return result;
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

  checkRequiredFields(): string {
    let additionalCostRequired = [];
    for (let i = 0; i < this.offerAdditionalCostList.length; i++) {
      if (!this.offerAdditionalCostList[i].additionalCostId) {
        additionalCostRequired.push(
          'Cost name for line ' + (i + 1) + ' is required!'
        );
      }
      if (!this.offerAdditionalCostList[i].price) {
        additionalCostRequired.push(
          'Price for line ' + (i + 1) + ' is required!'
        );
      }
    }
    let additionalCostRequiredString = '';
    for (let i = 0; i < additionalCostRequired.length; i++) {
      additionalCostRequiredString += additionalCostRequired[i] + ',';
    }
    if (
      additionalCostRequiredString[additionalCostRequiredString.length - 1] ==
      ','
    ) {
      additionalCostRequiredString = additionalCostRequiredString.substring(
        0,
        additionalCostRequiredString.length - 1
      );
    }
    return additionalCostRequiredString;
  }

  saveAdditionalCosts() {
    this.saveButtonClicked = true;
    let additionalCostRequiredString = this.checkRequiredFields();
    if (additionalCostRequiredString != '') {
      this.toastr.error(additionalCostRequiredString);
      return;
    }
    let offerAdditionalCostArray = [];
    for (let i = 0; i < this.offerAdditionalCostList.length; i++) {
      if (this.rowData?.requestOffers?.length > 0) {
        const firstOffer = this.rowData.requestOffers[0];
        let elem = {
          id: this.offerAdditionalCostList[i].id,
          offerId: this.offerAdditionalCostList[i].offerId,
          requestLocationId: this.offerAdditionalCostList[i].requestLocationId,
          additionalCostId: this.offerAdditionalCostList[i].additionalCostId
            ? this.offerAdditionalCostList[i].additionalCostId
            : null,
          costTypeId: this.offerAdditionalCostList[i].costTypeId
            ? this.offerAdditionalCostList[i].costTypeId
            : null,
          maxQuantity: this.offerAdditionalCostList[i].maxQuantity,
          maxQuantityUom: this.offerAdditionalCostList[i].maxQuantityUom,
          currencyId: this.offerAdditionalCostList[i].currencyId,
          currency: this.offerAdditionalCostList[i].currency.code,
          price: this.offerAdditionalCostList[i].price,
          priceUomId: this.offerAdditionalCostList[i].priceUomId,
          amount: this.offerAdditionalCostList[i].amount,
          extras: this.offerAdditionalCostList[i].extras,
          extraAmount: this.offerAdditionalCostList[i].extraAmount,
          totalAmount: this.offerAdditionalCostList[i].totalAmount,
          ratePerUom: this.offerAdditionalCostList[i].ratePerUom,
          isAllProductsCost: this.offerAdditionalCostList[i].isAllProductsCost,
          requestProductId: this.offerAdditionalCostList[i].requestProductId
            ? this.offerAdditionalCostList[i].requestLocationId
            : null,
          isDeleted: this.offerAdditionalCostList[i].isDeleted,
          isLocationBased: false
        };
        offerAdditionalCostArray.push(elem);
      }
    }
    console.log(this.offerAdditionalCostList);
    console.log(offerAdditionalCostArray);
    // let payload = {
    //   additionalCosts: [
    //     {
    //       id: 0,
    //       name: 'string',
    //       offerId: 0,
    //       requestOfferId: 0,
    //       requestLocationId: 0,
    //       additionalCostId: 0,
    //       costTypeId: 0,
    //       costType: 'string',
    //       costName: 'string',
    //       currencyId: 0,
    //       currency: 'string',
    //       price: 0,
    //       amount: 0,
    //       extraAmount: 0,
    //       totalAmount: 0,
    //       ratePerUom: 0,
    //       maxQuantity: 0,
    //       maxQuantityUom: 'string',
    //       priceUomId: 0,
    //       extras: 0,
    //       comment: 'string',
    //       isAllProductsCost: true,
    //       requestProductId: 0,
    //       isDeleted: true,
    //       isLocationBased: true
    //     }
    //   ]
    // };
    let payload = { additionalCosts: offerAdditionalCostArray };

    this.spotNegotiationService
      .saveOfferAdditionalCosts(payload)
      .subscribe((res: any) => {
        if (res.status) {
          // let locationAdditionalCosts = res?.costs?.locationAdditionalCosts;
          // locationAdditionalCosts.forEach((cost: any) => {
          //   cost.selectedApplicableForId = cost.requestProductId ?? 0;
          // });
          // this.locationBasedCosts = locationAdditionalCosts;
          this.toastr.success('Additional cost saved successfully.');
        } else this.toastr.error('Please try again later.');
      });

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

  // Only Number
  keyPressNumber(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (inp == '.' || inp == ',') {
      return true;
    }
    if (/^[-,+]*\d{1,6}(,\d{3})*(\.\d*)?$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
