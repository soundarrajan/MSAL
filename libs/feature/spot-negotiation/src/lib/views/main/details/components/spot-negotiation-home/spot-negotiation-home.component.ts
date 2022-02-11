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
  EditLocationRow,
  SetLocationsRows,
  UpdateRequest
} from '../../../../../store/actions/ag-grid-row.action';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { SpotnegoemaillogComponent } from '../spotnegoemaillog/spotnegoemaillog.component';
import { KnownSpotNegotiationRoutes } from 'libs/feature/spot-negotiation/src/lib/known-spot-negotiation.routes';
import { find, takeUntil } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';
import _ from 'lodash';

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
  requestOptionsToDuplicatePrice: any;
  isOpen: boolean = false;

  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;

  @ViewChild(SpotnegoemaillogComponent)
  spotEmailComp: SpotnegoemaillogComponent;

  selectedSellerList = [];
  selectedRequestList: any = [];
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
      if (this.requestOptions && this.currentRequestInfo) {
        this.requestOptionsToDuplicatePrice = this.requestOptions.filter(r => r.id != this.currentRequestInfo.id && r.requestLocations.some(l => l.requestProducts.some(pr => pr.status.toLowerCase().includes("inquired") || pr.status.toLowerCase().includes("quoted")))).map(req => ({ ...req, selected: true }));
        this.selectedRequestList = this.requestOptionsToDuplicatePrice
      }
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
      .then(() => { });
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

      dialogRef.afterClosed().subscribe(result => { });
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
              if (element.selected) {
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
    let requestProductIds = this.selectedSellerList.map(x => x.RequestProductIds);
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
      let reqs = this.store.selectSnapshot<any>((state: any) => {
        return state.spotNegotiation.requests;
      });

      const locationsRows = this.store.selectSnapshot<string>((state: any) => {
        return state.spotNegotiation.locationsRows;
      });

      // const requestGroupID = this.store.selectSnapshot<string>((state: any) => {
      //   return state.spotNegotiation.groupOfRequestsId;
      // });

      reqs = reqs.map(e => {
        let requestLocations = e.requestLocations.map(reqLoc => {
          let requestProducts = reqLoc.requestProducts.map(reqPro => requestProductIds.some(x => x.includes(reqPro.id)) &&
            (reqPro.status.toLowerCase() == 'validated' || reqPro.status.toLowerCase() == 'reopen') ? { ...reqPro, status: 'Inquired' } : reqPro)

          return { ...reqLoc, requestProducts }
        });
        return { ...e, requestLocations }
      });
      this.store.dispatch(new UpdateRequest(reqs));
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
    let requestlist: any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      currentRequestData = spotNegotiation.locations;
      requestlist = spotNegotiation.requests;
      counterpartyList = spotNegotiation.counterparties;
    });

    rowsArray.forEach((row, index) => {
      let requestLocations = currentRequestData.filter(row1 => row1.id == row.requestLocationId);
      let reqLocations = requestlist.filter(row1 => row1.id == row.requestId);
      let reqProducts = reqLocations.length > 0 ? reqLocations[0].requestLocations.filter(row1 => row1.id == row.requestLocationId) : [];
      let currentLocProdCount = reqProducts.length > 0 ? reqProducts[0].requestProducts.length : 0;
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
        row.requestOffers = priceDetailsArray[index].requestOffers?.sort((a, b) => (a.requestProductId > b.requestProductId ? 1 : -1));
        //row.isSelected = priceDetailsArray[index].isSelected;
        row.physicalSupplierCounterpartyId = priceDetailsArray[index].physicalSupplierCounterpartyId;
        if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
          )?.displayName;
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
        row.requestOffers = detailsForCurrentRow[0].requestOffers?.sort((a, b) => (a.requestProductId > b.requestProductId ? 1 : -1));
        //row.isSelected = detailsForCurrentRow[0].isSelected;
        row.physicalSupplierCounterpartyId = detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
          )?.displayName;
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
      this.selectedSellerList = [];
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
    let selectedproductIds = [];
    let selectedproduct = [];
    let rfqId = 0;

    if (Seller['checkProd1']) {
      selectedproductIds.push(requestProducts[0].id);
      selectedproduct.push(requestProducts[0]);
    }
    if (Seller['checkProd2']) {
      selectedproductIds.push(requestProducts[1].id);
      selectedproduct.push(requestProducts[1]);
    }
    if (Seller['checkProd3']) {
      selectedproductIds.push(requestProducts[2].id);
      selectedproduct.push(requestProducts[2]);
    }
    if (Seller['checkProd4']) {
      selectedproductIds.push(requestProducts[3].id);
      selectedproduct.push(requestProducts[3]);
    }
    if (Seller['checkProd5']) {
      selectedproductIds.push(requestProducts[4].id);
      selectedproduct.push(requestProducts[4]);
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
      RequestProductIds: selectedproductIds,
      RequestProducts: selectedproduct,
      RfqId: rfqId,
      RequestOffers: Seller.requestOffers?.filter(row =>
        selectedproductIds.includes(row.requestProductId)
      ),
      QuoteByDate: new Date(this.child.getValue())
    };
  }

  dateTimePicker(e) {
    //alert("");
    e.stopPropagation();
    this.child.pickerOpen();
  }

  onRequestListCheckboxChange(checkbox: any, element: any) {
    if (checkbox.checked && this.selectedRequestList?.filter(e => e.id == element.id).length == 0) {
      this.selectedRequestList.push(element);
    }

    if (!checkbox.checked) {
      this.selectedRequestList = this.selectedRequestList.filter(
        e => e.id !== element.id
      );
    }
  }

  copyPriceToSelectedRequests() {
    if (this.selectedRequestList.length > 0) {
      this.selectedSellerList = [];

      var selectedRows = this.FilterselectedRowForCurrentRequest();
      if (selectedRows.length == 0) {
        this.toaster.error('Atleast 1 product should be selected');
        return;
      }
      else if (selectedRows.filter(x => !x.RequestOffers || x.RequestOffers.find(r => r.price == null)).length != 0) {
        this.toaster.error('Please select the product(s) that has offer price.');
        return;
      }
      const locationsRows = this.store.selectSnapshot<any>(
        (state: any) => {
          return state.spotNegotiation.locationsRows;
        }
      );

      let selectedSellerRows = selectedRows.map(e => {
        let reqProdOffers = e.RequestProducts.map(reqProd => {
          let reqProOffers = e.RequestOffers?.find(reqOff => reqOff.requestProductId === reqProd.id)
          return { ...reqProd, ...reqProOffers }
        });
        return { ...e, ReqProdOffers: reqProdOffers }
      });

      let isProductsExists: boolean = false;
      let reqIdForLocation: String;
      let reqIdwithLocationForSeller: String;
      let isPhySupMandatoryForQuoting: boolean = false;
      let sellerDetails = [];
      let requestProductIds= []
      //avoid calculation based on physical supplier mandatory configurations.
      const tenantConfig = this.store.selectSnapshot(
        (state: SpotNegotiationStoreModel) => {
          return state['spotNegotiation'].tenantConfigurations;
        }
      );
      let reqIdwithSellerName: String;
      this.selectedRequestList.forEach(req => {
        var reqLocation = req.requestLocations.filter(l => selectedSellerRows.some(s => s.LocationID == l.locationId));
        if (reqLocation.length == 0) {
          reqIdForLocation = reqIdForLocation ? reqIdForLocation + ', ' + req.name : req.name;
        }
        reqLocation.forEach(reqLoc => {
          var reqOffers = locationsRows.filter(lr => lr.requestLocationId == reqLoc.id && lr.requestOffers && selectedSellerRows.some(s => s.SellerId == lr.sellerCounterpartyId));
          if (reqOffers.length == 0) {
            reqIdwithLocationForSeller = reqIdwithLocationForSeller ? reqIdwithLocationForSeller + ', ' + req.name + ' - ' + reqLoc.name : req.name + ' - ' + reqLoc.locationName;
          }
          reqOffers.forEach(locRows => {
            if (
              tenantConfig['isPhysicalSupplierMandatoryForQuoting'] &&
              !locRows.physicalSupplierCounterpartyId && selectedSellerRows.filter(x => x.LocationID == reqLoc.locationId && x.SellerId == locRows.sellerCounterpartyId).length > 0
            ) {
              if (reqIdwithSellerName)
                reqIdwithSellerName = reqIdwithSellerName + ', REQ ' + locRows.requestId.toString() + '-' + locRows.sellerCounterpartyName;
              else
                reqIdwithSellerName = 'REQ ' + locRows.requestId.toString() + '-' + locRows.sellerCounterpartyName;
              isPhySupMandatoryForQuoting = true;
              return false;
            }
            let filterRequestWithSameDtails = selectedSellerRows.filter(e => e.LocationID == reqLoc.locationId && e.SellerId == locRows.sellerCounterpartyId
              && (tenantConfig['isPhysicalSupplierMandatoryForQuoting'] && e.physicalSupplierCounterpartyId == locRows.physicalSupplierCounterpartyId) ||
              locRows.physicalSupplierCounterpartyId == null).map(result => {
                result.ReqProdOffers = result.ReqProdOffers.filter(p => reqLoc.requestProducts.some(rp => rp.productId === p.productId && (rp.status.toLowerCase().includes("inquired") || rp.status.toLowerCase().includes("quoted"))))
                return result
              });

            if (filterRequestWithSameDtails.length > 0 && filterRequestWithSameDtails?.filter(x => x.ReqProdOffers.length > 0).length > 0) {
              isProductsExists = true;
              filterRequestWithSameDtails?.filter(x => x.ReqProdOffers.length > 0).forEach(async req => {
                req.ReqProdOffers.forEach(proOff => {
                  locRows = this.spotNegotiationService
                    .formatRowData(
                      locRows,
                      reqLoc.requestProducts?.find(p => proOff.productId === p.productId),
                      'offPrice',
                      proOff.price,
                      reqLoc,
                      true
                    );
                    requestProductIds.push(reqLoc.requestProducts?.find(p => proOff.productId === p.productId).id);
                });

                // Update the store
                this.store.dispatch(new EditLocationRow(locRows));

                const reqLocSell = this.ConstructUpdatePricePayload(locRows, reqLoc.requestProducts, true);
                sellerDetails.push(reqLocSell);
              });

            }
            else {
              if (reqIdwithSellerName)
                reqIdwithSellerName = reqIdwithSellerName + ', REQ ' + locRows.requestId.toString() + '-' + locRows.sellerCounterpartyName;
              else
                reqIdwithSellerName = 'REQ ' + locRows.requestId.toString() + '-' + locRows.sellerCounterpartyName;
            }
          });
        });
      });

      if (reqIdForLocation) {
        this.toaster.error(
          'Selected location(s) does not exists in  ' + reqIdForLocation
        );
        return;
      }
      if (reqIdwithLocationForSeller) {
        this.toaster.error(
          'Selected seller(s) does not exists in  ' + reqIdwithLocationForSeller
        );
        return;
      }
      if (isPhySupMandatoryForQuoting) {
        this.toaster.error(
          'Physical Supplier(s) should be provided to copy offer price to ' + reqIdwithSellerName
        );
        return;
      }
      else if (!isProductsExists) {
        this.toaster.error('Selected product(s) does not exist for ' + reqIdwithSellerName);
        return;
      }
      const copyPricePayload = { copyPriceDetailsRequest: sellerDetails }
      this.spinner.show();
      const response = this.spotNegotiationService.copyPriceDetails(copyPricePayload);
      response.subscribe((res: any) => {
        this.spinner.hide();
        if (typeof res === 'boolean' && res == true) {
          this.toaster.success('Offer price copied successfully.');
          this.selectedRequestList = [];
          this.requestOptionsToDuplicatePrice = this.requestOptionsToDuplicatePrice.map(req => ({ ...req, selected: false }));

          this.requestOptions = this.requestOptions.map(e => {
            let requestLocations = e.requestLocations.map(reqLoc => {
              let requestProducts = reqLoc.requestProducts.map(reqPro => requestProductIds.some(x => x == reqPro.id) &&
                (reqPro.status.toLowerCase() == 'inquired') ? { ...reqPro, status: 'Quoted' } : reqPro)
    
              return { ...reqLoc, requestProducts }
            });
            return { ...e, requestLocations }
          });
          this.store.dispatch(new UpdateRequest(this.requestOptions));

        } else {
          this.toaster.error(res);
          return;
        }
      });
    }
    else {
      this.toaster.error('Select atlease one Request to proceed.');
      return;
    }
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
      let requestProductIds = this.selectedSellerList.map(x => x.RequestProductIds);
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

        // const requestGroupID = this.store.selectSnapshot<string>(
        //   (state: any) => {
        //     return state.spotNegotiation.groupOfRequestsId;
        //   }
        // );

        // this.store.dispatch(
        //   new SetLocationsRowsPriceDetails(res['sellerOffers'])
        // );

        const futureLocationsRows = this.getLocationRowsWithPriceDetails(
          JSON.parse(JSON.stringify(locationsRows)),
          res['sellerOffers']
        );
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));

        this.requestOptions = this.requestOptions.map(e => {
          let requestLocations = e.requestLocations.map(reqLoc => {
            let requestProducts = reqLoc.requestProducts.map(reqPro => requestProductIds.some(x => x.includes(reqPro.id)) &&
              (reqPro.status.toLowerCase() == 'validated'|| reqPro.status.toLowerCase() == 'reopen') ? { ...reqPro, status: 'Inquired' } : reqPro)
  
            return { ...reqLoc, requestProducts }
          });
          return { ...e, requestLocations }
        });
        this.store.dispatch(new UpdateRequest(this.requestOptions));

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
      const locationsRows = this.store.selectSnapshot<any>(
        (state: any) => {
          return state.spotNegotiation.locationsRows;
        }
      );
      let rfqIds = this.selectedSellerList.map(x => x.RfqId);
      let requestProductIds = locationsRows.filter(r => r.requestOffers && r.requestOffers.find(ro => (rfqIds.includes(ro.rfqId) && !ro.isRfqskipped))).map(x => x.requestOffers.filter(r => !r.isRfqskipped).map(r =>r.requestProductId));
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
        else{
          this.requestOptions = this.requestOptions.map(e => {
            let requestLocations = e.requestLocations.map(reqLoc => {
              let requestProducts = null;
              if (futureLocationsRows.filter(lr => lr.requestLocationId == reqLoc.id && lr.requestOffers).length == 0 || futureLocationsRows.filter(lr => lr.requestLocationId == reqLoc.id && lr.requestOffers?.find(x => !x.isRfqskipped)).length == 0){
              requestProducts = reqLoc.requestProducts.map(reqPro => requestProductIds.some(x => x.includes(reqPro.id)) ? { ...reqPro, status: 'ReOpen' } : reqPro)
              }

              return requestProducts ? { ...reqLoc, requestProducts} : reqLoc;
            
          });
          return requestLocations?{ ...e,  requestLocations} : e;
            
          });
          this.store.dispatch(new UpdateRequest(this.requestOptions));
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

  noQuoteAction() {
    var Selectedfinaldata = this.FilterselectedRowForRFQ();
    console.log(Selectedfinaldata);
    console.log(this.selectedSellerList);
    var requestOfferIds = [];
    this.selectedSellerList.forEach((e) => {
      requestOfferIds.push([...e.RequestOffers.map(e => e)]);
    })
    requestOfferIds = requestOfferIds.reduce((acc, val) => acc.concat(val), []); // flatten array
    console.log(requestOfferIds);  
    if(requestOfferIds.length == 0) {
      this.toaster.error("Offer Price cannot be marked as 'No Quote' as RFQ has neither been skipped or sent.");
      return;
    }
    let noQuotePayload = {
      "requestOfferIds": requestOfferIds.map(e => e.id),
      "noQuote": !requestOfferIds[0].hasNoQuote
    };
    let response = this.spotNegotiationService.switchReqOffBasedOnQuote(noQuotePayload);
    response.subscribe((res: any) => {
      console.log(res);
      if(res) {
        
        let locationsRows = this.store.selectSnapshot<any>((state: any) => {
          return state.spotNegotiation.locationsRows;
        });
        let changedRowsOffers = requestOfferIds.map(e => e.id)
        console.log(locationsRows);
        let updatedRows = _.cloneDeep(locationsRows);
        updatedRows.forEach(e => {
          e.requestOffers.forEach(requestOffer => {
            if(changedRowsOffers.includes(requestOffer.id)) {
              requestOffer.hasNoQuote = !requestOfferIds[0].hasNoQuote;
            }
          });
        })
        this.store.dispatch(new SetLocationsRows(updatedRows));
        // params.node.setData(updatedRows);     

        let successMessage = requestOfferIds[0].hasNoQuote ? "Selected Offer Price has been enabled." : "Selected Offers have been marked as 'No Quote' successfully.";
        this.toaster.success(successMessage);

      }
    })
    console.log(noQuotePayload);    
  }

  FilterselectedRowForCurrentRequest() {
    this.store.subscribe(({ spotNegotiation }) => {
      spotNegotiation.locations.forEach(element => {
        spotNegotiation.locationsRows.forEach(element1 => {
          if (element.id == element1.requestLocationId && spotNegotiation.currentRequestSmallInfo.id == element1.requestId) {
            if (element1['checkProd1'] || element1['checkProd2'] || element1['checkProd3'] || element1['checkProd4'] || element1['checkProd5']) {
              var Sellectedsellerdata = this.ConstuctSellerPayload(
                element1,
                element.requestProducts,
                spotNegotiation.currentRequestSmallInfo
              );
              if (Sellectedsellerdata) {
                this.selectedSellerList.push(Sellectedsellerdata);
              }
            }
          }
        });
      });
    });
    return this.selectedSellerList;
  }

  ConstructUpdatePricePayload(updatedRow, products, isPriceCopied) {
    let requestOffers = []
    let offerId: number;

    products.forEach(pro => {
      const productDetails = this.spotNegotiationService.getRowProductDetails(updatedRow, pro.id);

      if (productDetails.id == null || productDetails.price == null) {
        return;
      }
      offerId = productDetails.offerId;
      let requOffer = {
        id: productDetails.id,
        totalPrice: productDetails.totalPrice,
        amount: productDetails.amount,
        targetDifference: productDetails.targetDifference,
        price: productDetails.price,
        cost: productDetails.cost,
        currencyId: productDetails.currencyId,
        isOfferPriceCopied: productDetails.isOfferPriceCopied
      }
      requestOffers.push(requOffer);
    });
    return {
      RequestLocationSellerId: updatedRow.id,
      Offers: [
        {
          id: offerId,
          totalOffer: updatedRow.totalOffer,
          totalCost: updatedRow.totalCost,
          requestOffers: requestOffers
        }
      ]
    };
  }

}
