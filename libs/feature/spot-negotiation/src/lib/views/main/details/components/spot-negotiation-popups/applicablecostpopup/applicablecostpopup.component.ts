import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { AdditionalCostViewModel } from './../../../../../../core/models/additional-costs-model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpotNegotiationService } from './../../../../../../services/spot-negotiation.service';
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import _ from 'lodash';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { DecimalPipe } from '@angular/common';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { UpdateRequest } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';

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
  styleUrls: ['./applicablecostpopup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  requestList: any[] = [];
  currentRequestInfo: any;
  requestListToDuplicateLocationBasedCost: any[];
  duplicateCost: boolean = false;
  copiedLocationCost: any[];
  endpointCount: number = 0;

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
    @Inject(DecimalPipe) private _decimalPipe,
    private store: Store
  ) {
    this.legacyLookupsDatabase.getTableByName('costType').then(response => {
      this.costTypeList = response;
    });
    this.legacyLookupsDatabase.getTableByName('uom').then(response => {
      this.uomList = response;
    });
    this.legacyLookupsDatabase.getTableByName('currency').then(response => {
      this.currencyList = response;
    });
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
    
    this.store.selectSnapshot<any>((state: any) => {
      this.currentRequestInfo = _.cloneDeep(
        state.spotNegotiation.currentRequestSmallInfo
      );
      this.requestList = _.cloneDeep(state.spotNegotiation.requests);
      this.getRequestsList();
    });
    this.buildApplicableForItems();
    this.getLocationCosts();
  }

  getLocationCosts() {
    this.spinner.show();
    this.spotNegotiationService
      .getLocationCosts(this.requestLocation.locationId)
      .subscribe(async (res: any) => {
        // this.spinner.hide();
        if (res?.message == 'Unauthorized') {
          this.spinner.hide();
          return;
        }
        if (res) {
          this.locationCosts = res;
        }
        const payload = {
          requestLocationId: this.requestLocation.id,
          isLocationBased: true
        };
        let response = await this.spotNegotiationService
          .getAdditionalCosts(payload)
          //.subscribe((response: any) => {
            if(response != null){
              this.spinner.hide();
              if (response?.message == 'Unauthorized') {
                return;
              }
              this.locationBasedCosts = this.formatCostItemForDisplay(
                response.locationAdditionalCosts
              );
              this.changeDetectorRef.detectChanges();
            }            
          //});
      });

    this.spotNegotiationService
      .getMasterAdditionalCosts({})
      .subscribe((response: any) => {
        if (response?.message == 'Unauthorized') {
          return;
        }
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
    let findIfLocationCostExists = _.filter(this.locationBasedCosts, function(
      object
    ) {
      return !object.isDeleted;
    });
    if (
      findIfLocationCostExists &&
      !findIfLocationCostExists.length &&
      this.duplicateCost
    ) {
      this.toastr.warning('Please add location cost');
      return;
    }
    if (!this.enableSave) {
      this.toastr.warning('No changes are made to perform save.');
      return;
    }
    if (this.checkIfLocRTAddCostsInvalid(this.locationBasedCosts)) {
      this.toastr.error(
        'Range/Total cost cannot be saved due to request quantity is greater than the defined cost quantity.'
      );
      return;
    }

    this.saveButtonClicked = true;
    let locationBasedCostsRequiredString = this.checkRequiredFields();
    if (locationBasedCostsRequiredString != '') {
      this.toastr.error(locationBasedCostsRequiredString);
      return;
    }

    let selectedRequestList = _.filter(
      this.requestListToDuplicateLocationBasedCost,
      function(request) {
        return request.isSelected;
      }
    );

    if (this.duplicateCost && selectedRequestList.length == 0) {
      this.toastr.error('At least one request should be selected!');
      return;
    }

    let reqIdForLocation: String;
    let requestLocationId = this.requestLocation.locationId;
    for (let i = 0; i < selectedRequestList.length; i++) {
      let reqLocation = selectedRequestList[i].requestLocations.filter(function(
        location
      ) {
        return requestLocationId == location.locationId;
      });
      if (reqLocation.length == 0) {
        reqIdForLocation = reqIdForLocation
          ? reqIdForLocation + ', ' + selectedRequestList[i].name
          : selectedRequestList[i].name;
      }
    }
    if (reqIdForLocation) {
      this.toastr.warning(
        'The particular cost cannot be applied to request(s) ' +
          reqIdForLocation +
          ' as the location is not available! '
      );
      return;
    }

    if (selectedRequestList.length) {
      this.copyLocationBasedCostToSelectedRequest(selectedRequestList);
    }

    if (!selectedRequestList.length) {
      const payload = {
        additionalCosts: this.locationBasedCosts.concat(this.deletedCosts)
      };
    let reqs = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });
      this.spotNegotiationService
        .saveOfferAdditionalCosts(payload)
        .subscribe((res: any) => {
          this.enableSave = false;
          if (res?.message == 'Unauthorized') {
            return;
          }
          if (res.status) {
            let locAddCosts = res?.costs?.locationAdditionalCosts;
            this.locationBasedCosts = this.formatCostItemForDisplay(
              res?.costs?.locationAdditionalCosts
            );
            reqs = reqs.map(e => {
              let requestLocations = e.requestLocations.map(reqLoc => {
                let requestAdditionalCosts : any = [];
                if(locAddCosts?.filter(loc => reqLoc.id == loc.requestLocationId).length > 0){
                  requestAdditionalCosts = locAddCosts.filter(loc => reqLoc.id == loc.requestLocationId);    
                  //return { ...reqLoc, requestAdditionalCosts };
                }
                return { ...reqLoc, requestAdditionalCosts };        
              });
               return { ...e, requestLocations };
            });            
            this.store.dispatch(new UpdateRequest(reqs));
            this.toastr.success('Additional cost saved successfully.');
            this.closeDialog();
          } else this.toastr.error('Please try again later.');
        });
    }
  }

  // To check if Location based Range/Total additional costs are invalid
  checkIfLocRTAddCostsInvalid(additionalCosts) {
    let zeroPricedRTAddCosts = _.filter(additionalCosts, function(addCost) {
      return (
        !addCost.isDeleted &&
        (addCost.costType == 'Total' || addCost.costType == 'Range') &&
        addCost.price <= 0
      );
    });
    return zeroPricedRTAddCosts && zeroPricedRTAddCosts.length > 0
      ? true
      : false;
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

    cost.costName = selectedCost.costDescription;
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
  }

  getCostAmountByType(cost: any) {
    let costAmount = 0;
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
        cost.extraAmount = cost.costAmount = cost.ratePerUom = 0;
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

  async getConvertedUOM(productId, quantity, fromUomId, toUomId, additionalCost, i) {
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
      let response= await this.spotNegotiationService.getUomConversionFactor(payload);
      if(response != null){
          if (response?.message == 'Unauthorized') {
            return;
          }
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            additionalCost.prodConv[i] = _.cloneDeep(response);
            if (
              additionalCost.priceUomId &&
              additionalCost.prodConv &&
              additionalCost.prodConv.length == this.productList.length
            ) {
              this.calculateCostAmount(additionalCost);
              this.recalculatePercentAdditionalCosts(this.locationBasedCosts);
            }
          }
        };
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
        if (response?.message == 'Unauthorized') {
          return;
        }
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
      if (!this.applicableForItems.length) {
        this.toastr.warning('All products are stemmed!');
      } else {
        this.locationBasedCosts.push(additionalCost);
        this.onApplicableForChange(
          additionalCost.selectedApplicableForId,
          this.locationBasedCosts.length - 1
        );
      }
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
    if (value.toString().includes('e')) {
      value = value.toString().split('e')[0];
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
    if (value.toString().includes('e')) {
      value = value.toString().split('e')[0];
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
    if (value.toString().includes('e')) {
      value = value.toString().split('e')[0];
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
    this.dialogRef.close(this.saveButtonClicked);
  }

  checkIfAllProductAreStemmedOrConfirmed(request) {
    for (let i = 0; i < request.requestLocations.length; i++) {
      let productList = _.filter(
        request.requestLocations[i].requestProducts,
        function(object) {
          return !(object.status == 'Stemmed' || object.status == 'Confirmed');
        }
      );
      if (productList && productList.length) {
        return true;
      }
    }
    return false;
  }

  getRequestsList() {
    if (this.requestList && this.currentRequestInfo) {
      this.requestListToDuplicateLocationBasedCost = _.cloneDeep(
        this.requestList
          .filter(
            r => r.id != this.currentRequestInfo.id && r.status !== 'Stemmed'
          )
          .map(req => ({ ...req }))
      );
    }
  }

  onRequestListCheckboxChange(checkbox: any) {
    if (checkbox.checked) {
      this.enableSave = true;
    }
    this.requestListToDuplicateLocationBasedCost.map(
      req => (req.isSelected = checkbox.checked ? true : false)
    );
  }

  onRequestListSelectionChange(checkbox: any, element: any) {
    element.isSelected = checkbox.checked ? true : false;
  }

  checkIfLineIsApplicableToStemmedProductForCopiedLocationCost(
    locationAdditionalCost,
    selectedRequestLocation: any
  ) {
    let findProductIndex = _.findIndex(
      selectedRequestLocation.requestProducts,
      function(product: any) {
        return (
          product.id == locationAdditionalCost.requestProductId &&
          product.status == 'Stemmed'
        );
      }
    );
    if (findProductIndex != -1) {
      locationAdditionalCost.hasStemmedProduct = true;
    }
  }

  copyLocationBasedCostToSelectedRequest(selectedRequestList) {
    this.copiedLocationCost = [];
    this.endpointCount = 0;
    let reqIdForLocation: String;
    let requestLocationId = this.requestLocation.locationId;
    selectedRequestList.forEach(request => {
      request.requestLocations.forEach(requestLocation => {
        //statusId = 12 => Stemmed status
        if (
          requestLocation.locationId == requestLocationId &&
          requestLocation.statusId != 12
        ) {
          let reqProductIdForLocation = [];
          this.locationBasedCosts.forEach(locationCost => {
            if (!locationCost.isDeleted) {
              let newCost = _.cloneDeep(locationCost);
              newCost.id = 0;
              newCost.hasStemmedProduct = false;
              newCost.requestLocationId = requestLocation.id;
              newCost.extraAmount = 0;
              newCost.totalAmount = 0;
              newCost.ratePerUom = 0;
              newCost.selectedRequestLocation = requestLocation;
              newCost.isCostCopy = true;

              //If All is selected in the applicable for dropdown
              if (newCost.isAllProductsCost) {
                let notStemmedProducts = this.checkNumberOfNotStemmedProduct(
                  requestLocation
                );
                if (notStemmedProducts.length > 1) {
                  newCost.isAllProductsCost = true;
                  const productDetails = this.getProductDetails(
                    newCost.selectedApplicableForId,
                    requestLocation
                  );
                  newCost.productList = productDetails.productList;
                  newCost.maxQuantity = productDetails.maxQty;
                  newCost.maxQuantityUomId = productDetails.maxQtyUomId;
                  newCost.requestProductIds = this.getRequestProductIdsForCopyLocationCost(
                    0,
                    requestLocation
                  );
                } else if (notStemmedProducts.length == 1) {
                  this.formatCopiedAdditionalCostForSpecificProduct(
                    newCost,
                    notStemmedProducts[0],
                    requestLocation
                  );
                } else if (!notStemmedProducts.length) {
                  newCost.hasStemmedProduct = true;
                }
              } else {
                //One product is selected in the applicable for dropdown
                let applicableForProduct = _.find(
                  this.requestLocation.requestProducts,
                  function(product) {
                    return product.id == newCost.requestProductId;
                  }
                );
                let productId = applicableForProduct.productId;
                let productList = _.filter(
                  requestLocation.requestProducts,
                  function(product) {
                    return product.productId === productId;
                  }
                );
                if (!productList.length) {
                  reqProductIdForLocation.push(
                    applicableForProduct.productName
                  );
                } else {
                  //If selected product exist
                  let product = _.find(
                    requestLocation.requestProducts,
                    function(product) {
                      return product.productId === productId;
                    }
                  );
                  this.formatCopiedAdditionalCostForSpecificProduct(
                    newCost,
                    product,
                    requestLocation
                  );
                }
              }
              if (!newCost.hasStemmedProduct) {
                this.copiedLocationCost.push(newCost);
              }
            }
          });
          reqProductIdForLocation = _.uniq(reqProductIdForLocation);
          let reqProductIdForLocationString = reqProductIdForLocation.join(',');
          if (reqProductIdForLocationString != '') {
            reqIdForLocation = reqIdForLocation
              ? reqIdForLocation +
                ', ' +
                reqProductIdForLocationString +
                ' does not exists in ' +
                request.name +
                ' '
              : reqProductIdForLocationString +
                ' does not exists in ' +
                request.name +
                ' ';
          }
        }
      });
    });
    if (reqIdForLocation) {
      this.toastr.error('Selected products(s) : ' + reqIdForLocation);
      return;
    }
    this.copiedLocationCost.forEach(async cost => {
      // Check if selected cost type is equal with Unit
      if (cost?.costTypeId == 2) {
        await this.addPriceUomChangedForCopiedLocationCost(
          cost,
          cost.productList,
          cost.selectedRequestLocation
        );
      } else {
        this.calculateCostAmountForCopiedLocationCost(
          cost,
          cost.productList,
          cost.selectedRequestLocation
        );
      }
    });
  }

  formatCopiedAdditionalCostForSpecificProduct(
    newCost,
    product,
    requestLocation
  ) {
    newCost.requestProductId = product.id;
    newCost.isAllProductsCost = false;
    const productDetails = this.getProductDetails(
      newCost.requestProductId,
      requestLocation
    );
    newCost.productList = productDetails.productList;
    newCost.maxQuantity = productDetails.maxQty;
    newCost.maxQuantityUomId = productDetails.maxQtyUomId;
    newCost.requestProductIds = this.getRequestProductIdsForCopyLocationCost(
      newCost.requestProductId,
      requestLocation
    );
    this.checkIfLineIsApplicableToStemmedProductForCopiedLocationCost(
      newCost,
      requestLocation
    );
  }

  async addPriceUomChangedForCopiedLocationCost(
    additionalCost,
    productList,
    selectedRequestLocation
  ) {
    if (!additionalCost.priceUomId) {
      return;
    }
    additionalCost.prodConv = _.cloneDeep([]);

    for (let i = 0; i < productList.length; i++) {
      let prod = productList[i];
      await this.setConvertedAddCostForCopiedLocationCost(
        prod,
        additionalCost,
        i,
        productList,
        selectedRequestLocation
      );
    }
  }

  async setConvertedAddCostForCopiedLocationCost(
    prod,
    additionalCost,
    i,
    productList,
    selectedRequestLocation
  ) {
   await this.getConvertedUOMForCopiedLocationCost(
      prod.productId,
      1,
      prod.uomId,
      additionalCost.priceUomId,
      additionalCost,
      i,
      productList,
      selectedRequestLocation
    );
  }

  async getConvertedUOMForCopiedLocationCost(
    productId,
    quantity,
    fromUomId,
    toUomId,
    additionalCost,
    i,
    productList,
    selectedRequestLocation
  ) {
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
        additionalCost.prodConv.length == productList.length
      ) {
        this.calculateCostAmountForCopiedLocationCost(
          additionalCost,
          productList,
          selectedRequestLocation
        );
      }
    } else {
      this.endpointCount += 1;
      let response= await this.spotNegotiationService.getUomConversionFactor(payload)
      if(response != null){
          this.endpointCount -= 1;
          if (response?.message == 'Unauthorized') {
            return;
          }
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            additionalCost.prodConv[i] = _.cloneDeep(response);
            if (
              additionalCost.priceUomId &&
              additionalCost.prodConv &&
              additionalCost.prodConv.length == productList.length
            ) {
              this.calculateCostAmountForCopiedLocationCost(
                additionalCost,
                productList,
                selectedRequestLocation
              );
            }
          }
        };
    }
  }

  getRangeTotalAdditionalCostsForCopiedLocationCost(
    cost: any,
    selectedRequestLocation: any,
    productList: any[]
  ) {
    let productId = cost.requestProductId
      ? productList.find((item: any) => item.id == cost.requestProductId)
          ?.productId
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
            Value: selectedRequestLocation.locationId
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
    this.endpointCount += 1;
    this.spotNegotiationService
      .getRangeTotalAdditionalCosts(payload)
      .subscribe((response: any) => {
        this.endpointCount -= 1;
        if (response?.message == 'Unauthorized') {
          return;
        }
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          cost.amountIsCalculated = true;

          cost.price = response.price;
          cost.currencyId = response.currencyId;
          cost.amount = response.price;

          cost.extraAmount = cost.extras
            ? cost.amount * (cost.extras / 100)
            : 0;
          cost.totalAmount = cost.amount + cost.extraAmount;
          cost.ratePerUom = cost.totalAmount / cost.maxQuantity;
          this.checkIfForAllCopiedLocationCostAmountIsCalculated();
        }
      });
  }

  calculateCostAmountForCopiedLocationCost(
    cost: any,
    productList: any[],
    selectedRequestLocation: any
  ) {
    switch (cost.costType) {
      case 'Flat':
        cost.amount = cost.price;
        cost.amountIsCalculated = true;
        break;
      case 'Unit':
        cost.amount = 0;
        if (
          cost.priceUomId &&
          cost.prodConv &&
          cost.prodConv.length == productList.length
        ) {
          for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if (cost.isAllProductsCost || product.id == cost.requestProductId) {
              cost.amount =
                cost.amount +
                product.maxQuantity * cost.prodConv[i] * parseFloat(cost.price);
            }
          }
          cost.amountIsCalculated = true;
        }
        break;
      case 'Percent':
        cost.extraAmount = cost.costAmount = cost.ratePerUom = 0;
        cost.amountIsCalculated = true;

        break;
      case 'Range':
      case 'Total':
        this.getRangeTotalAdditionalCostsForCopiedLocationCost(
          cost,
          selectedRequestLocation,
          productList
        );
        break;
    }

    cost.extraAmount = cost.extras ? cost.amount * (cost.extras / 100) : 0;
    cost.totalAmount = cost.amount + cost.extraAmount;
    cost.ratePerUom = cost.totalAmount / cost.maxQuantity;

    this.checkIfForAllCopiedLocationCostAmountIsCalculated();
  }

  checkIfForAllCopiedLocationCostAmountIsCalculated() {
    let checkCopiedAdditionalCostRowIndex = _.findIndex(
      this.copiedLocationCost,
      function(obj: any) {
        return !obj.amountIsCalculated;
      }
    );

    if (this.endpointCount == 0 && checkCopiedAdditionalCostRowIndex == -1) {
      this.saveCopiedLocationCost();
    }
  }

  saveCopiedLocationCost() {
    if (this.checkIfLocRTAddCostsInvalid(this.copiedLocationCost)) {
      this.toastr.error(
        'Range/Total for duplicate cost cannot be saved due to request quantity is greater than the defined cost quantity.'
      );
      return;
    }
    const payload = {
      additionalCosts: this.locationBasedCosts.concat(this.copiedLocationCost)
    };
    let reqs = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });
    let requestLocationId = this.requestLocation.id;
    this.spotNegotiationService
      .saveOfferAdditionalCosts(payload)
      .subscribe((res: any) => {
        this.enableSave = false;
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res.status) {
          let locAddCosts = res?.costs?.locationAdditionalCosts;
          this.locationBasedCosts = this.formatCostItemForDisplay(
            _.filter(res?.costs?.locationAdditionalCosts, function(
              locationCost
            ) {
              return locationCost.requestLocationId == requestLocationId;
            })
          );
          reqs = reqs.map(e => {
            let requestLocations = e.requestLocations.map(reqLoc => {
              let requestAdditionalCosts : any = [];
              if(locAddCosts?.filter(loc => reqLoc.id == loc.requestLocationId).length > 0){
                requestAdditionalCosts = locAddCosts.filter(loc => reqLoc.id == loc.requestLocationId);    
                //return { ...reqLoc, requestAdditionalCosts };
              }
              return { ...reqLoc, requestAdditionalCosts };          
            });
             return { ...e, requestLocations };
          });
          this.store.dispatch(new UpdateRequest(reqs));
          this.toastr.success('Additional cost copied successfully.');

          this.closeDialog();
        } else this.toastr.error(res.message);
      });
  }

  checkNumberOfNotStemmedProduct(selectedRequestLocation: any) {
    let products = _.filter(selectedRequestLocation.requestProducts, function(
      product
    ) {
      return product.status !== 'Stemmed';
    });
    return products;
  }

  getRequestProductIdsForCopyLocationCost(
    selectedApplicableForId: any,
    selectedRequestLocation: any
  ) {
    let requestProductsIds = [];
    if (selectedApplicableForId > 0) {
      requestProductsIds.push(selectedApplicableForId);
    } else {
      selectedRequestLocation.requestProducts.forEach((product: any) => {
        if (product.status !== 'Stemmed') {
          requestProductsIds.push(product.id);
        }
      });
    }

    return requestProductsIds.join(',');
  }

  getProductDetails(requestProductId: any, selectedRequestLocation: any) {
    let productList = [];
    if (requestProductId > 0) {
      const product = selectedRequestLocation.requestProducts.find(
        (item: any) => item.id === requestProductId
      );
      return {
        productList: [product],
        maxQty: product.maxQuantity,
        maxQtyUomId: product.uomId,
        maxQtyUom: product.uomName
      };
    } else {
      let totalMaxQuantity = 0,
        maxQuantityUomId,
        maxQuantityUom;
      selectedRequestLocation.requestProducts.forEach((product: any) => {
        if (product.status !== 'Stemmed') {
          totalMaxQuantity = totalMaxQuantity + product.maxQuantity;
          maxQuantityUomId = product.uomId;
          maxQuantityUom = product.uomName;
          productList.push(product);
        }
      });
      return {
        productList: productList,
        maxQty: totalMaxQuantity,
        maxQtyUomId: maxQuantityUomId,
        maxQtyUom: maxQuantityUom
      };
    }
  }
  priceFormatTrailingZero(value, type?: any) {

    if (typeof value == 'undefined' || value == null) {
      return type == 'benchMark' || 'closure' ? '--' : null;
    }

    if (value == 0) {
      return type == 'benchMark' ? value : '--';
    }
    let format = /[^\d|\-+|\.+]/g;
    let plainNumber;
    value = value.toString().replace(/,/g, '');
    if (format.test(value.toString()) && type == 'livePrice') {
      this.toastr.warning('Live price should be a numeric value ');
      plainNumber = '';
    } else {
      plainNumber = value.toString().replace(format, '');
    }

    const number = parseFloat(plainNumber);

    if (isNaN(number)) {
      return null;
    }

    let productPricePrecision = this.tenantService.pricePrecision;

    let num = plainNumber.split('.', 2);
    //To follow precision set at tenant. Ignore the precision, if the decimal values are only 0s
    if (plainNumber == num ) {
      this.priceFormat = '';
    } else {
      this.priceFormat =
        '1.' + productPricePrecision + '-' + productPricePrecision;
    }

    if (plainNumber) {
      if (!productPricePrecision) {
        plainNumber = Math.trunc(plainNumber);
      }
      if (type && type == 'benchMark') {
        plainNumber = Math.abs(parseFloat(plainNumber));
      }
      this.priceFormat = '';
      plainNumber = this._decimalPipe.transform(plainNumber, this.priceFormat);
      
      return plainNumber;
    }
  }

}
