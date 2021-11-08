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
  requestOptions: any;

  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;

  selectedSellerList: any[];
  currentRequestInfo: any;
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
    this.store.subscribe(({ spotNegotiation }) => {
       this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
       this.requestOptions = spotNegotiation.requests;
     });
  }

  confirmorderpopup() {
    const dialogRef = this.dialog.open(SpotnegoConfirmorderComponent, {
      width: '1045px',
      height: '555px',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  sendRFQpopup() {
    this.selectedSellerList = [];
    var Selectedfinaldata = this.FilterselectedRow();
    if (Selectedfinaldata.length == 0) {
      let errormessage = 'Atleast 1 counterparty should be selected in '+ this.currentRequestInfo.name +' - '+ this.currentRequestInfo.vesselName;
      this.toaster.error(errormessage);
      return;
    } else {

      var FinalAPIdata = {
        RequestGroupId: this.currentRequestInfo.requestGroupId,
        quoteByDate: new Date(this.child.getValue()),
        selectedSellers: this.selectedSellerList
      };
    }

    this.spinner.show();
    // Get response from server
    const response = this.spotNegotiationService.SendRFQ(FinalAPIdata);
    response.subscribe((res: any) => {
      this.spinner.hide();
      if(res instanceof Object && res['sellerOffers'].length > 0 ){
        this.toaster.success('RFQ(s) sent successfully.')
      }
      else if(res instanceof Object){
        this.toaster.warning(res.Message);
      }
      else{
        this.toaster.error(res);
        return;
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
    
    let currentRequestData: any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
     currentRequestData = spotNegotiation.locations;
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
      row[val] = row.isSelected;
    }
  }
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
      if(res instanceof Array && res.length>0 ){
        this.toaster.success('Amend RFQ(s) sent successfully.');
      }
      else{
        this.toaster.error(res);
      }
    });
  }
}
