import { Component, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownQuantityControlRoutes } from '../../../known-quantity-control.routes';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './qc-report-details.component.html',
  styleUrls: ['./qc-report-details.component.scss']
})
export class QcReportDetailsComponent implements OnInit {
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

  constructor(public entityStatus: EntityStatusService) {
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

  get reportStatus(): EntityStatus {
    return this.entityStatus.currentStatus.value;
  }
}
