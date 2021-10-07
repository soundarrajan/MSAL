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
import { RaiseClaimComponent } from './components/raise-claim/raise-claim.component';
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

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './control-tower-details.component.html',
  styleUrls: ['./control-tower-details.component.scss'],
  providers: [ConfirmationService, DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlTowerDetailsComponent implements OnInit, OnDestroy {
  categories$: Observable<IDisplayLookupDto[]>;

  autocompleteVessel: string;
  autocompleteVesselPort: string;
  vesselToWatch: VesselToWatchModel;
  vesselToWatchSubscriber: any;

  bunkerSelectedCategory$: Observable<IDisplayLookupDto>;
  bunkerDescription$: Observable<string>;

  sludgeSelectedCategory$: Observable<IDisplayLookupDto>;
  sludge$: Observable<number>;
  sludgeVerified$: Observable<boolean>;
  sludgeDescription$: Observable<string>;

  nbOfClaims$: Observable<number>;
  nbOfDeliveries$: Observable<number>;
  comment$: Observable<string>;

  vessel$: Observable<IVesselToWatchLookupDto>;
  portCall$: Observable<IQcVesselPortCallDto>;

  matchStatus$: Observable<IReconStatusLookupDto>;

  @Select(QcReportState.isReadOnly) isReadOnly$: Observable<boolean>;
  @Select(QcReportState.isBusy) isBusy$: Observable<boolean>;
  @Select(QcReportState.isNew) isNew$: Observable<boolean>;

  hasVerifiedStatus$ = new BehaviorSubject<boolean>(false);
  private _destroy$ = new Subject();

  private quantityPrecision: number;

  private firstApiCallStartTime: any;

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

    this.vessel$ = this.selectReportDetails(state => state.vessel);
    this.portCall$ = this.selectReportDetails(state => state.portCall);

    this.matchStatus$ = this.store
      .select(QcReportState.matchStatus)
      .pipe(map(s => reconStatusLookups.toReconStatus(s)));

    this.autocompleteVessel = knownMastersAutocomplete.vessel;
    this.autocompleteVesselPort = knownMastersAutocomplete.vesselPort;

    // Note: Since the PortCall can change multiple times (autocomplete) we want to load BDN / nbOfClaims / ndOfDeliveries just for the last call and cancel previous.
    // Note: That's why we update it here, via an observable, instead of on UpdatePortCall.
    this.portCall$
      .pipe(
        skip(1),
        filter(() => this.store.selectSnapshot(QcReportState.isNew)), // Note: PortCalls can be updated only on New Reports. We don't want to loadPortCallBdn$ when editing
        switchMap(portCall => this.reportService.loadPortCallBdn$(portCall)),
        takeUntil(this._destroy$)
      )
      .subscribe();

    this.store
      .select(
        (appState: IAppState) =>
          appState?.quantityControl?.report?.details?.status
      )
      .pipe(
        filter(status => !!status),
        tap(s => {
          this.hasVerifiedStatus$.next(s.name === StatusLookupEnum.Verified);

          const status = this.statusLookup.getStatus(s);
          if (status)
            this.entityStatus.setStatus({
              name: status.displayName,
              backgroundColor: status.code
            });
        }),
        takeUntil(this._destroy$)
      )
      .subscribe();

    this.categories$ = this.selectReportDetails(
      state => state.vesselResponse?.categories
    );

    this.bunkerSelectedCategory$ = this.selectReportDetails(
      state => state.vesselResponse?.bunker?.activeCategory
    );
    this.bunkerDescription$ = this.selectReportDetails(
      state => state.vesselResponse?.bunker?.description
    );

    this.sludgeSelectedCategory$ = this.selectReportDetails(
      state => state.vesselResponse?.sludge?.activeCategory
    );
    this.sludge$ = this.selectReportDetails(
      state => state.vesselResponse?.sludge?.sludge
    );
    this.sludgeVerified$ = this.selectReportDetails(
      state => state.vesselResponse?.sludge?.sludgeVerified
    );
    this.sludgeDescription$ = this.selectReportDetails(
      state => state.vesselResponse?.sludge?.description
    );

    this.nbOfClaims$ = this.selectReportDetails(state => state.nbOfClaims);
    this.nbOfDeliveries$ = this.selectReportDetails(
      state => state.nbOfDeliveries
    );
    this.comment$ = this.selectReportDetails(state => state.comment);
  }

  ngOnInit(): void {}

  changeActiveSludgeResponse(option: IDisplayLookupDto): void {
    this.store.dispatch(new SwitchActiveSludgeResponseAction(option));
  }

  changeActiveBunkerResponse(option: IDisplayLookupDto): void {
    this.store.dispatch(new SwitchActiveBunkerResponseAction(option));
  }

  updateSludgeVesselResponse(
    key: keyof QcVesselResponseSludgeStateModel,
    value: any
  ): void {
    this.reportService
      .updateActiveSludgeVesselResponse$(
        key,
        typeof value === 'number'
          ? roundDecimals(value, this.quantityPrecision)
          : value
      )
      .subscribe();
  }

  updateBunkerVesselResponse(
    key: keyof QcVesselResponseBunkerStateModel,
    value: any
  ): void {
    this.reportService
      .updateActiveBunkerVesselResponse$(key, value)
      .subscribe();
  }

  updateComment(content: string): void {
    this.reportService.updateReportComment$(content).subscribe();
  }

  updateVessel(newVessel: any): void {
    this.reportService
      .updateVessel$(fromLegacyLookupVesselToWatch(newVessel))
      .subscribe();
  }

  updatePortCall(newPortCall: IVesselPortCallMasterDto): void {
    // Note: Since the PortCall can change multiple times (autocomplete) we want to load BDN / nbOfClaims / ndOfDeliveries just for the last call and cancel previous.
    // Note: So we can't do it here, look into the ctor for a pipe on $portCall.

    this.reportService
      .updatePortCallId$(
        newPortCall
          ? {
              portCallId: newPortCall.portCallId,
              voyageReference: newPortCall.voyageReference,
              vesselVoyageDetailId: newPortCall.id
            }
          : undefined
      )
      .subscribe();
  }

  updateVesselToWatch(): void {
    this.vesselToWatchSubscriber = this.vessel$.subscribe(result => {
      this.vesselToWatch = new VesselToWatchModel();
      this.vesselToWatch.result = result;
    });
    this.vesselToWatch.result.vesselToWatchFlag = !this.vesselToWatch.result
      .vesselToWatchFlag;
    this.reportService
      .updateVesselToWatch$(this.vesselToWatch.result)
      .subscribe(() => {
        this.toastrService.success('Vessel to Watch saved successfully');
      });
  }

  openEmailPreview(): void {
    const detailsState = (<IAppState>this.store.snapshot()).quantityControl
      .report.details;

    this.reportService
      .previewEmail$(detailsState.id, detailsState.emailTransactionTypeId)
      .subscribe();
  }

  save(): void {
    (<any>window).qcActions = true;
    const id = window.location.href.split('report')[1].split('/')[1];
    let actionLevel = 'Save ';
    if (parseInt(id)) {
      actionLevel = 'Update ';
    }
    this.firstApiCallStartTime = Date.now();
    console.log('FIRST API CALL START TIME!!!');
    console.log(this.firstApiCallStartTime);
    this.reportService.saveReport$().subscribe(reportId => {
      this.toastrService.success('Report saved successfully');
      this.router
        .navigate([
          KnownPrimaryRoutes.QuantityControl,
          `${KnownControlTowerRoutes.Report}`,
          reportId,
          KnownControlTowerRoutes.ReportDetails
        ])
        .then(() => {
          this.reportService.loadEventsLog$().subscribe(() => {
            console.log('TIME AT ACTION LEVEL!');
            console.log(Date.now() - this.firstApiCallStartTime);
            this.myMonitoringService.logMetric(
              actionLevel + window.location.href,
              Date.now() - this.firstApiCallStartTime
            );
            delete this.firstApiCallStartTime;
            delete (<any>window).qcActions;
          });
        });
    });
  }

  verifyVessel(): void {
    this.firstApiCallStartTime = Date.now();
    (<any>window).qcActions = true;
    this.reportService.saveReport$().subscribe(reportId => {
      this.router
        .navigate([
          KnownPrimaryRoutes.QuantityControl,
          `${KnownControlTowerRoutes.Report}`,
          reportId,
          KnownControlTowerRoutes.ReportDetails
        ])
        .then(() => {
          this.reportService.loadEventsLog$().subscribe();
        })
        .then(() => {
          this.reportService
            .verifyVesselReports$([
              this.store.selectSnapshot(QcReportState.reportDetailsId)
            ])
            .subscribe(() => {
              this.toastrService.success('Report marked for verification.');
              console.log('TIME AT ACTION LEVEL!');
              console.log(Date.now() - this.firstApiCallStartTime);
              this.myMonitoringService.logMetric(
                'Verify ' + window.location.href,
                Date.now() - this.firstApiCallStartTime
              );
              delete this.firstApiCallStartTime;
              delete (<any>window).qcActions;
            });
        });
    });
  }

  revertVerifyVessel(): void {
    this.firstApiCallStartTime = Date.now();
    (<any>window).qcActions = true;
    this.reportService
      .revertVerifyVessel$([
        this.store.selectSnapshot(QcReportState.reportDetailsId)
      ])
      .subscribe(() => {
        this.toastrService.success('Verification reverted successfully.');
        console.log('TIME AT ACTION LEVEL!');
        console.log(Date.now() - this.firstApiCallStartTime);
        this.myMonitoringService.logMetric(
          'Revert Verify ' + window.location.href,
          Date.now() - this.firstApiCallStartTime
        );
        delete this.firstApiCallStartTime;
        delete (<any>window).qcActions;
      });
  }

  raiseClaim(): void {
    this.dialogService.open(RaiseClaimComponent, {
      width: '50%',
      showHeader: false
    });
  }

  ngOnDestroy(): void {
    this.hasVerifiedStatus$.complete();
    if (this.vesselToWatchSubscriber) {
      this.vesselToWatchSubscriber.complete();
    }
    this._destroy$.next();
    this._destroy$.complete();

    this.store.dispatch(ResetQcReportDetailsStateAction);
  }

  private selectReportDetails<T>(
    select: (state: IQcReportDetailsState) => T
  ): Observable<T> {
    return this.store.select((appState: IAppState) =>
      select(appState?.quantityControl?.report?.details)
    );
  }
}
