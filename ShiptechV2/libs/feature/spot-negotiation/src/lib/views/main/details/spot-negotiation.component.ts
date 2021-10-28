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
  SetRequests
} from '../../../store/actions/request-group-actions';
import {
  SetLocations,
  SetLocationsRows,
  SetCounterpartyList,
  SetLocationsRowsPriceDetails
} from '../../../store/actions/ag-grid-row.action';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SelectSeller, EditLocationRow } from '../../../store/actions/ag-grid-row.action';

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
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.entityName = 'Spot negotiation';
  }

  ngOnInit(): void {
    this.getRequestGroup();
    this.getGroupOfSellers();
    this.getCounterpartyList();
  }

  getRequestGroup(): void {
    this.spinner.show();
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
      let currentLocProd= this.currentRequestData.filter(row1 => row1.locationId == row.locationId);
      if(currentLocProd.length != 0){
        let currentLocProdCount = currentLocProd[0].requestProducts.length;
        for (let index = 0; index < currentLocProdCount; index++) {

          let indx = index +1;
          let val = "checkProd" + indx;
          row[val] = true
          row.isSelected = true;
        }
      }

      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray.length &&
        row.id ===
        priceDetailsArray[index].requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        row.totalOffer = priceDetailsArray[index].totalOffer;
        return row;
      }

      // Else if not in the same index
      const detailsForCurrentRow = priceDetailsArray.filter(
        e => e.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers;
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
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

          this.store.dispatch(new SetLocationsRows(futureLocationsRows));
        });

        this.changeDetector.detectChanges();
      }
    });
  }

  getCounterpartyList(): void {
    let payload = {
      Order: null,
      PageFilters: { Filters: [] },
      SortList: { SortList: [] },
      Filters: [],
      SearchText: null,
      Pagination: { Skip: 0, Take: 1000 }
    };

    const response = this.spotNegotiationService.getCounterpartyList(payload);

    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      } else {
        // Populate Store
        this.store.dispatch(new SetCounterpartyList(res.payload));
      }
    });
  }

  ngOnDestroy(): void {}
}
