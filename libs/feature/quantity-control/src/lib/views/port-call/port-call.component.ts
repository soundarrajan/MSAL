import { Component, OnInit } from '@angular/core';
import { QuantityControlService } from '../../services/quantity-control.service';
import { Observable } from 'rxjs';
import { IPortCallDto } from '../../services/api/dto/port-call.dto';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'shiptech-port-call',
  templateUrl: './port-call.component.html',
  styleUrls: ['./port-call.component.scss']
})
export class PortCallComponent implements OnInit {

  // TODO: get port callId dynamically
  portCall$: Observable<IPortCallDto> = this.quantityControlService.getPortCallById(1).pipe(tap((value) => console.log('vALUE', value)));

  constructor(private quantityControlService: QuantityControlService) {
  }

  ngOnInit(): void {
  }

}
