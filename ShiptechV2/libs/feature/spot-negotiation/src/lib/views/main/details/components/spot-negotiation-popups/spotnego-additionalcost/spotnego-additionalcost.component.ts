import { DecimalPipe } from '@angular/common';
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { SpotNegotiationPriceCalcService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation-price-calc.service';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdditionalCostViewModel } from '../../../../../../core/models/additional-costs-model';
import { EditLocationRow } from '../../../../../../store/actions/ag-grid-row.action';

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
  locationCosts: any = []; // location specific costs from location master
  applicableForItems: any = [];

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
  totalMaxQuantity: number = 0;
  maxQuantityUomId: number = 0;
  currentRequestInfo: any;
  requestList: any[] = [];
  requestListToDuplicate: any[] = [];
  duplicateCost: boolean = false;
  copiedAdditionalCost: any[] = [];
  endpointCount: number = 0;
  isCheckedMain: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<SpotnegoAdditionalcostComponent>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spotNegotiationService: SpotNegotiationService,
    private spotNegotiationPriceCalcService: SpotNegotiationPriceCalcService,
    private tenantSettingsService: TenantSettingsService,
    private changeDetectorRef: ChangeDetectorRef,
    private tenantService: TenantFormattingService,
    @Inject(DecimalPipe) private _decimalPipe,
    private store: Store
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
    this.costTypeList = data.costTypeList;
    this.uomList = data.uomList;
    this.currencyList = data.currencyList;
  }

  ngOnInit() {
    this.store.selectSnapshot<any>((state: any) => {
      this.currentRequestInfo = _.cloneDeep(
        state.spotNegotiation.currentRequestSmallInfo
      );
      this.requestList = _.cloneDeep(state.spotNegotiation.requests);
      this.getRequestsList();
    });
    this.buildApplicableForItems(this.rowData);
    this.getAdditionalCosts();
  }

  checkUncheckAll(event: any, rowNumber: number) {
    if (this.offerAdditionalCostList.length === 0) {
      this.isCheckedMain = false;
    }
    this.offerAdditionalCostList.map(req => (req.isSelected == event.checked ? true : false));
    if (event.checked == true && rowNumber === -1) {
      this.offerAdditionalCostList.map(x => x.isSelected = true);
    }
    if (event.checked == false && rowNumber === -1) {
      this.isCheckedMain = false;
      this.offerAdditionalCostList.map(x => x.isSelected = false);
    }
    if (this.offerAdditionalCostList.every(x => x.isSelected == true)) {
      this.isCheckedMain = true;
    }
    else {
      this.isCheckedMain = false;
    }
  }

  addLocationCostToAllRequests() { ///save & proceed
    this.copiedAdditionalCost = this.offerAdditionalCostList.filter(x => x.isSelected == true);
    if (this.copiedAdditionalCost.length === 0) {
      this.toastr.warning('Please Select Atleast one Row');
      return;
    }
    if (this.requestListToDuplicate.length === 0) {
      this.toastr.warning('Please Select Atleast one Request');
      return;
    }
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    let requestAditionalCost = [];
    requestAditionalCost = locationsRows.find(loc => loc.sellerCounterpartyId == this.rowData.sellerCounterpartyId).requestAdditionalCosts;

    if (requestAditionalCost.length > 0) {
      this.saveAdditionalCostsToSelectedRequests(this.requestListToDuplicate);
    }
    else {
      this.saveAdditionalCosts('isProceed');
    }
  }

  saveAdditionalCostsToSelectedRequests(selectedRequestList) {
    this.copiedAdditionalCost = [];
    this.endpointCount = 0;
    let reqIdForLocation: String;
    let noRequestOffer: String;
    let reqIdForOfferLocation: String;
    let reqIdForStemmedProduct: String;

    let requestLocationId = this.requestLocation.locationId;
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    //this.offerAdditionalCostList = this.offerAdditionalCostList.filter((x) => x.isSelected && !x.isDeleted );
    let rowsToCopy = this.offerAdditionalCostList.filter((x) => x.isSelected && !x.isDeleted);
    selectedRequestList.forEach(request => {
      request.requestLocations.forEach(requestLocation => {
        //statusId = 12 => Stemmed status
        if (
          requestLocation.locationId == requestLocationId &&
          requestLocation.statusId != 12
        ) {
          let reqProductIdForLocation = [];
          let reqOfferIdForLocation = [];
          let noRequestOfferArray = [];
          let productsStemmedArray = [];
          rowsToCopy.forEach(additionalCost => {
            if (!additionalCost.isDeleted) {
              let newCost = _.cloneDeep(additionalCost);
              newCost.id = 0;
              newCost.hasStemmedProduct = false;
              newCost.requestLocationId = requestLocation.id;
              newCost.amount = additionalCost.amount;
              newCost.extraAmount = additionalCost.extraAmount;
              newCost.totalAmount = additionalCost.totalAmount;
              newCost.ratePerUom = additionalCost.ratePerUom;
              newCost.offerId = null;
              newCost.selectedRequestLocation = requestLocation;
              newCost.isCostCopy = true;

              let row = locationsRows.filter(
                lr =>
                  lr.requestLocationId == requestLocation.id &&
                  this.rowData.sellerCounterpartyId == lr.sellerCounterpartyId
              );

              if (!row[0].requestOffers) {
                noRequestOfferArray.push(
                  request.name + ' - ' + requestLocation.locationName
                );
              }

              //If All is selected in the applicable for dropdown
              if (newCost.isAllProductsCost) {
                let rowData = row[0];
                newCost.rowData = rowData;
                newCost.requestOfferIds = null;
                newCost.isAllProductsCost = true;

                const productDetails = this.getProductDetails(
                  newCost.selectedApplicableForId,
                  requestLocation,
                  rowData
                );

                newCost.productList = productDetails.productList;
                newCost.maxQuantity = productDetails.maxQty;
                newCost.maxQuantityUomId = productDetails.maxQtyUomId;

                requestLocation.requestProducts.forEach((product: any) => {
                  if (product.status !== 'Stemmed') {
                    //Check if exist request offer for product
                    let findRequestOffer = _.filter(
                      rowData.requestOffers,
                      function (object: any) {
                        return object.requestProductId == product.id;
                      }
                    );
                    if (!findRequestOffer.length) {
                      reqOfferIdForLocation.push(product.productName);
                    }
                  }
                });

                if (productDetails.productList.length > 1) {
                  newCost.requestOfferIds = this.getRequestOfferIdsForCopyAdditionalCost(
                    0,
                    rowData
                  );
                  newCost.offerId = rowData.requestOffers[0].offerId;
                } else if (productDetails.productList.length == 1) {
                  newCost.excludeCost = true;
                  requestLocation.requestProducts.forEach((product: any) => {
                    if (product.status === 'Stemmed') {
                      productsStemmedArray.push(product.productName);
                    }
                  });
                } else if (!productDetails.productList.length) {
                  newCost.excludeCost = true;
                }
              } else {
                //One product is selected in the applicable for dropdown
                let rowData = row[0];
                newCost.rowData = rowData;
                newCost.requestOfferId = null;

                let applicableForProduct = _.find(
                  this.requestLocation.requestProducts,
                  function (product: any) {
                    return product.id == newCost.requestProductId;
                  }
                );
                let productId = applicableForProduct.productId;
                let productList = _.filter(
                  requestLocation.requestProducts,
                  function (product: any) {
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
                    function (product: any) {
                      return product.productId === productId;
                    }
                  );

                  let findRequestOffer = _.filter(
                    rowData.requestOffers,
                    function (object: any) {
                      return object.requestProductId == product.id;
                    }
                  );

                  if (!findRequestOffer.length) {
                    reqOfferIdForLocation.push(
                      applicableForProduct.productName
                    );
                  } else {
                    if (product.status == 'Stemmed') {
                      productsStemmedArray.push(product.productName);
                    }
                    this.formatCopiedAdditionalCostForSpecificProduct(
                      newCost,
                      product,
                      requestLocation,
                      rowData
                    );
                  }
                }
              }

              if (!newCost.hasStemmedProduct && !newCost.excludeCost) {
                this.copiedAdditionalCost.push(newCost);
              }
            }
          });

          //If selected product in applicable for dropdown doesn't exist in selected request
          reqProductIdForLocation = _.uniq(reqProductIdForLocation);
          let reqProductIdForLocationString = reqProductIdForLocation.join(',');
          if (reqProductIdForLocationString != '') {
            reqIdForLocation = reqIdForLocation
              ? reqIdForLocation +
              ', ' +
              reqProductIdForLocationString +
              ' is not available in ' +
              request.name +
              ' '
              : reqProductIdForLocationString +
              ' is not available in ' +
              request.name +
              ' ';
          }

          //If counterparty doesn't have request offers available
          noRequestOfferArray = _.uniq(noRequestOfferArray);
          let noRequestOfferArrayString = noRequestOfferArray.join(',');
          if (noRequestOfferArrayString != '') {
            noRequestOffer = noRequestOffer
              ? noRequestOffer + ', ' + noRequestOfferArrayString + ' '
              : noRequestOfferArrayString + ' ';
          }

          //If counterparty doesn't have request offer available for selected product
          reqOfferIdForLocation = _.uniq(reqOfferIdForLocation);
          let reqOfferIdForLocationString = reqOfferIdForLocation.join(',');
          if (reqOfferIdForLocationString != '') {
            reqIdForOfferLocation = reqIdForOfferLocation
              ? reqIdForOfferLocation +
              ', ' +
              reqOfferIdForLocationString +
              ' is not available in ' +
              request.name +
              ' '
              : reqOfferIdForLocationString +
              ' is not available in ' +
              request.name +
              ' ';
          }

          //If user select stemmed product  for selected product
          productsStemmedArray = _.uniq(productsStemmedArray);
          let productsStemmedString = productsStemmedArray.join(',');
          if (productsStemmedString != '') {
            reqIdForStemmedProduct = reqIdForStemmedProduct
              ? productsStemmedString +
              ', ' +
              productsStemmedString +
              ' are stemmed in ' +
              request.name +
              ' '
              : productsStemmedString + ' are stemmed in ' + request.name + ' ';
          }
        }
      });
    });

    if (reqIdForLocation) {
      this.toastr.warning('Cost cannot be copied as the ' + reqIdForLocation);
      return;
    }

    if (noRequestOffer) {
      this.toastr.warning(
        'Cost cannot be copied as the request offer(s) ' +
        ' is not available in ' +
        noRequestOffer +
        ' for the counterparty ' +
        this.rowData.sellerCounterpartyName
      );
      return;
    }

    if (reqIdForOfferLocation) {
      this.toastr.warning(
        'Cost cannot be copied as the request offer(s) for the counterpaty ' +
        this.rowData.sellerCounterpartyName +
        ': ' +
        reqIdForOfferLocation
      );
      return;
    }

    if (reqIdForStemmedProduct) {
      this.toastr.warning(
        'Cost cannot be copied as the product(s) ' + reqIdForStemmedProduct
      );
      return;
    }

    if (this.copiedAdditionalCost.length) {
      let payload = {
        additionalCosts: this.offerAdditionalCostList
          .concat(this.copiedAdditionalCost)
      };

      this.saveButtonClicked = false;
      this.spotNegotiationService
        .saveOfferAdditionalCosts(payload)
        .subscribe((res: any) => {
          this.enableSave = false;
          if (res?.message == 'Unauthorized') {
            return;
          }
          if (res.status) {
            let rowData = (payload.additionalCosts.filter(obj => obj.hasOwnProperty('rowData')))[0].rowData;
            this.updateCopiedAdditionalCostToStore(rowData);
            this.toastr.success('Additional cost copied successfully!');
          } else this.toastr.error('Please try again later.');
        });
    }
    else {
      this.toastr.error('Please try again later');
      return;
    }
  }

  getAdditionalCosts() {
    this.spinner.show();
    this.spotNegotiationService
      .getMasterAdditionalCosts({})
      .subscribe(async (response: any) => {
        if (response?.message == 'Unauthorized') {
          return;
        }
        if (typeof response === 'string') {
          this.spinner.hide();
          this.toastr.error(response);
        } else {
          this.additionalCostList = _.cloneDeep(
            response.payload.filter(
              e =>
                e.costType.name !== 'Total' &&
                e.costType.name !== 'Range'
            )
          );
          this.createAdditionalCostTypes();
          if (this.rowData?.requestOffers?.length > 0) {
            const firstOffer = this.rowData.requestOffers[0];
            this.offerId = firstOffer.offerId;
            const payload = {
              offerId: firstOffer.offerId,
              requestLocationId: this.rowData.requestLocationId,
              isLocationBased: false
            };
            let additionalCostId = [];
            let response = await this.spotNegotiationService
              .getAdditionalCosts(payload);
            //.subscribe((response: any) => {
            if (response != null) {
              if (response?.message == 'Unauthorized') {
                return;
              }
              if (typeof response === 'string') {
                this.spinner.hide();
                this.toastr.error(response);
              } else {
                this.spinner.hide();
                this.offerAdditionalCostList = _.cloneDeep(
                  response.offerAdditionalCosts.map(resp => ({ ...resp, isSelected: true }))
                );
                response.offerAdditionalCosts.forEach(el => {
                  additionalCostId[el.additionalCostId] = el.additionalCostId;
                });

                this.formatAdditionalCostList(this.offerAdditionalCostList);
                this.locationAdditionalCostsList = _.cloneDeep(
                  response.locationAdditionalCosts
                );
                this.convertOfferAdditionalCostListToPriceCurrecny(this.offerAdditionalCostList, firstOffer);
                this.formatAdditionalCostList(
                  this.locationAdditionalCostsList
                );
                this.calculateAdditionalCost(this.offerAdditionalCostList);
                this.calculateAdditionalCost(this.locationAdditionalCostsList);
              }
              //});
            }
            let tempId = [];
            this.additionalCostList.filter(el => {
              if (!el.isDeleted == true || additionalCostId[el.id]) {
                tempId.push(el);
              }
            });
            this.additionalCostList = tempId;
          }
        }
      });
  }

  calculateAdditionalCost(additionalCostList) {
    for (let i = 0; i < additionalCostList.length; i++) {
      if (!additionalCostList[i].isDeleted) {
        this.additionalCostNameChanged(
          additionalCostList[i],
          true,
          true
        )
      }
    }
  }

  convertOfferAdditionalCostListToPriceCurrecny(additionalCostList, reqOffer) {
    for (let i = 0; i < additionalCostList.length; i++) {
      if (additionalCostList[i].currencyId != reqOffer.currencyId && additionalCostList[i].currencyId == 1) {
        additionalCostList[i].price = additionalCostList[i].price / reqOffer.exchangeRateToBaseCurrency;
        additionalCostList[i].amount = additionalCostList[i].amount / reqOffer.exchangeRateToBaseCurrency;
        additionalCostList[i].currencyId = reqOffer.currencyId;
        if (additionalCostList[i].extraAmount)
          additionalCostList[i].extraAmount = additionalCostList[i].extraAmount / reqOffer.exchangeRateToBaseCurrency;
        additionalCostList[i].totalAmount = additionalCostList[i].totalAmount / reqOffer.exchangeRateToBaseCurrency;
        additionalCostList[i].ratePerUom = additionalCostList[i].ratePerUom / reqOffer.exchangeRateToBaseCurrency;
      }
      else if (additionalCostList[i].currencyId != reqOffer.currencyId && additionalCostList[i].currencyId != 1) {
        additionalCostList[i].price = additionalCostList[i].price / additionalCostList[i].exchangeRateToBaseCurrency;
        additionalCostList[i].amount = additionalCostList[i].amount / additionalCostList[i].exchangeRateToBaseCurrency;
        if (additionalCostList[i].extraAmount)
          additionalCostList[i].extraAmount = additionalCostList[i].extraAmount / additionalCostList[i].exchangeRateToBaseCurrency;
        additionalCostList[i].totalAmount = additionalCostList[i].totalAmount / additionalCostList[i].exchangeRateToBaseCurrency;
        additionalCostList[i].ratePerUom = additionalCostList[i].ratePerUom / additionalCostList[i].exchangeRateToBaseCurrency;
        additionalCostList[i].currencyId = reqOffer.currencyId;
      }
    }
  }
  formatAdditionalCostList(additionalCostList) {
    for (let i = 0; i < additionalCostList.length; i++) {
      additionalCostList[i].selectedApplicableForId = additionalCostList[i]
        .requestProductId
        ? additionalCostList[i].requestProductId
        : 0;

      this.checkIfLineIsApplicableToStemmedProduct(additionalCostList[i]);

      this.getAdditionalCostDefaultCostType(additionalCostList[i]);
    }
  }

  checkIfLineIsApplicableToStemmedProduct(additionalCost) {
    let findProductIndex = _.findIndex(
      this.requestLocation.requestProducts,
      function (product: any) {
        return product.status == 'Stemmed';
      }
    );
    if (findProductIndex != -1) {
      additionalCost.hasStemmedProduct = true;
      if (!additionalCost.isAllProductsCost) {
        additionalCost.product = {
          name: this.requestLocation.requestProducts[findProductIndex]
            .productName,
          id: this.requestLocation.requestProducts[findProductIndex].productId
        };
      } else {
        additionalCost.product = {
          name: 'All',
          id: 0
        };
      }
    }
  }

  checkIfSelectedApplicableIdExistsInapplicableForItems(additionalCost) {
    let findIndex = _.findIndex(this.applicableForItems, function (object: any) {
      return object.id == additionalCost.selectedApplicableForId;
    });
    if (
      findIndex == -1 &&
      additionalCost.id &&
      !additionalCost.selectedApplicableForId
    ) {
      return false;
    }
    return true;
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
    if (this.applicableForItems.length > 0) {
      return this.applicableForItems;
    }
    let applicableForItemsArray = [];
    this.requestLocation.requestProducts.forEach((product: any, index) => {
      //if (product.status != 'Stemmed') {
      let findRowDataOfferIndex = _.findIndex(rowData.requestOffers, function (
        object: any
      ) {
        return object.requestProductId == product.id && object.price;
      });
      if (findRowDataOfferIndex != -1) {
        applicableForItemsArray.push({
          id: product.id,
          name: product.productName,
          productId: product.productId
        });

        this.totalMaxQuantity = this.totalMaxQuantity + product.maxQuantity;
        this.maxQuantityUomId = product.uomId;

        this.productList.push(product);
      }
      //}
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

  getMaxQuantityByApplicableFor(requestProductId: any) {
    if (requestProductId > 0) {
      const product = this.requestLocation.requestProducts.find(
        (item: any) => item.id === requestProductId
      );
      return {
        maxQty: product.maxQuantity,
        maxQuantityUomId: product.uomId
      };
    } else
      return {
        maxQty: this.totalMaxQuantity,
        maxQuantityUomId: this.maxQuantityUomId
      };
  }

  onApplicableForChange(
    selectedApplicableForId: number,
    selectedIndex: number
  ) {
    let cost = this.offerAdditionalCostList[selectedIndex];
    cost.requestProductId =
      selectedApplicableForId === 0 ? null : cost.selectedApplicableForId;
    cost.requestOfferIds = this.getRequestOfferIds(selectedApplicableForId);
    cost.isLocationBased = false;
    if (cost.requestProductId) {
      cost.isAllProductsCost = false;
      cost.offerId = null;
      cost.requestOfferId = parseInt(cost.requestOfferIds);
    } else {
      cost.isAllProductsCost = true;
      cost.offerId = this.offerId;
      cost.requestOfferId = null;
    }

    // cost.requestProductIds = this.getRequestProductIds(selectedApplicableForId);
    cost.currencyId = this.getCurrencyId(selectedApplicableForId);

    const maxQtyDetails = this.getMaxQuantityByApplicableFor(
      selectedApplicableForId
    );
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUomId = maxQtyDetails.maxQuantityUomId;
  }

  getRequestOfferIds(selectedApplicableForId) {
    let requestOfferIds = [];

    if (selectedApplicableForId > 0) {
      let findIndex = _.findIndex(this.rowData.requestOffers, function (
        object: any
      ) {
        return object.requestProductId == selectedApplicableForId;
      });
      if (findIndex !== -1) {
        requestOfferIds.push(this.rowData.requestOffers[findIndex].id);
      }
    } else {
      for (let i = 0; i < this.rowData.requestOffers.length; i++) {
        requestOfferIds.push(this.rowData.requestOffers[i].id);
      }
    }
    return requestOfferIds.join(',');
  }

  getRequestProductIds(selectedApplicableForId) {
    let requestProductsIds = [];

    if (selectedApplicableForId > 0) {
      requestProductsIds.push(selectedApplicableForId);
    } else {
      for (let i = 0; i < this.rowData.requestOffers.length; i++) {
        requestProductsIds.push(this.rowData.requestOffers[i].requestProductId);
      }
    }
    return requestProductsIds;
  }

  getCurrencyId(selectedApplicableForId) {
    if (selectedApplicableForId > 0) {
      let findIndex = _.findIndex(this.rowData.requestOffers, function (
        object: any
      ) {
        return object.requestProductId == selectedApplicableForId;
      });
      if (findIndex !== -1) {
        return this.rowData.requestOffers[findIndex].currencyId;
      }
    } else {
      return this.rowData.requestOffers[0].currencyId;
    }
  }

  addNewAdditionalCostLine() {
    if (this.applicableForItems.length == 0) {
      this.toastr.error('No quoted products!');
      return;
    }
    const additionalCost = {
      additionalCostId: null,
      costTypeId: null,
      price: null,
      selectedApplicableForId: this.applicableForItems[0]?.id,
      offerId: this.offerId,
      requestLocationId: this.rowData.requestLocationId,
      isDeleted: false,
      isSelected: true,
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
    if (this.offerAdditionalCostList.length === 0) {
      this.isCheckedMain = false;
    }
    this.recalculatePercentAdditionalCosts(this.offerAdditionalCostList, false);
    this.enableSave = true;
  }

  closeDialog(duplicateCost: boolean) {
    this.dialogRef.close(duplicateCost);
  }

  compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  /**
   * Change the cost type to the default for the respective additional cost.
   */
  async additionalCostNameChanged(additionalCost, skipDefault, skipDefaultPriceUom) {
    this.enableSave = true;
    if (!skipDefault) {
      additionalCost.costTypeId = this.getAdditionalCostDefaultCostType(
        additionalCost
      ).id;
    }
    additionalCost.isAllowingNegativeAmmount = this.additionalCostList.find(ac => ac.id == additionalCost.additionalCostId)?.isAllowingNegativeAmmount;
    if (!skipDefaultPriceUom) {
      if (additionalCost.costTypeId != 2) {
        additionalCost.priceUomId = null;
      } else {
        const maxQtyDetails = this.getMaxQuantityByApplicableFor(
          additionalCost.selectedApplicableForId
        );
        additionalCost.priceUomId = maxQtyDetails.maxQuantityUomId;
      }
    }

    if (additionalCost.costTypeId == 2) {
      await this.addPriceUomChanged(additionalCost);
    } else {
      this.calculateAdditionalCostAmounts(additionalCost, false);
      this.recalculatePercentAdditionalCosts(
        this.offerAdditionalCostList,
        false
      );
    }
  }

  recalculatePercentAdditionalCosts(
    additionalCostList,
    locationAdditionalCostFlag
  ) {
    for (let i = 0; i < additionalCostList.length; i++) {
      if (!additionalCostList[i].isDeleted) {
        //if (additionalCostList[i].costTypeId == COST_TYPE_IDS.PERCENT) {
        additionalCostList[i].totalAmount = 0;
        this.calculateAdditionalCostAmounts(
          additionalCostList[i],
          locationAdditionalCostFlag
        );
        //}

        if (additionalCostList[i].isLocationBased) {
          if (additionalCostList[i].isAllProductsCost) {
            additionalCostList[i].requestOfferIds = this.getRequestOfferIds(0);
          } else {
            additionalCostList[i].requestOfferIds = this.getRequestOfferIds(
              additionalCostList[i].requestProductId
            );
          }
        }
      }
    }
  }

  async addPriceUomChanged(additionalCost) {
    if (!additionalCost.priceUomId) {
      return;
    }
    additionalCost.prodConv = _.cloneDeep([]);

    for (let i = 0; i < this.productList.length; i++) {
      let prod = this.productList[i];
      await this.setConvertedAddCost(prod, additionalCost, i);
    }
  }

  async setConvertedAddCost(prod, additionalCost, i) {
    await this.getConvertedUOM(
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
        this.calculateAdditionalCostAmounts(additionalCost, false);
        this.recalculatePercentAdditionalCosts(
          this.offerAdditionalCostList,
          false
        );
      }
    } else {
      let response = await this.spotNegotiationService.getUomConversionFactor(payload)
      if (response != null) {
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
            this.calculateAdditionalCostAmounts(additionalCost, false);
            this.recalculatePercentAdditionalCosts(
              this.offerAdditionalCostList,
              false
            );
          }
        }
      };
    }
  }

  /**
   * Get the corresponding component type ID for a given additional cost.
   */
  getAdditionalCostDefaultCostType(additionalCost) {
    if (!additionalCost.additionalCostId) {
      return false;
    }
    const costType = this.additionalCostTypes[additionalCost.additionalCostId]
      ? this.additionalCostTypes[additionalCost.additionalCostId].costType
      : this.costTypeList.find(c => c.id === additionalCost.costTypeId);
    if (costType) {
      if (costType.id == 1 || costType.id == 2) {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 1 || v.id == 2) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      } else if (costType.id == 3) {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 3) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      } else if (costType.id == 4) {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 4) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      } else if (costType.id == 5) {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 5) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      }
      return costType;
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
  calculateAdditionalCostAmounts(additionalCost, locationAdditionalCostFlag) {
    let totalAmount, productComponent;
    if (!additionalCost.costTypeId) {
      return additionalCost;
    }
    additionalCost.maxQuantity = 0;
    for (let i = 0; i < this.productList.length; i++) {
      let product = this.productList[i];
      if (additionalCost.isAllProductsCost || product.id == additionalCost.requestProductId
      ) {

        additionalCost.maxQuantity = additionalCost.maxQuantity + product.maxQuantity;
      }
    }
    if (additionalCost.price != null)
      additionalCost.price = additionalCost.price.toString().replace(/,/g, '');
    if (additionalCost.extras != null)
      additionalCost.extras = additionalCost.extras.toString().replace(/,/g, '');
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
            function (object: any) {
              return object.requestProductId == additionalCost.requestProductId;
            }
          );
          if (findProductIndex != -1) {
            let product = _.cloneDeep(
              this.rowData.requestOffers[findProductIndex]
            );
            let currentPrice = Number(product.price) * Number(product.exchangeRateToBaseCurrency);
            let findProduct = _.find(this.productList, function (item) {
              return item.id == product.requestProductId;
            });
            if (findProduct) {
              totalAmount = Number(currentPrice * findProduct.maxQuantity);
            }
          }
        }
        if (productComponent) {
          additionalCost.amount = (totalAmount * additionalCost.price) / 100;
        } else {
          if (!locationAdditionalCostFlag) {
            totalAmount =
              totalAmount +
              this.sumProductComponentAdditionalCostAmounts(
                this.offerAdditionalCostList
              );
          } else {
            totalAmount =
              totalAmount +
              this.sumProductComponentAdditionalCostAmounts(
                this.locationAdditionalCostsList
              );
          }

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

    this.changeDetectorRef.detectChanges();
  }

  /**
   * Sum the Amount field of all products.
   */
  sumProductAmounts(products) {
    let result = 0;
    let newProducts = _.cloneDeep(products);
    for (let i = 0; i < newProducts.length; i++) {
      let currentPrice = Number(newProducts[i].price) * Number(newProducts[i].exchangeRateToBaseCurrency);
      let findProduct = _.find(this.productList, function (item) {
        return item.id == newProducts[i].requestProductId;
      });
      if (findProduct) {
        result += Number(currentPrice * findProduct.maxQuantity);
      }
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
      this.additionalCostTypes[additionalCost.additionalCostId]?.componentType
    ) {
      additionalCost.isTaxComponent = !(
        this.additionalCostTypes[additionalCost.additionalCostId]?.componentType
          .id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT
      );
      if (additionalCost.isTaxComponent) {
      } else {
        additionalCost.isTaxComponent = false;
      }
      return (
        this.additionalCostTypes[additionalCost.additionalCostId]?.componentType
          .id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT
      );
    }

    return null;
  }

  checkRequiredFields(): string {
    let additionalCostRequired = [];
    for (let i = 0, rowLength = this.offerAdditionalCostList.length; i < rowLength; i++) {
      if (!this.offerAdditionalCostList[i].isDeleted && this.offerAdditionalCostList[i].isSelected) {
        if (!this.offerAdditionalCostList[i].additionalCostId) {
          additionalCostRequired.push('Cost name is required!');
        }
        if (!this.offerAdditionalCostList[i].price) {
          let costName = this.offerAdditionalCostList[i].additionalCostId
            ? this.additionalCostTypes[
              this.offerAdditionalCostList[i].additionalCostId
            ].name
            : 'from line ' + (i + 1);
          additionalCostRequired.push('Price is required for cost ' + costName);
        }
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

  saveAdditionalCosts(isSaveType: string) {
    let findIfAdditionalCostExists = _.filter(
      this.offerAdditionalCostList,
      function (object) {
        return !object.isDeleted && object.isSelected;
      }
    );
    if (
      findIfAdditionalCostExists &&
      !findIfAdditionalCostExists.length &&
      this.duplicateCost
    ) {
      this.toastr.warning('No offer specific cost available to be copied.');
      return;
    }

    this.saveButtonClicked = true;
    let additionalCostRequiredString = this.checkRequiredFields();
    if (additionalCostRequiredString != '') {
      this.toastr.error(additionalCostRequiredString);
      return;
    }

    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    let selectedRequestList = [];
    if (isSaveType == 'isProceed') {
      selectedRequestList = _.filter(this.requestListToDuplicate, function (
        request
      ) {
        return request.isSelected;
      });
    }

    if (this.duplicateCost && !selectedRequestList.length) {
      this.toastr.warning('At least one request should be selected!');
      return;
    }

    let reqIdForLocation: String;
    let reqIdwithLocationForSeller: String;
    let reqIdwithLocationForProduct: String;
    let reqIdwithLocationForLength: String;

    let requestLocationId = this.requestLocation.locationId;

    let currentRequestProducts = this.requestLocation.requestProducts;
    for (let i = 0; i < selectedRequestList.length; i++) {
      let reqLocation = selectedRequestList[i].requestLocations.filter(function (
        location
      ) {
        return requestLocationId == location.locationId;
      });
      if (reqLocation.length == 0) {
        reqIdForLocation = reqIdForLocation
          ? reqIdForLocation + ', ' + selectedRequestList[i].name
          : selectedRequestList[i].name;
      }
      reqLocation.forEach(reqLoc => {
        let reqOffers = locationsRows.filter(
          lr =>
            lr.requestLocationId == reqLoc.id &&
            this.rowData.sellerCounterpartyId == lr.sellerCounterpartyId
        );
        if (reqOffers.length == 0) {
          reqIdwithLocationForSeller = reqIdwithLocationForSeller
            ? reqIdwithLocationForSeller +
            ', ' +
            selectedRequestList[i].name +
            ' - ' +
            reqLoc.locationName
            : selectedRequestList[i].name + ' - ' + reqLoc.locationName;
        }
        let reqProductIdForLocation = [];
        currentRequestProducts.forEach((currentProduct: any) => {
          let findProduct = _.filter(reqLoc.requestProducts, function (
            product: any
          ) {
            return currentProduct.productId == product.productId;
          });
          if (findProduct.length == 0) {
            reqProductIdForLocation.push(currentProduct.productName);
          }
        });
        reqProductIdForLocation = _.uniq(reqProductIdForLocation);
        let reqProductIdForLocationString = reqProductIdForLocation.join(',');
        if (reqProductIdForLocationString != '') {
          reqIdwithLocationForProduct = reqIdwithLocationForProduct
            ? reqIdwithLocationForProduct +
            ', ' +
            reqProductIdForLocationString +
            ' is not available in ' +
            selectedRequestList[i].name +
            ' '
            : reqProductIdForLocationString +
            ' is not available in ' +
            selectedRequestList[i].name +
            ' ';
        }

        if (currentRequestProducts.length < reqLoc.requestProducts.length) {
          reqIdwithLocationForLength = reqIdwithLocationForLength
            ? reqIdwithLocationForLength +
            ', ' +
            selectedRequestList[i].name +
            ' - ' +
            reqLoc.locationName +
            ' has ' +
            reqLoc.requestProducts.length +
            ' product(s)  '
            : selectedRequestList[i].name +
            ' - ' +
            reqLoc.locationName +
            ' has ' +
            reqLoc.requestProducts.length +
            ' product(s) ';
        }
      });
    }
    if (reqIdForLocation) {
      this.toastr.warning(
        'Cost cannot be copied as the ' +
        this.requestLocation.locationName +
        ' is not available in ' +
        reqIdForLocation
      );
      return;
    }

    if (reqIdwithLocationForSeller) {
      this.toastr.warning(
        'Cost cannot be copied as the ' +
        this.rowData.sellerCounterpartyName +
        ' is not available in ' +
        reqIdwithLocationForSeller
      );
      return;
    }

    let findIfAdditionalCostWithAllExists = _.filter(
      this.offerAdditionalCostList,
      function (object) {
        return !object.isDeleted && object.isAllProductsCost;
      }
    );

    if (findIfAdditionalCostWithAllExists.length) {
      if (reqIdwithLocationForProduct) {
        this.toastr.warning(
          'Cost cannot be copied as the ' + reqIdwithLocationForProduct
        );
        return;
      }

      if (reqIdwithLocationForLength) {
        this.toastr.warning(
          'Cost cannot be copied as the ' +
          this.requestLocation.locationName +
          ' has ' +
          this.requestLocation.requestProducts.length +
          ' products ' +
          ' and  ' +
          reqIdwithLocationForLength
        );
        return;
      }
    }

    if (selectedRequestList.length) {
      this.copyAdditionalCostToSelectedRequest(selectedRequestList);
    }

    if (!selectedRequestList.length) {
      if (this.offerAdditionalCostList.length == 0) {
        this.offerAdditionalCostList = [];
      }
      else {
        this.offerAdditionalCostList = this.offerAdditionalCostList.filter((x) => x.isSelected == true);
      }
      let payload = {
        additionalCosts: this.offerAdditionalCostList.concat(
          this.locationAdditionalCostsList
        )
      };
      this.saveButtonClicked = false;
      this.spotNegotiationService
        .saveOfferAdditionalCosts(payload)
        .subscribe((res: any) => {
          this.enableSave = false;
          if (res?.message == 'Unauthorized') {
            return;
          }
          if (res.status) {
            this.saveButtonClicked = false;

            this.offerAdditionalCostList = _.cloneDeep(
              res.costs.offerAdditionalCosts
            );

            this.formatAdditionalCostList(this.offerAdditionalCostList);

            this.changeDetectorRef.detectChanges();
            this.toastr.success('Offer Additional Cost saved successfully.');
          } else this.toastr.error('Please try again later.');

          this.closeDialog(this.duplicateCost);
        });
    }
  }

  getCurrencyCode(currencyId) {
    let findCurrencyIndex = _.findIndex(this.currencyList, function (object) {
      return object.id == currencyId;
    });
    if (findCurrencyIndex !== -1) {
      return this.currencyList[findCurrencyIndex]?.code;
    }
  }

  getUomName(maxQuantityUomId) {
    let findMaxQuantityUomIndex = _.findIndex(this.uomList, function (object) {
      return object.id == maxQuantityUomId;
    });
    if (findMaxQuantityUomIndex !== -1) {
      return this.uomList[findMaxQuantityUomIndex]?.name;
    }
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
  validateNumber(offerAdditionalCost) {
    if (offerAdditionalCost.price && offerAdditionalCost.price.match(/^[-,.]?\d{1,6}(,\d{3})*(\.\d*)?$/)) {
      return true;
    } else {
      this.toastr.warning('Please enter the valid number')
      return false;
    }
  }
  // Only Number
  OfferPricekeyPressNumber(event, offerAdditionalCost) {
    const typedChar = String.fromCharCode(event.keyCode);
    if (typedChar == '.' || typedChar == ',') {
      return true;
    }
    if (offerAdditionalCost.isAllowingNegativeAmmount && typedChar == "-" && (event.target.value == "" || !event.target.value.match(/^-/))) {
      return;
    }
    else if (typedChar == "-") {
      event.preventDefault();
      return false;
    }
    if (offerAdditionalCost.isAllowingNegativeAmmount && /^[-,.]?\d{1,6}(,\d{3})*(\.\d*)?$/.test(typedChar)) {
      return true;
    } else if (!offerAdditionalCost.isAllowingNegativeAmmount && /\d{1,6}(,\d{3})*(\.\d*)?$/.test(typedChar)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressNumber(event) {
    const typedChar = String.fromCharCode(event.keyCode);
    if (typedChar == '.' || typedChar == ',') {
      return true;
    }
    if (/\d{1,6}(,\d{3})*(\.\d*)?$/.test(typedChar)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  checkIfItsEmptyString(index, type) {
    if (type == 'extras') {
      if (this.offerAdditionalCostList[index].extras === '') {
        this.offerAdditionalCostList[index].extras = null;
      }
      if (this.offerAdditionalCostList[index].extras != null)
        this.offerAdditionalCostList[index].extras.toString().replace(/,/g, '');
    } else if (type == 'price') {
      if (this.offerAdditionalCostList[index].price === '') {
        this.offerAdditionalCostList[index].price = null;
      }
      if (this.offerAdditionalCostList[index].price != null)
        this.offerAdditionalCostList[index].price.toString().replace(/,/g, '');
    }
  }

  getRequestsList() {
    if (this.requestList && this.currentRequestInfo) {
      this.requestListToDuplicate = _.cloneDeep(
        this.requestList
          .filter(
            r => r.id != this.currentRequestInfo.id && r.status !== 'Stemmed'
          )
          .map(req => ({ ...req, isSelected: true }))
      );
    }
  }

  onRequestListCheckboxChange(checkbox: any) {
    if (checkbox.checked) {
      this.enableSave = true;
    }
    this.requestListToDuplicate.map(
      req => (req.isSelected = checkbox.checked ? true : false)
    );
  }

  onRequestListSelectionChange(checkbox: any, element: any) {
    element.isSelected = checkbox.checked ? true : false;
  }

  copyAdditionalCostToSelectedRequest(selectedRequestList) {
    this.copiedAdditionalCost = [];
    this.endpointCount = 0;
    let reqIdForLocation: String;
    let noRequestOffer: String;
    let reqIdForOfferLocation: String;
    let reqIdForStemmedProduct: String;

    let requestLocationId = this.requestLocation.locationId;
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    this.offerAdditionalCostList = this.offerAdditionalCostList.filter((x) => x.isSelected && !x.isDeleted);
    selectedRequestList.forEach(request => {
      request.requestLocations.forEach(requestLocation => {
        //statusId = 12 => Stemmed status
        if (
          requestLocation.locationId == requestLocationId &&
          requestLocation.statusId != 12
        ) {
          let reqProductIdForLocation = [];
          let reqOfferIdForLocation = [];
          let noRequestOfferArray = [];
          let productsStemmedArray = [];
          this.offerAdditionalCostList.forEach(additionalCost => {
            if (!additionalCost.isDeleted) {
              let newCost = _.cloneDeep(additionalCost);
              newCost.id = 0;
              newCost.hasStemmedProduct = false;
              newCost.requestLocationId = requestLocation.id;
              newCost.amount = 0;
              newCost.extraAmount = 0;
              newCost.totalAmount = 0;
              newCost.ratePerUom = 0;
              newCost.offerId = null;
              newCost.selectedRequestLocation = requestLocation;
              newCost.isCostCopy = true;

              let row = locationsRows.filter(
                lr =>
                  lr.requestLocationId == requestLocation.id &&
                  this.rowData.sellerCounterpartyId == lr.sellerCounterpartyId
              );

              if (!row[0].requestOffers) {
                noRequestOfferArray.push(
                  request.name + ' - ' + requestLocation.locationName
                );
              }

              //If All is selected in the applicable for dropdown
              if (newCost.isAllProductsCost) {
                let rowData = row[0];
                newCost.rowData = rowData;
                newCost.requestOfferIds = null;
                newCost.isAllProductsCost = true;

                const productDetails = this.getProductDetails(
                  newCost.selectedApplicableForId,
                  requestLocation,
                  rowData
                );

                newCost.productList = productDetails.productList;
                newCost.maxQuantity = productDetails.maxQty;
                newCost.maxQuantityUomId = productDetails.maxQtyUomId;

                requestLocation.requestProducts.forEach((product: any) => {
                  if (product.status !== 'Stemmed') {
                    //Check if exist request offer for product
                    let findRequestOffer = _.filter(
                      rowData.requestOffers,
                      function (object: any) {
                        return object.requestProductId == product.id;
                      }
                    );
                    if (!findRequestOffer.length) {
                      reqOfferIdForLocation.push(product.productName);
                    }
                  }
                });

                if (productDetails.productList.length > 1) {
                  newCost.requestOfferIds = this.getRequestOfferIdsForCopyAdditionalCost(
                    0,
                    rowData
                  );
                  newCost.offerId = rowData.requestOffers[0].offerId;
                } else if (productDetails.productList.length == 1) {
                  newCost.excludeCost = true;
                  requestLocation.requestProducts.forEach((product: any) => {
                    if (product.status === 'Stemmed') {
                      productsStemmedArray.push(product.productName);
                    }
                  });
                } else if (!productDetails.productList.length) {
                  newCost.excludeCost = true;
                }
              } else {
                //One product is selected in the applicable for dropdown
                let rowData = row[0];
                newCost.rowData = rowData;
                newCost.requestOfferId = null;

                let applicableForProduct = _.find(
                  this.requestLocation.requestProducts,
                  function (product: any) {
                    return product.id == newCost.requestProductId;
                  }
                );
                let productId = applicableForProduct.productId;
                let productList = _.filter(
                  requestLocation.requestProducts,
                  function (product: any) {
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
                    function (product: any) {
                      return product.productId === productId;
                    }
                  );

                  let findRequestOffer = _.filter(
                    rowData.requestOffers,
                    function (object: any) {
                      return object.requestProductId == product.id;
                    }
                  );

                  if (!findRequestOffer.length) {
                    reqOfferIdForLocation.push(
                      applicableForProduct.productName
                    );
                  } else {
                    if (product.status == 'Stemmed') {
                      productsStemmedArray.push(product.productName);
                    }
                    this.formatCopiedAdditionalCostForSpecificProduct(
                      newCost,
                      product,
                      requestLocation,
                      rowData
                    );
                  }
                }
              }

              if (!newCost.hasStemmedProduct && !newCost.excludeCost) {
                this.copiedAdditionalCost.push(newCost);
              }
            }
          });

          //If selected product in applicable for dropdown doesn't exist in selected request
          reqProductIdForLocation = _.uniq(reqProductIdForLocation);
          let reqProductIdForLocationString = reqProductIdForLocation.join(',');
          if (reqProductIdForLocationString != '') {
            reqIdForLocation = reqIdForLocation
              ? reqIdForLocation +
              ', ' +
              reqProductIdForLocationString +
              ' is not available in ' +
              request.name +
              ' '
              : reqProductIdForLocationString +
              ' is not available in ' +
              request.name +
              ' ';
          }

          //If counterparty doesn't have request offers available
          noRequestOfferArray = _.uniq(noRequestOfferArray);
          let noRequestOfferArrayString = noRequestOfferArray.join(',');
          if (noRequestOfferArrayString != '') {
            noRequestOffer = noRequestOffer
              ? noRequestOffer + ', ' + noRequestOfferArrayString + ' '
              : noRequestOfferArrayString + ' ';
          }

          //If counterparty doesn't have request offer available for selected product
          reqOfferIdForLocation = _.uniq(reqOfferIdForLocation);
          let reqOfferIdForLocationString = reqOfferIdForLocation.join(',');
          if (reqOfferIdForLocationString != '') {
            reqIdForOfferLocation = reqIdForOfferLocation
              ? reqIdForOfferLocation +
              ', ' +
              reqOfferIdForLocationString +
              ' is not available in ' +
              request.name +
              ' '
              : reqOfferIdForLocationString +
              ' is not available in ' +
              request.name +
              ' ';
          }

          //If user select stemmed product  for selected product
          productsStemmedArray = _.uniq(productsStemmedArray);
          let productsStemmedString = productsStemmedArray.join(',');
          if (productsStemmedString != '') {
            reqIdForStemmedProduct = reqIdForStemmedProduct
              ? productsStemmedString +
              ', ' +
              productsStemmedString +
              ' are stemmed in ' +
              request.name +
              ' '
              : productsStemmedString + ' are stemmed in ' + request.name + ' ';
          }
        }
      });
    });

    if (reqIdForLocation) {
      this.toastr.warning('Cost cannot be copied as the ' + reqIdForLocation);
      return;
    }

    if (noRequestOffer) {
      this.toastr.warning(
        'Cost cannot be copied as the request offer(s) ' +
        ' is not available in ' +
        noRequestOffer +
        ' for the counterparty ' +
        this.rowData.sellerCounterpartyName
      );
      return;
    }

    if (reqIdForOfferLocation) {
      this.toastr.warning(
        'Cost cannot be copied as the request offer(s) for the counterpaty ' +
        this.rowData.sellerCounterpartyName +
        ': ' +
        reqIdForOfferLocation
      );
      return;
    }

    if (reqIdForStemmedProduct) {
      this.toastr.warning(
        'Cost cannot be copied as the product(s) ' + reqIdForStemmedProduct
      );
      return;
    }

    if (this.copiedAdditionalCost.length) {
      this.copiedAdditionalCost.forEach(async cost => {
        // Check if selected cost type is equal with Unit
        if (cost?.costTypeId == 2) {
          await this.addPriceUomChangedForCopiedAdditionalCost(
            cost,
            cost.productList
          );
        } else {
          this.calculateAdditionalCostAmountsForCopiedAdditionalCost(
            cost,
            cost.productList,
            cost.rowData
          );
        }
      });
    } else {
      this.saveCopiedAdditionalCost();
    }
  }

  formatCopiedAdditionalCostForSpecificProduct(
    newCost,
    product,
    requestLocation,
    rowData
  ) {
    newCost.requestProductId = product.id;
    newCost.requestOfferIds = this.getRequestOfferIdsForCopyAdditionalCost(
      newCost.requestProductId,
      rowData
    );
    newCost.requestOfferId = parseInt(newCost.requestOfferIds);
    newCost.isAllProductsCost = false;
    const productDetails = this.getProductDetails(
      newCost.requestProductId,
      requestLocation,
      rowData
    );
    if (!productDetails.productList.length) {
      newCost.excludeCost = true;
    } else {
      newCost.productList = productDetails.productList;
      newCost.maxQuantity = productDetails.maxQty;
      newCost.maxQuantityUomId = productDetails.maxQtyUomId;
      this.checkIfLineIsApplicableToStemmedProductForCopiedAdditionalCost(
        newCost,
        requestLocation
      );
    }
  }

  checkIfLineIsApplicableToStemmedProductForCopiedAdditionalCost(
    additionalCost,
    selectedRequestLocation: any
  ) {
    let findProductIndex = _.findIndex(
      selectedRequestLocation.requestProducts,
      function (product: any) {
        return (
          product.id == additionalCost.requestProductId &&
          product.status == 'Stemmed'
        );
      }
    );
    if (findProductIndex != -1) {
      additionalCost.hasStemmedProduct = true;
    }
  }

  async addPriceUomChangedForCopiedAdditionalCost(additionalCost, productList) {
    if (!additionalCost.priceUomId) {
      return;
    }
    additionalCost.prodConv = _.cloneDeep([]);

    for (let i = 0; i < productList.length; i++) {
      let prod = productList[i];
      await this.setConvertedAddCostForCopiedAdditionalCost(
        prod,
        additionalCost,
        i,
        productList
      );
    }
  }

  async setConvertedAddCostForCopiedAdditionalCost(
    prod,
    additionalCost,
    i,
    productList
  ) {
    await this.getConvertedUOMForCopiedAdditionalCost(
      prod.productId,
      1,
      prod.uomId,
      additionalCost.priceUomId,
      additionalCost,
      i,
      productList
    );
  }

  async getConvertedUOMForCopiedAdditionalCost(
    productId,
    quantity,
    fromUomId,
    toUomId,
    additionalCost,
    i,
    productList
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
        this.calculateAdditionalCostAmountsForCopiedAdditionalCost(
          additionalCost,
          productList
        );
      }
    } else {
      this.endpointCount += 1;
      let response = await this.spotNegotiationService.getUomConversionFactor(payload)
      if (response != null) {
        this.endpointCount -= 1;
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          additionalCost.prodConv[i] = _.cloneDeep(response);
          if (
            additionalCost.priceUomId &&
            additionalCost.prodConv &&
            additionalCost.prodConv.length == productList.length
          ) {
            this.calculateAdditionalCostAmountsForCopiedAdditionalCost(
              additionalCost,
              productList
            );
          }
        }
      };
    }
  }

  /**
   * Calculates the amount-related fields of an additional cost, as per FSD p. 139: Amount, Extras Amount, Total Amount.
   */
  calculateAdditionalCostAmountsForCopiedAdditionalCost(
    additionalCost,
    productList: any[],
    rowData?: any
  ) {
    let totalAmount, productComponent;
    if (!additionalCost.costTypeId) {
      return additionalCost;
    }
    additionalCost.maxQuantity = 0;
    for (let i = 0; i < productList.length; i++) {
      let product = productList[i];
      if (additionalCost.isAllProductsCost || product.id == additionalCost.requestProductId
      ) {

        additionalCost.maxQuantity = additionalCost.maxQuantity + product.maxQuantity;
      }
    }
    if (additionalCost.price != null)
      additionalCost.price = additionalCost.price.toString().replace(/,/g, '');
    if (additionalCost.extras != null)
      additionalCost.extras = additionalCost.extras.toString().replace(/,/g, '');
    switch (additionalCost.costTypeId) {
      case COST_TYPE_IDS.FLAT:
        additionalCost.amount = parseFloat(additionalCost.price);
        additionalCost.amountIsCalculated = true;
        break;

      case COST_TYPE_IDS.UNIT:
        additionalCost.amount = 0;
        if (
          additionalCost.priceUomId &&
          additionalCost.prodConv &&
          additionalCost.prodConv.length == productList.length
        ) {
          for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
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
          additionalCost.amountIsCalculated = true;
        }
        break;

      case COST_TYPE_IDS.PERCENT:
        productComponent = this.isProductComponent(additionalCost);
        if (additionalCost.isAllProductsCost || !productComponent) {
          totalAmount = this.sumProductAmountsForCopiedAdditionalCost(
            rowData.requestOffers,
            productList
          );
        } else {
          let findProductIndex = _.findIndex(rowData.requestOffers, function (
            object: any
          ) {
            return object.requestProductId == additionalCost.requestProductId;
          });
          if (findProductIndex != -1) {
            let product = _.cloneDeep(rowData.requestOffers[findProductIndex]);
            let currentPrice = Number(product.price) * Number(product.exchangeRateToBaseCurrency);
            let findProduct = _.find(productList, function (item) {
              return item.id == product.requestProductId;
            });
            if (findProduct) {
              totalAmount = Number(currentPrice * findProduct.maxQuantity);
            }
          }
        }
        if (productComponent) {
          additionalCost.amount = (totalAmount * additionalCost.price) / 100;
        } else {
          additionalCost.amount =
            (totalAmount * parseFloat(additionalCost.price)) / 100;
        }
        additionalCost.amountIsCalculated = true;
        break;
      case COST_TYPE_IDS.RANGE:
      case COST_TYPE_IDS.TOTAL:
        additionalCost.amount = parseFloat(additionalCost.price) || 0;
        additionalCost.amountIsCalculated = true;
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
    this.changeDetectorRef.detectChanges();

    this.checkIfForAllCopiedAdditionalCostAmountIsCalculated();
  }

  recalculatePercentAdditionalCostForCopiedAdditionalCost(
    copiedAdditionalCost
  ) {
    for (let i = 0; i < copiedAdditionalCost.length; i++) {
      if (!copiedAdditionalCost[i].isDeleted) {
        //if (copiedAdditionalCost[i].costTypeId == COST_TYPE_IDS.PERCENT) {
        copiedAdditionalCost[i].totalAmount = 0;
        this.calculateAdditionalCostAmountsForCopiedAdditionalCostPercentType(
          copiedAdditionalCost[i],
          copiedAdditionalCost[i].productList,
          copiedAdditionalCost[i].rowData
        );
        //}
      }
    }
  }

  calculateAdditionalCostAmountsForCopiedAdditionalCostPercentType(
    additionalCost,
    productList: any[],
    rowData?: any
  ) {
    let totalAmount, productComponent;
    if (!additionalCost.costTypeId) {
      return additionalCost;
    }
    switch (additionalCost.costTypeId) {
      case COST_TYPE_IDS.PERCENT:
        productComponent = this.isProductComponent(additionalCost);
        if (additionalCost.isAllProductsCost || !productComponent) {
          totalAmount = this.sumProductAmountsForCopiedAdditionalCost(
            rowData.requestOffers,
            productList
          );
        } else {
          let findProductIndex = _.findIndex(rowData.requestOffers, function (
            object: any
          ) {
            return object.requestProductId == additionalCost.requestProductId;
          });
          if (findProductIndex != -1) {
            let product = _.cloneDeep(rowData.requestOffers[findProductIndex]);
            let currentPrice = Number(product.price) * Number(product.exchangeRateToBaseCurrency);
            let findProduct = _.find(productList, function (item) {
              return item.id == product.requestProductId;
            });
            if (findProduct) {
              totalAmount = Number(currentPrice * findProduct.maxQuantity);
            }
          }
        }
        if (productComponent) {
          additionalCost.amount = (totalAmount * additionalCost.price) / 100;
        } else {
          totalAmount =
            totalAmount +
            this.sumProductComponentAdditionalCostAmountsForCopiedAdditionalCost(
              this.copiedAdditionalCost
            );
          additionalCost.amount =
            (totalAmount * parseFloat(additionalCost.price)) / 100;
        }
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
  }

  /**
   * Sum the Amount field of all products.
   */
  sumProductAmountsForCopiedAdditionalCost(requestOffers, productList) {
    let result = 0;
    let newRequestOffers = _.cloneDeep(requestOffers);
    for (let i = 0; i < newRequestOffers.length; i++) {
      let currentPrice = Number(newRequestOffers[i].price) * Number(newRequestOffers[i].exchangeRateToBaseCurrency);
      let findProduct = _.find(productList, function (item: any) {
        return item.id == newRequestOffers[i].requestProductId;
      });
      if (findProduct) {
        result += Number(currentPrice * findProduct.maxQuantity);
      }
    }
    return result;
  }

  /**
   * Sum the amounts of all additional costs that are NOT tax component additional costs.
   */
  sumProductComponentAdditionalCostAmountsForCopiedAdditionalCost(
    copiedAdditionalCostList
  ) {
    let result = 0;
    if (!copiedAdditionalCostList.length) {
      return;
    }
    for (let i = 0; i < copiedAdditionalCostList.length; i++) {
      if (!copiedAdditionalCostList[i].isDeleted) {
        if (
          this.isProductComponent(copiedAdditionalCostList[i]) ||
          copiedAdditionalCostList[i].costTypeId !== COST_TYPE_IDS.PERCENT
        ) {
          result = result + copiedAdditionalCostList[i].totalAmount;
        }
      }
    }
    return result;
  }

  checkIfForAllCopiedAdditionalCostAmountIsCalculated() {
    let checkCopiedAdditionalCostRowIndex = _.findIndex(
      this.copiedAdditionalCost,
      function (obj: any) {
        return !obj.amountIsCalculated;
      }
    );

    if (this.endpointCount == 0 && checkCopiedAdditionalCostRowIndex == -1) {
      this.recalculatePercentAdditionalCostForCopiedAdditionalCost(
        this.copiedAdditionalCost
      );
      this.saveCopiedAdditionalCost();
    }
  }

  saveCopiedAdditionalCost() {
    let payload = {
      additionalCosts: this.offerAdditionalCostList
        .concat(this.locationAdditionalCostsList)
        .concat(this.copiedAdditionalCost)
    };

    this.saveButtonClicked = false;
    this.spotNegotiationService
      .saveOfferAdditionalCosts(payload)
      .subscribe((res: any) => {
        this.enableSave = false;
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res.status) {
          this.toastr.success('Additional cost copied successfully!');
        } else this.toastr.error('Please try again later.');
      });
  }

  checkNumberOfNotStemmedProduct(selectedRequestLocation: any) {
    let products = _.filter(selectedRequestLocation.requestProducts, function (
      product: any
    ) {
      return product.status !== 'Stemmed';
    });
    return products;
  }

  getProductDetails(
    requestProductId: any,
    selectedRequestLocation: any,
    rowData: any
  ) {
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
          let findRowDataOfferIndex = _.findIndex(
            rowData.requestOffers,
            function (object: any) {
              return object.requestProductId == product.id;
            }
          );
          if (findRowDataOfferIndex != -1) {
            totalMaxQuantity = totalMaxQuantity + product.maxQuantity;
            maxQuantityUomId = product.uomId;
            maxQuantityUom = product.uomName;
            productList.push(product);
          }
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

  getRequestOfferIdsForCopyAdditionalCost(selectedApplicableForId, rowData) {
    let requestOfferIds = [];

    if (selectedApplicableForId > 0) {
      let findIndex = _.findIndex(rowData.requestOffers, function (object: any) {
        return object.requestProductId == selectedApplicableForId;
      });
      if (findIndex !== -1) {
        requestOfferIds.push(rowData.requestOffers[findIndex].id);
      }
    } else {
      for (let i = 0; i < rowData.requestOffers.length; i++) {
        requestOfferIds.push(rowData.requestOffers[i].id);
      }
    }
    return requestOfferIds.join(',');
  }

  updateCopiedAdditionalCostToStore(rowData) {
    var updatedRow = { ...rowData };
    let groupId = updatedRow.requestGroupId;
    let requestLocationSellerId = updatedRow.id;
    this.spotNegotiationService
      .getPriceDetailsById(groupId, requestLocationSellerId)
      .subscribe(async (priceDetailsRes: any) => {
        let requests = this.store.selectSnapshot<any>((state: any) => {
          return state['spotNegotiation'].requests;
        });
        let requestProducts = requests.find(x => x.id == updatedRow.requestId)?.requestLocations?.find(l => l.id == updatedRow.requestLocationId)?.requestProducts;
        updatedRow.totalOffer = priceDetailsRes.sellerOffers[0].totalOffer;

        updatedRow.totalCost = priceDetailsRes.sellerOffers[0].totalCost;
        updatedRow.requestOffers = priceDetailsRes.sellerOffers[0].requestOffers;
        updatedRow.requestAdditionalCosts = priceDetailsRes.sellerOffers[0].requestAdditionalCosts;
        updatedRow.requestOffers = updatedRow.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
          let requestProductTypeOrderBy = requestProducts?.find(rp => rp.id == e.requestProductId)?.productTypeOrderBy;
          return { ...e, reqProdStatus: isStemmed, requestProductTypeOrderBy: requestProductTypeOrderBy };
        });
        updatedRow.hasAnyProductStemmed = updatedRow.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        updatedRow.isOfferConfirmed = updatedRow.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        updatedRow.requestOffers = updatedRow.requestOffers?.sort((a, b) =>
          a.requestProductTypeOrderBy === b.requestProductTypeOrderBy
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeOrderBy > b.requestProductTypeOrderBy
              ? 1
              : -1);
        var locRow = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
          updatedRow,
          updatedRow
        );
        // Update the store
        this.store.dispatch(new EditLocationRow(locRow));
        this.spotNegotiationService.callGridRedrawService();
      });
  }
}
