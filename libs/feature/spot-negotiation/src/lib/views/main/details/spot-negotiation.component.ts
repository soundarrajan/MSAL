import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { SpotNegotiationService } from '../../../services/spot-negotiation.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import {
  SetCurrentRequestSmallInfo,
  SetRequestGroupId,
  SetRequests,
  SetTenantConfigurations,
  SetStaticLists,
  SetCounterparties
} from '../../../store/actions/request-group-actions';
import {
  SetLocations,
  SetLocationsRows,
  SetCounterpartyList,
  SetRequestList,
  SetLocationsRowsOriData,
  // SetLocationsRowsPriceDetails,
  SetPhysicalSupplierCounterpartyList,
  UpdateAdditionalCostList
} from '../../../store/actions/ag-grid-row.action';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { isNumeric } from 'rxjs/internal-compatibility';
import { SpotNegotiationPriceCalcService } from '../../../services/spot-negotiation-price-calc.service';
import _ from 'lodash';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'spot-negotiation-main-component',
  templateUrl: './spot-negotiation.component.html',
  styleUrls: ['./spot-negotiation.component.scss'],
  // providers: [ConfirmationService, DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotNegotiationComponent implements OnInit, OnDestroy {
  entityId: number;
  entityName: string;
  isLoading: boolean;

  adminConfiguration: any;
  tenantConfiguration: any;
  staticLists: any;
  CurrentProductLength: any;
  CurrentLocationprduct: any[];
  currentRequestData: any[];
  allRequest: any[];
  totalCounterpartyCount: number;
  additionalCostList: any = [];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    public format: TenantFormattingService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private spotNegotiationPriceCalcService: SpotNegotiationPriceCalcService
  ) {
    this.entityName = 'Spot negotiation';
  }

  ngOnInit(): void {
    const requestIdFromUrl = this.route.snapshot.params.requestId;
    if(requestIdFromUrl && isNumeric(requestIdFromUrl)){
      localStorage.setItem('activeRequestId', requestIdFromUrl.toString());
    }
    this.spinner.show();
    this.getStaticLists();
    this.getAdditionalCosts();
    this.getRequestGroup();
    this.getCounterpartyList();
    this.getPhysicalSupplierList();
    this.getRequestList();
    this.getTenantConfugurations();
    
    this.legacyLookupsDatabase.getTableByName('counterparty').then(response => {
      this.store.dispatch(new SetCounterparties(response));
    });
    this.currentRequestData = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });
    this.allRequest = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });
  }


  getRequestGroup(): void {
    // Get current id from url and make a request with that data.
    const groupRequestIdFromUrl = this.route.snapshot.params.spotNegotiationId;
    this.store.dispatch(new SetRequestGroupId(groupRequestIdFromUrl));
    // Get response from server and populate store
    const responseGroupComment = this.spotNegotiationService.updateGroupComments(
      groupRequestIdFromUrl
    );

    responseGroupComment.subscribe((res: any) => {
    if(res.status){
    // Get response from server and populate store
    const responseGetRequestGroup = this.spotNegotiationService.getRequestGroup(
      groupRequestIdFromUrl
    );

    responseGetRequestGroup.subscribe((res: any) => {
      this.spinner.hide();
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res.error) {
        alert('Handle Error');
        return;
      }
      // Set all request inside store
      if (res['requests']) {
        this.store.dispatch(new SetRequests(res['requests']));
        this.getGroupOfSellers(); 
      }

      if ((<any>window).activeRequest && res['requests'][(<any>window).activeRequest.i]) {
        // Set first request default;
        this.store.dispatch(
          [new SetCurrentRequestSmallInfo(
            res['requests'][(<any>window).activeRequest.i]
          ), new SetLocations(
            res['requests'][(<any>window).activeRequest.i].requestLocations
          )]
        );
        if ((<any>window).location.href.includes('v2/group-of-requests')) {
          (<any>window).activeRequest = false;
        }
        this.changeDetector.detectChanges();
      } else {
        if (res['requests'] && res['requests'].length > 0) {
          // Set first request default;
          let activeRequest = res['requests'][0];
          if(localStorage.getItem('activeRequestId')){
              const requestIndex = res['requests'].findIndex(x=> x.id == localStorage.getItem('activeRequestId'));
              if(requestIndex > -1){
                activeRequest = res['requests'].find(x=> x.id == localStorage.getItem('activeRequestId'));
                localStorage.setItem('reqIdx', requestIndex);
              }

              localStorage.removeItem('activeRequestId');
          }
          this.store.dispatch([new SetCurrentRequestSmallInfo(activeRequest), new SetLocations(activeRequest.requestLocations)]);
          this.changeDetector.detectChanges();
        }
      }
    });}
    });
  }
  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    this.allRequest = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });
    let requests = this.store.selectSnapshot<any>((state: any) => {
      return state['spotNegotiation'].requests;
    });

    rowsArray.forEach((row, index) => {
      let rowrelatedrequest = this.allRequest.filter(
        row1 => row1.id == row.requestId
      );
      let requestProducts = requests.find(x => x.id == row.requestId)?.requestLocations?.find(l => l.id ==row.requestLocationId)?.requestProducts;
      if(rowrelatedrequest.length > 0 && rowrelatedrequest[0]["requestLocations"]){
        let currentLocProd = rowrelatedrequest[0]["requestLocations"].filter(
          row1 => row1.locationId == row.locationId
        );
      if (currentLocProd.length != 0) {
        let currentLocProdCount = currentLocProd[0].requestProducts.length;
        for (let index = 0; index < currentLocProdCount; index++) {
          let indx = index + 1;
          let val = 'checkProd' + indx;
          const status = currentLocProd[0].requestProducts[index].status;
          row[val] =
            status === 'Stemmed' || status === 'Confirmed'
              ? false
              : row.isSelected && row.preferredProducts ? row.preferredProducts.some(x=>x == currentLocProd[0].requestProducts[index].productId) :false;
          row.isEditable = false;
        }
      }

      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray?.length &&
        row.id === priceDetailsArray[index]?.requestLocationSellerId
      ) {
        priceDetailsArray[index].requestOffers.forEach(element1 => {
          if (
            element1.requestProductId != undefined &&
            element1.requestProductId != null &&
            this.currentRequestData?.length > 0
          ) {
            if (
              currentLocProd.length > 0 &&
              currentLocProd[0].requestProducts.length > 0
            ) {
              let FilterProdut = currentLocProd[0].requestProducts.filter(
                col => col.id == element1.requestProductId
              );
              element1.requestProductTypeId = FilterProdut[0]?.productTypeId;
              if (
                FilterProdut.length > 0 &&
                FilterProdut[0].status != undefined &&
                FilterProdut[0].status == 'Stemmed'
              ) {
                row.isEditable = true;
              }

            }
          }
        });

        row.requestOffers = priceDetailsArray[index].requestOffers?.sort((a,b)=>
         a.requestProductTypeId  === b.requestProductTypeId ?
         (a.requestProductId > b.requestProductId ? 1 : -1) :
        (a.requestProductTypeId > b.requestProductTypeId ? 1 : -1)
        );
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;
        row.requestAdditionalCosts = priceDetailsArray[index].requestAdditionalCosts;
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
           return { ...e, reqProdStatus: isStemmed };
        });
        row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        return row;
      }

      // Else if not in the same index
      if (priceDetailsArray != undefined && priceDetailsArray.length > 0) {
        const detailsForCurrentRow = priceDetailsArray.filter(
          e => e.requestLocationSellerId === row.id
        );

        // We found something
        if (detailsForCurrentRow.length > 0) {
          detailsForCurrentRow[0].requestOffers.forEach(element1 => {
            if (
              element1.requestProductId != undefined &&
              element1.requestProductId != null &&
              this.currentRequestData?.length > 0
            ) {
              if (
                currentLocProd.length > 0 &&
                currentLocProd[0].requestProducts.length > 0
              ) {
                let FilterProdut = currentLocProd[0].requestProducts.filter(
                  col => col.id == element1.requestProductId
                );
                element1.requestProductTypeId = FilterProdut[0]?.productTypeId;
                if (
                  FilterProdut.length > 0 &&
                  FilterProdut[0].status != undefined &&
                  FilterProdut[0].status == 'Stemmed'
                ) {
                  row.isEditable = true;
                }
              }
            }
          });
          row.requestOffers = detailsForCurrentRow[0].requestOffers?.sort((a,b)=>
          a.requestProductTypeId  === b.requestProductTypeId ?
          (a.requestProductId > b.requestProductId ? 1 : -1) :
         (a.requestProductTypeId > b.requestProductTypeId ? 1 : -1)
         );
          row.totalOffer = detailsForCurrentRow[0].totalOffer;
          row.totalCost = detailsForCurrentRow[0].totalCost;
          row.requestAdditionalCosts = detailsForCurrentRow[0].requestAdditionalCosts;
          row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
          row.requestOffers = row.requestOffers.map(e => {
            let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
             return { ...e, reqProdStatus: isStemmed };
          });
          row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
          row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        }
      }
    }
      return row;
    });

    return rowsArray;
  }

  getGroupOfSellers(): void {
    // Get current id from url and make a request with that data.
    const groupRequestIdFromUrl = this.route.snapshot.params.spotNegotiationId;

    // Get response from server and populate store
    const response = this.spotNegotiationService.getGroupOfSellers(
      groupRequestIdFromUrl
    );
    response.subscribe(async (res: any) => {
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res.error) {
        alert('Handle Error');
        return;
      }

      // Populate store;
      if (res['requestLocationSellers']) {
          // Demo manipulate location before entering store;
          // TODO : get phySupplier, totalOffer, diff, amt, tPR from the endpoint directly.

          const futureLocationsRows = this.getLocationRowsWithPriceDetails(
            res['requestLocationSellers'],
            res['sellerOffers']
          );
          // Demo format data
          let reqLocationRows : any =[];
          for (const locRow of futureLocationsRows) {
            var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
              locRow,
              locRow);
              reqLocationRows.push(data);
          }

          this.store.dispatch([new SetLocationsRowsOriData(reqLocationRows), new SetLocationsRows(reqLocationRows)]);
      }
    });
    this.changeDetector.detectChanges();
  }

  getRequestList(): void {
    const response = this.spotNegotiationService.getRequestresponse(null, { Filters: [] }, { SortList: [{ columnValue: 'eta', sortIndex: 0, sortParameter: 2 }]}, [] , null , { Skip: 0, Take: 25 })
    response.subscribe((res: any) => {
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res.error) {
        alert('Handle Error');
        return;
      } else {
        if (res?.payload?.length > 0) {
          this.spotNegotiationService.requestCount = res.matchedCount;
          res.payload.forEach(element => {
            element.isSelected = false;
          });
          this.store.dispatch(new SetRequestList(res.payload));
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      }
    });
  }

  getCounterpartyList(): void {
    const response = this.spotNegotiationService.getResponse(null, { Filters: [] }, { SortList: [] }, [{ ColumnName: 'CounterpartyTypes', Value: '1,2,3,11' }], null, { Skip:0, Take: 25 })
    response.subscribe((res: any) => {
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res.error) {
        alert('Handle Error');
        return;
      } else {
        if (res?.payload?.length > 0) {
          this.spotNegotiationService.counterpartyTotalCount = res.matchedCount;
          res.payload.forEach(element => {
            element.isSelected = false;
            element.name = this.format.htmlDecode(element.name);
          });
        }
        // Populate Store
        this.store.dispatch(new SetCounterpartyList(res.payload));
      }
    });
  }

  getPhysicalSupplierList(): void{
    const response = this.spotNegotiationService.getResponse(null, { Filters: [] }, { SortList: [] }, [{ ColumnName: 'CounterpartyTypes', Value: '1' }], null, { Skip:0 , Take: 25 } );
    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      } else {
        if (res?.payload?.length > 0) {
          this.spotNegotiationService.physicalSupplierTotalCount = res.matchedCount;
          res.payload.forEach(element => {
            element.isSelected = false;
            element.name = this.format.htmlDecode(element.name);
          });
        }
        // Populate Store
        this.store.dispatch(new SetPhysicalSupplierCounterpartyList(res.payload));
      }
    });
  }

  getTenantConfugurations(): void {
    const response = this.spotNegotiationService.getTenantConfiguration();
    response.subscribe((res: any) => {
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res.error) {
        alert('Handle Error');
        return;
      } else {
        // Populate Store
        this.store.dispatch(
          new SetTenantConfigurations(res.tenantConfiguration)
        );
      }
    });
  }
  getStaticLists(): void {
    let staticLists = {};
    forkJoin(
      { currencies: this.legacyLookupsDatabase.getTableByName('currency'),
        products: this.legacyLookupsDatabase.getTableByName('product'),
        // inactiveProducts: this.legacyLookupsDatabase.getTableByName('inactiveProducts'),
        uoms: this.legacyLookupsDatabase.getTableByName('uom')
      }
    ).subscribe((res: any)=>{
      staticLists = {'currency': res.currencies };
      staticLists = { ...staticLists, 'product': res.products};
      // staticLists = { ...staticLists, 'inactiveProducts': res.inactiveProducts};
      staticLists = { ...staticLists, 'uom': res.uoms};
      this.store.dispatch(new SetStaticLists(staticLists));
    });
  }
  getAdditionalCosts() {
    this.spotNegotiationService
      .getMasterAdditionalCosts({})
      .subscribe((response: any) => {
        if (response?.message == 'Unauthorized') {
          return;
        }
        if (typeof response === 'string') {
          this.spinner.hide();
          //this.toastr.error(response);
        } else {
          this.additionalCostList = _.cloneDeep(
            response.payload.filter(e => e.isDeleted == false)
          );
          this.store.dispatch(
            new UpdateAdditionalCostList(this.additionalCostList)
          );
          //this.createAdditionalCostTypes();
        }
      });
  }
  ngOnDestroy(): void {}
}
