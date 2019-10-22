import { Component, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './port-call.component.html',
  styleUrls: ['./port-call.component.css']
})
export class PortCallComponent implements OnInit {

  constructor(private entityStatus: EntityStatusService) {
    //TODO: after loading
    this.entityStatus.setStatus({
      value: EntityStatus.Delivered
    });
  }

  ngOnInit() {
  }

}
