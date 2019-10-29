import { Component, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './qc-report-view.component.html',
  styleUrls: ['./qc-report-view.component.scss']
})
export class QcReportViewComponent implements OnInit {

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
