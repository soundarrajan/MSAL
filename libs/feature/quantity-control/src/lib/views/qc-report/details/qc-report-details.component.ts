import { Component, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../store/report-view/qc-report.state';
import { Observable } from 'rxjs';
import {
  QcVesselResponseBaseStateItem,
  QcVesselResponseSludgeStateItem
} from '../../../store/report-view/details/qc-vessel-responses.state';
import { QcReportDetailsService } from '../../../services/qc-report-details.service';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import _ from 'lodash';
import {
  SwitchActiveBunkerResponse,
  SwitchActiveSludgeResponse
} from '../../../store/report-view/details/actions/qc-vessel-response.actions';
import { IQcReportDetailsState } from '../../../store/report-view/details/qc-report-details.model';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './qc-report-details.component.html',
  styleUrls: ['./qc-report-details.component.scss']
})
export class QcReportDetailsComponent implements OnInit {

  public bunkerVesselResponseCategories$: Observable<QcVesselResponseBaseStateItem[]>;
  public bunkerVesselResponseActiveCategory$: Observable<QcVesselResponseBaseStateItem>;
  public sludgeVesselResponseCategories$: Observable<QcVesselResponseSludgeStateItem[]>;
  public sludgeVesselResponseActiveCategory$: Observable<QcVesselResponseSludgeStateItem>;

  @Select(QcReportState.getReportDetails) reportDetailsState$: Observable<IQcReportDetailsState>;
  @Select(QcReportState.getReportComment) comment$: Observable<string>;

  constructor(private entityStatus: EntityStatusService, private store: Store, private detailsService: QcReportDetailsService) {
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

  get reportStatus(): EntityStatus {
    return this.entityStatus.currentStatus.value;
  }

  ngOnInit(): void {
  }

  changeActiveSludgeResponse(option: QcVesselResponseBaseStateItem): void {
    // TODO: move to service method
    this.store.dispatch(new SwitchActiveSludgeResponse(option.id));
  }

  changeActiveBunkerResponse(option: QcVesselResponseBaseStateItem): void {
    // TODO: move to service method
    this.store.dispatch(new SwitchActiveBunkerResponse(option.id));
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
    alert('save');
  }

  raiseClaim(): void {
    alert('Not implemented');
  }

  verifyVessel(): void {
    alert('Not implemented');
  }

}
