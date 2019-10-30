import { Component, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { MenuItem } from 'primeng/api';
import { KnownQuantityControlRoutes } from '../../known-quantity-control.routes';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './port-call-details.component.html',
  styleUrls: ['./port-call-details.component.scss']
})
export class PortCallDetailsComponent implements OnInit {
  public toolbarTabMenuItems: MenuItem[];

  constructor(private entityStatus: EntityStatusService) {
    //TODO: after loading
    this.entityStatus.setStatus({
      value: EntityStatus.Delivered
    });
  }

  ngOnInit(): void {
    this.toolbarTabMenuItems = [
      { label: 'Main Page', routerLink: ['./'] },
      { label: 'Audit Log', routerLink: [KnownQuantityControlRoutes.portCallDetailsAuditPath]},
    ];
  }

  raiseClaim(): void {
    alert('Not implemented');
  }

  verifyVessel(): void {
    alert('Not implemented');
  }
}
