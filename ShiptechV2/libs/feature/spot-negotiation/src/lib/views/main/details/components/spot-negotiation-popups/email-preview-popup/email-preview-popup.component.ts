import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from '../../../../../../../../../spot-negotiation/src/lib/services/spot-negotiation.service';
import {
  SetLocationsRows,
  SetLocationsRowsPriceDetails,
} from '../../../../../../store/actions/ag-grid-row.action';

interface Items {
  value: string;
  viewValue: string;
}
interface EmailAddress {
  IdEmailAddress: string;
  Name: string;
}

@Component({
  selector: 'app-email-preview-popup',
  templateUrl: './email-preview-popup.component.html',
  styleUrls: ['./email-preview-popup.component.css']
})
export class EmailPreviewPopupComponent implements OnInit {
  public SelectedSellerWithProds: any;
  currentRequestInfo: any;
  selected: any;
  toEmail = '';
  ccEmail = '';
  filesList: any;
  from: any;
  to: any;
  cc: any;
  subject: any;
  content: any;
  previewTemplate: any;
  rfqTemplate: any;
  items: Items[];

  constructor(public dialogRef: MatDialogRef<EmailPreviewPopupComponent>,
    private store: Store,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private changeDetector: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.SelectedSellerWithProds =  data;
      if(this.SelectedSellerWithProds.requestOffers?.length > 0){
        this.items =  [
          {value: 'MultipleRfqAmendRFQEmailTemplate', viewValue: 'Amend RFQ'},
          {value: 'MultipleRfqRevokeRFQEmailTemplate', viewValue: 'Revoke RFQ'},
        ];
        this.selected = 'MultipleRfqAmendRFQEmailTemplate';
      }
      else{
        this.items =  [
          {value: 'MultipleRfqNewRFQEmailTemplate', viewValue: 'New RFQ'},
        ];
        this.selected = 'MultipleRfqNewRFQEmailTemplate';
      }
     }


  ngOnInit(): void {
    this.store.subscribe(({ spotNegotiation }) => {
      this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
    });
    this.getPreviewTemplate();
  }

  getPreviewTemplate(){

  //this.selected = this.SelectedSellerWithProds.requestOffers?.length > 0 ? "MultipleRfqAmendRFQEmailTemplate" : "MultipleRfqNewRFQEmailTemplate";
  var FinalAPIdata = {
    RequestLocationSellerId: this.SelectedSellerWithProds.id,
    RequestId: this.SelectedSellerWithProds.requestId,
    CounterpartyId: this.SelectedSellerWithProds.sellerCounterpartyId,
    CounterpartyName: this.SelectedSellerWithProds.sellerCounterpartyName,
    RequestProductIds: this.currentRequestInfo.requestLocations.filter(loc => loc.id === this.SelectedSellerWithProds.requestLocationId
      ).map(prod =>
        prod.requestProducts.map(i =>i.id)
      )[0],
    RfqId: this.SelectedSellerWithProds.requestOffers?.length > 0 ? this.SelectedSellerWithProds.requestOffers[0].rfqId:0,
    TemplateName: this.selected,
    QuoteByDate: new Date(this.spotNegotiationService.QuoteByDate)
  };
  this.spinner.show();
  // Get response from server
  const response = this.spotNegotiationService.PreviewRfqMail(FinalAPIdata);
  response.subscribe((res: any) => {
    this.spinner.hide();
    this.previewTemplate = res["previewResponse"];
    this.rfqTemplate = this.previewTemplate
    this.to =(this.previewTemplate.to.map(to => to.idEmailAddress));
    this.cc =(this.previewTemplate.cc.map(cc => cc.idEmailAddress));
    this.subject =  this.previewTemplate.subject;
    this.content =  this.previewTemplate.content;
    this.from = this.previewTemplate.From;
    this.filesList = this.previewTemplate.AttachmentsList;
  });
}

  addTo(item){

    this.to.push(item);
    this.previewTemplate.to.push({IdEmailAddress: item});
    this.toEmail = '';
  }

  addCc(item){
    this.cc.push(item);
    this.previewTemplate.cc.push({IdEmailAddress: item});
    this.ccEmail = '';
  }

  fileBrowseHandler(files){
    for (const item of files) {
      this.filesList.push(item.name);
    }
  }


