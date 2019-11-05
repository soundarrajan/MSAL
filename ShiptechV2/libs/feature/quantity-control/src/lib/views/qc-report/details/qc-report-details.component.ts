import { Component, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownQuantityControlRoutes } from '../../../known-quantity-control.routes';
import { SelectItem } from 'primeng/api';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../store/report-view/qc-report.state';
import { Observable } from 'rxjs';
import {
  QcVesselResponseBaseStateModel,
  QcVesselResponseSludgeStateModel
} from '../../../store/report-view/details/qc-vessel-response.state';
import { QcReportDetailsService } from '../../../services/qc-report-details.service';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './qc-report-details.component.html',
  styleUrls: ['./qc-report-details.component.scss']
})
export class QcReportDetailsComponent implements OnInit {

  @Select(QcReportState.getBunkerVesselResponse) bunkerVesselResponse$: Observable<QcVesselResponseBaseStateModel>;
  @Select(QcReportState.getSludgeVesselResponse) sludgeVesselResponse$: Observable<QcVesselResponseSludgeStateModel>;
  @Select(QcReportState.getReportComment) comment$: Observable<string>;

  knownRoutes = KnownQuantityControlRoutes;
  mockResponseSelectItems: SelectItem[] = [
    {
      value: 1,
      label: 'General Email'
    },
    {
      value: 2,
      label: 'Specific Email'
    },
    {
      value: 3,
      label: 'Friendly Email'
    },
    {
      value: 4,
      label: 'Poke Email'
    }
  ];

  constructor(private entityStatus: EntityStatusService, private store: Store, private detailsService: QcReportDetailsService) {
    //TODO: after loading
    this.entityStatus.setStatus({
      value: EntityStatus.Delivered
    });
  }

  get reportStatus(): EntityStatus {
    return this.entityStatus.currentStatus.value;
  }

  ngOnInit(): void {
  }

  updateSludgeVesselResponse(key: keyof QcVesselResponseSludgeStateModel, value: any): void {
    this.detailsService.updateSludgeVesselResponse(key, value).subscribe();
  }

  updateBunkerVesselResponse(key: keyof QcVesselResponseBaseStateModel, value: any): void {
    this.detailsService.updateBunkerVesselResponse(key, value).subscribe();
  }

  updateComment(content: string): void {
    this.detailsService.updateReportComment(content).subscribe();
  }

  raiseClaim(): void {
    alert('Not implemented');
  }

  verifyVessel(): void {
    alert('Not implemented');
  }

}
