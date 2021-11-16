import { Component, Inject, OnInit, ViewChild,Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { SpotNegotiationService } from '../../../../../../../../../spot-negotiation/src/lib/services/spot-negotiation.service';


interface Items {
  value: string;
  viewValue: string;
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
  items: Items[];

  constructor(public dialogRef: MatDialogRef<EmailPreviewPopupComponent>,
    private store: Store,
    private spinner: NgxSpinnerService,
    private spotNegotiationService: SpotNegotiationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.SelectedSellerWithProds =  data;
      if(this.SelectedSellerWithProds.requestOffers?.length > 0){
        this.items =  [
          {value: 'MultipleRfqAmendRFQEmailTemplate', viewValue: 'Amend RFQ'},
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
    QuoteByDate: new Date()
  };
  
  this.spinner.show();
  // Get response from server
  const response = this.spotNegotiationService.PreviewRfqMail(FinalAPIdata);
  response.subscribe((res: any) => { 
    this.spinner.hide();   
    this.previewTemplate = res["previewResponse"];
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
    this.toEmail = '';
  }

  addCc(item){
    this.cc.push(item);
    this.ccEmail = '';
  }

  fileBrowseHandler(files){
    for (const item of files) {
      this.filesList.push(item.name);
    }
  }

}
