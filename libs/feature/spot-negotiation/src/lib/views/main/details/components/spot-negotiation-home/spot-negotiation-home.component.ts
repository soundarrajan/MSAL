import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
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
  SetLocationsRowsPriceDetails
} from '../../../../../store/actions/ag-grid-row.action';

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
    private spotNegotiationService: SpotNegotiationService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.navBar = data.navBar;
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
      let errormessage = 'Atleast 1 counterparty should be selected in'; // + spotNegotiation.currentRequestSmallInfo.name +"-"+spotNegotiation.currentRequestSmallInfo.vesselName;
      this.toaster.error(errormessage);
      return;
      // }
    } else {

      this.RequestGroupID = 1213;
      this.store.subscribe(({ spotNegotiation }) => {
        this.RequestGroupID = spotNegotiation.currentRequestSmallInfo.RequestGroupId;

      });
      this.selectedSellerList.push(Selectedfinaldata[0]);
      var FinalAPIdata = {
        RequestGroupId: this.RequestGroupID,
        quoteByDate: new Date(),
        quoteByCurrencyId: 1,
        quoteByTimeZoneId: 1,
        selectedSellers: this.selectedSellerList
      };
    }
    // Get response from server
    const response = this.spotNegotiationService.SendRFQ(FinalAPIdata);
    response.subscribe((res: any) => {

      // TODO DEMO | Please check this (the response doesn't has a status code);
      if (res.message) {
        this.toaster.success(res.message);

        // Define
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

        // Here make getpricedetails get one more time;
        const responseGetPriceDetails = this.spotNegotiationService.getPriceDetails(
          requestGroupID
        );

        responseGetPriceDetails.subscribe((priceDetailsRes: any) => {
          this.store.dispatch(
            new SetLocationsRowsPriceDetails(priceDetailsRes['sellerOffers'])
          );

          const futureLocationsRows = this.getLocationRowsWithPriceDetails(
            JSON.parse(JSON.stringify(locationsRows)),
            priceDetailsRes['sellerOffers']
          );
          this.store.dispatch(new SetLocationsRows(futureLocationsRows));
        });

        this.changeDetector.detectChanges();

        // Until here
      } else {
        this.toaster.error(res.message);
        return;
      }
    });
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    rowsArray.forEach((row, index) => {
      row.isSelected = true;
      row.checkProd1 = true;
      row.checkProd2 = true;
      row.checkProd3 = true;
      row.checkProd4 = true;
      row.checkProd5 = true;

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
    debugger;
    var Sellectedsellerdata = [];

    this.store.subscribe(({ spotNegotiation }) => {
      spotNegotiation.locations.forEach(element => {
        spotNegotiation.locationsRows.forEach(element1 => {
          if (element.locationId == element1.locationId) {
            if (element1['isSelected']) {
              var Sellectedsellerdata = this.ConstuctSellerPayload(
                element1,
                element.requestProducts,
                spotNegotiation.currentRequestSmallInfo,
                ''
              );
              if (
                Sellectedsellerdata != null &&
                Sellectedsellerdata.length != 0
              ) {
                this.selectedSellerList.push(Sellectedsellerdata[0]);
              }
            } else {
              let productLength = element.requestProducts.length;
              for (let index = 0; index < productLength; index++) {
                if (index == 0 && element1['checkProd1']) {
                  Sellectedsellerdata = this.ConstuctSellerPayload(
                    element1,
                    element.requestProducts,
                    spotNegotiation.currentRequestSmallInfo,
                    index
                  );
                } else if (index == 1 && element1['checkProd2']) {
                  Sellectedsellerdata = this.ConstuctSellerPayload(
                    element1,
                    element.requestProducts,
                    spotNegotiation.currentRequestSmallInfo,
                    index
                  );
                } else if (index == 2 && element1['checkProd3']) {
                  Sellectedsellerdata = this.ConstuctSellerPayload(
                    element1,
                    element.requestProducts,
                    spotNegotiation.currentRequestSmallInfo,
                    index
                  );
                  this.selectedSellerList.push(Sellectedsellerdata[0]);
                } else if (index == 3 && element1['checkProd4']) {
                  Sellectedsellerdata = this.ConstuctSellerPayload(
                    element1,
                    element.requestProducts,
                    spotNegotiation.currentRequestSmallInfo,
                    index
                  );
                  this.selectedSellerList.push(Sellectedsellerdata[0]);
                } else if (index == 4 && element1['checkProd5']) {
                  Sellectedsellerdata = this.ConstuctSellerPayload(
                    element1,
                    element.requestProducts,
                    spotNegotiation.currentRequestSmallInfo,
                    index
                  );
                  this.selectedSellerList.push(Sellectedsellerdata[0]);
                }
                // else{
                //   let errormessage = "Atleast 1 counterparty should be selected in" + spotNegotiation.currentRequestSmallInfo.name +"-"+spotNegotiation.currentRequestSmallInfo.vesselName;
                //   this.toaster.error(errormessage);
                // }

                // if(Sellectedsellerdata != null && Sellectedsellerdata.length != 0){
                //   this.selectedSellerList.push(Sellectedsellerdata[0]);
                // }
              }
            }
          }
        });
      });
    });
    return this.selectedSellerList;
  }
  ConstuctSellerPayload(Seller, Product, Request, index) {
    let selectedproduct;
    if (Product.length > 0 && index == '') {
      selectedproduct = Product.map(({ id }) => id).join(',');
    } else {
      selectedproduct = Product[index].id;
    }
    return [
      {
        RequestLocationSellerId: Seller.sellerCounterpartyId,
        RequestLocationID: Seller.locationId,
        RequestId: Request.id,
        physicalSupplierCounterpartyId: 11,
        RequestProductIds: [parseInt(selectedproduct)]
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
}
