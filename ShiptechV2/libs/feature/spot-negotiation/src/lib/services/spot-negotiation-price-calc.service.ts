import { isNumeric } from 'rxjs/internal-compatibility';
import { Injectable, OnDestroy } from '@angular/core';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { Store } from '@ngxs/store';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import _ from 'lodash';
import { SpotNegotiationService } from './spot-negotiation.service';
import { EditLocationRow, UpdateRequest } from '../store/actions/ag-grid-row.action';

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

@Injectable()
export class SpotNegotiationPriceCalcService extends BaseStoreService
  implements OnDestroy {
  additionalCostTypes: any = [];
  notPercentageLocationCostRows: any[];
  notAllSelectedCostRows: any[];
  applicableForItems: any[];
  endpointCount: number = 0;
  locations: any;


  constructor(
    protected store: Store,
    private urlService: UrlService,
    private router: Router,
    loggerFactory: ModuleLoggerFactory,
    private spotNegotiationService: SpotNegotiationService
  ) {
    super(store, loggerFactory.createLogger(SpotNegotiationPriceCalcService.name));
  }

  calculateAdditionalCostAmounts(
    additionalCost,
    locationAdditionalCostFlag,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    index,
    requestLocation
  ) {
    let totalAmount, productComponent;
    if (!additionalCost.costTypeId) {
      return additionalCost;
    }
    switch (additionalCost.costTypeId) {
      case COST_TYPE_IDS.FLAT:
        additionalCost.amount = parseFloat(additionalCost.price);
        productComponent = this.isProductComponent(additionalCost);
        if (!locationAdditionalCostFlag) {
          offerAdditionalCostList[index].amountIsCalculated = true;
        }
        break;

      case COST_TYPE_IDS.UNIT:
        additionalCost.amount = 0;
        productComponent = this.isProductComponent(additionalCost);
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
          if (!locationAdditionalCostFlag) {
            offerAdditionalCostList[index].amountIsCalculated = true;
          }
        }
        break;

      case COST_TYPE_IDS.PERCENT:
        productComponent = this.isProductComponent(additionalCost);
        if (additionalCost.isAllProductsCost || !productComponent) {
          totalAmount = this.sumProductAmounts(
            rowData,
            rowData.requestOffers,
            requestLocation
          );
        } else {
          let findProductIndex = _.findIndex(rowData.requestOffers, function (
            object: any
          ) {
            return object.requestProductId == additionalCost.requestProductId;
          });
          if (findProductIndex != -1) {
            let product = _.cloneDeep(rowData.requestOffers[findProductIndex]);
            let currentPrice = Number(product.price);
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
          if (!locationAdditionalCostFlag) {
            totalAmount =
              totalAmount +
              this.sumProductComponentAdditionalCostAmounts(
                offerAdditionalCostList
              );
          }

          additionalCost.amount =
            (totalAmount * parseFloat(additionalCost.price)) / 100;
        }
        if (!locationAdditionalCostFlag) {
          offerAdditionalCostList[index].amountIsCalculated = true;
        } else {
          locationAdditionalCostsList[index].amountIsCalculated = true;
        }
        break;
      case COST_TYPE_IDS.RANGE:
      case COST_TYPE_IDS.TOTAL:
        additionalCost.amount = parseFloat(additionalCost.price) || 0;
        if (!locationAdditionalCostFlag) {
          offerAdditionalCostList[index].amountIsCalculated = true;
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
      (additionalCost.totalAmount * additionalCost.exchangeRateToBaseCurrency) / additionalCost.maxQuantity;
    if (additionalCost.isAllProductsCost || !productComponent) {
      rowData.requestOffers.forEach(reqOff => {
        if(additionalCost.isAllProductsCost || reqOff.requestProductId == additionalCost.requestProductId){
          reqOff.cost = reqOff.cost + additionalCost.ratePerUom;
        }
      });
    }
    else {
      let findProductIndex = _.findIndex(rowData.requestOffers, function (
        object: any
      ) {
        return object.requestProductId == additionalCost.requestProductId;
      });
      if (findProductIndex != -1) {
        rowData.requestOffers[findProductIndex].cost = rowData.requestOffers[findProductIndex].cost + additionalCost.ratePerUom;
      }
    }

    if (isNaN(additionalCost.ratePerUom)) {
      additionalCost.ratePerUom = null;
    }

  }
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
  sumProductAmounts(rowData, products, requestLocation) {
    let result = 0;
    let newProducts = _.cloneDeep(products);
    let productList = [];
    requestLocation.requestProducts.forEach((product: any, index) => {
      //if (product.status != 'Stemmed') {
        let findRowDataOfferIndex = _.findIndex(rowData.requestOffers, function (
          object: any
        ) {
          return object.requestProductId == product.id && object.price;
        });
        if (findRowDataOfferIndex != -1) {
          productList.push(product);
        }
     // }
    });
    for (let i = 0; i < newProducts.length; i++) {
      let currentPrice = Number(newProducts[i].price);
      let findProduct = _.find(productList, function (item) {
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

  async recalculateLocationAdditionalCosts(
    additionalCostList,
    locationAdditionalCostFlag,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    totalMaxQuantity,
    maxQuantityUomId,
    requestLocation
  ) {
    for (let i = 0; i < additionalCostList.length; i++) {
      if (!additionalCostList[i].isDeleted) {
        additionalCostList[i].totalAmount = 0;
        let cost = additionalCostList[i];

        if (additionalCostList[i].isAllProductsCost) {

          this.onApplicableForChange(
            cost,
            rowData,
            totalMaxQuantity,
            maxQuantityUomId
          );


        }
        await this.additionalCostNameChanged(
          cost,
          additionalCostList,
          productList,
          rowData,
          locationAdditionalCostsList,
          i,
          requestLocation
        );
        // else {
        //   this.calculateAdditionalCostAmounts(
        //     additionalCostList[i],
        //     locationAdditionalCostFlag,
        //     productList,
        //     offerAdditionalCostList,
        //     rowData,
        //     locationAdditionalCostsList,
        //     i
        //   );
        // }

      }
    }
  }

  async checkAdditionalCost(
    sellOffs,
    updatedRow
  ) : Promise<any> {
    let sellerOffers =  _.cloneDeep(sellOffs);
    if(sellerOffers.requestOffers){
      let offerAdditionCostsList = [];
      let locAdditionCostsList = [];
      let request : any;
      this.locations = this.store.selectSnapshot<any>((state: any) => {
        return state.spotNegotiation.locations;
      });
      request = this.store.selectSnapshot<any>((state: any) => {
        return state.spotNegotiation.requests?.find(r => r.id == sellerOffers.requestId);;
      });

      let requestLocationId = sellerOffers.requestLocationId;
      let findRequestLocationIndex = _.findIndex(
        request?.requestLocations,
        function (object: any) {
          return object.id == requestLocationId;
        }
      );
      if (findRequestLocationIndex != -1) {
        let requestLocation = request?.requestLocations[
          findRequestLocationIndex
        ];
        locAdditionCostsList = _.cloneDeep(requestLocation?.requestAdditionalCosts);
        offerAdditionCostsList = _.cloneDeep(sellerOffers?.requestAdditionalCosts);
        // const payload = {
        //   offerId: sellerOffers.requestOffers[0].offerId,
        //   requestLocationId: sellerOffers.requestLocationId,
        //   isLocationBased: false
        // };
        this.notPercentageLocationCostRows = [];
        this.notAllSelectedCostRows = [];
        this.createAdditionalCostTypes();
        // let response = await this.spotNegotiationService
        //   .getAdditionalCosts(payload)
        //   //.subscribe((response: any) =>
        //   if(response!= null){
        //     if (response?.message == 'Unauthorized') {
        //       return;
        //     }
        //     if (typeof response === 'string') {
        //       // this.getSellerLine(updatedRow, colDef, newValue, elementidValue);
        //       return;
        //     } else {
              // offerAdditionCostsList = response.offerAdditionalCosts;
              // locAdditionCostsList = response.locationAdditionalCosts;
              let {
                productList,
                reqProList,
                applicableForItems,
                totalMaxQuantity,
                maxQuantityUomId
              } = this.buildApplicableForItems(requestLocation, sellerOffers);
              if (
                offerAdditionCostsList.length > 0 ||
                locAdditionCostsList.length > 0
              ) {

                sellerOffers.requestOffers.forEach(reqOff => {
                  reqOff.cost = 0;
                });
                this.recalculateLocationAdditionalCosts(
                  locAdditionCostsList,
                  true,
                  productList,
                  offerAdditionCostsList,
                  sellerOffers,
                  locAdditionCostsList,
                  totalMaxQuantity,
                  maxQuantityUomId,
                  requestLocation
                );


                for (let i = 0; i < offerAdditionCostsList.length; i++) {
                  let cost = offerAdditionCostsList[i];
                  if (offerAdditionCostsList[i].isAllProductsCost) {
                    this.onApplicableForChange(
                      cost,
                      sellerOffers,
                      totalMaxQuantity,
                      maxQuantityUomId
                    );

                  }
                  await this.additionalCostNameChanged(
                    cost,
                    offerAdditionCostsList,
                    productList,
                    sellerOffers,
                    locAdditionCostsList,
                    i,
                    requestLocation
                  );
                  // else {
                  //   offerAdditionCostsList[i].totalAmount = 0;
                  //   this.calculateAdditionalCostAmounts(
                  //     offerAdditionCostsList[i],
                  //     false,
                  //     productList,
                  //     offerAdditionCostsList,
                  //     sellerOffers,
                  //     locAdditionCostsList,
                  //     i
                  //   );
                  // }
                }
              }
              let totalOffer = 0;
              let totalCost = 0
              reqProList.forEach(pro => {
                sellerOffers.requestOffers.forEach(reqOff => {
                    if (reqOff.requestProductId == pro.id) {
                      reqOff.totalPrice = (reqOff.price * reqOff.exchangeRateToBaseCurrency) + reqOff.cost;
                      reqOff.amount = reqOff.totalPrice * pro.maxQuantity;
                      // Target Difference = Total Price - Target Price
                      reqOff.targetDifference = reqOff.totalPrice ? reqOff.totalPrice - (pro.requestGroupProducts
                        ? pro.requestGroupProducts.targetPrice
                        : 0): null;
                      totalOffer += reqOff.amount;
                      totalCost += reqOff.cost;
                      reqOff.targetDifference = pro.requestGroupProducts.targetPrice == 0
                          ? 0
                          : reqOff.targetDifference;
                    }
                  });
                });
                sellerOffers.totalOffer = totalOffer;
                sellerOffers.totalCost = totalCost;
          //   }
          // }
          //});
      }
    }
  return sellerOffers;
  }

  getSellerLine(sellerOffers, colDef, newValue, elementidValue) {
    const requestLocationSellerId = sellerOffers.id;
    let updatedRow = { ...sellerOffers };
    const currentLocation = this.locations.find(
      e => e.locationId === updatedRow.locationId
    );

    //Do the calculation here
    updatedRow = this.spotNegotiationService.formatRowData(
      updatedRow,
      colDef['product'],
      colDef.field,
      newValue,
      currentLocation,
      false,
      null
    );

    // Save to the cloud
    this.saveRowToCloud(updatedRow, colDef['product'], elementidValue);
  }
  saveRowToCloud(updatedRow, product, elementidValue) {
    const productDetails = this.spotNegotiationService.getRowProductDetails(
      updatedRow,
      product.id
    );

    if (productDetails.id == null || productDetails.price == null) {
      return;
    }

    let reqs = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });

    const payload = {
      RequestLocationSellerId: updatedRow.id,
      Offers: [
        {
          id: productDetails.offerId,
          totalOffer: updatedRow.totalOffer,
          totalCost: updatedRow.totalCost,
          requestOffers: [
            {
              id: productDetails.id,
              totalPrice: productDetails.totalPrice,
              amount: productDetails.amount,
              targetDifference: productDetails.targetDifference,
              price: productDetails.price,
              currencyId: productDetails.currencyId,
              cost: productDetails.cost,
              isOfferPriceCopied: productDetails.isOfferPriceCopied
            }
          ]
        }
      ]
    };
    //this.gridOptions_counterparty.api.showLoadingOverlay();
    const response = this.spotNegotiationService.updatePrices(payload);
    response.subscribe((res: any) => {
      //this.gridOptions_counterparty.api.hideOverlay();
      if (res?.message == 'Unauthorized') {
        return;
      }
      if (res.status) {
        //this.toastr.success('Price update successful.');

        //var params = { force: true };
        setTimeout(() => {
          //this.gridOptions_counterparty.api?.refreshCells(params);
          setTimeout(() => {
            let element = document.getElementById(elementidValue);
            if (element) {
              //this.moveCursorToEnd(element);
            }
          }, 1000);
        });

        reqs = reqs.map(e => {
          let requestLocations = e.requestLocations.map(reqLoc => {
            let requestProducts = reqLoc.requestProducts.map(reqPro =>
              productDetails.requestProductId == reqPro.id &&
              reqPro.status.toLowerCase() == 'inquired'
                ? { ...reqPro, status: 'Quoted' }
                : reqPro
            );

            return { ...reqLoc, requestProducts };
          });
          return { ...e, requestLocations };
        });
        // Update the store
        this.store.dispatch([new EditLocationRow(updatedRow), new UpdateRequest(reqs)]);
      } else {
        //this.toastr.error(res.message);
        return;
      }
    });
  }
  createAdditionalCostTypes() {
    const additionalCostList = this.store.selectSnapshot<any>(
      (state: any) => state.spotNegotiation.additionalCostList
    );
    for (let i = 0; i < additionalCostList.length; i++) {
      if (
        typeof this.additionalCostTypes[additionalCostList[i].id] ==
        'undefined'
      ) {
        this.additionalCostTypes[additionalCostList[i].id] = [];
      }
      this.additionalCostTypes[
        additionalCostList[i].id
      ] = additionalCostList[i];
    }
  }

  /**
* Create Applicable For dropdown values
*/

  buildApplicableForItems(requestLocation, rowData) {
    let applicableForItems = [];
    let productList = [];
    let reqProList = [];
    let applicableForItemsArray = [];
    let totalMaxQuantity = 0;
    let maxQuantityUomId = null;
    requestLocation.requestProducts.forEach((product: any, index) => {
        let findRowDataOfferIndex = _.findIndex(rowData.requestOffers, function (
          object: any
        ) {
          return object.requestProductId == product.id && isNumeric(object.price);
        });
        if (findRowDataOfferIndex != -1) {
          applicableForItemsArray.push({
            id: product.id,
            name: product.productName,
            productId: product.productId
          });

          totalMaxQuantity = totalMaxQuantity + product.maxQuantity;
          maxQuantityUomId = product.uomId;
        if (product.status != 'Stemmed') {
          productList.push(product);
        }
          reqProList.push(product);
        }
    });
    if (applicableForItemsArray.length > 1) {
      const allElement = { id: 0, name: 'All' };
      applicableForItems = _.cloneDeep(
        [allElement].concat(applicableForItemsArray)
      );
    } else {
      this.applicableForItems = _.cloneDeep(applicableForItemsArray);
    }

    return {
      productList: productList,
      reqProList: reqProList,
      applicableForItems: applicableForItems,
      totalMaxQuantity,
      maxQuantityUomId
    };
  }
  onApplicableForChange(cost, rowData, totalMaxQuantity, maxQuantityUomId) {
    cost.requestOfferIds = this.getRequestOfferIds(rowData);
    cost.currencyId = this.getCurrencyId(rowData);

    cost.maxQuantity = totalMaxQuantity;
    cost.maxQuantityUomId = maxQuantityUomId;
  }
  getRequestOfferIds(rowData) {
    let requestOfferIds = [];
    for (let i = 0; i < rowData.requestOffers.length; i++) {
      requestOfferIds.push(rowData.requestOffers[i].id);
    }

    return requestOfferIds.join(',');
  }
  getCurrencyId(rowData) {
    return rowData.requestOffers[0].currencyId;
  }
  async additionalCostNameChanged(
    additionalCost,
    offerAdditionalCostList,
    productList,
    rowData,
    locationAdditionalCostsList,
    index,
    requestLocation
  ) {
    if (additionalCost.costTypeId == 2) {
      await this.addPriceUomChanged(
        additionalCost,
        productList,
        offerAdditionalCostList,
        rowData,
        locationAdditionalCostsList,
        index,
        requestLocation
      );
    } else {
      this.calculateAdditionalCostAmounts(
        additionalCost,
        false,
        productList,
        offerAdditionalCostList,
        rowData,
        locationAdditionalCostsList,
        index,
        requestLocation
      );
    }
  }
  // getSellerLine(sellerOffers, colDef, newValue, elementidValue) {
  //     const requestLocationSellerId = sellerOffers.id;
  //     let updatedRow = { ...sellerOffers };
  //         const currentLocation = this.locations.find(
  //           e => e.locationId === updatedRow.locationId
  //         );

  //         //Do the calculation here
  //         updatedRow = this.spotNegotiationService.formatRowData(
  //           updatedRow,
  //           colDef['product'],
  //           colDef.field,
  //           newValue,
  //           currentLocation,
  //           false,
  //           null
  //         );

  //         // Save to the cloud
  //         this.saveRowToCloud(updatedRow, colDef['product'], elementidValue);
  //   }
  async addPriceUomChanged(
    additionalCost,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    index,
    requestLocation
  ) {
    if (!additionalCost.priceUomId) {
      return;
    }
    additionalCost.prodConv = _.cloneDeep([]);

    for (let i = 0; i < productList.length; i++) {
      let prod = productList[i];
      await this.setConvertedAddCost(
        prod,
        additionalCost,
        i,
        productList,
        offerAdditionalCostList,
        rowData,
        locationAdditionalCostsList,
        index,
        requestLocation
      );
    }
  }

  async setConvertedAddCost(
    prod,
    additionalCost,
    i,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    index,
    requestLocation
  ) {
    await this.getConvertedUOM(
      prod.productId,
      1,
      prod.uomId,
      additionalCost.priceUomId,
      additionalCost,
      i,
      productList,
      offerAdditionalCostList,
      rowData,
      locationAdditionalCostsList,
      index,
      requestLocation
    );
  }

  async getConvertedUOM(
    productId,
    quantity,
    fromUomId,
    toUomId,
    additionalCost,
    i,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    index,
    requestLocation
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
        this.calculateAdditionalCostAmounts(
          additionalCost,
          false,
          productList,
          offerAdditionalCostList,
          rowData,
          locationAdditionalCostsList,
          index,
          requestLocation
        );
      }
    } else {
      this.endpointCount += 1;
      let response= await this.spotNegotiationService.getUomConversionFactor(payload);
      if(response != null){
        this.endpointCount -= 1;
        if (response?.message == 'Unauthorized') {
          return;
        }
        if (typeof response == 'string') {
          //this.toastr.error(result);
        } else {
          additionalCost.prodConv[i] = _.cloneDeep(response);
          if (
            additionalCost.priceUomId &&
            additionalCost.prodConv &&
            additionalCost.prodConv.length == productList.length
          ) {
            this.calculateAdditionalCostAmounts(
              additionalCost,
              false,
              productList,
              offerAdditionalCostList,
              rowData,
              locationAdditionalCostsList,
              index,
              requestLocation
            );
          }
        }
      }
    }
  }


  ngOnDestroy(): void {
    super.onDestroy();
  }
}
