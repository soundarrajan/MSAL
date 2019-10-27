import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPortCallDto } from '../../../../services/api/dto/port-call.dto';
import { tap } from 'rxjs/operators';
import { PortCallDetailsService } from '../../../../services/port-call-details.service';

@Component({
  selector: 'shiptech-port-call-grid',
  templateUrl: './port-call-grid.component.html',
  styleUrls: ['./port-call-grid.component.scss']
})
export class PortCallGridComponent implements OnInit {
  // TODO: get port callId dynamically
  // Note: At this point the port call details should be already loaded into the state, use the selector.
  // Note: Rename "Grid" to Product Details
  //portCall$: Observable<IPortCallDto> = this.portCallDetailsService.loadPortCallDetails('1').pipe(tap((value) => console.log('vALUE', value)));

  constructor(private portCallDetailsService: PortCallDetailsService) {
  }

  ngOnInit(): void {
  }

}
