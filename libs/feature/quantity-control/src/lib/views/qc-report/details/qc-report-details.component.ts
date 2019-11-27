import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../store/report/qc-report.state';
import { Observable, Subject } from 'rxjs';
import { QcReportService } from '../../../services/qc-report.service';
import { filter, takeUntil, tap } from 'rxjs/operators';
import {
  SwitchActiveBunkerResponseAction,
  SwitchActiveSludgeResponseAction
} from '../../../store/report/details/actions/qc-vessel-response.actions';
import { ConfirmationService, DialogService } from 'primeng/api';
import { RaiseClaimComponent } from './components/raise-claim/raise-claim.component';
import { ResetQcReportDetailsStateAction } from '../../../store/report/qc-report-details.actions';
import { ToastrService } from 'ngx-toastr';
import {
  QcVesselResponseBunkerStateModel,
  QcVesselResponseSludgeStateModel
} from '../../../store/report/details/qc-vessel-responses.state';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../../../store/report/details/qc-report-details.model';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './qc-report-details.component.html',
  styleUrls: ['./qc-report-details.component.scss'],
  providers: [ConfirmationService]
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

  @Select(QcReportState.isBusy) isBusy$: Observable<boolean>;

  constructor(private entityStatus: EntityStatusService,
              private store: Store,
              private reportService: QcReportService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private toastrService: ToastrService
  ) {
    this.store.select((appState: IAppState) => appState?.quantityControl?.report?.details?.status)
      .pipe(
        filter(status => !!status),
        tap(status => {
          this.entityStatus.setStatus({
            value: <EntityStatus>status?.name
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
    this.reportService.updateActiveSludgeVesselResponse(key, value).subscribe();
  }

  updateBunkerVesselResponse(key: keyof QcVesselResponseBunkerStateModel, value: any): void {
    this.reportService.updateActiveBunkerVesselResponse(key, value).subscribe();
  }

  updateComment(content: string): void {
    this.reportService.updateReportComment(content).subscribe();
  }

  openEmailPreview(): void {
    alert('Oh, such an email preview');
  }

  save(): void {
    this.reportService.saveReport$()
      .pipe(
        tap(() => this.toastrService.success('Report saved successfully')),
        takeUntil(this._destroy$)
      ).subscribe();
  }

  verifyVessel(): void {
    // TODO: Verify should be disabled for New
    this.reportService.verifyVesselReports([this.store.selectSnapshot(QcReportState.reportDetailsId)])
      .pipe(
        tap(() => this.toastrService.success('Report marked for verification.'))
      ).subscribe();
  }

  raiseClaim(): void {
    this.dialogService.open(RaiseClaimComponent, {
      width: '50%',
      showHeader: false
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    this.store.dispatch(ResetQcReportDetailsStateAction);
  }
}
