import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { SpotNegotiationService } from '../../../services/spot-negotiation.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
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
  SetPhysicalSupplierCounterpartyList
} from '../../../store/actions/ag-grid-row.action';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  SelectSeller,
  EditLocationRow
} from '../../../store/actions/ag-grid-row.action';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

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
  private _destroy$ = new Subject();
  CurrentProductLength: any;
  CurrentLocationprduct: any[];
  currentRequestData: any[];
  allRequest: any[];
  totalCounterpartyCount: number;

  constructor(
    private http: HttpClient,
    private store: Store,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    public format: TenantFormattingService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private legacyLookupsDatabase: LegacyLookupsDatabase
  ) {
    this.entityName = 'Spot negotiation';
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getRequestGroup();
    this.getGroupOfSellers();
    this.getCounterpartyList();
    this.getPhysicalSupplierList();
    this.getRequestList();
    this.getTenantConfugurations();
    this.getStaticLists();
    this.legacyLookupsDatabase.getTableByName('counterparty').then(response => {
      this.store.dispatch(new SetCounterparties(response));
    });
  }


  getRequestGroup(): void {
    // Get current id from url and make a request with that data.
    const groupRequestIdFromUrl = this.route.snapshot.params.spotNegotiationId;
    this.store.dispatch(new SetRequestGroupId(groupRequestIdFromUrl));

    // Get response from server and populate store
    const responseGetRequestGroup = this.spotNegotiationService.getRequestGroup(
      groupRequestIdFromUrl
    );

    responseGetRequestGroup.subscribe((res: any) => {
      this.spinner.hide();
      if (res.error) {
        alert('Handle Error');
        return;
      }

      // Set all request inside store
      if (res['requests']) {
        this.store.dispatch(new SetRequests(res['requests']));
      }

      if (res['requests'][0]) {
        // Set first request default;
        this.store.dispatch(new SetCurrentRequestSmallInfo(res['requests'][0]));
        this.store.dispatch(
          new SetLocations(res['requests'][0].requestLocations)
        );
        this.changeDetector.detectChanges();
      }
    });
  }
  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      this.currentRequestData = spotNegotiation.locations;
      this.allRequest = spotNegotiation.requests;
    });
    rowsArray.forEach((row, index) => {
      let rowrelatedrequest = this.allRequest.filter(
        row1 => row1.id == row.requestId
      );
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
              : row.isSelected;
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

        row.requestOffers = priceDetailsArray[index].requestOffers?.sort((a,b)=> (a.requestProductTypeId > b.requestProductTypeId ? 1 : -1));
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;

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
          row.requestOffers = detailsForCurrentRow[0].requestOffers?.sort((a,b)=> (a.requestProductTypeId > b.requestProductTypeId ? 1 : -1));
          row.totalOffer = detailsForCurrentRow[0].totalOffer;
          row.totalCost = detailsForCurrentRow[0].totalCost;
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

    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      }

      // Populate store;
      if (res['requestLocationSellers']) {
        // Demo manipulate location before entering store;
        // TODO : get phySupplier, totalOffer, diff, amt, tPR from the endpoint directly.
        // Get response from server and populate store
        const responseGetPriceDetails = this.spotNegotiationService.getPriceDetails(
          groupRequestIdFromUrl
        );

        responseGetPriceDetails.subscribe((priceDetailsRes: any) => {
          // this.store.dispatch(
          //   new SetLocationsRowsPriceDetails(priceDetailsRes['sellerOffers'])
          // );

          const futureLocationsRows = this.getLocationRowsWithPriceDetails(
            res['requestLocationSellers'],
            priceDetailsRes['sellerOffers']
          );
          // Demo format data
          this.store.dispatch(new SetLocationsRowsOriData(futureLocationsRows));
          this.store.dispatch(new SetLocationsRows(futureLocationsRows));
        });

        this.changeDetector.detectChanges();
      }
    });
  }

  getRequestList(): void {
    const response = this.spotNegotiationService.getRequestresponse(null, { Filters: [] }, { SortList: [{ columnValue: 'eta', sortIndex: 0, sortParameter: 2 }]}, [] , null , { Skip: 0, Take: 25 })
    response.subscribe((res: any) => {
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
    let request = ['currency', 'product', 'uom']; //only currency add ,if required add here
    const response = this.spotNegotiationService.getStaticLists(request);
    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      } else {
        // Populate Store
        this.store.dispatch(new SetStaticLists(res));
      }
    });
  }
  ngOnDestroy(): void {}
}
