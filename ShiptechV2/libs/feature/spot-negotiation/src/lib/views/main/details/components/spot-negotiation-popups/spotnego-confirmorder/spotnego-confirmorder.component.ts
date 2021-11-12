import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngxs/store';
import { DecimalPipe, KeyValue } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ValueService } from 'ag-grid-community';
import { SpotNegotiationService } from '../../../../../../../../../spot-negotiation/src/lib/services/spot-negotiation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServerQueryFilter } from '@shiptech/core/grid/server-grid/server-query.filter';
import { now } from 'moment';
import { AgGridDatetimePickerToggleComponent } from 'libs/feature/spot-negotiation/src/lib/core/ag-grid/ag-grid-datetimePicker-Toggle';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { AppConfig } from '@shiptech/core/config/app-config';
import { groupBy } from 'lodash';
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
  buttonsDisabled:boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;
  requests: any = [];
  requestOfferItems:any=[];
  selectedOffers:any=[];
  currentRequestInfo: any=[];
  tenantConfiguration:any;
  responseOrderData:any;
  totalPriceValue:number;
  errorMessages: string;
  constructor(
    public dialogRef: MatDialogRef<SpotnegoConfirmorderComponent>,
    private store: Store,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private spotNegotiationService: SpotNegotiationService,
    private urlService: UrlService,
    public appConfig: AppConfig,
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
  getSelectedLocationRowsForLocation(){
    this.store.subscribe(({ spotNegotiation }) => {
      this.currentRequestInfo[0] = spotNegotiation.currentRequestSmallInfo;
      this.tenantConfiguration=spotNegotiation.tenantConfigurations;
    });
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows
    });
    const locations = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations
    });
    if(!locationsRows){
      return [];
    }
    var requestOfferItemPayload=[];
      locations.forEach(element => {
      locationsRows.forEach(element1 => {
        if (element.locationId == element1.locationId && element1.requestOffers!=undefined ) { //&& element1.locationId==locationId
          if(element1.checkProd1 && element1.requestOffers[0].quotedProductId==element.requestProducts[0].productId ){
             requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
                element1,
                element1.requestOffers[0],
                element.requestProducts[0],
                element.eta,
                this.currentRequestInfo
              );
              if (requestOfferItemPayload.length > 0) {
                this.requestOfferItems.push(requestOfferItemPayload[0]);
              }
          }
          if(element1.checkProd2 && element1.requestOffers[1].quotedProductId==element.requestProducts[1].productId){
            requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
               element1,
               element1.requestOffers[1],
               element.requestProducts[1],
               element.eta,
               this.currentRequestInfo
             );
             if (requestOfferItemPayload.length > 0) {
               this.requestOfferItems.push(requestOfferItemPayload[0]);
             }
          }
         if(element1.checkProd3 && element1.requestOffers[2].quotedProductId==element.requestProducts[2].productId){
          requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
             element1,
             element1.requestOffers[2],
             element.requestProducts[2],
             element.eta,
             this.currentRequestInfo
           );
           if (requestOfferItemPayload.length > 0) {
             this.requestOfferItems.push(requestOfferItemPayload[0]);
           }
          }
          if(element1.checkProd4 && element1.requestOffers[3].quotedProductId==element.requestProducts[3].productId){
            requestOfferItemPayload = this.ConstructRequestOfferItemPayload(
               element1,
               element1.requestOffers[3],
               element.requestProducts[3],
               element.eta,
               this.currentRequestInfo
             );
             if (requestOfferItemPayload.length > 0) {
               this.requestOfferItems.push(requestOfferItemPayload[0]);
             }
          }
        }
      });
    });
    return this.requestOfferItems;
  }
  //Construct UI Value's to bind the popup grid
  ConstructRequestOfferItemPayload(seller, requestOffers,requestProducts,etaDate,requestInfo) {
    return [
      {
        RequestId: this.requests[0].id,//Single request pass
        RequestGroupId:seller.requestGroupId,
        RequestSellerId: seller.id,
        SellerId:seller.sellerCounterpartyId,
        SellerName:seller.sellerCounterpartyName,
        LocationId:seller.locationId,
        RequestLocationId: seller.requestLocationId,
        PhysicalSupplierCounterpartyId: seller.physicalSupplierCounterpartyId,
       // PhysicalSupplierName: seller.physicalSupplierCounterpartyName,
        RequestProductId:requestProducts.id,
        ProductId: requestProducts.productId,
        ProductName: requestProducts.productName,
        minQuantity: requestProducts.minQuantity,
        MaxQuantity: requestProducts.maxQuantity,
        ConfirmedQuantity: requestProducts.maxQuantity,
        UomId: requestProducts.uomId,
        WorkflowId:requestProducts.workflowId,
        productStatus:{
          id:requestProducts.statusId,
          name:requestProducts.status
        },
        vesselETA:etaDate,
        RequestStatus:requestInfo[0].status,
        VesselId:requestInfo[0].vesselId,
        VesselVoyageDetailId: null,
        UomName:"MT", //requestProducts.uomName,
        OfferPrice:requestOffers.price,
        ContactCounterpartyId: requestOffers.contactCounterpartyId,
				BrokerCounterpartyId: requestOffers.brokerCounterpartyId,
        currencyId:requestOffers.currencyId,
        PricingTypeId: requestOffers.priceQuantityUomId,
        QuoteByDate: requestOffers.quoteByDate,
        ProductTypeId:1,
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
        isCheckBox:false,
        //End
        TotalPrice:requestOffers.price*requestProducts.maxQuantity,
        RequestOfferId:requestOffers.id,
        RfqId:requestOffers.rfqId,
        OrderFields : {
          ConfirmedQuantity: requestProducts.maxQuantity
          }
        }
    ];
  }

  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => 0;
  //Calculate TatalPrice
  totalprice(rowIndex) {
    const currentRowIndex = rowIndex;
    const offers=this.requestOfferItems[currentRowIndex];
    if(offers.ConfirmedQuantity != 'undefined' && offers.OfferPrice!= 'undefined' ){
      this.requestOfferItems[currentRowIndex].TotalPrice=offers.OfferPrice*offers.ConfirmedQuantity;
    }
    return this.requestOfferItems;
  }
  //popup all select/deselct
  onConfirmOfferALLCheckboxChange(ev,req,requestoffer){
    if (ev.checked) {
      requestoffer.forEach((v,k)=>{
        v.isCheckBox=true;
      });
    }else{
      requestoffer.forEach((v,k)=>{
        v.isCheckBox=false;
      });
    }
    return requestoffer;
  }
  //popup single select/deselct
  onConfirmOfferCheckboxChange(ev,requestoffer){
    if (ev.checked) {
      requestoffer.isCheckBox=true;
    }else{
      requestoffer.isCheckBox=false;
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
      if(itemVal.isCheckBox){
        RequestProductIds.push(itemVal.RequestProductId);
        this.selectedOffers.push(itemVal);
      }
    });
    if (RequestProductIds) {
      filters = [
        {
          columnName: 'RequestProductIds',
          value:"["+RequestProductIds.join(",")+"]"
        }
      ];
    }
    let payload = {
      filters
    };
    this.setConfirmedQuantities();
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
        if(res.payload.length>0){
          this.responseOrderData=res.payload;
          this.responseOrderData.forEach((rodV ,rodK ) => {
            hasError = false;
            rodV.products.forEach((rodProdV,rodProdK ) => {
              if (rodV.requestLocationId == rqV.RequestLocationId /*&& rodProdV.requestProductId == rqV.RequestProductId*/) {
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
                let etasDifference =  rqV.vesselETA -  rodV.orderEta
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
     if(this.tenantConfiguration.captureConfirmedQuantityId == 1) {
        let errorConf = false;
        this.selectedOffers.foreach(( val,key) => {
          if (!val.ConfirmedQuantity ) {
            this.selectedOffers[`confirmedQuantity_${key}`].$setValidity('required', false);
            errorConf = true;
          }
        });
          if (errorConf) {
            this.toaster.error('Confirmed Quantity is required!');
            this.buttonsDisabled = false;
            return;
          }
      }
      this.errorMessages = errorMessages.join('\n\n');
      if (errorMessages.length > 0) {
        this.toaster.error(this.errorMessages);
      }
      let rfq_data = {
        Requirements:this.selectedOffers, //this.requestOfferItems.filter(row1 => row1.isCheckBox == true),
        RequestGroupId:this.selectedOffers[0].RequestGroupId,
        QuoteByDate:this.selectedOffers[0].QuoteByDate,
        QuoteByCurrencyId: "1",
        QuoteByTimeZoneId: "11",//this.requestOffers.Select(off => off.QuoteByTimeZoneId).FirstOrDefault()
        Comments: ""
      };
      this.toaster.info('Please wait while the offer is confirmed');
      this.spinner.show();
      setTimeout(() => {
        const response =this.spotNegotiationService.ConfirmRfq(rfq_data);
        response.subscribe((res: any) => {
          this.buttonsDisabled = false;
          var receivedOffers = res;
          this.spinner.hide();
          if(res instanceof Object && res.payload.length > 0 ){
            //this.openEditOrder(receivedOffers.payload);
            const baseOrigin = new URL(window.location.href).origin;
            window.open(`${baseOrigin}/#/edit-order/${receivedOffers.payload}`, '_blank');
            this.toaster.success('order created successfully.')
          }
          else if(res instanceof Object){
            this.toaster.warning(res.Message);
          }
          else{
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
    },(response)=>{
      this.buttonsDisabled=true;
    });       
  }
 createOrderErrorMessage(requestProductId, errorType) {
    let errorMessage = null;
    let errorTypes = errorType.join(", ");
    if (!errorType) {
        return
    };
    let fullGroupData=[];
    this.currentRequestInfo.forEach((gdV, gdK)=> {
        gdV.requestLocations.forEach(( locV ,locK)=> {
            locV.requestProducts.forEach((prodV , prodK)=> {
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
   setConfirmedQuantities() {
    var requirement, offer,o;
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows
    });
    for (var i = 0; i < locationsRows.length; i++) {
        requirement = locationsRows[i];
        for (var j = 0; j < this.selectedOffers.length; j++) {
            offer = this.selectedOffers[i];
            if (offer  && offer.LocationId === requirement.locationId && offer.ProductId === requirement.productId && offer.SellerId === requirement.sellerCounterpartyId) {  //&& offer.RequestId === requirement.RequestId
               var OrderFields = {
                    ConfirmedQuantity: offer.confirmedQuantity
                };
                this.selectedOffers[i].add(OrderFields);
            }
        }
    }
}
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

}
