import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { IEntityStatusConfig } from '@shiptech/core/ui/components/entity-status/entity-status-config.interface';

@Injectable({
  providedIn: 'root'
})
export class EntityStatusService {
  public statusChanged = new ReplaySubject<IEntityStatusConfig>(1);
  public currentStatus: IEntityStatusConfig;

  constructor() {}

  public setStatus(newStatus: IEntityStatusConfig): void {
    this.currentStatus = newStatus;
    this.statusChanged.next(this.currentStatus);
  }
}
