import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { IEntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';

@Injectable({
  providedIn: 'root'
})
export class EntityStatusService {
  public statusChanged = new ReplaySubject<IEntityStatus>(1);
  public currentStatus: IEntityStatus;

  constructor() {
  }

  public setStatus(newStatus: IEntityStatus): void{
    this.currentStatus = newStatus;
    this.statusChanged.next(this.currentStatus);
  }
}
