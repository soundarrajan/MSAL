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
  SetStaticLists
} from '../../../store/actions/request-group-actions';
import {
  SetLocations,
  SetLocationsRows,
  SetCounterpartyList,
  SetRequestList,
  SetLocationsRowsOriData,
  SetLocationsRowsPriceDetails
} from '../../../store/actions/ag-grid-row.action';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SelectSeller, EditLocationRow } from '../../../store/actions/ag-grid-row.action';
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

  constructor(
    private http: HttpClient,
    private store: Store,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    public format: TenantFormattingService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.entityName = 'Spot negotiation';
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getRequestGroup();
    this.getGroupOfSellers();
    this.getCounterpartyList();
    this.getRequestList();
    this.getTenantConfugurations();
    this.getStaticLists();
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
    });

    rowsArray.forEach((row, index) => {
      row.isSelected = true;
      let currentLocProd= this.currentRequestData.filter(row1 => row1.locationId == row.locationId);
      if(currentLocProd.length != 0){
        let currentLocProdCount = currentLocProd[0].requestProducts.length;
        for (let index = 0; index < currentLocProdCount; index++) {

          let indx = index +1;
          let val = "checkProd" + indx;
          const status = currentLocProd[0].requestProducts[index].status;
          row[val] =  status === 'Stemmed' || status === 'Confirmed'? false : row.isSelected;
         row.isEditable = false;
        }
      }

      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray?.length &&
        row.id ===
        priceDetailsArray[index]?.requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        row.requestOffers.forEach(element1 => {
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
        row.totalOffer = priceDetailsArray[index].totalOffer;
        return row;
      }

      // Else if not in the same index
  if(priceDetailsArray != undefined && priceDetailsArray.length >0){
      const detailsForCurrentRow = priceDetailsArray.filter(
        e => e.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers;
        row.requestOffers.forEach(element1 => {
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
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
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
    let payload = {
      Order: null,
      PageFilters: { Filters: [] },
      SortList: { SortList: [{"columnValue":"eta","sortIndex":0,"sortParameter":2}] },
      Filters: [],
      SearchText: null,
      Pagination: { Skip: 0, Take: 2000 }
    };
    const response = this.spotNegotiationService.getRequestList(payload);
    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      } else {
        if(res?.payload?.length > 0){
          res.payload.forEach(element => {
            element.isSelected = false;
          });
        this.store.dispatch(new SetRequestList(res.payload));
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
       }}
    });
  }
  
  getCounterpartyList(): void {
    let payload = {
      Order: null,
      PageFilters: { Filters: [] },
      SortList: { SortList: [] },
      Filters: [{"ColumnName":"CounterpartyTypes","Value":"1,2,3,11"}],
      SearchText: null,
      Pagination: { Skip: 0, Take: 2000 }
    };

    const response = this.spotNegotiationService.getCounterpartyList(payload);

    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      } else {
        if(res?.payload?.length > 0){
          res.payload.forEach(element => {
            element.isSelected = false;
            element.name=this.format.htmlDecode(element.name);
            
          });

        }
        // Populate Store
        this.store.dispatch(new SetCounterpartyList(res.payload));
      }
    });
  }

  getTenantConfugurations():void{
    const response = this.spotNegotiationService.getTenantConfiguration();
    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      } else { 
        // Populate Store
        this.store.dispatch(new SetTenantConfigurations(res.tenantConfiguration));
      }
    });
  }
  getStaticLists():void{
    let request=(['currency','product','uom']);//only currency add ,if required add here
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
