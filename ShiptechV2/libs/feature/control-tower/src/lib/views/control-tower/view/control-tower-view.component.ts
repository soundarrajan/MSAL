import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../store/report/qc-report.state';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { QcReportService } from '../../../services/qc-report.service';
import { filter, map, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  SwitchActiveBunkerResponseAction,
  SwitchActiveSludgeResponseAction
} from '../../../store/report/details/actions/qc-vessel-response.actions';
import { ResetQcReportDetailsStateAction } from '../../../store/report/qc-report-details.actions';
import { ToastrService } from 'ngx-toastr';
import {
  QcVesselResponseBunkerStateModel,
  QcVesselResponseSludgeStateModel
} from '../../../store/report/details/qc-vessel-responses.state';
import {
  IDisplayLookupDto,
  IVesselToWatchLookupDto
} from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../../../store/report/details/qc-report-details.model';
import { roundDecimals } from '@shiptech/core/utils/math';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IQcVesselPortCallDto } from '../../../services/api/dto/qc-vessel-port-call.interface';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { KnownControlTowerRoutes } from '../../../control-tower.routes';
import { fromLegacyLookupVesselToWatch } from '@shiptech/core/lookups/utils';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { VesselToWatchModel } from '../../../store/report/models/vessel-to-watch.model';
import { MyMonitoringService } from '../../service/logging.service';
import { RaiseClaimComponent } from '../details/components/raise-claim/raise-claim.component';
import { StringifyOptions } from 'querystring';

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
    private reportService: QcReportService,
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

  onValChange(val: string): void {
    this.selectedVal = val;
    console.log(val);
  }
}
