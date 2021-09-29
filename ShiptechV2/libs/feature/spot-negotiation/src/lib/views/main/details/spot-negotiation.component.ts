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
  SetGroupOfRequestsId,
  SetRequests,
  SetLocationsRows,
  SetCounterpartyList
} from '../../../store/actions/ag-grid-row.action';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private http: HttpClient,
    private store: Store,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    public dialog: MatDialog
  ) {
    this.entityName = 'Spot negotiation';
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

  getGroupOfRequests(): void {
    // Get current id from url and make a request with that data.
    const groupRequestIdFromUrl = this.route.snapshot.params.spotNegotiationId;
    this.store.dispatch(new SetGroupOfRequestsId(groupRequestIdFromUrl));

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
        const editedLocation = res['requestLocationSellers'].map(e => {
          e.phySupplier = 'Add P. supplier';
          e.totalOffer = '$500.00';
          e.diff = '99.00';
          e.amt = '32.00';
          e.tPr = Math.floor(Math.random() * 100) + 0;
          return e;
        });

        this.store.dispatch(new SetLocationsRows(editedLocation));
        this.changeDetector.detectChanges();
      }
    });
  }

  getGroupOfRequests1(): void {
    // Get current id from url and make a request with that data.
    const groupRequestIdFromUrl = this.route.snapshot.params.spotNegotiationId;
    this.store.dispatch(new SetGroupOfRequestsId(groupRequestIdFromUrl));

    // Get response from server and populate store

    const response = this.spotNegotiationService.getGroupOfRequests1(
      groupRequestIdFromUrl
    );

    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      }

      if (res['requests'][0]) {
        this.store.dispatch(new SetCurrentRequestSmallInfo(res['requests']));
        this.store.dispatch(
          new SetRequests(res['requests'][0].requestLocations)
        );
        this.changeDetector.detectChanges();
      }
    });
  }
  ngOnInit(): void {
    this.getGroupOfRequests();
    this.getGroupOfRequests1();
    this.getCounterpartyList();
    // this.getSpotNegotiationRows();
  }

  getSpotNegotiationRows(): void {
    // Delete this;
    const withThis = this.http.get(
      './assets/data/demoData/spot-grid1-data.json'
    );
    withThis.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      }

      // Populate store;
      // alert(2);
      // this.store.dispatch(new SetLocationsRows(res));
    });
  }

  ngOnDestroy(): void {}
}