  saveAndSendRFQ(isSendEmail) {
    var selectedSellers = [{
      RequestLocationSellerId: this.SelectedSellerWithProds.id,
      RequestLocationID: this.SelectedSellerWithProds.requestLocationId,
      LocationID: this.SelectedSellerWithProds.locationId,
      SellerId: this.SelectedSellerWithProds.sellerCounterpartyId,
      RfqId: this.SelectedSellerWithProds.requestOffers?.length > 0 ? this.SelectedSellerWithProds.requestOffers[0].rfqId:0,
      RequestId: this.SelectedSellerWithProds.requestId,
      PhysicalSupplierCounterpartyId: this.SelectedSellerWithProds.physicalSupplierCounterpartyId,
      RequestProductIds: this.currentRequestInfo.requestLocations.filter(loc => loc.id === this.SelectedSellerWithProds.requestLocationId
        ).map(prod =>
          prod.requestProducts.map(i =>i.id)
        )[0]
    }];

    this.previewTemplate.subject = this.subject;
    this.previewTemplate.content = this.content;
    this.previewTemplate.From = this.from;
    this.previewTemplate.AttachmentsList = this.filesList;

    var saveAndSendRfqAPIPayload = {
      SelectedSellers:selectedSellers,
      RequestGroupId:this.currentRequestInfo.requestGroupId,
      IsSendMail: isSendEmail,
      PreviewResponse:this.previewTemplate,
      QuoteByDate: new Date(this.spotNegotiationService.QuoteByDate)
    };

    this.spinner.show();
    // Get response from server
    const response = this.spotNegotiationService.SaveAndSendRFQ(saveAndSendRfqAPIPayload);
    response.subscribe((res: any) => {
      this.spinner.hide();

      if(res instanceof Object && res['validationMessage'].length > 3 ){
        // this.toaster.success('RFQ(s) skipped successfully.')
        // if(res['message'].length>5)
          this.toaster.warning(res['validationMessage']);
      }
      else if(res instanceof Object && isSendEmail && res['validationMessage'].length == 0 ){
         this.toaster.success('RFQ(s) sent successfully.');
         this.dialogRef.close();
      }
      else if(res instanceof Object && !isSendEmail &&  res['validationMessage'].length == 0 ){
        this.toaster.success('Template saved successfully.');
        this.rfqTemplate = this.previewTemplate;
     }
      else if(res instanceof Object){
        this.toaster.warning(res.Message);
      }
      else{
        this.toaster.error(res);
        return;
      }
    if(res['sellerOffers'].length>0){
      const locationsRows = this.store.selectSnapshot<string>(
        (state: any) => {
          return state.spotNegotiation.locationsRows;
        }
      );

      const requestGroupID = this.store.selectSnapshot<string>(
        (state: any) => {
          return state.spotNegotiation.groupOfRequestsId;
        }
      );

        this.store.dispatch(
          new SetLocationsRowsPriceDetails(res['sellerOffers'])
        );

        const futureLocationsRows = this.getLocationRowsWithPriceDetails(
          JSON.parse(JSON.stringify(locationsRows)),
          res['sellerOffers']
        );
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));

      this.changeDetector.detectChanges();
        }
    });
    //}
  }
  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {

    let currentRequestData: any;
    let counterpartyList : any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
     currentRequestData = spotNegotiation.locations;
     counterpartyList = spotNegotiation.counterpartyList;
    });

    rowsArray.forEach((row, index) => {
      let currentLocProd = currentRequestData.filter(row1 => row1.locationId == row.locationId);

      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray.length &&
        row.id ===
        priceDetailsArray[index].requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        row.isSelected = priceDetailsArray[index].isSelected;
        row.physicalSupplierCounterpartyId =  priceDetailsArray[index].physicalSupplierCounterpartyId;
        if(priceDetailsArray[index].physicalSupplierCounterpartyId){
        row.physicalSupplierCounterpartyName = counterpartyList.find(x=>x.id == priceDetailsArray[index].physicalSupplierCounterpartyId).displayName;
        }
        this.UpdateProductsSelection(currentLocProd,row);

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
        row.physicalSupplierCounterpartyId =  detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        if(detailsForCurrentRow[0].physicalSupplierCounterpartyId){
        row.physicalSupplierCounterpartyName = counterpartyList.find(x=>x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId).displayName;}
        this.UpdateProductsSelection(currentLocProd,row);
      }
      return row;
    });

    return rowsArray;
  }

 UpdateProductsSelection(currentLocProd,row){
  if(currentLocProd.length != 0){
    let currentLocProdCount = currentLocProd[0].requestProducts.length;
    for (let index = 0; index < currentLocProdCount; index++) {
      let indx = index +1;
      let val = "checkProd" + indx;
      const status = currentLocProd[0].requestProducts[index].status;
      row[val] =  status === 'Stemmed' || status === 'Confirmed'? false : row.isSelected;
      //row[val] = row.isSelected;
    }
  }
 }

 revertChanges(){
  this.to = (this.rfqTemplate.to.map(to => to.idEmailAddress));
  this.cc =(this.rfqTemplate.cc.map(cc => cc.idEmailAddress));
  this.subject =  this.rfqTemplate.subject;
  this.content =  this.rfqTemplate.content;
  this.from = this.rfqTemplate.From;
  this.filesList = this.rfqTemplate.AttachmentsList;
  this.previewTemplate = this.rfqTemplate;
 }

}
