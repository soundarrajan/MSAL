import { SpotnegoSendRfqComponent } from './../spot-negotiation-popups/spotnego-send-rfq/spotnego-send-rfq.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
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
  SetLocationsRowsPriceDetails
} from '../../../../../store/actions/ag-grid-row.action';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { SpotnegoemaillogComponent } from '../spotnegoemaillog/spotnegoemaillog.component';
import { KnownSpotNegotiationRoutes } from 'libs/feature/spot-negotiation/src/lib/known-spot-negotiation.routes';
import { takeUntil } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';

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
  isOpen: boolean = false;

  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;

  @ViewChild(SpotnegoemaillogComponent)
  spotEmailComp: SpotnegoemaillogComponent;

  selectedSellerList: any[];
  currentRequestInfo: any;
  tenantConfiguration: any;
  RequestGroupID: number;
  negotiationId: any;
  emailLogUrl: string;
  baseOrigin: string;
  public menuItems: MenuItem[];
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private changeDetector: ChangeDetectorRef,
    private store: Store,
    private spinner: NgxSpinnerService,
    private spotNegotiationService: SpotNegotiationService,
    private router: Router
  ) {
    this.baseOrigin = new URL(window.location.href).origin;
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.navBar = data.navBar;
    });
    this.store.subscribe(({ spotNegotiation }) => {
      this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
      this.requestOptions = spotNegotiation.requests;
      this.tenantConfiguration = spotNegotiation.tenantConfigurations;
      this.setTabItems();
    });

    this.route.params.pipe().subscribe(params => {
      this.negotiationId = params.spotNegotiationId;
    });
  }

  ngAfterViewInit(): void {
    this.spotNegotiationService.QuoteByDate = this.child.getValue();
  }

  setTabItems() {
    const routeLinkToNegotiationDetails = [
      '/',
      KnownPrimaryRoutes.SpotNegotiation,
      this.negotiationId
    ];
    let disabled = !this.tenantConfiguration.isNegotiationReport;
    this.menuItems = [
      {
        label: 'Main Page',
        routerLink: [
          ...routeLinkToNegotiationDetails,
          KnownSpotNegotiationRoutes.details
        ],
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'Report',
        routerLink: disabled
          ? null
          : [
              ...routeLinkToNegotiationDetails,
              KnownSpotNegotiationRoutes.reportPath
            ],
        routerLinkActiveOptions: { exact: true },
        disabled
      },
      {
        label: 'Documents',
        routerLink: [
          ...routeLinkToNegotiationDetails,
          KnownSpotNegotiationRoutes.documentsPath
        ],
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'Email Log',
        routerLink: [
          ...routeLinkToNegotiationDetails,
          KnownSpotNegotiationRoutes.emailLog
        ],
        routerLinkActiveOptions: { exact: true }
      }
    ];
  }

  goToEmailLog() {
    this.router
      .navigate([
        KnownSpotNegotiationRoutes.spotNegotiation,
        this.negotiationId,
        KnownSpotNegotiationRoutes.emailLog
      ])
      .then(() => {});
    // if(this.isOpen == false){
    //   this.isOpen = true;
    // }
    //  else{
    //    this.spotEmailComp.getEmailLogs();
    //  }
  }

  confirmorderpopup() {
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    let isallow = false;
    locationsRows.forEach((element, lkey) => {
      if (element.requestOffers == undefined && element.isSelected) {
        isallow = true;
      }
      if (element.requestOffers != undefined) {
        if (element.checkProd1 && element.requestOffers[0] != undefined) {
          if (
            element.requestOffers[0].price < 0 ||
            element.requestOffers[0].price == null
          ) {
            isallow = true;
          }
        }
        if (element.checkProd2 && element.requestOffers[1] != undefined) {
          if (
            element.requestOffers[1].price < 0 ||
            element.requestOffers[1].price == null
          ) {
            isallow = true;
          }
        }
        if (element.checkProd3 && element.requestOffers[2] != undefined) {
          if (
            element.requestOffers[2].price < 0 ||
            element.requestOffers[2].price == null
          ) {
            isallow = true;
          }
        }
        if (element.checkProd4 && element.requestOffers[3] != undefined) {
          if (
            element.requestOffers[3].price < 0 ||
            element.requestOffers[3].price == null
          ) {
            isallow = true;
          }
        }
        if (element.checkProd5 && element.requestOffers[4] != undefined) {
          if (
            element.requestOffers[4].price < 0 ||
            element.requestOffers[4].price == null
          ) {
            isallow = true;
          }
        }
      }
    });
    if (!isallow) {
      const dialogRef = this.dialog.open(SpotnegoConfirmorderComponent, {
        width: '1045px',
        height: '555px',
        panelClass: 'additional-cost-popup'
      });

      dialogRef.afterClosed().subscribe(result => {});
    } else {
      this.toaster.warning('Cannot confirm offer as no offer price available');
      return;
    }
  }

  sendRFQpopup() {
    this.selectedSellerList = [];
    var Selectedfinaldata = this.FilterselectedRowForRFQ();
    if (Selectedfinaldata.length == 0) {
      let errormessage =
        'Atleast 1 counterparty should be selected in ' +
        this.currentRequestInfo.name +
        ' - ' +
        this.currentRequestInfo.vesselName;
      this.toaster.error(errormessage);
      return;
    } else {
      if (this.requestOptions.length > 1) {
        const dialogRef = this.dialog.open(SpotnegoSendRfqComponent, {
          width: '600px',
          height: '220px',
          panelClass: 'additional-cost-popup'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result instanceof Array) {
            var sellers = [];
            result.forEach(element => {
              if (element.selected === true) {
                const selectItems = this.selectedSellerList.filter(
                  item => item.RequestId === element.id
                );
                if (selectItems.length > 0) {
                  sellers.push(...selectItems);
                }
              }
            });
            this.selectedSellerList = sellers;
            if (this.selectedSellerList.length > 0) {
              this.sendRFQs();
            }
          }
        });
      } else {
        this.sendRFQs();
      }
    }
  }

  sendRFQs() {
    var FinalAPIdata = {
      RequestGroupId: this.currentRequestInfo.requestGroupId,
      quoteByDate: new Date(this.child.getValue()),
      selectedSellers: this.selectedSellerList
    };

    this.spinner.show();
    // Get response from server
    const response = this.spotNegotiationService.SendRFQ(FinalAPIdata);
    response.subscribe((res: any) => {
      this.spinner.hide();
      if (res instanceof Object && res['sellerOffers'].length > 0) {
        this.toaster.success('RFQ(s) sent successfully.');
        if (res['message'].length > 5) this.toaster.warning(res['message']);
      } else if (res instanceof Object) {
        this.toaster.warning(res.Message);
      } else {
        this.toaster.error(res);
        return;
      }

      const locationsRows = this.store.selectSnapshot<string>((state: any) => {
        return state.spotNegotiation.locationsRows;
      });

      const requestGroupID = this.store.selectSnapshot<string>((state: any) => {
        return state.spotNegotiation.groupOfRequestsId;
      });

      // this.store.dispatch(
      //   new SetLocationsRowsPriceDetails(res['sellerOffers'])
      // );

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
    let counterpartyList: any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      currentRequestData = spotNegotiation.locations;
      counterpartyList = spotNegotiation.counterpartyList;
    });

    rowsArray.forEach((row, index) => {
      let requestLocations = currentRequestData.filter(
        row1 => row1.id == row.requestLocationId
      );
      let currentLocProdCount = currentRequestData[0].requestProducts.length;
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        row[val] = false;
        row.isSelected = false;
      }
      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray.length &&
        row.id === priceDetailsArray[index].requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        //row.isSelected = priceDetailsArray[index].isSelected;
        row.physicalSupplierCounterpartyId =
          priceDetailsArray[index].physicalSupplierCounterpartyId;
        if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
          ).displayName;
        }
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;
        this.UpdateProductsSelection(requestLocations, row);
        //row.totalOffer = priceDetailsArray[index].totalOffer;
        return row;
      }

      // Else if not in the same index
      const detailsForCurrentRow = priceDetailsArray.filter(
        e => e.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers;
        //row.isSelected = detailsForCurrentRow[0].isSelected;
        row.physicalSupplierCounterpartyId =
          detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
          ).displayName;
        }
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
        row.totalCost = detailsForCurrentRow[0].totalCost;
        this.UpdateProductsSelection(requestLocations, row);
      }
      return row;
    });

    return rowsArray;
  }
  ///Report tab view
  onReport() {
    if (this.tenantConfiguration.isNegotiationReport) {
      const baseOrigin = new URL(window.location.href).origin;
      window.open(
        `${baseOrigin}/#/view-group-of-requests-report/${this.currentRequestInfo.requestGroupId}`,
        '_self'
      );
    }
  }

  UpdateProductsSelection(requestLocations, row) {
    if (requestLocations.length != 0) {
      let currentLocProdCount = requestLocations[0].requestProducts.length;
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        const status = requestLocations[0].requestProducts[index].status;
        row[val] =
          status === 'Stemmed' || status === 'Confirmed'
            ? false
            : row.isSelected;
        //row[val] = row.isSelected;
      }
    }
  }

  FilterselectedRowForRFQ() {
    this.store.subscribe(({ spotNegotiation }) => {
      spotNegotiation.requests.forEach(req => {
        req.requestLocations.forEach(element => {
          spotNegotiation.locationsRows.forEach(element1 => {
            if (element.id == element1.requestLocationId) {
              if (
                element1['checkProd1'] ||
                element1['checkProd2'] ||
                element1['checkProd3'] ||
                element1['checkProd4'] ||
                element1['checkProd5']
              ) {
                var Sellectedsellerdata = this.ConstuctSellerPayload(
                  element1,
                  element.requestProducts,
                  req
                );
                if (Sellectedsellerdata) {
                  this.selectedSellerList.push(Sellectedsellerdata);
                }
              }
            }
          });
        });
      });
    });
    return this.selectedSellerList;
  }

  ConstuctSellerPayload(Seller, requestProducts, Request) {
    let selectedproducts = [];
    let rfqId = 0;

    if (Seller['checkProd1']) {
      selectedproducts.push(requestProducts[0].id);
    }
    if (Seller['checkProd2']) {
      selectedproducts.push(requestProducts[1].id);
    }
    if (Seller['checkProd3']) {
      selectedproducts.push(requestProducts[2].id);
    }
    if (Seller['checkProd4']) {
      selectedproducts.push(requestProducts[3].id);
    }
    if (Seller['checkProd5']) {
      selectedproducts.push(requestProducts[4].id);
    }
    if (Seller.requestOffers !== undefined && Seller.requestOffers.length > 0) {
      rfqId = Seller.requestOffers[0].rfqId;
      //isRfqSkipped = Seller.requestOffers[0].isRfqskipped;
    }
    return {
      RequestLocationSellerId: Seller.id,
      SellerId: Seller.sellerCounterpartyId,
      RequestLocationID: Seller.requestLocationId,
      LocationID: Seller.locationId,
      RequestId: Request.id,
      physicalSupplierCounterpartyId: Seller.physicalSupplierCounterpartyId,
      RequestProductIds: selectedproducts,
      RfqId: rfqId,
      RequestOffers: Seller.requestOffers?.filter(row =>
        selectedproducts.includes(row.requestProductId)
      ),
      QuoteByDate: new Date(this.child.getValue())
    };
  }

  dateTimePicker(e) {
    //alert("");
    e.stopPropagation();
    this.child.pickerOpen();
  }

  displaySuccessMsg() {
    this.selectedSellerList = [];
    var Selectedfinaldata = this.FilterselectedRowForRFQ();
    if (Selectedfinaldata.length == 0) {
      this.toaster.error('Atleast 1 product should be selected');
      return;
    }
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
    var Selectedfinaldata = this.FilterselectedRowForRFQ();
    if (Selectedfinaldata.length == 0) {
      this.toaster.error('Atleast 1 product should be selected');
      return;
    } else if (this.selectedSellerList.find(x => x.RfqId === 0)) {
      this.toaster.error(
        'Amend RFQ cannot be sent as RFQ was not communicated.'
      );
      return;
    } else if (
      this.selectedSellerList.filter(
        x =>
          x.RfqId !== 0 &&
          x.RequestOffers?.find(x => !x.isRfqskipped && !x.isDeleted)
      ).length === 0
    ) {
      this.toaster.error('Amended RFQ cannot be sent as RFQ was skipped.');
      return;
    } else {
      var amendRFQRequestPayload = this.selectedSellerList;

      this.spinner.show();
      // Get response from server
      const response = this.spotNegotiationService.AmendRFQ(
        amendRFQRequestPayload
      );
      response.subscribe((res: any) => {
        this.spinner.hide();
        if (res instanceof Object && res['rfqIds'].length > 0) {
          this.toaster.success('Amend RFQ(s) sent successfully.');
          if (res['message'].length > 5) this.toaster.warning(res['message']);
        } else if (res instanceof Object) {
          this.toaster.warning(res.Message);
        } else {
          this.toaster.error(res);
        }
      });
    }
  }

  skipRFQ() {
    this.selectedSellerList = [];
    var Selectedfinaldata = this.FilterselectedRowForRFQ();
    if (Selectedfinaldata.length == 0) {
      let errormessage =
        'Atleast 1 counterparty should be selected in ' +
        this.currentRequestInfo.name +
        ' - ' +
        this.currentRequestInfo.vesselName;
      this.toaster.error(errormessage);
      return;
    } else if (
      this.selectedSellerList.find(
        x =>
          x.RfqId !== 0 && x.RequestOffers?.find(x => x.isRfqskipped === false)
      )
    ) {
      this.toaster.error('RFQ communicated to the counterparty already.');
      return;
    } else {
      var FinalAPIPayload = {
        RequestGroupId: this.currentRequestInfo.requestGroupId,
        quoteByDate: new Date(this.child.getValue()),
        selectedSellers: this.selectedSellerList
      };
      this.spinner.show();
      // Get response from server
      const response = this.spotNegotiationService.SkipRFQ(FinalAPIPayload);
      response.subscribe((res: any) => {
        this.spinner.hide();
        if (res instanceof Object && res['sellerOffers'].length > 0) {
          this.toaster.success('RFQ(s) skipped successfully.');
          if (res['message'].length > 5) this.toaster.warning(res['message']);
        } else if (res instanceof Object) {
          this.toaster.warning(res.Message);
        } else {
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
  }

  revokeRFQ() {
    this.selectedSellerList = [];
    var Selectedfinaldata = this.FilterselectedRowForRFQ();
    if (Selectedfinaldata.length == 0) {
      let errormessage =
        'Atleast 1 counterparty should be selected in ' +
        this.currentRequestInfo.name +
        ' - ' +
        this.currentRequestInfo.vesselName;
      this.toaster.error(errormessage);
      return;
    } else if (this.selectedSellerList.find(x => x.RfqId == 0)) {
      this.toaster.error(
        'Revoke RFQ cannot be sent as RFQ was not communicated.'
      );
      return;
    } else if (
      this.selectedSellerList.filter(
        x =>
          x.RfqId !== 0 &&
          x.RequestOffers?.find(x => !x.isRfqskipped && !x.isDeleted)
      ).length === 0
    ) {
      this.toaster.error('Revoke RFQ cannot be sent as RFQ was skipped.');
      return;
    } else {
      var FinalAPIdata = {
        RequestGroupId: this.currentRequestInfo.requestGroupId,
        selectedSellers: this.selectedSellerList
      };
      this.spinner.show();
      // Get response from server
      const response = this.spotNegotiationService.RevokeFQ(FinalAPIdata);
      response.subscribe((res: any) => {
        this.spinner.hide();
        if (res instanceof Object) {
          this.toaster.success('RFQ(s) revoked successfully.');
          if (res['message'].length > 3) this.toaster.warning(res['message']);
          // else
          //   this.toaster.success('RFQ(s) revoked successfully.');
        }
        // else if(res instanceof Object){
        //   this.toaster.warning(res.Message);
        // }
        else {
          this.toaster.error(res);
          return;
        }
        // window.location.reload();
        // const locationsRows = this.store.selectSnapshot<string>(
        //   (state: any) => {
        //     return state.spotNegotiation.locationsRows;
        //   }
        // );

        // const requestGroupID = this.store.selectSnapshot<string>(
        //   (state: any) => {
        //     return state.spotNegotiation.groupOfRequestsId;
        //   }
        // );

        // this.store.dispatch(
        //   new SetLocationsRowsPriceDetails(res['sellerOffers'])
        // );

        const futureLocationsRows = this.getLocationRowsWithPriceDetails(
          res['requestLocationSellers'],
          res['sellerOffers']
        );
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));

        this.changeDetector.detectChanges();

        if (res.isGroupDeleted) {
          const baseOrigin = new URL(window.location.href).origin;
          window.open(
            `${baseOrigin}/#/edit-request/${this.currentRequestInfo.id}`,
            '_self'
          );
          //window.open(`${baseOrigin}/#/edit-request/${request.id}`, '_blank');
        }
      });
    }
  }

  requoteRFQ() {
    this.selectedSellerList = [];
    var Selectedfinaldata = this.FilterselectedRowForRFQ();
    if (Selectedfinaldata.length == 0) {
      this.toaster.error('Atleast 1 product should be selected');
      return;
    } else if (this.selectedSellerList.find(x => x.RfqId === 0)) {
      this.toaster.error(
        'Requote RFQ cannot be sent as RFQ was not communicated.'
      );
      return;
    } else if (
      this.selectedSellerList.filter(
        x =>
          x.RfqId !== 0 &&
          x.RequestOffers?.find(x => !x.isRfqskipped && !x.isDeleted)
      ).length === 0
    ) {
      this.toaster.error('Requote RFQ cannot be sent as RFQ was skipped.');
      return;
    } else if (
      this.selectedSellerList.find(
        x => x.RfqId !== 0 && !x.RequestOffers?.some(x => x.price != null)
      )
    ) {
      this.toaster.error(
        'Atleast 1 offer price should be captured in order to requote.'
      );
      return;
    } else {
      var requoteRFQRequestPayload = this.selectedSellerList;

      this.spinner.show();
      // Get response from server
      const response = this.spotNegotiationService.RequoteRFQ(
        requoteRFQRequestPayload
      );
      response.subscribe((res: any) => {
        this.spinner.hide();
        if (res instanceof Object && res['rfqIds'].length > 0) {
          this.toaster.success('Requote RFQ(s) sent successfully.');
          if (res['message'].length > 5) this.toaster.warning(res['message']);
        } else if (res instanceof Object) {
          this.toaster.warning(res.Message);
        } else {
          this.toaster.error(res);
        }
      });
    }
  }
}
