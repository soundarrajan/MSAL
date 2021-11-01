import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AgGridDatetimePickerToggleComponent } from '../../../../../core/ag-grid/ag-grid-datetimePicker-Toggle';
import { SpotnegoConfirmorderComponent } from '../spot-negotiation-popups/spotnego-confirmorder/spotnego-confirmorder.component';
import { Store } from '@ngxs/store';
// import { SpotnegoConfirmorderComponent } from '../spot-negotiation-popups/spotnego-confirmorder/spotnego-confirmorder.component';
// import { SpotnegoSendRfqComponent } from '../spot-negotiation-popups/spotnego-send-rfq/spotnego-send-rfq.component';
import { SpotNegotiationService } from '../../../../../../../../spot-negotiation/src/lib/services/spot-negotiation.service';
import {
  SetLocationsRows,
  SetLocationsRowsPriceDetails,
  SetLocations
} from '../../../../../store/actions/ag-grid-row.action';

@Component({
  selector: 'app-spot-negotiation-home',
  templateUrl: './spot-negotiation-home.component.html',
  styleUrls: ['./spot-negotiation-home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotNegotiationHomeComponent implements OnInit {
  navigationItems: any[];
  navBar: any;
  requestOptions = [
    {
      request: 'Req 12321',
      vessel: 'Merlion',
      selected: true
    },
    {
      request: 'Req 12322',
      vessel: 'Afif',
      selected: false
    }
  ];
  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;

  selectedSellerList: any[];
  RequestGroupID: number;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private changeDetector: ChangeDetectorRef,
    private store: Store,
    private spinner: NgxSpinnerService,
    private spotNegotiationService: SpotNegotiationService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.navBar = data.navBar;
    });
  }

  // @HostListener('document:click', ['$event'])
  // clickout(event) {
  //   //if(event.target.className.indexOf('mat-button-wrapper')>=0) return false;
  //   if($('.checkgrid').find(event.target).length == 0 && this.spotNegotiationService.FinalOutputdata.length !=0){
  //     this.store.dispatch(
  //       new SetLocationsRows(this.spotNegotiationService.FinalOutputdata)
  //     );
  //   }
  // }
  confirmorderpopup() {
    const dialogRef = this.dialog.open(SpotnegoConfirmorderComponent, {
      width: '1045px',
      height: '555px',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  sendRFQpopup() {
    // const dialogRef = this.dialog.open(SpotnegoSendRfqComponent, {
    //   width: '600px',
    //   height: '220px',
    //   panelClass: 'additional-cost-popup'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });
    this.selectedSellerList = [];
    var Selectedfinaldata = this.FilterselectedRow();
    if (Selectedfinaldata.length == 0) {
      let errormessage = 'Atleast 1 counterparty should be selected'; // + spotNegotiation.currentRequestSmallInfo.name +"-"+spotNegotiation.currentRequestSmallInfo.vesselName;
      this.toaster.error(errormessage);
      return;
      // }
    } else {
      this.store.subscribe(({ spotNegotiation }) => {
        this.RequestGroupID = spotNegotiation.currentRequestSmallInfo.requestGroupId;
      });
       // this.selectedSellerList.push(Selectedfinaldata[0]);
      var FinalAPIdata = {
        RequestGroupId: this.RequestGroupID,
        quoteByDate: new Date(),
        quoteByCurrencyId: 1,
        quoteByTimeZoneId: 1,
        selectedSellers: this.selectedSellerList
      };
    }

    this.spinner.show();
    // Get response from server
    const response = this.spotNegotiationService.SendRFQ(FinalAPIdata);
    response.subscribe((res: any) => {
      this.spinner.hide();
      //this.toaster.success('RFQ(s) sent successfully.');
      if (res.message) {
        this.toaster.warning(res.message);
      }

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
    });
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    rowsArray.forEach((row, index) => {

      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray.length &&
        row.id ===
        priceDetailsArray[index].requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        return row;
      }

      // Else if not in the same index
      const detailsForCurrentRow = priceDetailsArray.filter(
        e => e.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers;
      }

      return row;
    });

    return rowsArray;
  }

  FilterselectedRow() {
    var Sellectedsellerdata = [];
    
    this.store.subscribe(({ spotNegotiation }) => {
      spotNegotiation.locations.forEach(element => {
        spotNegotiation.locationsRows.forEach(element1 => {
          if (element.locationId == element1.locationId) {
            if (element1['checkProd1'] || element1['checkProd2'] || element1['checkProd3'] || element1['checkProd4'] || element1['checkProd5']) {
              var Sellectedsellerdata = this.ConstuctSellerPayload(
                element1,
                element.requestProducts,
                spotNegotiation.currentRequestSmallInfo
              );
              if (Sellectedsellerdata.length > 0) {
                this.selectedSellerList.push(Sellectedsellerdata[0]);
              }
            }
          }
        });
      });
    });
    return this.selectedSellerList;
  }
  ConstuctSellerPayload(Seller, requestProducts, Request) {
    let selectedproducts = [];
    let rfqId = null;
    if(Seller['checkProd1']){
      selectedproducts.push(requestProducts[0].id)
    }
    if(Seller['checkProd2']){
      selectedproducts.push(requestProducts[1].id)
    }
    if(Seller['checkProd3']){
      selectedproducts.push(requestProducts[2].id)
    }
    if(Seller['checkProd4']){
      selectedproducts.push(requestProducts[3].id)
    }
    if(Seller['checkProd5']){
      selectedproducts.push(requestProducts[4].id)
    }
    if((Seller.requestOffers  !== undefined) && Seller.requestOffers.length >0){
      rfqId = Seller.requestOffers[0].rfqId;
    }    
    return [
      {
        
          RequestLocationSellerId: Seller.id,
          SellerId:Seller.sellerCounterpartyId,
          RequestLocationID: Seller.requestLocationId,
          RequestId: Request.id,
          physicalSupplierCounterpartyId: Seller.physicalSupplierCounterpartyId,             
          RequestProductIds: selectedproducts,
          RfqId: rfqId  
      }
    ];
  }

  dateTimePicker(e) {
    //alert("");
    e.stopPropagation();
    this.child.pickerOpen();
  }

  displaySuccessMsg() {
    this.toaster.show(
      '<div class="message cust-msg">Successfully Duplicated to:</div><div class="requests"><span class="circle internal"></span><span class="label">Req 12322 - Afif</span><span class="circle external"></span><span class="label">Req 12323 - Al Mashrab</span></div>',
      '',
      {
        enableHtml: true,
        toastClass: 'toast-alert cust-alert toast-darkGrey',
        timeOut: 2000
      }
    );
  }
  amendRFQ() {
    this.selectedSellerList = [];
    var Selectedfinaldata = this.FilterselectedRow();
    if (Selectedfinaldata.length == 0) {
      this.toaster.error('Atleast 1 product should be selected');
      return;
    }
    else if(this.selectedSellerList.find(x=>x.RfqId===null)){
      this.toaster.error('Amend RFQ cannot be sent as RFQ was not communicated.');
      return;
    }     
    else {
      var amendRFQRequestPayload = this.selectedSellerList;
    }

    this.spinner.show();
    // Get response from server
    const response = this.spotNegotiationService.AmendRFQ(amendRFQRequestPayload);
    response.subscribe((res: any) => {      
      this.spinner.hide();      
      this.toaster.success('Amend RFQ(s) sent successfully.');
    });
  }
}
