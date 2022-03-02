import {
  Component,
  OnInit,
  Inject,
  ViewChild
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  requestOfferItems: any = [];
  selectedOffers: any = [];
  currentRequestInfo: any = [];
  tenantConfiguration: any;
  responseOrderData: any;
  currencyList: any;
  productList: any;
  uomList: any;
  errorMessages: string;
  staticLists: any;
  constructor(
    public dialogRef: MatDialogRef<SpotnegoConfirmorderComponent>,
    private store: Store,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private spotNegotiationService: SpotNegotiationService,
    private urlService: UrlService,
    public appConfig: AppConfig,
    public format: TenantFormattingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getRequests();
    this.getSelectedLocationRowsForLocation();
  }

  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;

  getRequests() {
    this.requests = this.store.selectSnapshot<string>((state: any) => {
      return state.spotNegotiation.requests
    });
  }
  ngOnInit(): void {
    // this.scrollToBottom();
  }
  openEditOrder(orderId: number): void {
    window.open(
      this.urlService.editOrder(orderId),
      this.appConfig.openLinksInNewTab ? '_blank' : '_self'
    );
  }
  //popup grid data fill the value's..
  getSelectedLocationRowsForLocation() {
    this.store.subscribe(({ spotNegotiation }) => {
      this.currentRequestInfo[0] = spotNegotiation.currentRequestSmallInfo;
      this.tenantConfiguration = spotNegotiation.tenantConfigurations;
      this.staticLists = spotNegotiation.staticLists;
    });
    this.currencyList = this.setListFromStaticLists('Currency');
    this.productList = this.setListFromStaticLists('Product');
    this.uomList = this.setListFromStaticLists('Uom');
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows
    });
    const locations = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations
    });
    if (!locationsRows) {
      return [];
    }

    var requestOfferItemPayload = [];
    this.requests.forEach(req => {
      req.requestLocations.forEach(element => {
        locationsRows.forEach(element1 => {
          if (element.id == element1.requestLocationId && element1.requestOffers != undefined) { //&& element1.locationId==locationId
            debugger;
            if (element1.checkProd1) {
              var reqProdId = element.requestProducts[0].id;
              requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
                element1,
                element1.requestOffers?.find(ro => ro.requestProductId == reqProdId),
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
                element1.requestOffers?.find(ro => ro.requestProductId == reqProdId),
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
                element1.requestOffers?.find(ro => ro.requestProductId == reqProdId),
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
                element1.requestOffers?.find(ro => ro.requestProductId == reqProdId),
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
                element1.requestOffers?.find(ro => ro.requestProductId == reqProdId),
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
        const offerProducts = this.requestOfferItems.filter(e => e.RequestLocationId === ele.id && e.RequestProductId == product.id);
        if (offerProducts.length > 1) {
          this.requestOfferItems = [];
          this.toaster.error('Only 1 offer price can be confirmed for a requested product.');
          this.closeDialog();
          return;
        }
      });
    });
    return this.requestOfferItems;
  }
  //Construct UI Value's to bind the popup grid
  ConstructRequestOfferItemPayload(seller, requestOffer, requestProducts, etaDate, requestInfo) {
    return [
      {
        RequestId: requestInfo.id,//Single request pass
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
        ProductName: this.productList.find(x => x.id == requestOffer.quotedProductId ?? requestProducts.productId).name,
        minQuantity: requestProducts.minQuantity,
        MaxQuantity: this.format.quantity(requestProducts.maxQuantity), //this.format.quantity(requestOffers.supplyQuantity)??
        ConfirmedQuantity: this.format.quantity(requestOffer.supplyQuantity) ?? this.format.quantity(requestProducts.maxQuantity),
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
        currencyId: requestOffer.currencyId ?? this.tenantConfiguration.currencyId,
        currencyName: this.currencyList.find(x => x.id == requestOffer.currencyId ?? this.tenantConfiguration.currencyId).code,
        PricingTypeId: requestProducts.uomId,
        QuoteByDate: requestOffer.quoteByDate,
        QuoteByTimeZoneId: requestOffer.quoteByTimeZoneId,
        QuoteByCurrencyId: requestOffer.currencyId,
        ProductTypeId: 1,
        //need to check this value
        productHasOffer: true,
        productHasPrice: true,
        productHasRFQ: true,
        UniqueLocationSellerPhysical: "1000-902-null",
        rowLocationSellerPhysical: "1000-902-null-individual-null",
        randUniquePkg: "902-null-individual-null",
        isClonedSeller: false,
        productAllowZeroPricing: false,
        ProductTypeGroupId: 1,
        QuotedProductGroupId: 1,
        isCheckBox: true,
        //End
        Amount: requestOffer.amount * requestOffer.exchangeRateToBaseCurrency,
        RequestOfferId: requestOffer.id,
        RfqId: requestOffer.rfqId,
        OrderFields: {
          ConfirmedQuantity: requestOffer.supplyQuantity ?? requestProducts.maxQuantity
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

  setListFromStaticLists(name) {
    const findList = _.find(this.staticLists, function (object) {
      return object.name == name;
    });
    if (findList != -1) {
      return findList?.items;
    }
  }
  //Calculate TatalPrice - Not used onblur method confirm qty
  totalprice(rowIndex) {
    const currentRowIndex = rowIndex;
    const offers = this.requestOfferItems[currentRowIndex];
    if (offers.ConfirmedQuantity != 'undefined' && offers.OfferPrice != 'undefined') {
      this.requestOfferItems[currentRowIndex].TotalPrice = this.format.quantity(offers.OfferPrice * offers.ConfirmedQuantity);
      this.requestOfferItems[currentRowIndex].ConfirmedQuantity = this.format.quantity(offers.ConfirmedQuantity);
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
        if(v.RequestId==req.id){
          v.isCheckBox =true;
        }
      });
    } else {
      requestoffer.forEach((v, k) => {
        if(v.RequestId==req.id){
          v.isCheckBox =false;
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
    if (RequestProductIds.length > 0) {
      filters = [
        {
          columnName: 'RequestProductIds',
          value: "[" + RequestProductIds.join(",") + "]"
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
      if (va.OfferPrice == null || va.OfferPrice == undefined || va.OfferPrice == 0) {
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
    const response = this.spotNegotiationService.GetExistingOrders(payload);
    response.subscribe((res: any) => {
      this.spinner.hide();
      let productsWithErrors = []
      let errorMessages = [];
      this.selectedOffers.forEach((rqV, rqK) => {
        let hasOrder = false;
        let hasError = false;
        if (res.payload.length > 0) {
          this.responseOrderData = res.payload;
          this.responseOrderData.forEach((rodV, rodK) => {
            hasError = false;
            rodV.products.forEach((rodProdV, rodProdK) => {
              if (rodV.requestLocationId == rqV.RequestLocationId) {  //&& rodProdV.requestProductId == rqV.RequestProductId
                hasOrder = true;
                let errorType = [];
                if (rodV.seller.id != rqV.SellerId) {
                  if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                    productsWithErrors.push(rqV.RequestProductId);
                    hasError = true;
                    errorType.push("Seller");
                  }
                }
                if (rodProdV.currency.id != rqV.currencyId) {
                  if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                    productsWithErrors.push(rqV.RequestProductId);
                    hasError = true;
                    errorType.push("Currency");
                  }
                }
                let etasDifference = rqV.vesselETA - rodV.orderEta
                if (etasDifference > 259200000 || etasDifference < -259200000) {
                  if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                    productsWithErrors.push(rqV.RequestProductId);
                    hasError = true;
                    errorType.push("ETA Difference");
                  }
                }
                if (!hasError) {
                  foundRelatedOrder = rodV.id;
                } else {
                errorMessages.push(this.createOrderErrorMessage(rqV.RequestProductId, errorType));
                }
              }
            })
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
        QuoteByTimeZoneId: this.selectedOffers[0].QuoteByTimeZoneId,//this.requestOffers.Select(off => off.QuoteByTimeZoneId).FirstOrDefault()
        Comments: ""
      };
      this.toaster.info('Please wait while the offer is confirmed');
      this.spinner.show();
      setTimeout(() => {
        const response = this.spotNegotiationService.ConfirmRfq(rfq_data);
        response.subscribe((res: any) => {
          this.buttonsDisabled = false;
          var receivedOffers = res;
          this.spinner.hide();
          if (res instanceof Object && res.payload.length > 0) {
            //add/modifiy market prices
            var FreezeMarketPricesPayload = {
              FreezePriceRequests: this.productPricePayload(this.selectedOffers)
            };
            let response = this.spotNegotiationService.UpdateProductPrices(FreezeMarketPricesPayload);
            response.subscribe((res: any) => {
              if (res.status) {
              }
            });
            //this.openEditOrder(receivedOffers.payload);
            const baseOrigin = new URL(window.location.href).origin;
            window.open(`${baseOrigin}/#/edit-order/${receivedOffers.payload[0]}`, '_self');
            this.toaster.success('order created successfully.')
          }
          else if (res instanceof Object) {
            this.toaster.warning(res.Message);
          }
          else {
            this.toaster.error(res);
            return;
          }
          // if (receivedOffers?.payload?.length> 0) {
          //   this.openEditOrder(receivedOffers.payload);
          //   //window.location.href = `/#/edit-order/${receivedOffers[0]}`;
          // } else {
          //   this.toaster.error(res.message);
          // }
        }, () => {
          this.buttonsDisabled = false;
        });
      }, 200);
    }, (response) => {
      this.buttonsDisabled = true;
    });
  }
  createOrderErrorMessage(requestProductId, errorType) {
    let errorMessage = null;
    let errorTypes = errorType.join(", ");
    if (!errorType) {
      return
    };
    let fullGroupData = [];
    this.currentRequestInfo.forEach((gdV, gdK) => {
      gdV.requestLocations.forEach((locV, locK) => {
        locV.requestProducts.forEach((prodV, prodK) => {
          if (prodV.id == requestProductId) {
            errorMessage = "Unable to add " + prodV.productName + " for " + gdV.vesselName + " in existing stemmed order due to conflicting " + errorTypes + ". New order will be created. " + errorTypes + " will be only that did not met the criteria for extending the order"
          }
        })
      })
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
      if (typeof requirement.requestOfferId == "undefined" || requirement.requestOfferId === null) {
        isCorrect = false;
        break;
      }
      if (typeof requirement.requestOffer.price == "undefined" || requirement.requestOffer.price === null) {
        isCorrect = false;
        break;
      }
      if (existingRequestProductIds.indexOf(requirement.requestProductId) >= 0) {
        isCorrect = false;
        break;
      }
      existingRequestProductIds.push(requirement.requestProductId);
    }
    return isCorrect;
  };
  productPricePayload(selectedOffers) {
    let selectedOffs = [];
    selectedOffers.forEach((confirmOff, key) => {
      let selectOff = {
        RequestGroupId: confirmOff.RequestGroupId,
        RequestLocationId: confirmOff.RequestLocationId,
        RequestProductId: confirmOff.RequestProductId,
        ClosurePrice: confirmOff.ClosurePrice ? confirmOff.ClosurePrice : 0,
        BestContract: confirmOff.BestContract ? confirmOff.BestContract : 0,
        BestContractId: confirmOff.BestContractId,
        BenchMark: confirmOff.BenchMark ? confirmOff.BenchMark : 0,
        ClosureDate: confirmOff.ClosureDate ? confirmOff.ClosureDate : null,
      }
      selectedOffs.push(selectOff);
    });
    return selectedOffs;
  }

}
