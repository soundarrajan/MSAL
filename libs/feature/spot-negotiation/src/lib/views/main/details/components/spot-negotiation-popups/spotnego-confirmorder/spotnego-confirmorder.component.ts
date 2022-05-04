import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from '../../../../../../../../../spot-negotiation/src/lib/services/spot-negotiation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServerQueryFilter } from '@shiptech/core/grid/server-grid/server-query.filter';
import { AgGridDatetimePickerToggleComponent } from 'libs/feature/spot-negotiation/src/lib/core/ag-grid/ag-grid-datetimePicker-Toggle';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { AppConfig } from '@shiptech/core/config/app-config';
import { KeyValue } from '@angular/common';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { SetLocationsRows } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';
import { MyMonitoringService } from '@shiptech/core/services/app-insights/logging.service';
import { SpotNegotiationPriceCalcService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation-price-calc.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';

@Component({
  selector: 'app-spotnego-confirmorder',
  templateUrl: './spotnego-confirmorder.component.html',
  styleUrls: ['./spotnego-confirmorder.component.css']
})
export class SpotnegoConfirmorderComponent implements OnInit {
  disableScrollDown = false;
  public showaddbtn = true;
  isShown: boolean = true; // hidden by default
  isBtnActive: boolean = false;
  buttonsDisabled: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;
  requests: any = [];
  requestByLocation:any=[];
  requestOfferItems: any = [];
  selectedOffers: any = [];
  currentRequestInfo: any = [];
  tenantConfiguration: any;
  responseOrderData: any;
  currencyList: any;
  productList: any = [];
  inactiveList: any = [];
  uomList: any;
  errorMessages: string;
  staticLists: any;
  FreezeMarketPricesPayload:any;
  constructor(
    public dialogRef: MatDialogRef<SpotnegoConfirmorderComponent>,
    private store: Store,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private spotNegotiationService: SpotNegotiationService,
    private spotNegotiationPriceCalcService: SpotNegotiationPriceCalcService,
    private urlService: UrlService,
    public appConfig: AppConfig,
    public format: TenantFormattingService,
    private myMonitoringService: MyMonitoringService,
    private route: ActivatedRoute,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;

  getRequests() {
    this.requests = this.store.selectSnapshot<string>((state: any) => {
      return state.spotNegotiation.requests;
    });
  }
  ngOnInit(): void {
    // this.scrollToBottom();
    this.legacyLookupsDatabase.getTableByName('currency').then(response => {
      this.currencyList = response;
    });
    this.legacyLookupsDatabase.getTableByName('product').then(response => {
      this.productList = response;
    });
    // this.legacyLookupsDatabase.getTableByName('inactiveProducts').then(response => {
    //   this.inactiveList = response;
    //   this.productList = this.productList.concat(this.inactiveList);
    // });
    this.legacyLookupsDatabase.getTableByName('uom').then(response => {
      this.uomList = response;
    });
    this.getRequests();
    this.getSelectedLocationRowsForLocation();
  }
  openEditOrder(orderId: number): void {
    window.open(
      this.urlService.editOrder(orderId),
      this.appConfig.openLinksInNewTab ? '_blank' : '_self'
    );
  }
  //popup grid data fill the value's..
  getSelectedLocationRowsForLocation() {
    this.currentRequestInfo[0] = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.currentRequestSmallInfo;
    });
    this.tenantConfiguration = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.tenantConfigurations;
    });
    this.staticLists = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.staticLists;
    });
    this.currencyList = this.staticLists['currency'];
    this.productList = this.staticLists['product'];
    // this.inactiveList = this.staticLists['inactiveProducts'];
    this.productList = this.productList.concat(this.inactiveList);
    this.uomList = this.staticLists['uom'];
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    const locations = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });
    if (!locationsRows) {
      return [];
    }

    var requestOfferItemPayload = [];
    this.requests.forEach(req => {
      req.requestLocations.forEach(element => {
        locationsRows.forEach(element1 => {
          if (
            element.id == element1.requestLocationId &&
            element1.requestOffers != undefined
          ) {
            //&& element1.locationId==locationId
            if (element1.checkProd1) {
              var reqProdId = element.requestProducts[0].id;
              requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
                element1,
                element1.requestOffers?.find(
                  ro => ro.requestProductId == reqProdId
                ),
                element.requestProducts[0],
                element.eta,
                req
              );
              if (requestOfferItemPayload.length > 0) {
                this.requestOfferItems.push(requestOfferItemPayload[0]);
              }
            }
            if (element1.checkProd2) {
              var reqProdId = element.requestProducts[1].id;
              requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
                element1,
                element1.requestOffers?.find(
                  ro => ro.requestProductId == reqProdId
                ),
                element.requestProducts[1],
                element.eta,
                req
              );
              if (requestOfferItemPayload.length > 0) {
                this.requestOfferItems.push(requestOfferItemPayload[0]);
              }
            }
            if (element1.checkProd3) {
              var reqProdId = element.requestProducts[2].id;
              requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
                element1,
                element1.requestOffers?.find(
                  ro => ro.requestProductId == reqProdId
                ),
                element.requestProducts[2],
                element.eta,
                req
              );
              if (requestOfferItemPayload.length > 0) {
                this.requestOfferItems.push(requestOfferItemPayload[0]);
              }
            }
            if (element1.checkProd4) {
              var reqProdId = element.requestProducts[3].id;
              requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
                element1,
                element1.requestOffers?.find(
                  ro => ro.requestProductId == reqProdId
                ),
                element.requestProducts[3],
                element.eta,
                req
              );
              if (requestOfferItemPayload.length > 0) {
                this.requestOfferItems.push(requestOfferItemPayload[0]);
              }
            }
            if (element1.checkProd5) {
              var reqProdId = element.requestProducts[4].id;
              requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
                element1,
                element1.requestOffers?.find(
                  ro => ro.requestProductId == reqProdId
                ),
                element.requestProducts[4],
                element.eta,
                req
              );
              if (requestOfferItemPayload.length > 0) {
                this.requestOfferItems.push(requestOfferItemPayload[0]);
              }
            }
          }
        });
      });
    });
    locations.forEach((ele, key) => {
      ele.requestProducts.forEach(product => {
        const offerProducts = this.requestOfferItems.filter(
          e =>
            e.RequestLocationId === ele.id && e.RequestProductId == product.id
        );
        if (offerProducts.length > 1) {
          this.requestOfferItems = [];
          this.toaster.error(
            'Only 1 offer price can be confirmed for a requested product.'
          );
          this.closeDialog();
          return;
        }
      });
    });
    this.requests.map(e => {
      let requestLocations=[];
      let reqs;
      this.requestOfferItems.forEach(row => {
        if(e.requestLocations.filter(reqLoc =>reqLoc.id==row.RequestLocationId && e.id==row.RequestId).length>0  && requestLocations?.filter(reqLoc =>reqLoc.id==row.RequestLocationId && e.id==row.RequestId).length==0){          
          requestLocations.push(e.requestLocations.find(reqLoc =>reqLoc.id==row.RequestLocationId ));
          reqs=e;           
        }
      });
      if(reqs!=undefined && requestLocations.length>0){
        this.requestByLocation.push({...reqs, requestLocations});
      }  
    });     
    return this.requestOfferItems;
  }

  //Construct UI Value's to bind the popup grid
  ConstructRequestOfferItemPayload(
    seller,
    requestOffer,
    requestProducts,
    etaDate,
    requestInfo
  ) {
    return [
      {
        RequestId: requestInfo.id, //Single request pass
        RequestGroupId: seller.requestGroupId,
        RequestSellerId: seller.id,
        SellerId: seller.sellerCounterpartyId,
        SellerName: seller.sellerCounterpartyName,
        LocationId: seller.locationId,
        RequestLocationId: seller.requestLocationId,
        PhysicalSupplierCounterpartyId: seller.physicalSupplierCounterpartyId,
        PhysicalSupplierName: seller.physicalSupplierCounterpartyName,
        RequestProductId: requestProducts.id,
        ProductId: requestOffer.quotedProductId ?? requestProducts.productId,
        ProductName: this.productList.find(
          x => x.id == requestOffer.quotedProductId ?? requestProducts.productId
        ).name,
        minQuantity: requestProducts.minQuantity,
        MaxQuantity: this.format.quantity(requestProducts.maxQuantity), //this.format.quantity(requestOffers.supplyQuantity)??
        ConfirmedQuantity:
          this.format.quantity(requestOffer.supplyQuantity) ??
          this.format.quantity(requestProducts.maxQuantity),
        UomId: requestProducts.uomId,
        WorkflowId: requestProducts.workflowId,
        productStatus: {
          id: requestProducts.statusId,
          name: requestProducts.status
        },
        vesselETA: etaDate,
        RequestStatus: requestInfo.status,
        VesselId: requestInfo.vesselId,
        VesselVoyageDetailId: null,
        UomName: this.uomList.find(x => x.id == requestProducts.uomId).name,
        OfferPrice: requestOffer.price,
        ContactCounterpartyId: requestOffer.contactCounterpartyId,
        BrokerCounterpartyId: requestOffer.brokerCounterpartyId,
        currencyId:
          requestOffer.currencyId ?? this.tenantConfiguration.currencyId,
        currencyName: this.currencyList.find(
          x =>
            x.id == requestOffer.currencyId ??
            this.tenantConfiguration.currencyId
        ).code,
        PricingTypeId: requestProducts.uomId,
        QuoteByDate: requestOffer.quoteByDate,
        QuoteByTimeZoneId: requestOffer.quoteByTimeZoneId,
        QuoteByCurrencyId: requestOffer.currencyId,
        ProductTypeId: 1,
        //need to check this value
        productHasOffer: true,
        productHasPrice: true,
        productHasRFQ: true,
        UniqueLocationSellerPhysical: '1000-902-null',
        rowLocationSellerPhysical: '1000-902-null-individual-null',
        randUniquePkg: '902-null-individual-null',
        isClonedSeller: false,
        productAllowZeroPricing: false,
        ProductTypeGroupId: 1,
        QuotedProductGroupId: 1,
        isCheckBox: true,
        //End
        Amount:
          requestOffer.amount * (requestOffer.exchangeRateToBaseCurrency ?? 1),
        RequestOfferId: requestOffer.id,
        RfqId: requestOffer.rfqId,
        OrderFields: {
          ConfirmedQuantity:
          this.format.quantity(requestOffer.supplyQuantity) ??
          this.format.quantity(requestProducts.maxQuantity)
        },
        ClosurePrice: requestProducts.requestGroupProducts.closurePrice,
        BestContract: requestProducts.requestGroupProducts.bestContract,
        BestContractId: requestProducts.requestGroupProducts.bestContractId,
        BenchMark: requestProducts.requestGroupProducts.benchMark,
        ClosureDate: requestProducts.requestGroupProducts.closureDate
      }
    ];
  }

  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => 0;

  //Calculate TatalPrice - Not used onblur method confirm qty
  totalprice(rowIndex) {
    const currentRowIndex = rowIndex;
    const offers = this.requestOfferItems[currentRowIndex];
    if (
      offers.ConfirmedQuantity != 'undefined' &&
      offers.OfferPrice != 'undefined'
    ) {
      // this.requestOfferItems[currentRowIndex].TotalPrice = this.format.quantity(
      //   offers.OfferPrice * offers.ConfirmedQuantity
      // );
      this.requestOfferItems[
        currentRowIndex
      ].ConfirmedQuantity = this.format.quantity(offers.ConfirmedQuantity);
      this.requestOfferItems[currentRowIndex].OrderFields = {
        ConfirmedQuantity: this.format.quantity(offers.ConfirmedQuantity)
      };
    }
    return this.requestOfferItems;
  }
  //popup all select/deselct
  onConfirmOfferALLCheckboxChange(ev, req, requestoffer) {
    if (ev.checked) {
      requestoffer.forEach((v, k) => {
        if (v.RequestId == req.id) {
          v.isCheckBox = true;
        }
      });
    } else {
      requestoffer.forEach((v, k) => {
        if (v.RequestId == req.id) {
          v.isCheckBox = false;
        }
      });
    }
    return requestoffer;
  }
  //popup single select/deselct
  onConfirmOfferCheckboxChange(ev, requestoffer) {
    if (ev.checked) {
      requestoffer.isCheckBox = true;
    } else {
      requestoffer.isCheckBox = false;
    }
    return requestoffer;
  }
  closeDialog() {
    this.dialogRef.close();
  }
  confirmOffers(shouldValidate) {
    let RequestProductIds = [];
    let errorMessages = [];
    let filters: ServerQueryFilter[] = [];
    this.requestOfferItems.forEach((itemVal, itemKey) => {
      if (itemVal.isCheckBox) {
        RequestProductIds.push(itemVal.RequestProductId);
        this.selectedOffers.push(itemVal);
      }
    });
    //add/modifiy market prices
    this.FreezeMarketPricesPayload = {
      FreezePriceRequests: this.productPricePayload(
        this.selectedOffers
      )
    };
    if (RequestProductIds.length > 0) {
      filters = [
        {
          columnName: 'RequestProductIds',
          value: '[' + RequestProductIds.join(',') + ']'
        }
      ];
    } else {
      this.toaster.warning('Please select at least one products');
      return;
    }
    let payload = {
      filters
    };
    this.selectedOffers.forEach((va, k) => {
      if (
        va.OfferPrice == null ||
        va.OfferPrice == undefined
      ) {
        this.toaster.error('Cannot confirm offer as no offer price available');
        return;
      }
    });
    //this.setConfirmedQuantities();
    // if ((this.selectedOffers, 'quotedProductGroupId').length != 1) {
    //   this.buttonsDisabled = false;
    //   this.toaster.error('Product types from different groups cannot be stemmed in one order. Please select the products with same group to proceed');
    //   return;
    // }

    // requestProductIdsForOrder = [];
    // $.each(ctrl.requirements, function(rqK, rqV) {
    //     requestProductIdsForOrder.push(rqV.RequestProductId);
    // })
    let foundRelatedOrder;
    this.buttonsDisabled = true;

    (<any>window).startConfirmOfferTime = Date.now();

    const response = this.spotNegotiationService.GetExistingOrders(payload);
    response.subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res?.message == 'Unauthorized') {
          return;
        }
        let productsWithErrors = [];
        let errorMessages = [];
        this.selectedOffers.forEach((rqV, rqK) => {
          let hasOrder = false;
          let hasError = false;
          if (res.payload.length > 0) {
            this.responseOrderData = res.payload;
            this.responseOrderData.forEach((rodV, rodK) => {
              hasError = false;
              rodV.products.forEach((rodProdV, rodProdK) => {
                if (rodV.requestLocationId == rqV.RequestLocationId) {
                  //&& rodProdV.requestProductId == rqV.RequestProductId
                  hasOrder = true;
                  let errorType = [];
                  if (rodV.seller.id != rqV.SellerId) {
                    if (
                      productsWithErrors.indexOf(rqV.RequestProductId) == -1
                    ) {
                      productsWithErrors.push(rqV.RequestProductId);
                      hasError = true;
                      errorType.push('Seller');
                    }
                  }
                  if (rodProdV.currency.id != rqV.currencyId) {
                    if (
                      productsWithErrors.indexOf(rqV.RequestProductId) == -1
                    ) {
                      productsWithErrors.push(rqV.RequestProductId);
                      hasError = true;
                      errorType.push('Currency');
                    }
                  }
                  let etasDifference = rqV.vesselETA - rodV.orderEta;
                  if (
                    etasDifference > 259200000 ||
                    etasDifference < -259200000
                  ) {
                    if (
                      productsWithErrors.indexOf(rqV.RequestProductId) == -1
                    ) {
                      productsWithErrors.push(rqV.RequestProductId);
                      hasError = true;
                      errorType.push('ETA Difference');
                    }
                  }
                  if (!hasError) {
                    foundRelatedOrder = rodV.id;
                  } else {
                    errorMessages.push(
                      this.createOrderErrorMessage(
                        rqV.RequestProductId,
                        errorType
                      )
                    );
                  }
                }
              });
            });
          }
          if (foundRelatedOrder) {
            rqV.ExistingOrderId = foundRelatedOrder;
          }
        });
        // if capture conf qty == "Offer", confirmed qty is visible & required..Id-1 means offer
        // if (this.tenantConfiguration.captureConfirmedQuantityId == 1) {
        //   let errorConf = false;
        //   this.selectedOffers.forEach((val, key) => {
        //     if (!val.ConfirmedQuantity) {
        //       this.selectedOffers[`confirmedQuantity_${key}`].$setValidity('required', false);
        //       errorConf = true;
        //     }
        //   });
        //   if (errorConf) {
        //     this.toaster.error('Confirmed Quantity is required!');
        //     this.buttonsDisabled = false;
        //     return;
        //   }
        // }
        this.errorMessages = errorMessages.join('\n\n');
        if (errorMessages.length > 0) {
          this.toaster.error(this.errorMessages);
        }
        let rfq_data = {
          Requirements: this.selectedOffers, //this.requestOfferItems.filter(row1 => row1.isCheckBox == true),
          RequestGroupId: this.selectedOffers[0].RequestGroupId,
          QuoteByDate: this.selectedOffers[0].QuoteByDate,
          QuoteByCurrencyId: this.selectedOffers[0].QuoteByCurrencyId,
          QuoteByTimeZoneId: this.selectedOffers[0].QuoteByTimeZoneId, //this.requestOffers.Select(off => off.QuoteByTimeZoneId).FirstOrDefault()
          Comments: ''
        };
        //this.toaster.info('Please wait while the offer is confirmed');
        this.spinner.show();
        setTimeout(() => {
          const response = this.spotNegotiationService.ConfirmRfq(rfq_data);
          response.subscribe(
            (res: any) => {
              this.buttonsDisabled = false;
              var receivedOffers = res;
              this.spinner.hide();
              if (res?.message == 'Unauthorized') {
                return;
              }
              if (res instanceof Object && res.payload.length > 0) {
                this.myMonitoringService.logMetric(
                  'Confirm Offer ' + (<any>window).location.href,
                  Date.now() - (<any>window).startConfirmOfferTime,
                  (<any>window).location.href
                );
                let resp =  this.spotNegotiationService.UpdateProductPrices(
                  this.FreezeMarketPricesPayload
                );
                resp.subscribe((result: any) => {
                  if(result.status ) {
                    //this.openEditOrder(receivedOffers.payload);
                    const baseOrigin = new URL(window.location.href).origin;
                    window.open(
                      `${baseOrigin}/#/edit-order/${receivedOffers.payload[0]}`,
                      '_self'
                    );
                    this.toaster.success('order created successfully.');
                  }
                });
              } else if (res instanceof Object) {
                this.toaster.warning(res.Message);
              } else {
                this.toaster.error(res);
                return;
              }
              // if (receivedOffers?.payload?.length> 0) {
              //   this.openEditOrder(receivedOffers.payload);
              //   //window.location.href = `/#/edit-order/${receivedOffers[0]}`;
              // } else {
              //   this.toaster.error(res.message);
              // }
            },
            () => {
              this.buttonsDisabled = false;
            }
          );
        }, 200);
      },
      response => {
        this.buttonsDisabled = true;
      }
    );
  }
  getPriceDetails() {
    // Get current id from url and make a request with that data.
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    const groupId = this.route.snapshot.params.spotNegotiationId;
    let rows = _.cloneDeep(locationsRows);
    this.spotNegotiationService
      .getPriceDetails(groupId)
      .subscribe(async (res: any) => {
        if (res['sellerOffers']) {
          const futureLocationsRows = this.getLocationRowsWithPriceDetails(
            rows,
            res['sellerOffers']
          );
          let reqLocationRows : any =[];
          for (const locRow of futureLocationsRows) {
            var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
              locRow,
              locRow);
              reqLocationRows.push(data);
          }
          this.store.dispatch(new SetLocationsRows(reqLocationRows));
        }
      });
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let currentRequestData: any;
    //let currencyList: any;
    currentRequestData = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });
    // currencyList = this.store.selectSnapshot<any>((state: any) => {
    //   return state.spotNegotiation.staticLists['currency'];
    // });
    let requestlist = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });

    rowsArray.forEach((row, index) => {
      let requestProducts = requestlist?.find(x => x.id == row.requestId)?.requestLocations?.find(l => l.id ==row.requestLocationId)?.requestProducts;
      let currentLocProd = currentRequestData.filter(
        row1 => row1.locationId == row.locationId
      );

      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray.length &&
        row.id === priceDetailsArray[index]?.requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        row.isSelected = priceDetailsArray[index].isSelected;
        // row.physicalSupplierCounterpartyId =
        //   priceDetailsArray[index].physicalSupplierCounterpartyId;
        // if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
        //   row.physicalSupplierCounterpartyName = counterpartyList.find(
        //     x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
        //   ).displayName;
        // }
        // row.requestOffers = priceDetailsArray[
        //   index
        // ].requestOffers?.sort((a, b) =>
        //   a.requestProductId > b.requestProductId ? 1 : -1
        // );
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;
        row.requestAdditionalCosts = priceDetailsArray[index].requestAdditionalCosts;
        this.UpdateProductsSelection(currentLocProd, row);
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts.find(rp => rp.id == e.requestProductId)?.status;
           return { ...e, reqProdStatus: isStemmed };
        });
        row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeId === b.requestProductTypeId
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeId > b.requestProductTypeId
            ? 1
            : -1
        );
        return row;
      }

      // Else if not in the same index
      const detailsForCurrentRow = priceDetailsArray.filter(
        e => e.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers;
        row.isSelected = detailsForCurrentRow[0].isSelected;
        // row.physicalSupplierCounterpartyId =
        //   detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        // if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
        //   row.physicalSupplierCounterpartyName = counterpartyList.find(
        //     x => x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
        //   ).displayName;
        // }
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
        row.totalCost = detailsForCurrentRow[0].totalCost;
        row.requestAdditionalCosts = detailsForCurrentRow[0].requestAdditionalCosts;
        this.UpdateProductsSelection(currentLocProd, row);
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts.find(rp => rp.id == e.requestProductId)?.status;
           return { ...e, reqProdStatus: isStemmed };
        });
        row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);

        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeId === b.requestProductTypeId
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeId > b.requestProductTypeId
            ? 1
            : -1
        );
      }
      return row;
    });

    return rowsArray;
  }

  UpdateProductsSelection(currentLocProd, row) {
    if (currentLocProd.length != 0) {
      let currentLocProdCount = currentLocProd[0].requestProducts.length;
      row.requestOffers.forEach(element1 => {
        let FilterProdut = currentLocProd[0].requestProducts.filter(
          col => col.id == element1.requestProductId
        );
        element1.requestProductTypeId = FilterProdut[0]?.productTypeId;
      });
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        const status = currentLocProd[0].requestProducts[index].status;
        row[val] =
          status === 'Stemmed' || status === 'Confirmed'
            ? false
            : row.isSelected;
        //row[val] = row.isSelected;
      }
    }
  }

  createOrderErrorMessage(requestProductId, errorType) {
    let errorMessage = null;
    let errorTypes = errorType.join(', ');
    if (!errorType) {
      return;
    }
    let fullGroupData = [];
    this.currentRequestInfo.forEach((gdV, gdK) => {
      gdV.requestLocations.forEach((locV, locK) => {
        locV.requestProducts.forEach((prodV, prodK) => {
          if (prodV.id == requestProductId) {
            errorMessage =
              'Unable to add ' +
              prodV.productName +
              ' for ' +
              gdV.vesselName +
              ' in existing stemmed order due to conflicting ' +
              errorTypes +
              '. New order will be created. ' +
              errorTypes +
              ' will be only that did not met the criteria for extending the order';
          }
        });
      });
    });
    if (errorMessage) {
      return errorMessage;
    }
  }
  /**
   * Set confirmed quantites on the requirements depending on user input on offers
   */
  //  setConfirmedQuantities() {
  //   var requirement, offer,o;
  //   const locationsRows = this.store.selectSnapshot<any>((state: any) => {
  //     return state.spotNegotiation.locationsRows
  //   });
  //   for (var i = 0; i < locationsRows.length; i++) {
  //       requirement = locationsRows[i];
  //       for(var k=0;k<locationsRows[i].requestOffers.length;k++){
  //         for (var j = 0; j < this.selectedOffers.length; j++) {
  //           offer = this.selectedOffers[i];
  //           if (offer  && offer.LocationId === requirement.locationId && offer.ProductId === locationsRows[i].requestOffers[k].quotedProductId && offer.SellerId === requirement.sellerCounterpartyId &&  offer.RequestId === requirement.requestId) {  //
  //             this.selectedOffers[i].OrderFields = {
  //                   ConfirmedQuantity: offer.ConfirmedQuantity
  //               };
  //           }
  //       }
  //       }
  //   }
  // }
  requirementsAreCorrectForConfirm() {
    var requirement;
    var isCorrect = true;
    var existingRequestProductIds = [];
    if (this.selectedOffers.length == 0) {
      return false;
    }
    for (var i = 0; i < this.selectedOffers.length; i++) {
      requirement = this.selectedOffers[i];
      if (
        typeof requirement.requestOfferId == 'undefined' ||
        requirement.requestOfferId === null
      ) {
        isCorrect = false;
        break;
      }
      if (
        typeof requirement.requestOffer.price == 'undefined' ||
        requirement.requestOffer.price === null
      ) {
        isCorrect = false;
        break;
      }
      if (
        existingRequestProductIds.indexOf(requirement.requestProductId) >= 0
      ) {
        isCorrect = false;
        break;
      }
      existingRequestProductIds.push(requirement.requestProductId);
    }
    return isCorrect;
  }
  productPricePayload(selectedOffers) {
    let selectedOffs = [];
    for( let i = 0; i < selectedOffers.length ; i++){
      let selectOff = {
        RequestGroupId: selectedOffers[i].RequestGroupId,
        RequestLocationId: selectedOffers[i].RequestLocationId,
        RequestProductId: selectedOffers[i].RequestProductId,
        ClosurePrice: selectedOffers[i].ClosurePrice ? selectedOffers[i].ClosurePrice : 0,
        BestContract: selectedOffers[i].BestContract ? selectedOffers[i].BestContract : 0,
        BestContractId: selectedOffers[i].BestContractId,
        BenchMark: selectedOffers[i].BenchMark ? selectedOffers[i].BenchMark : 0,
        ClosureDate: selectedOffers[i].ClosureDate ? selectedOffers[i].ClosureDate : null
      };
      selectedOffs.push(selectOff);
    }
    return selectedOffs;
  }
}
