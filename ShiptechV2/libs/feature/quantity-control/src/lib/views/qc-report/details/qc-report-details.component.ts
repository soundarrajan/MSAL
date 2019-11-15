import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../store/report-view/qc-report.state';
import { Observable, Subject } from 'rxjs';
import {
  QcVesselResponseBaseStateItem,
  QcVesselResponseSludgeStateItem
} from '../../../store/report-view/details/qc-vessel-responses.state';
import { QcReportDetailsService } from '../../../services/qc-report-details.service';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import _ from 'lodash';
import {
  SwitchActiveBunkerResponseAction,
  SwitchActiveSludgeResponseAction
} from '../../../store/report-view/details/actions/qc-vessel-response.actions';
import { IQcReportDetailsState } from '../../../store/report-view/details/qc-report-details.model';
import { ConfirmationService, DialogService, MessageService } from 'primeng/api';
import { RaiseClaimComponent } from '../raise-claim/raise-claim.component';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './qc-report-details.component.html',
  styleUrls: ['./qc-report-details.component.scss'],
  providers: [ConfirmationService]
})
export class QcReportDetailsComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  public bunkerVesselResponseCategories$: Observable<QcVesselResponseBaseStateItem[]>;
  public bunkerVesselResponseActiveCategory$: Observable<QcVesselResponseBaseStateItem>;
  public sludgeVesselResponseCategories$: Observable<QcVesselResponseSludgeStateItem[]>;
  public sludgeVesselResponseActiveCategory$: Observable<QcVesselResponseSludgeStateItem>;

  @Select(QcReportState.getReportDetails) reportDetailsState$: Observable<IQcReportDetailsState>;
  @Select(QcReportState.getReportComment) comment$: Observable<string>;
  @Select(QcReportState.isBusy) isBusy$: Observable<boolean>;

  eventsLogLoaded: boolean;
  surveyHistoryLoaded: boolean;
  soundingReportLoaded: boolean;

  constructor(private entityStatus: EntityStatusService,
              private store: Store,
              private detailsService: QcReportDetailsService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService
  ) {
    //TODO: after loading
    this.entityStatus.setStatus({
      value: EntityStatus.Delivered
    });

    this.sludgeVesselResponseCategories$ = this.store.select(QcReportState.getSludgeVesselResponse).pipe(map(sludge => _.values(sludge.categories)));
    this.sludgeVesselResponseActiveCategory$ = this.store.select(QcReportState.getSludgeVesselResponseActiveCategoryId)
      .pipe(
        switchMap(id => this.store.select(QcReportState.getSludgeVesselResponse).pipe(
          map(sludge => sludge.categories[id] || {} as QcVesselResponseBaseStateItem),
          shareReplay()
        )));


    this.bunkerVesselResponseCategories$ = this.store.select(QcReportState.getBunkerVesselResponse).pipe(map(bunker => _.values(bunker.categories)));
    this.bunkerVesselResponseActiveCategory$ = this.store.select(QcReportState.getBunkerVesselResponseActiveCategoryId)
      .pipe(
        switchMap(id => this.store.select(QcReportState.getBunkerVesselResponse).pipe(
          map(bunker => bunker.categories[id] || {} as QcVesselResponseSludgeStateItem),
          shareReplay()
        )));
  }


  // TODO: Remove after demo
  protected get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }

  ngOnInit(): void {
  }

  changeActiveSludgeResponse(option: QcVesselResponseBaseStateItem): void {
    // TODO: move to service method
    this.store.dispatch(new SwitchActiveSludgeResponseAction(option.id));
  }

  changeActiveBunkerResponse(option: QcVesselResponseBaseStateItem): void {
    // TODO: move to service method
    this.store.dispatch(new SwitchActiveBunkerResponseAction(option.id));
  }

  updateSludgeVesselResponse(key: keyof QcVesselResponseSludgeStateItem, value: any): void {
    this.detailsService.updateActiveSludgeVesselResponse(key, value).subscribe();
  }

  updateBunkerVesselResponse(key: keyof QcVesselResponseBaseStateItem, value: any): void {
    this.detailsService.updateActiveBunkerVesselResponse(key, value).subscribe();
  }

  updateComment(content: string): void {
    this.detailsService.updateReportComment(content).subscribe();
  }

  save(): void {
    this.detailsService.saveReport();

    this.dialogService.open(RaiseClaimComponent, {
      header: 'Data to be saved',
      width: '70%',
      contentStyle: { 'max-height': '350px', 'overflow': 'auto' },
      data: this.reportDetailsState
    });
  }

  verifyVessel(): void {
    this.confirmationService.confirm({
      header: 'Verify?',
      message: 'Please confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Verified', detail: 'Vessel report was verified' });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Verification canceled',
          detail: 'Vessel report verification has been canceled'
        });
      }
    });
  }

  raiseClaim(): void {
    this.dialogService.open(RaiseClaimComponent, {
      header: 'Raise claim',
      width: '50%'
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
