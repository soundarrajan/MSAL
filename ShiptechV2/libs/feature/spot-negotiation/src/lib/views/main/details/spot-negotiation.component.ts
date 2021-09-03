import { SpotNegotiationService } from '../../../services/spot-negotiation.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { DecimalPipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BdnInformationApiService } from '@shiptech/core/delivery-api/bdn-information/bdn-information-api.service';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import _ from 'lodash';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { NavBarApiService } from '@shiptech/core/services/navbar/navbar-api.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import {
  SetCurrentRequestSmallInfo,
  SetGroupOfRequestsId,
  SetRequests,
  SetRowsList
} from '../../../store/actions/ag-grid-row.action';

@Component({
  selector: 'spot-negotiation-main-component',
  templateUrl: './spot-negotiation.component.html',
  styleUrls: ['./spot-negotiation.component.scss'],
  providers: [ConfirmationService, DialogService],
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
  generalTenantSettings: IGeneralTenantSettings;

  constructor(
    private http: HttpClient,
    private store: Store,
    public bdnInformationService: BdnInformationApiService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private navBarService: NavBarApiService,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
    private loadingBar: LoadingBarService,
    private titleService: Title,
    private tenantSettingsService: TenantSettingsService
  ) {
    this.entityName = 'Spot negotiation';
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.adminConfiguration = tenantSettingsService.getModuleTenantSettings<
      IGeneralTenantSettings
    >(TenantSettingsModuleName.General);
  }

  getGroupOfRequests(): void {
    // Get current id from url and make a request with that data.
    const groupRequestIdFromUrl = this.route.snapshot.params.spotNegotiationId;
    this.store.dispatch(new SetGroupOfRequestsId(groupRequestIdFromUrl));


    // Get response from server and populate store
    const response = this.spotNegotiationService.getGroupOfRequests(20);

    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      }


      // Populate store;

      this.store.dispatch(new SetCurrentRequestSmallInfo(res["requestGroups"][0].requests[0]));
      this.store.dispatch(new SetRequests(res["requestGroups"][0].requests));
    });
  }

  getGroupOfRequests1(): void {
    // Get current id from url and make a request with that data.
    const groupRequestIdFromUrl = this.route.snapshot.params.spotNegotiationId;
    this.store.dispatch(new SetGroupOfRequestsId(groupRequestIdFromUrl));


    // Get response from server and populate store

    const response = this.spotNegotiationService.getGroupOfRequests1(groupRequestIdFromUrl);

    response.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      }

      this.store.dispatch(new SetRowsList(res.requestGroupDto.requestLocationSellers));
    });
  }
  ngOnInit(): void {
    this.getGroupOfRequests();
    // this.getGroupOfRequests1();
    // this.getSpotNegotiationRows();
  }

  getSpotNegotiationRows(): void {
    // Delete this;
    const withThis = this.http.get(
      './assets/data/demoData/Spot_Negotiation.json'
    );
    withThis.subscribe((res: any) => {
      if (res.error) {
        alert('Handle Error');
        return;
      }
      // Populate store;
     // alert(2);
      this.store.dispatch(new SetRowsList(res.requestGroupDto.requestLocationSellers));
    });
  }

  ngOnDestroy(): void {}
}
