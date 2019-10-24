import { Inject, Injectable } from '@angular/core';
import { QUANTITY_CONTROL_API_SERVICE } from './api/quantity-control.api.service';
import { IQuantityControlApiService } from './api/quantity-control.api.service.interface';
import { Observable } from 'rxjs';
import { PortCallListItemModel } from './models/port-call-list-item.model';
import { IPortCallDto } from './api/dto/port-call.dto';
import { map } from 'rxjs/operators';

@Injectable()
export class QuantityControlService {

  constructor(@Inject(QUANTITY_CONTROL_API_SERVICE) private api: IQuantityControlApiService) {
  }

  getPortCalls(filter: unknown): Observable<{ items: PortCallListItemModel[], totalItems: number }> {
    return this.api.getPortCalls({ pageSize: 100 });
  }

  getPortCallById(portCallId: number): Observable<IPortCallDto> {
    return this.api.getPortCallById({ portCallId }).pipe(map(r => {
      return r.portCall;
    }));
  }
}
