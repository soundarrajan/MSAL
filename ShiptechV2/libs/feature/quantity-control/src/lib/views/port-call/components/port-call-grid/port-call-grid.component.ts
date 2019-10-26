import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPortCallDto } from '../../../../services/api/dto/port-call.dto';
import { tap } from 'rxjs/operators';
import { QuantityControlService } from '../../../../services/quantity-control.service';

@Component({
  selector: 'shiptech-port-call-grid',
  templateUrl: './port-call-grid.component.html',
  styleUrls: ['./port-call-grid.component.scss']
})
export class PortCallGridComponent implements OnInit {
  // TODO: get port callId dynamically
  portCall$: Observable<IPortCallDto> = this.quantityControlService.getPortCallById(1).pipe(tap((value) => console.log('vALUE', value)));

  constructor(private quantityControlService: QuantityControlService) {
  }

  ngOnInit(): void {
  }

}
