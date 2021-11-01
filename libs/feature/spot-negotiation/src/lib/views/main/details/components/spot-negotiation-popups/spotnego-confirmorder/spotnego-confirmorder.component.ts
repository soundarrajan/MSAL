import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngxs/store';
import { DecimalPipe, KeyValue } from '@angular/common';
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
  isButtonVisible = true;
  iscontentEditable = false;
  requests: any = [];
  requestOfferItems:any=[];
  totalPriceValue:number;


  getRequests() {
    this.requests = this.store.selectSnapshot<string>((state: any) => {
      return state.spotNegotiation.requests
    });
  }

  ngOnInit() {
    this.getRequests();
    this.getSelectedLocationRowsForLocation();
    // this.scrollToBottom();
  }

  getSelectedLocationRowsForLocation(){
    // selectedCounterpartyList
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      console.log("spotNegotiation",spotNegotiation);
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
        if (element.locationId == element1.locationId ) { //&& element1.locationId==locationId
          if(element1.checkProd1 && element1.requestOffers[0].quotedProductId==element.requestProducts[0].productId ){
             requestOfferItemPayload = this.ConstuctRequestOfferItemPayload(
                element1,
                element1.requestOffers[0],
                element.requestProducts[0]
                //requestId
              );
              if (requestOfferItemPayload.length > 0) {
                this.requestOfferItems.push(requestOfferItemPayload[0]);
              }
          }
          if(element1.checkProd2 && element1.requestOffers[1].quotedProductId==element.requestProducts[1].productId){
            requestOfferItemPayload = this.ConstuctRequestOfferItemPayload(
               element1,
               element1.requestOffers[1],
               element.requestProducts[1]
               //requestId
             );
             if (requestOfferItemPayload.length > 0) {
               this.requestOfferItems.push(requestOfferItemPayload[0]);
             }
          }
         if(element1.checkProd3 && element1.requestOffers[2].quotedProductId==element.requestProducts[2].productId){
          requestOfferItemPayload = this.ConstuctRequestOfferItemPayload(
             element1,
             element1.requestOffers[2],
             element.requestProducts[2]
             //requestId
           );
           if (requestOfferItemPayload.length > 0) {
             this.requestOfferItems.push(requestOfferItemPayload[0]);
           }
          }
          if(element1.checkProd4 && element1.requestOffers[3].quotedProductId==element.requestProducts[3].productId){
            requestOfferItemPayload = this.ConstuctRequestOfferItemPayload(
               element1,
               element1.requestOffers[3],
               element.requestProducts[3]
               //requestId
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
  ConstuctRequestOfferItemPayload(seller, requestOffers,requestProducts) {
    return [
      {
        RequestId: 1,//default pass now not use
        RequestGroupId:seller.requestGroupId,
        RequestLocationSellerId: seller.id,
        SellerId:seller.sellerCounterpartyId,
        SellerName:seller.sellerCounterpartyName,
        RequestLocationID: seller.locationId,
        PhysicalSupplierId: seller.physicalSupplierCounterpartyId,
        PhysicalSupplierName: seller.physicalSupplierCounterpartyName,
        RequestProduct:requestProducts.id,
        ProductId: requestProducts.productId,
        ProductName: requestProducts.productName,
        minQuantity: requestProducts.minQuantity,
        MaxQuantity: requestProducts.maxQuantity,
        ConfirmedQuantity: requestProducts.maxQuantity,
        UomId: requestProducts.uomId,
        UomName:"MT", //requestProducts.uomName,
        OfferPrice:requestOffers.price,
        TotalPrice:requestOffers.price*requestProducts.maxQuantity
      }
    ];
  }
  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => 0;
  totalprice(requestOfferItem,rowIndex) {
     debugger;
    console.log(rowIndex);
    const currentRowIndex = rowIndex;
    const offers=this.requestOfferItems[currentRowIndex];
    if(offers.ConfirmedQuantity != 'undefined' && offers.OfferPrice!= 'undefined' ){
      this.requestOfferItems[currentRowIndex].TotalPrice=offers.OfferPrice*offers.ConfirmedQuantity;
    }
    return this.requestOfferItems;
  }
  constructor(
    public dialogRef: MatDialogRef<SpotnegoConfirmorderComponent>,
    private store: Store,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  tabledata = [
    {
      seller: 'Total Marine Fuel',
      port: 'Amstredam',
      contractname: 'Cambodia Contarct 2021',
      contractproduct: 'DMA 1.5%',
      formula: 'Cambodia Con',
      schedule: 'Average of 5 Days',
      contractqty: '10,000,.00',
      liftedqty: '898.00 MT',
      availableqty: '96,602.00 MT',
      price: '$500.00'
    },
    {
      seller: 'Total Marine Fuel',
      port: 'Amstredam',
      contractname: 'Amstredam Contarct 2021',
      contractproduct: 'DMA 1.5%',
      formula: 'Cambodia Con',
      schedule: 'Average of 5 Days',
      contractqty: '10,000,.00',
      liftedqty: '898.00 MT',
      availableqty: '96,602.00 MT',
      price: '$500.00'
    }
  ];
}
