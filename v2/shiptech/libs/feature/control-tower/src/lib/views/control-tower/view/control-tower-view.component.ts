import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import {Store } from '@ngxs/store';


import { ToastrService } from 'ngx-toastr';

import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MyMonitoringService } from '../../service/logging.service';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './control-tower-view.component.html',
  styleUrls: ['./control-tower-view.component.scss'],
  providers: [ConfirmationService, DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlTowerViewComponent implements OnInit, OnDestroy {
  quantityPrecision: number;
  selectedVal: string = 'reportsList';
  public newScreen = true;
  public theme;

  constructor(
    private entityStatus: EntityStatusService,
    private store: Store,
    private router: Router,
    private location: Location,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService,
    private reconStatusLookups: ReconStatusLookup,
    private tenantSettings: TenantSettingsService,
    private statusLookup: StatusLookup,
    private myMonitoringService: MyMonitoringService
  ) {
    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();
    this.quantityPrecision =
      generalTenantSettings.defaultValues.quantityPrecision;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

 
}
