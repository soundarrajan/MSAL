import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../store/report/qc-report.state';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { QcReportService } from '../../../services/qc-report.service';
import { filter, map, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SwitchActiveBunkerResponseAction, SwitchActiveSludgeResponseAction } from '../../../store/report/details/actions/qc-vessel-response.actions';
import { RaiseClaimComponent } from './components/raise-claim/raise-claim.component';
import { ResetQcReportDetailsStateAction } from '../../../store/report/qc-report-details.actions';
import { ToastrService } from 'ngx-toastr';
import { QcVesselResponseBunkerStateModel, QcVesselResponseSludgeStateModel } from '../../../store/report/details/qc-vessel-responses.state';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../../../store/report/details/qc-report-details.model';
import { roundDecimals } from '@shiptech/core/utils/math';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { ConfirmationService, DialogService } from 'primeng/primeng';
import { IQcVesselPortCall } from '../../../guards/qc-vessel-port-call.interface';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import { IVesselMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { KnownQuantityControlRoutes } from '../../../known-quantity-control.routes';
import { fromLegacyLookup } from '@shiptech/core/lookups/utils';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { MockVesselsLookup } from '@shiptech/core/services/masters-api/mock-data/vessels.mock';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './qc-report-details.component.html',
  styleUrls: ['./qc-report-details.component.scss'],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  categories$: Observable<IDisplayLookupDto[]>;

  bunkerSelectedCategory$: Observable<IDisplayLookupDto>;
  bunkerDescription$: Observable<string>;

  sludgeSelectedCategory$: Observable<IDisplayLookupDto>;
  sludge$: Observable<number>;
  sludgeVerified$: Observable<boolean>;
  sludgeDescription$: Observable<string>;

  nbOfClaims$: Observable<number>;
  nbOfDeliveries$: Observable<number>;
  comment$: Observable<string>;

  vessel$: Observable<IDisplayLookupDto>;
  portCall$: Observable<IQcVesselPortCall>;

  matchStatus$: Observable<IReconStatusLookupDto>;

  @Select(QcReportState.isBusy) isBusy$: Observable<boolean>;
  @Select(QcReportState.isNew) isNew$: Observable<boolean>;

  hasVerifiedStatus$ = new BehaviorSubject<boolean>(false);

  private quantityPrecision: number;

  constructor(private entityStatus: EntityStatusService,
              private store: Store,
              private router: Router,
              private location: Location,
              private reportService: QcReportService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private toastrService: ToastrService,
              private reconStatusLookups: ReconStatusLookup,
              private tenantSettings: TenantSettingsService
  ) {
    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();
    this.quantityPrecision = generalTenantSettings.defaultValues.quantityPrecision;

    this.vessel$ = this.selectReportDetails(state => state.vessel);
    this.portCall$ = this.selectReportDetails(state => state.portCall);

    this.matchStatus$ = this.store.select(QcReportState.matchStatus).pipe(map(s => reconStatusLookups.toReconStatus(s)));

    // Note: Since the PortCall can change multiple times (autocomplete) we want to load BDN / nbOfClaims / ndOfDeliveries just for the last call and cancel previous.
    // Note: That's why we update it here, via an observable, instead of on UpdatePortCall.
    this.portCall$.pipe(
      skip(1),
      filter(s => this.store.selectSnapshot(QcReportState.isNew)), // Note: PortCalls can be updated only on New Reports. We don't want to loadPortCallBdn$ when editing
      switchMap(portCall => this.reportService.loadPortCallBdn$(portCall)),
      takeUntil(this._destroy$)
    ).subscribe();

    this.store.select((appState: IAppState) => appState?.quantityControl?.report?.details?.status).pipe(filter(status => !!status), tap(status => {
        this.hasVerifiedStatus$.next(status.name === StatusLookupEnum.Verified);

        this.entityStatus.setStatus({
          name: status.displayName,
          backgroundColor: status.code ?? '#c792ea' // TODO: Currently statuses do no have a color set
        });
      }),
      takeUntil(this._destroy$)
    ).subscribe();

    this.categories$ = this.selectReportDetails(state => state.vesselResponse.categories);

    this.bunkerSelectedCategory$ = this.selectReportDetails(state => state.vesselResponse.bunker.activeCategory);
    this.bunkerDescription$ = this.selectReportDetails(state => state.vesselResponse.bunker.description);

    this.sludgeSelectedCategory$ = this.selectReportDetails(state => state.vesselResponse.sludge.activeCategory);
    this.sludge$ = this.selectReportDetails(state => state.vesselResponse.sludge.sludge);
    this.sludgeVerified$ = this.selectReportDetails(state => state.vesselResponse.sludge.sludgeVerified);
    this.sludgeDescription$ = this.selectReportDetails(state => state.vesselResponse.sludge.description);

    this.nbOfClaims$ = this.selectReportDetails(state => state.nbOfClaims);
    this.nbOfDeliveries$ = this.selectReportDetails(state => state.nbOfDeliveries);
    this.comment$ = this.selectReportDetails(state => state.comment);
  }

  private selectReportDetails<T>(select: ((state: IQcReportDetailsState) => T)): Observable<T> {
    return this.store.select((appState: IAppState) => select(appState?.quantityControl?.report?.details));
  }

  ngOnInit(): void {
  }

  changeActiveSludgeResponse(option: IDisplayLookupDto): void {
    this.store.dispatch(new SwitchActiveSludgeResponseAction(option));
  }

  changeActiveBunkerResponse(option: IDisplayLookupDto): void {
    this.store.dispatch(new SwitchActiveBunkerResponseAction(option));
  }

  updateSludgeVesselResponse(key: keyof QcVesselResponseSludgeStateModel, value: any): void {
    this.reportService.updateActiveSludgeVesselResponse$(key,
      typeof value === 'number'
        ? roundDecimals(value, this.quantityPrecision)
        : value).subscribe();
  }

  updateBunkerVesselResponse(key: keyof QcVesselResponseBunkerStateModel, value: any): void {
    this.reportService.updateActiveBunkerVesselResponse$(key, value).subscribe();
  }

  updateComment(content: string): void {
    this.reportService.updateReportComment$(content).subscribe();
  }

  updateVessel(newVessel: IVesselMasterDto): void {
    this.reportService.updateVessel$(fromLegacyLookup(newVessel)).subscribe();
  }

  updatePortCall(newPortCall: IVesselPortCallMasterDto): void {
    // Note: Since the PortCall can change multiple times (autocomplete) we want to load BDN / nbOfClaims / ndOfDeliveries just for the last call and cancel previous.
    // Note: So we can't do it here, look into the ctor for a pipe on $portCall.

    this.reportService.updatePortCallId$(newPortCall ? {
      portCallId: newPortCall.portCallId,
      voyageReference: newPortCall.voyageReference,
      vesselVoyageDetailId: newPortCall.id
    } : undefined).subscribe();
  }

  openEmailPreview(): void {
    const detailsState = (<IAppState>this.store.snapshot()).quantityControl.report.details;

    this.reportService.previewEmail$(detailsState.id, detailsState.emailTransactionTypeId).subscribe();
  }

  save(): void {
    this.reportService.saveReport$().subscribe(reportId => {
      this.toastrService.success('Report saved successfully');
      this.router.navigate([KnownPrimaryRoutes.QuantityControl, `${KnownQuantityControlRoutes.Report}`, reportId, KnownQuantityControlRoutes.ReportDetails]);
    });
  }

  verifyVessel(): void {
    this.reportService.verifyVesselReports$([this.store.selectSnapshot(QcReportState.reportDetailsId)])
      .subscribe(() => this.toastrService.success('Report marked for verification.'));
  }

  revertVerifyVessel(): void {
    this.reportService.revertVerifyVessel$([this.store.selectSnapshot(QcReportState.reportDetailsId)])
      .subscribe(() => this.toastrService.success('Verification reverted successfully.'));
  }

  raiseClaim(): void {
    this.dialogService.open(RaiseClaimComponent, {
      width: '50%',
      showHeader: false
    });
  }

  ngOnDestroy(): void {
    this.hasVerifiedStatus$.complete();

    this._destroy$.next();
    this._destroy$.complete();

    this.store.dispatch(ResetQcReportDetailsStateAction);
  }
}
