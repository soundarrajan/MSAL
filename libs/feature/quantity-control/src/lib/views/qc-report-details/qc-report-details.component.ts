import { Component, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownQuantityControlRoutes } from '../../known-quantity-control.routes';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './qc-report-details.component.html',
  styleUrls: ['./qc-report-details.component.scss']
})
export class QcReportDetailsComponent implements OnInit {

  knownRoutes = KnownQuantityControlRoutes;

  constructor(private entityStatus: EntityStatusService) {
    //TODO: after loading
    this.entityStatus.setStatus({
      value: EntityStatus.Delivered
    });
  }

  ngOnInit(): void {
  }

  raiseClaim(): void {
    alert('Not implemented');
  }

  verifyVessel(): void {
    alert('Not implemented');
  }
}
