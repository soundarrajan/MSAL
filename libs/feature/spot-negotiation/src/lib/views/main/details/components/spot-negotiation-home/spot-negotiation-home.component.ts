import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AgGridDatetimePickerToggleComponent } from '../../../../../core/ag-grid/ag-grid-datetimePicker-Toggle';
import { SpotnegoConfirmorderComponent } from '../spot-negotiation-popups/spotnego-confirmorder/spotnego-confirmorder.component';
import { Store } from '@ngxs/store';
// import { SpotnegoConfirmorderComponent } from '../spot-negotiation-popups/spotnego-confirmorder/spotnego-confirmorder.component';
// import { SpotnegoSendRfqComponent } from '../spot-negotiation-popups/spotnego-send-rfq/spotnego-send-rfq.component';
import { SpotNegotiationService } from '../../../../../../../../spot-negotiation/src/lib/services/spot-negotiation.service';

@Component({
  selector: 'app-spot-negotiation-home',
  templateUrl: './spot-negotiation-home.component.html',
  styleUrls: ['./spot-negotiation-home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotNegotiationHomeComponent implements OnInit {
  navigationItems: any[];
  today = new FormControl(new Date());
  navBar: any;
  requestOptions = [
    {
      request : 'Req 12321', vessel: 'Merlion', selected: true
    },
    {
      request : 'Req 12322', vessel: 'Afif', selected: false
    }
  ];
  @ViewChild(AgGridDatetimePickerToggleComponent) child:AgGridDatetimePickerToggleComponent;

  selectedSellerList: any[];
  constructor(private route: ActivatedRoute, public dialog: MatDialog, private toaster: ToastrService,private store: Store,private spotNegotiationService: SpotNegotiationService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.navBar = data.navBar;
    });
  }

  confirmorderpopup(){
    const dialogRef = this.dialog.open(SpotnegoConfirmorderComponent, {
      width: '1045px',
      height: '555px',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }

  sendRFQpopup(){
    // const dialogRef = this.dialog.open(SpotnegoSendRfqComponent, {
    //   width: '600px',
    //   height: '220px',
    //   panelClass: 'additional-cost-popup'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });
    this.selectedSellerList = [];
    this.store.subscribe(({ spotNegotiation }) => {
      spotNegotiation.locations.forEach(element => {
        spotNegotiation.locationsRows.forEach(element1 => {
            if(element.locationId == element1.locationId){
              if(element1["isSelected"]){
                  var Sellectedsellerdata = this.ConstuctSellerPayload(element1,element.requestProducts,spotNegotiation.currentRequestSmallInfo,'')
                  if(Sellectedsellerdata != null && Sellectedsellerdata.length != 0){
                    this.selectedSellerList.push(Sellectedsellerdata[0]);
                  }
              }else{
                let productLength = element.requestProducts.length;
                for (let index = 0; index < productLength; index++) {
                  if(index == 0 && element1["checkProd1"]){
                    var Sellectedsellerdata = this.ConstuctSellerPayload(element1,element.requestProducts,spotNegotiation.currentRequestSmallInfo,index)
                  }
                  else if(index == 1 && element1["checkProd2"]){
                    var Sellectedsellerdata = this.ConstuctSellerPayload(element1,element.requestProducts,spotNegotiation.currentRequestSmallInfo,index)
                  }
                  else if(index == 2 && element1["checkProd3"]){
                    var Sellectedsellerdata = this.ConstuctSellerPayload(element1,element.requestProducts,spotNegotiation.currentRequestSmallInfo,index)
                  }
                  else if(index == 3 && element1["checkProd4"]){
                    var Sellectedsellerdata = this.ConstuctSellerPayload(element1,element.requestProducts,spotNegotiation.currentRequestSmallInfo,index)
                  }
                  else if(index == 4 && element1["checkProd5"]){
                    var Sellectedsellerdata = this.ConstuctSellerPayload(element1,element.requestProducts,spotNegotiation.currentRequestSmallInfo,index)
                  }
                  else{
                    let errormessage = "Atleast 1 counterparty should be selected in" + spotNegotiation.currentRequestSmallInfo.name +"-"+spotNegotiation.currentRequestSmallInfo.vesselName;
                    this.toaster.error(errormessage);
                  }

                  if(Sellectedsellerdata != null && Sellectedsellerdata.length != 0){
                    this.selectedSellerList.push(Sellectedsellerdata[0]);
                  }
                }
              }
            }
          });
      });
      });
    // Get response from server
    const response = this.spotNegotiationService.SendRFQ(
      this.selectedSellerList
    );
    response.subscribe((res: any) => {
      if (res.status) {
        this.toaster.success(res.message);
      } else {
        this.toaster.error(res.message);
        return;
      }
    });
  }
  ConstuctSellerPayload(Seller,Product,Request,index){
    let selectedproduct;
    if(Product.length >0 && index == ''){
      selectedproduct = Product.map(({ id }) => id).join(',');
    }
    else{
      selectedproduct = Product[index].id
    }
   return  [
      {
        RequestLocationSellerId: Seller.sellerCounterpartyId,
        RequestLocationID: Seller.locationId,
        RequestId:Request.id,
        physicalSupplierCounterpartyId:11,
        RequestProductIds: [parseInt(selectedproduct)],
        RequestGroupId:Request.requestGroupId,
        quoteByDate: new Date(),
        quoteByCurrencyId:1,
        quoteByTimeZoneId:11
      }
    ]
  }

  dateTimePicker(e){
    //alert("");
    e.stopPropagation();
    this.child.pickerOpen();
  }

  displaySuccessMsg(){
    this.toaster.show('<div class="message cust-msg">Successfully Duplicated to:</div><div class="requests"><span class="circle internal"></span><span class="label">Req 12322 - Afif</span><span class="circle external"></span><span class="label">Req 12323 - Al Mashrab</span></div>',
    '' , {
             enableHtml: true,
             toastClass: "toast-alert cust-alert toast-darkGrey",
             timeOut: 2000
         });
  }

}
