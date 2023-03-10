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
  SetNetEnergySpecific,
  SetOfferPriceFormulaId,
  SetStaticLists,
  UpdateRequest
} from '../../../../../store/actions/ag-grid-row.action';
import { SpotnegoemaillogComponent } from '../spotnegoemaillog/spotnegoemaillog.component';
import { KnownSpotNegotiationRoutes } from 'libs/feature/spot-negotiation/src/lib/known-spot-negotiation.routes';

import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';
import _ from 'lodash';
import { NegotiationDetailsToolbarComponent } from '../../../toolbar/spot-negotiation-details-toolbar.component';
import { MyMonitoringService } from '@shiptech/core/services/app-insights/logging.service';
import { SpotNegotiationPriceCalcService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation-price-calc.service';
import { ServerQueryFilter } from '@shiptech/core/grid/server-grid/server-query.filter';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { forkJoin } from 'rxjs';
import { SetQuoteDateAndTimeZoneId } from 'libs/feature/spot-negotiation/src/lib/store/actions/request-group-actions';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';

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
  RequestStatusIsStemmed:any;
  switchTheme; //false-Light Theme, true- Dark Theme
  quoteByTimeZoneId:number|null;
  quoteByTimeZone:any;
  requestOptionsToDuplicatePrice: any;
  isOpen: boolean = false;
  public expand_quoteDate:boolean = true;
  private legacyLookupsDatabase: LegacyLookupsDatabase;
  staticLists: any;
  timeZones:any;
  @ViewChild(NegotiationDetailsToolbarComponent)
  negoNavBarChild: NegotiationDetailsToolbarComponent;

  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;

  @ViewChild(SpotnegoemaillogComponent)
  spotEmailComp: SpotnegoemaillogComponent;

  @ViewChild('headerDetails') headerDetailsComponent: any;

  selectedSellerList = [];
  selectedRequestList: any = [];
  currentRequestInfo: any;
  tenantConfiguration: any;
  RequestGroupID: number;
  generalTenantSettings:any;
  negotiationId: any;
  requestId: any;
  emailLogUrl: string;
  baseOrigin: string;
  isAuthorizedForReportsTab: boolean = false;
  public menuItems: any[];
  public isOrderexisting:boolean = false;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private changeDetector: ChangeDetectorRef,
    private store: Store,
    private spinner: NgxSpinnerService,
    private spotNegotiationService: SpotNegotiationService,
    private tenantSettingsService: TenantSettingsService,
    private router: Router,
    private spotNegotiationPriceCalcService: SpotNegotiationPriceCalcService,
    private myMonitoringService: MyMonitoringService
  ) {
    this.baseOrigin = new URL(window.location.href).origin;
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
  }

  ngOnInit(): void {
    // this.route.data.subscribe(data => {
    //   this.navBar = data.navBar;
    // });
    this.tenantConfiguration = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.tenantConfigurations;
    });
    const response = this.spotNegotiationService.CheckWhetherUserIsAuthorizedForReportsTab();
    response.subscribe((res: any) => {
      if (res?.message == 'Unauthorized') {
        this.isAuthorizedForReportsTab = false;
      } else {
        this.isAuthorizedForReportsTab = true;
      }
      
      this.store.subscribe(({ spotNegotiation }) => {
        //this.spotNegotiationService.callGridRefreshService();
        this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
        if (
          this.currentRequestInfo &&
          this.negoNavBarChild &&
          this.navBar != this.currentRequestInfo.id
        ) {
          this.navBar = this.currentRequestInfo.id;
          this.negoNavBarChild.createNavBarIds(this.currentRequestInfo.id);
        }
        this.requestOptions = spotNegotiation.requests;
        if (this.requestOptions && this.currentRequestInfo) {
          this.requestOptionsToDuplicatePrice = this.requestOptions
            .filter(
              r =>
                r.id != this.currentRequestInfo.id && 
                r.requestLocations.some(l =>
                  l.requestProducts.some(
                    pr =>
                      pr.status.toLowerCase().includes('inquired') ||
                      pr.status.toLowerCase().includes('quoted')
                  )
                )
            )
            .map(req => ({ ...req, selected: true }));
          this.selectedRequestList = this.requestOptionsToDuplicatePrice;
        }
         this.RequestStatusIsStemmed = false;
        if (this.requestOptions.length>0){
          if(this.requestOptions[0].status=="Stemmed")
          {
          this.RequestStatusIsStemmed=true;
          }
        }
        this.tenantConfiguration = spotNegotiation.tenantConfigurations;
        this.setTabItems();
      });
  
      this.route.params.pipe().subscribe(params => {
        this.negotiationId = params.spotNegotiationId;
        if(params.requestId)
          this.requestId = params.requestId;
      });
    });
    
  }
  ngDoCheck(){
    this.quoteByTimeZoneId=this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.quoteTimeZoneIdByGroup;
    });
    this.staticLists = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.staticLists;
    });
    this.timeZones=this.staticLists['timeZone'];
    if(this.timeZones!=undefined && this.spotNegotiationService.QuoteByTimeZoneId!=undefined){
      this.quoteByTimeZone=this.timeZones?.find(x => x.id == this.spotNegotiationService.QuoteByTimeZoneId).name;
    }
    this.spotNegotiationService.QuoteByDate= this.spotNegotiationService.QuoteByDate;
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
    });
  }

  setTabItems() {
    const routeLinkToNegotiationDetails = [
      '/',
      KnownPrimaryRoutes.SpotNegotiation,
      this.negotiationId
    ];
    //let disabled = !this.tenantConfiguration.isNegotiationReport;
    this.menuItems = [
      {
        label: 'Main Page',
        routerLink: [
          ...routeLinkToNegotiationDetails,
          this.requestId ?? KnownSpotNegotiationRoutes.details
        ],
        routerLinkActiveOptions: { exact: true },
        command: () => {
          this.setActiveRequest();
        }
      },
      {
        label: 'Report',
        //  //,
        //   ? //routerLink: disabled
        //     null
        //   : 
        routerLink: [
          ...routeLinkToNegotiationDetails,
          KnownSpotNegotiationRoutes.reportPath
        ],
        routerLinkActiveOptions: { exact: true },
        //disabled,
        visible:
          this.isAuthorizedForReportsTab &&
          this.tenantConfiguration.isNegotiationReport,
        command: () => {
          this.setActiveRequest();
        }
      },
      {
        label: 'Documents',
        routerLink: [
          ...routeLinkToNegotiationDetails,
          KnownSpotNegotiationRoutes.documentsPath
        ],
        routerLinkActiveOptions: { exact: true },
        command: () => {
          this.setActiveRequest();
        }
      },
      {
        label: 'Email Log',
        routerLink: [
          ...routeLinkToNegotiationDetails,
          KnownSpotNegotiationRoutes.emailLog
        ],
        routerLinkActiveOptions: { exact: true },
        command: () => {
          this.setActiveRequest();
        }
      }
    ];
  }
  compareQuoteByTimeZoneIdObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
  selectedQuoteByTimeZone(value){
    this.quoteByTimeZoneId=value.id;
    this.quoteByTimeZone =value.name;
    this.updateQuoteByGroup();
  }
  updateQuoteByGroup(){
    let payload={
      QuoteByTimeZoneId:this.quoteByTimeZoneId, 
      RequestGroupId:this.currentRequestInfo.requestGroupId, 
      QuoteByDate:this.spotNegotiationService.QuoteByDate 
    }
    this.spotNegotiationService
    .updateQuoteDateGroup(payload)
    .subscribe((response: any) => {
      if (response?.message == 'Unauthorized') {
        return;
      }
      if (response.status) {
        this.spotNegotiationService.QuoteByTimeZoneId=payload.QuoteByTimeZoneId;
        this.spotNegotiationService.QuoteByDate=payload.QuoteByDate;
        let setQuoteByGroup={
          quoteTimeZoneIdByGroup:payload.QuoteByTimeZoneId,
          quoteDateByGroup: payload.QuoteByDate
        };
        payload.QuoteByTimeZoneId;
        this.store.dispatch(new SetQuoteDateAndTimeZoneId(setQuoteByGroup));
      }
    });
  }
  setActiveRequest() {
    (<any>window).activeRequest = {
      i: this.headerDetailsComponent.selReqIndex
    };
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
loadTimeZone(){
    this.staticLists = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.staticLists;
    });
    this.timeZones=this.staticLists['timeZone'];
}

 async confirmorderpopup() {
    this.isOrderexisting = false;
    let selectedFinalData = this.FilterselectedRowForRFQ();
    let requestOffers = [];
    selectedFinalData.forEach(e => {
      if(e.RequestOffers){
        requestOffers.push([...e.RequestOffers.map(e => e)]);
      }
    });
    requestOffers = requestOffers.reduce((acc, val) => acc.concat(val), []); // flatten array
    let checkIfExistRequestOffersWithNoQuote = _.filter(requestOffers, function(
      element
    ) {
      return element.hasNoQuote;
    });
    if (
      checkIfExistRequestOffersWithNoQuote &&
      checkIfExistRequestOffersWithNoQuote.length
    ) {
      this.toaster.warning(
        'Offer Price set as No Quote cannot be used for order creation'
      );
      return;
    }

    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    let requestLocations = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });

    let isallow = false;
    locationsRows.forEach((element, lkey) => {
      let reqLoc = requestLocations?.find(l => l.id ==element.requestLocationId);
      if (reqLoc && element.requestOffers == undefined && element.isSelected) {
        isallow = true;
      }
      if (reqLoc && element.requestOffers != undefined) {
        if (element.checkProd1 && reqLoc?.requestProducts[0]) {
          let offer = element.requestOffers?.find(x => x.requestProductId == reqLoc?.requestProducts[0].id);
          if (offer && offer.price == null) {
            isallow = true;
          }
        }
        if (element.checkProd2 && reqLoc?.requestProducts[1]) {
          let offer = element.requestOffers?.find(x => x.requestProductId == reqLoc?.requestProducts[1].id);
          if (offer && offer.price == null) {
            isallow = true;
          }
        }
        if (element.checkProd3 && reqLoc?.requestProducts[2]) {
          let offer = element.requestOffers?.find(x => x.requestProductId == reqLoc?.requestProducts[2].id);
          if (offer && offer.price == null) {
            isallow = true;
          }
        }
        if (element.checkProd4 && reqLoc?.requestProducts[3]) {
          let offer = element.requestOffers?.find(x => x.requestProductId == reqLoc?.requestProducts[3].id);
          if (offer && offer.price == null) {
            isallow = true;
          }
        }
        if (element.checkProd5 && reqLoc?.requestProducts[4]) {
          let offer = element.requestOffers?.find(x => x.requestProductId == reqLoc?.requestProducts[4].id);
          if (offer && offer.price == null) {
            isallow = true;
          }
        }
      }
    });
