import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sellerratingpopup',
  templateUrl: './sellerratingpopup.component.html',
  styleUrls: ['./sellerratingpopup.component.css']
})
export class SellerratingpopupComponent implements OnInit {

  locationName: string;
  popupType: string;
  locationId: number;
  counterpartyId: number;
  specificPortRatingData: any = [];
  allLocationRatingData: any = [];
  allocationRating: string;
  specificRating: string;
  constructor(public dialogRef: MatDialogRef<SellerratingpopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private store: Store,
              private spinner: NgxSpinnerService,
              private spotNegotiationService: SpotNegotiationService,
              public format: TenantFormattingService
              ) {
         this.popupType = data.popupType;
         this.locationId = data.locationId;
         this.counterpartyId = data.sellerId;
         this.getSellerRatings();
   }
   ngOnInit() {
    this.store.subscribe(({ spotNegotiation })=>{
      this.locationName = spotNegotiation.locations.find(x=> x.locationId == this.locationId).locationName;
    });
    
 }

  getSellerRatings(){
  let payload = {
    Payload: {
      counterpartyId: this.counterpartyId,
      locationId: this.locationId
    }
  };
  this.spinner.show();
  const response = this.spotNegotiationService.getSellerRatingforNegotiation(payload);
  response.subscribe((res: any)=>{
    this.spinner.hide();
    if (res?.message == 'Unauthorized') {
      return;
    }
    res.payload.map(element=>{
      if(element.location){
        this.specificRating = element.rating;
        element.categories.map(ele=>{
           this.specificPortRatingData.push({
            categoriesName: ele.name,
            categoriesRating : ele.rating,
            ratedBy: ele.createdBy.name,
            createdOn :ele.createdOn,
            details : ele.details
           })
        });
      }
      else{
        this.allocationRating = element.rating;
        element.categories.map(ele=>{
          this.allLocationRatingData.push({
           categoriesName: ele.name,
           ratedBy: ele.createdBy.name,
           createdOn :ele.createdOn,
           details : ele.details
          })
       });
      }
    });
  });

 }
 formatDate(date?: any) {
  if (date) {
    let currentFormat = this.format.dateFormat;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
      hasDayOfWeek = true;
      currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    let elem = moment(date);
    let formattedDate = moment(elem).format(currentFormat);
    if (hasDayOfWeek) {
      formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
    }
    return formattedDate;
  }
}

  closeDialog() {
      this.dialogRef.close();

    }


  }