this.checkorderexists();
    if (!isallow) {
      setTimeout(() => {
        const dialogRef = this.dialog.open(SpotnegoConfirmorderComponent, {
          data: this.isOrderexisting,
          width: '1045px',
          height: '555px',
          panelClass: 'additional-cost-popup'
        });  
        dialogRef.afterClosed().subscribe(result => {});
        this.spotNegotiationService.callGridRefreshService();
      },1500);
    } else {
      this.toaster.warning('Cannot confirm offer as no offer price available');
      return;
    }
  }

  async checkorderexists(){
    let RequestProductIds = [];
    let filters: ServerQueryFilter[] = [];
    RequestProductIds = this.selectedSellerList.map(
      x => x.RequestProductIds
    );
    if (RequestProductIds.length > 0) {
      filters = [
        {
          columnName: 'RequestProductIds',
          value: '[' + RequestProductIds.join(',') + ']'
        }
      ];
    } else {
      this.toaster.warning('Please select at least one products');
      return;
    }
    let payload = {
      filters
    };
    const response = await this.spotNegotiationService.GetExistingOrders(payload);
        if (response?.message == 'Unauthorized') {
          return;
        }
        if (response.payload.length > 0 && response.payload.some(x=>x.id !=null)) {
          for (let existingorders of response.payload) {
            this.isOrderexisting = this.selectedSellerList.some(y=>y.RequestLocationId == existingorders.requestLocationId && ((y.LocationID > 0 && existingorders.locationId > 0) ? y.LocationID == existingorders.locationId : true) && y.SellerId  == existingorders.seller?.id);
            if (this.isOrderexisting == true) {
                return;
            }
          }      
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
    let selectedSellerrName: String;
    let selectedCounterpartyList = [];
    let requestProductIds = this.selectedSellerList.map(
      x => x.RequestProductIds
    );
    let locRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });


    this.selectedSellerList.forEach(selectedSeller => {
      if(selectedSeller.RfqId !== 0 && selectedSeller.RequestOffers?.length > 0 && !selectedSeller.RequestOffers?.some(x => !x.isRfqskipped && !x.isDeleted)){
          if (selectedSellerrName)
          selectedSellerrName =
          selectedSellerrName +
              ', ' +
              locRows.find(x=> x.sellerCounterpartyId === selectedSeller.SellerId).sellerCounterpartyName;
          else
          selectedSellerrName =
          locRows.find(x=> x.sellerCounterpartyId === selectedSeller.SellerId).sellerCounterpartyName;

      }
      else{
        selectedCounterpartyList.push(selectedSeller);
      }
    });

    if (selectedSellerrName) {
      this.toaster.error(
        'RFQ mail cannot be sent as the RFQ was skipped earlier for  ' + selectedSellerrName 
      );
    }
    if(selectedCounterpartyList.length === 0) {return;}

    var FinalAPIdata = {
      RequestGroupId: this.currentRequestInfo.requestGroupId,
      quoteByDate: this.spotNegotiationService.QuoteByDate,
      selectedSellers: this.selectedSellerList
    };
    this.spinner.show();

    (<any>window).startSendRFQTime = Date.now();

    // Get response from server
    const response = this.spotNegotiationService.SendRFQ(FinalAPIdata);
    response.subscribe(async (res: any) => {
      this.spinner.hide();
      if (res?.message == 'Unauthorized') {
        return;
      }
      if (res instanceof Object && res['sellerOffers'].length > 0) {
        this.myMonitoringService.logMetric(
          'Send RFQ ' + (<any>window).location.href,
          Date.now() - (<any>window).startSendRFQTime,
          (<any>window).location.href
        );

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

      reqs = reqs.map(e => {
        let requestLocations = e.requestLocations.map(reqLoc => {
          let requestProducts = reqLoc.requestProducts.map(reqPro =>
            requestProductIds.some(x => x.includes(reqPro.id)) &&
            (reqPro.status.toLowerCase() == 'validated' ||
              reqPro.status.toLowerCase() == 'reopen')
              ? { ...reqPro, status: 'Inquired' }: reqPro
          );
          return { ...reqLoc, requestProducts };
        });
        return { ...e, requestLocations };
      });

      const futureLocationsRows = this.getLocationRowsWithPriceDetails(
        JSON.parse(JSON.stringify(locationsRows)),
        res['sellerOffers']
      );
      let reqLocationRows : any =[];
        for (const locRow of futureLocationsRows) {
          var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
            locRow,
            locRow);
            reqLocationRows.push(data);
        }
      this.store.dispatch([new UpdateRequest(reqs), new SetLocationsRows(reqLocationRows)]);
      let locationIds=reqLocationRows.map(loc=>loc.locationId);
      let productIds=reqLocationRows.map(ro=>ro?.requestOffers?.map(r=>r.quotedProductId));
      let physicalSupplierIds=reqLocationRows.map(phy=>phy.physicalSupplierCounterpartyId);
      let payload=  {
        locationIds: [...new Set(locationIds)],
        productIds:[...new Set(productIds.reduce((acc, val) => acc.concat(val), []).reduce((acc, val) => acc.concat(val), []))],
        physicalSupplierIds:[...new Set(physicalSupplierIds)],
        requestGroupId:this.currentRequestInfo.requestGroupId
      }
      this.getEnergy6MHistory(payload);
      // this.spotNegotiationService.callGridRefreshServiceAll();
      this.spotNegotiationService.callGridRedrawService();
      this.changeDetector.detectChanges();
    });
  }
  /// get avg netEnergy6MonthHistory
  async getEnergy6MHistory(payload){   
    const response = await this.spotNegotiationService.getEnergy6MHistorys(payload);
    if (response.energy6MonthHistories.length > 0){
        this.store.dispatch(new SetNetEnergySpecific(response.energy6MonthHistories));
      }
  }
 toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let currentRequestData: any;
    let counterpartyList: any;
    let requestlist: any;
    //let currencyList: any;
    currentRequestData = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });
    requestlist = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });
    counterpartyList = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.counterparties;
    });
    // currencyList = this.store.selectSnapshot<any>((state: any) => {
    //   return state.spotNegotiation.staticLists['currency'];
    // });

    rowsArray.forEach((row, index) => {
      let requestProducts = requestlist?.find(x => x.id == row.requestId)?.requestLocations?.find(l => l.id ==row.requestLocationId)?.requestProducts;
      let requestLocations = currentRequestData.filter(
        row1 => row1.id == row.requestLocationId
      );
      let reqLocations = requestlist.filter(rq =>
        rq.requestLocations.some(rl => rl.id == row.requestLocationId)
      );
      let reqProducts =
        reqLocations.length > 0
          ? reqLocations[0].requestLocations.filter(
              row1 => row1.id == row.requestLocationId
            )
          : [];
      let currentLocProdCount =
        reqProducts.length > 0 ? reqProducts[0].requestProducts.length : 0;
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
          )?.displayName;
        }
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;
        row.requestAdditionalCosts = priceDetailsArray[index].requestAdditionalCosts;
        this.UpdateProductsSelection(requestLocations, row);
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
          let requestProductTypeOrderBy = requestProducts?.find(rp => rp.id == e.requestProductId)?.productTypeOrderBy;
           return { ...e, reqProdStatus: isStemmed, requestProductTypeOrderBy: requestProductTypeOrderBy};
        });
        row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeOrderBy === b.requestProductTypeOrderBy
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeOrderBy > b.requestProductTypeOrderBy
            ? 1
            : -1
        );
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
          )?.displayName;
        }
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
        row.totalCost = detailsForCurrentRow[0].totalCost;
        row.requestAdditionalCosts = detailsForCurrentRow[0].requestAdditionalCosts;
        this.UpdateProductsSelection(requestLocations, row);
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
          let requestProductTypeOrderBy = requestProducts?.find(rp => rp.id == e.requestProductId)?.productTypeOrderBy;
           return { ...e, reqProdStatus: isStemmed, requestProductTypeOrderBy: requestProductTypeOrderBy };
        });
        row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeOrderBy === b.requestProductTypeOrderBy
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeOrderBy > b.requestProductTypeOrderBy
            ? 1
            : -1
        );
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
    let requests = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });
    let locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });

    //this.store.subscribe(({ spotNegotiation }) => {
      this.selectedSellerList = [];
      requests.forEach(req => {
        req.requestLocations.forEach(element => {
          locationsRows.forEach(element1 => {
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
    //});
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
      RequestLocationId: Seller.requestLocationId,
      LocationID: Seller.locationId,
      RequestId: Request.id,
      physicalSupplierCounterpartyId: Seller.physicalSupplierCounterpartyId,
      RequestProductIds: selectedproductIds,
      RequestProducts: selectedproduct,
      RfqId: rfqId,
      RequestOffers: Seller.requestOffers?.filter(row =>
        selectedproductIds.includes(row.requestProductId)
      ),
      QuoteByDate: new Date(this.spotNegotiationService.QuoteByDate )
    };
  }

  dateTimePicker(e) {
    //alert("");
    e.stopPropagation();
    this.child.pickerOpen();
  }

  onRequestListCheckboxChange(checkbox: any, element: any) {
    if (
      checkbox.checked &&
      this.selectedRequestList?.filter(e => e.id == element.id).length == 0
    ) {
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
      const tenantConfig = this.store.selectSnapshot(
        (state: SpotNegotiationStoreModel) => {
          return state['spotNegotiation'].tenantConfigurations;
        }
      );
      var selectedRows = this.FilterselectedRowForCurrentRequest();
      if (selectedRows.length == 0) {
        this.toaster.error('Atleast 1 product should be selected');
        return;
      } else if (
        selectedRows.filter(
          x => !x.RequestOffers || (x.RequestOffers.find(r => !r.hasNoQuote && r.price == null))
        ).length != 0
      ) {
        this.toaster.error(
          'Please select the product(s) that has offer price.'
        );
        return;
      }
      else if (
        tenantConfig['isPhysicalSupplierMandatoryForQuoting'] &&
        selectedRows.filter(
              x =>
                (x.physicalSupplierCounterpartyId == null ||
                  x.physicalSupplierCounterpartyId == '')
            ).length != 0
      ) {
        this.toaster.error(
          'Physical Supplier(s) should be provided to copy offer price.'
        );
        return;
      }
      let locationsRows = this.store.selectSnapshot<any>((state: any) => {
        return state.spotNegotiation.locationsRows;
      });
      let selectedSellerRows = selectedRows.map(e => {
        let reqProdOffers = e.RequestProducts.map(reqProd => {
          let reqProOffers = e.RequestOffers?.find(
            reqOff => reqOff.requestProductId === reqProd.id
          );
          return { ...reqProd, ...reqProOffers };
        });
        return { ...e, ReqProdOffers: reqProdOffers };
      });

      let isProductsExists: boolean = false;
      let reqIdForLocation: String;
      let reqIdwithLocationForSeller: String;
      let isPhySupMandatoryForQuoting: boolean = false;
      let sellerDetails = [];
      let requestProductIds = [];
      //avoid calculation based on physical supplier mandatory configurations.
      let reqIdwithSellerName: String;
      let reqLocationsRows = [];
      this.selectedRequestList.forEach(req => {
        var reqLocation = req.requestLocations.filter(l =>
          selectedSellerRows.some(s => s.LocationID == l.locationId)
        );
        if (reqLocation.length == 0) {
          reqIdForLocation = reqIdForLocation
            ? reqIdForLocation + ', ' + req.name
            : req.name;
        }
        reqLocation.forEach(reqLoc => {
          var reqOffers = locationsRows.filter(
            lr =>
              lr.requestLocationId == reqLoc.id &&
              lr.requestOffers &&
              selectedSellerRows.some(
                s =>
                  s.SellerId == lr.sellerCounterpartyId &&
                  ((tenantConfig['isPhysicalSupplierMandatoryForQuoting'] &&
                    lr.physicalSupplierCounterpartyId ==
                      s.physicalSupplierCounterpartyId) ||
                    (!tenantConfig['isPhysicalSupplierMandatoryForQuoting'] && lr.physicalSupplierCounterpartyId == null ||
                    lr.physicalSupplierCounterpartyId == '' || lr.physicalSupplierCounterpartyId ==
                    s.physicalSupplierCounterpartyId))
              )
          );
          if (reqOffers.length == 0) {
            reqIdwithLocationForSeller = reqIdwithLocationForSeller
              ? reqIdwithLocationForSeller +
                ', ' +
                req.name +
                ' - ' +
                reqLoc.locationName
              : req.name + ' - ' + reqLoc.locationName;
          }
          reqOffers.forEach(locRows => {
            if (
              tenantConfig['isPhysicalSupplierMandatoryForQuoting'] &&
              !locRows.physicalSupplierCounterpartyId &&
              selectedSellerRows.filter(
                x =>
                  x.LocationID == reqLoc.locationId &&
                  x.SellerId == locRows.sellerCounterpartyId &&
                  (locRows.physicalSupplierCounterpartyId == null ||
                    locRows.physicalSupplierCounterpartyId == '')
              ).length > 0
            ) {
              if (reqIdwithSellerName)
                reqIdwithSellerName =
                  reqIdwithSellerName +
                  ', REQ ' +
                  locRows.requestId.toString() +
                  '-' +
                  locRows.sellerCounterpartyName;
              else
                reqIdwithSellerName =
                  'REQ ' +
                  locRows.requestId.toString() +
                  '-' +
                  locRows.sellerCounterpartyName;
              isPhySupMandatoryForQuoting = true;
              return false;
            }
            let filterRequestWithSameDtails = selectedSellerRows
              .filter(
                e =>
                  e.LocationID == reqLoc.locationId &&
                    e.SellerId == locRows.sellerCounterpartyId &&
                    ((tenantConfig['isPhysicalSupplierMandatoryForQuoting'] &&
                    e.physicalSupplierCounterpartyId ==
                      locRows.physicalSupplierCounterpartyId) ||
                  !tenantConfig['isPhysicalSupplierMandatoryForQuoting'])
              )
              .map(result => {
                result.ReqProdOffers = result.ReqProdOffers.filter(p =>
                  reqLoc.requestProducts.some(
                    rp =>
                      rp.productId === p.productId &&
                      (rp.status.toLowerCase().includes('inquired') ||
                        rp.status.toLowerCase().includes('quoted'))
                  )
                );
                return result;
              });

            if (
              filterRequestWithSameDtails.length > 0 &&
              filterRequestWithSameDtails?.filter(
                x => x.ReqProdOffers.length > 0
              ).length > 0
            ) {
              isProductsExists = true;
              filterRequestWithSameDtails
                ?.filter(x => x.ReqProdOffers.length > 0)
                .forEach(async req => {
                  req.ReqProdOffers.forEach(proOff => {
                    locRows = this.spotNegotiationService.formatRowData(
                      locRows,
                      reqLoc.requestProducts?.find(
                        p => proOff.productId === p.productId
                      ),
                      'offPrice',
                      proOff.price,
                      reqLoc,
                      true,
                      proOff,
                      proOff.isFormulaPricing,
                      proOff.offerPriceFormulaId
                    );
                    requestProductIds.push(
                      reqLoc.requestProducts?.find(
                        p => proOff.productId === p.productId
                      ).id
                    );
                  });

                  const reqLocSell = this.ConstructUpdatePricePayload(
                    locRows,
                    reqLoc.requestProducts,
                    true
                  );
                  sellerDetails.push(reqLocSell);
                  reqLocationsRows.push(locRows);
                });
            } else {
              if (reqIdwithSellerName)
                reqIdwithSellerName =
                  reqIdwithSellerName +
                  ', REQ ' +
                  locRows.requestId.toString() +
                  '-' +
                  locRows.sellerCounterpartyName;
              else
                reqIdwithSellerName =
                  'REQ ' +
                  locRows.requestId.toString() +
                  '-' +
                  locRows.sellerCounterpartyName;
            }
          });
        });
      });

      if (reqIdForLocation) {
        this.toaster.warning(
          'Selected location(s) does not exists in  ' + reqIdForLocation
        );
      }
      if (
        tenantConfig['isPhysicalSupplierMandatoryForQuoting'] &&
        reqIdwithLocationForSeller
      ) {
        this.toaster.warning(
          'Selected seller(s) does not have same physical supplier in ' +
            reqIdwithLocationForSeller
        );
      }
      if (
        !tenantConfig['isPhysicalSupplierMandatoryForQuoting'] &&
        reqIdwithLocationForSeller
      ) {
        this.toaster.warning(
          'Selected seller(s) does not exists in ' + reqIdwithLocationForSeller
        );
      }
            // if (isPhySupMandatoryForQuoting) {
      //   this.toaster.error(
      //     'Physical Supplier(s) should be provided to copy offer price to ' +
      //       reqIdwithSellerName
      //   );
      //   return;
      // }
      if (isPhySupMandatoryForQuoting) {
        this.toaster.error(
          'Physical Supplier(s) should be provided to copy offer price');
        return;
      }
      else if (!isProductsExists && reqIdwithSellerName) {
        this.toaster.warning(
          'Selected product(s) does not exist for ' + reqIdwithSellerName
        );
      }
      if(sellerDetails.length == 0) return;
      let requestLocationIds = [];
      selectedSellerRows.forEach(sellerRow => {
        requestLocationIds.push(sellerRow.RequestLocationId);
      });

      let sellerDetailsforFormula =[] ;
      sellerDetails.map(rows => rows.Offers.map(offer => {
         offer.requestOffers.map(x=> {
            if(x.isFormulaPricing && x.offerPriceFormulaId){
              sellerDetailsforFormula.push({
                priceConfigurationId : x.offerPriceFormulaId,
                requestOfferIds : [x.id]
              })
            }
         })
      }));

      // Stop the copy the formula price to fixed price and fixed price to formula price - Start 
      let checkLocation = [];
      this.selectedRequestList.forEach(element => {
       checkLocation =  [...checkLocation, ...locationsRows.filter(arr => arr.requestId == element.id && arr?.requestOffers)];
      });

      let copyFlag = true;
      selectedSellerRows.forEach(el => { 
        checkLocation.filter(res => {
          if(el.SellerId == res.sellerCounterpartyId){
            el.RequestOffers.forEach(element => {
              res.requestOffers.filter(inner => {
                if(inner.quotedProductId == element.quotedProductId){
                  if(inner.isFormulaPricing != element.isFormulaPricing && inner.price != null){
                    copyFlag = false;
                    return;
                  }
                }
              })
            });
          }
        });
      });

      if(!copyFlag){
        this.toaster.warning('Unable to copy price from "Fixed to Formula price" or "Formula to Fixed price"');
        return;
      }
      // Stop the copy the formula price to fixed price and fixed price to formula price - End
     
      if(sellerDetailsforFormula.length>0){
        // let checkForErrors = [];
        // sellerDetailsforFormula.forEach(x=>{
        //   x.requestOfferIds.forEach(y=>
        //     checkForErrors = this.checkQuoatedPriceAcrossLocations(y, locationsRows)
        //   )
        // });
        // if(checkForErrors.length > 0){
        //     this.toaster.error('Formula Price cannot be copied to fixed Price');
        // return;
        // }
        const payload = {
          copyOfferPrices : sellerDetailsforFormula
         }
        this.spinner.show();
        this.spotNegotiationService.copyPriceConfigurations(payload)
        .subscribe((res: any)=>{
          this.spinner.hide();
          if (res?.message == 'Unauthorized') {
            return;
          }
          res?.copyOfferPrices?.forEach(off=>{
            let payload = {
              RequestOfferId: off.requestOfferId,
              priceConfigurationId: off.priceConfigurationId
            };
            this.store.dispatch(new SetOfferPriceFormulaId(payload));
          })
        });
      }
      const copyPricePayload = {
        copyPriceDetailsRequest: sellerDetails,
        RequestLocationIds: requestLocationIds,
        RequestGroupId: this.currentRequestInfo.requestGroupId
      };
      const response = this.spotNegotiationService.copyPriceDetails(
        copyPricePayload
      );
      response.subscribe(async (res: any) => {
        this.spinner.hide();
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (typeof res === 'boolean' && res == true) {
          this.toaster.success('Offer price copied successfully.');
          this.selectedRequestList = [];
          this.requestOptionsToDuplicatePrice = this.requestOptionsToDuplicatePrice.map(
            req => ({ ...req, selected: false })
          );

          this.requestOptions = this.requestOptions.map(e => {
            let requestLocations = e.requestLocations.map(reqLoc => {
              let requestProducts = reqLoc.requestProducts.map(reqPro =>
                requestProductIds.some(x => x == reqPro.id) &&
                reqPro.status.toLowerCase() == 'inquired'
                  ? { ...reqPro, status: 'Quoted' }
                  : reqPro
              );

              return { ...reqLoc, requestProducts };
            });
            return { ...e, requestLocations };
          });

          let updatedLocationRows = locationsRows.map(row => {
            let updatedRow =  reqLocationsRows?.find(x => x.id === row.id);
              if (updatedRow) {
                return updatedRow;
              }
            return row;
          });
          let futureLocationsRows = this.getLocationRowsWithSelectedSeller(
            JSON.parse(JSON.stringify(updatedLocationRows)),
            selectedSellerRows
          );
          let reqLocationRows : any =[];
          for (const locRow of futureLocationsRows) {
            var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
              locRow,
              locRow);
              reqLocationRows.push(data);
          }
          // Update the store
          this.store.dispatch([new UpdateRequest(this.requestOptions), new SetLocationsRows(reqLocationRows)]);
          this.spotNegotiationService.callGridRefreshService();
        } else {
          this.toaster.error(res);
          return;
        }
      });
    } else {
      this.toaster.error('Select atlease one Request to proceed.');
      return;
    }
  }

  // checkQuoatedPriceAcrossLocations(id : number, locationsRows){
  //   debugger;
  //   let quoatedPrice = [];
  //   locationsRows.forEach(loc=>
  //     loc?.requestOffers?.forEach(req=>{
  //        if(req.id == id){
  //          if(req.price){
  //             quoatedPrice.push(req);
  //          }
  //        }
  //     })
  // );
  // return quoatedPrice;
  // }

  getLocationRowsWithSelectedSeller(rowsArray, selectedSellerRows) {
    rowsArray.forEach(row => {
      selectedSellerRows.forEach(sellerRow => {
        let reqLocations = this.requestOptions.filter(req => req.id == row.requestId &&
          req.requestLocations.some(
            reqloc => reqloc.id == row.requestLocationId
          )
        );
        let reqProducts =
          reqLocations.length > 0
            ? reqLocations[0].requestLocations.filter(
                row1 => row1.id == sellerRow.RequestLocationId
              )
            : [];
        let currentLocProdCount =
          reqProducts.length > 0 ? reqProducts[0].requestProducts.length : 0;
        for (let index = 0; index < currentLocProdCount; index++) {
          let indx = index + 1;
          let val = 'checkProd' + indx;
          row[val] = false;
          row.isSelected = false;
        }
      });
    });
    return rowsArray;
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

      (<any>window).startAmendRFQTime = Date.now();

      // Get response from server
      const response = this.spotNegotiationService.AmendRFQ(
        amendRFQRequestPayload
      );
      response.subscribe((res: any) => {
        this.spinner.hide();
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res instanceof Object && res['rfqIds'].length > 0) {
          this.myMonitoringService.logMetric(
            'Amend RFQ ' + (<any>window).location.href,
            Date.now() - (<any>window).startAmendRFQTime,
            (<any>window).location.href
          );

          this.toaster.success('Amend RFQ(s) sent successfully.');
          this.spotNegotiationService.callGridRefreshService();
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
      let requestProductIds = this.selectedSellerList.map(
        x => x.RequestProductIds
      );
      var FinalAPIPayload = {
        RequestGroupId: this.currentRequestInfo.requestGroupId,
        quoteByDate: new Date(this.spotNegotiationService.QuoteByDate ),
        selectedSellers: this.selectedSellerList
      };
      this.spinner.show();

      (<any>window).startSkipRFQTime = Date.now();

      // Get response from server
      const response = this.spotNegotiationService.SkipRFQ(FinalAPIPayload);
      response.subscribe(async (res: any) => {
        this.spinner.hide();
        if (res?.message == 'Unauthorized') {
          return;
        }

        if (res instanceof Object && res['sellerOffers'].length > 0) {
          this.myMonitoringService.logMetric(
            'Skip RFQ ' + (<any>window).location.href,
            Date.now() - (<any>window).startSkipRFQTime,
            (<any>window).location.href
          );

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
        let reqLocationRows : any =[];
        for (const locRow of futureLocationsRows) {
          var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
            locRow,
            locRow);
            reqLocationRows.push(data);
        }

        this.requestOptions = this.requestOptions.map(e => {
          let requestLocations = e.requestLocations.map(reqLoc => {
            let requestProducts = reqLoc.requestProducts.map(reqPro =>
              requestProductIds.some(x => x.includes(reqPro.id)) &&
              (reqPro.status.toLowerCase() == 'validated' ||
                reqPro.status.toLowerCase() == 'reopen')
                ? { ...reqPro, status: 'Inquired' }
                : reqPro
            );

            return { ...reqLoc, requestProducts };
          });
          return { ...e, requestLocations };
        });
        this.store.dispatch([new SetLocationsRows(reqLocationRows), new UpdateRequest(this.requestOptions)]);
        this.spotNegotiationService.callGridRedrawService();
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
      const locationsRows = this.store.selectSnapshot<any>((state: any) => {
        return state.spotNegotiation.locationsRows;
      });
      let rfqIds = this.selectedSellerList.map(x => x.RfqId);
      let requestProductIds = locationsRows
        .filter(
          r =>
            r.requestOffers &&
            r.requestOffers.find(
              ro => rfqIds.includes(ro.rfqId) && !ro.isRfqskipped
            )
        )
        .map(x =>
          x.requestOffers
            .filter(r => !r.isRfqskipped)
            .map(r => r.requestProductId)
        );
      var FinalAPIdata = {
        RequestGroupId: this.currentRequestInfo.requestGroupId,
        selectedSellers: this.selectedSellerList
      };
      this.spinner.show();

      (<any>window).startRevokeRFQTime = Date.now();

      // Get response from server
      const response = this.spotNegotiationService.RevokeFQ(FinalAPIdata);
      response.subscribe(async (res: any) => {
        this.spinner.hide();

        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res instanceof Object) {
          this.myMonitoringService.logMetric(
            'Revoke RFQ ' + (<any>window).location.href,
            Date.now() - (<any>window).startRevokeRFQTime,
            (<any>window).location.href
          );

          this.toaster.success('RFQ(s) revoked successfully.');
          setTimeout(() => {
            this.spotNegotiationService.energyCalculationService(null,null,null);
          },3000);
          

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
        let reqLocationRows : any =[];
        for (const locRow of futureLocationsRows) {
          var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
            locRow,
            locRow);
            reqLocationRows.push(data);
        }
        //this.store.dispatch(new SetLocationsRows(reqLocationRows));
        if (res.isGroupDeleted) {
          const baseOrigin = new URL(window.location.href).origin;
          window.open(
            `${baseOrigin}/#/edit-request/${this.currentRequestInfo.id}`,
            '_self'
          );
          this.store.dispatch(new SetLocationsRows(reqLocationRows));
          //window.open(`${baseOrigin}/#/edit-request/${request.id}`, '_blank');
        } else {
          this.requestOptions = this.requestOptions.map(e => {
            let requestLocations = e.requestLocations.map(reqLoc => {
              let requestProducts = null;
              if (
                futureLocationsRows.filter(
                  lr => lr.requestLocationId == reqLoc.id && lr.requestOffers
                ).length == 0 ||
                futureLocationsRows.filter(
                  lr =>
                    lr.requestLocationId == reqLoc.id &&
                    lr.requestOffers?.find(x => !x.isRfqskipped)
                ).length == 0
              ) {
                requestProducts = reqLoc.requestProducts.map(reqPro =>
                  requestProductIds.some(x => x.includes(reqPro.id))
                    ? { ...reqPro, status: 'ReOpen' }
                    : reqPro
                );
              }

              return requestProducts ? { ...reqLoc, requestProducts } : reqLoc;
            });
            return requestLocations ? { ...e, requestLocations } : e;
          });
          this.store.dispatch([new SetLocationsRows(reqLocationRows), new UpdateRequest(this.requestOptions)]);
          //this.spotNegotiationService.callGridRefreshService();
          this.spotNegotiationService.callEvaluateIconDisplayCheck();
          this.spotNegotiationService.callGridRedrawService();
          this.changeDetector.detectChanges();          
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

      (<any>window).startRevokeRFQTime = Date.now();

      // Get response from server
      const response = this.spotNegotiationService.RequoteRFQ(
        requoteRFQRequestPayload
      );
      response.subscribe((res: any) => {
        this.spinner.hide();
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res instanceof Object && res['rfqIds'].length > 0) {
          this.myMonitoringService.logMetric(
            'Revoke RFQ ' + (<any>window).location.href,
            Date.now() - (<any>window).startRevokeRFQTime,
            (<any>window).location.href
          );

          this.toaster.success('Requote RFQ(s) sent successfully.');
          //this.spotNegotiationService.callGridRefreshServiceAll();
          this.spotNegotiationService.callGridRefreshService();
          if (res['message'].length > 5) this.toaster.warning(res['message']);
        } else if (res instanceof Object) {
          this.toaster.warning(res.Message);
        } else {
          this.toaster.error(res);
        }
      });
    }
  }

  noQuoteAction(type) {
    let locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });

    let selectedFinalData = this.FilterselectedRowForRFQ();
    let requestLocationSellerIds = selectedFinalData.map(
      e => e.RequestLocationSellerId
    );

    let requestOfferIds = [];
    let requestOffers = [];
    this.selectedSellerList.forEach(e => {
      if (e.RequestOffers && e.RequestOffers.length > 0)
        requestOfferIds.push([...e.RequestOffers.map(e => e)]);
    });
    requestOfferIds = requestOfferIds.reduce((acc, val) => acc.concat(val), []); // flatten array
    if (requestOfferIds.length == 0) {
      this.toaster.warning(
        "Offer Price cannot be marked as 'No Quote' as RFQ has neither been skipped or sent."
      );
      return;
    }
    requestOffers = _.cloneDeep(requestOfferIds);
    if (type == 'enable-quote') {
      let quotedElements = _.filter(requestOffers, e => {
        return !e.hasNoQuote;
      });
      if (quotedElements && quotedElements.length) {
        this.toaster.warning(
          'Enable Quote can be applied only on Offer Price marked as No Quote'
        );
        return;
      }
    } else if (type == 'no-quote') {
      let quotedElements = _.filter(requestOffers, e => {
        return e.hasNoQuote;
      });
      if (quotedElements && quotedElements.length) {
        this.toaster.warning(
          'Cannot perform the action. Please check the selections made!'
        );
        return;
      }
    }
    if (type == 'no-quote') {
      (<any>window).startNoQuoteTime = Date.now();
    } else if (type == 'enable-quote') {
      (<any>window).startEnableQuoteTime = Date.now();
    }

    let noQuotePayload = {
      requestOfferIds: requestOfferIds.map(e => e.id),
      noQuote: type === 'no-quote' ? true : false
    };
    let response = this.spotNegotiationService.switchReqOffBasedOnQuote(
      noQuotePayload
    );
    this.spinner.show();
    response.subscribe((res: any) => {
      if (res?.message == 'Unauthorized') {
        return;
      }
      if (res) {
        if (type == 'no-quote') {
          this.myMonitoringService.logMetric(
            'No Quote ' + (<any>window).location.href,
            Date.now() - (<any>window).startNoQuoteTime,
            (<any>window).location.href
          );
        } else if (type == 'enable-quote') {
          this.myMonitoringService.logMetric(
            'Enable Quote ' + (<any>window).location.href,
            Date.now() - (<any>window).startEnableQuoteTime,
            (<any>window).location.href
          );
        }
        let updatedRows = _.cloneDeep(locationsRows);
        this.getPriceDetailsInformation(updatedRows, requestLocationSellerIds);
        let successMessage =
          type === 'enable-quote'
            ? 'Selected Offer Price has been enabled.'
            : "Selected Offers have been marked as 'No Quote' successfully. zxc";
        this.toaster.success(successMessage);
        setTimeout(() => {
          this.spotNegotiationService.energyCalculationService(null,null,null);
        },3000);
        
      } else {
        this.toaster.error('An error has occurred!');
        this.spinner.hide();
      }
    });
  }

  getPriceDetailsInformation(updatedRows, requestLocationSellerIds) {
    const groupId = parseFloat(this.route.snapshot.params.spotNegotiationId);
    this.spotNegotiationService
      .getPriceDetails(groupId)
      .subscribe(async (priceDetailsRes: any) => {
        this.spinner.hide();
        if (priceDetailsRes?.message == 'Unauthorized') {
          return;
        }
        let priceDetails = _.cloneDeep(priceDetailsRes.sellerOffers);
        priceDetails.forEach(e => {
          if (requestLocationSellerIds.includes(e.requestLocationSellerId)) {
            let findElementIndex = _.findIndex(updatedRows, function(
              object: any
            ) {
              return object.id == e.requestLocationSellerId;
            });
            if (findElementIndex != -1) {
              updatedRows[findElementIndex].requestOffers = _.cloneDeep(
                e.requestOffers
              );
              updatedRows[findElementIndex].totalOffer = e.totalOffer;
              updatedRows[findElementIndex].totalCost = e.totalCost;
              //Deselect rows
              updatedRows[findElementIndex].isSelected = false;
              if (updatedRows[findElementIndex].checkProd1) {
                updatedRows[findElementIndex].checkProd1 = false;
              }
              if (updatedRows[findElementIndex].checkProd2) {
                updatedRows[findElementIndex].checkProd2 = false;
              }
              if (updatedRows[findElementIndex].checkProd3) {
                updatedRows[findElementIndex].checkProd3 = false;
              }
              if (updatedRows[findElementIndex].checkProd4) {
                updatedRows[findElementIndex].checkProd4 = false;
              }
              if (updatedRows[findElementIndex].checkProd5) {
                updatedRows[findElementIndex].checkProd5 = false;
              }
            }
          }
        });
        let reqLocationRows : any =[];
        for (const locRow of updatedRows) {
          var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
            locRow,
            locRow);
            data.requestOffers = data.requestOffers?.sort((a, b) =>
          a.requestProductTypeOrderBy === b.requestProductTypeOrderBy
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeOrderBy > b.requestProductTypeOrderBy
            ? 1
            : -1
        );
            reqLocationRows.push(data);
        }
        this.store.dispatch(new SetLocationsRows(reqLocationRows));
        this.spotNegotiationService.callGridRedrawService();
      });
  }

  FilterselectedRowForCurrentRequest() {
    let locations = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });
    let locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    let currentRequestSmallInfo = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.currentRequestSmallInfo;
    });

    //this.store.subscribe(({ spotNegotiation }) => {
      locations.forEach(element => {
        locationsRows.forEach(element1 => {
          if (
            element.id == element1.requestLocationId &&
            currentRequestSmallInfo.id == element1.requestId
          ) {
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
                currentRequestSmallInfo
              );
              if (Sellectedsellerdata) {
                this.selectedSellerList.push(Sellectedsellerdata);
              }
            }
          }
        });
      });
    //});
    return this.selectedSellerList;
  }

  ConstructUpdatePricePayload(updatedRow, products, isPriceCopied) {
    let requestOffers = [];
    let offerId: number;

    products.forEach(pro => {
      const productDetails = this.spotNegotiationService.getRowProductDetails(
        updatedRow,
        pro.id
      );

      if (productDetails.id == null) {
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
        isFormulaPricing : productDetails.isFormulaPricing,
        hasNoQuote : productDetails.hasNoQuote,
        offerPriceFormulaId: productDetails.offerPriceFormulaId,
      };
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
