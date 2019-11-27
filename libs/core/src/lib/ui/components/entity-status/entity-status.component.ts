import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export enum EntityStatus {
  New = 'New',
  Pending = 'Pending',
  Verified = 'Verified',
}

export interface IEntityStatusConfig {
  name: string,
  color?: string,
  backgroundColor?: string,
  cssClass?: string,
}

export interface IEntityStatus {
  custom?: IEntityStatusConfig,
  value?: EntityStatus,
}

const emptyStatus: IEntityStatus = { value: undefined };
const entityStatusMapping: Record<EntityStatus, IEntityStatusConfig> = {
  [EntityStatus.New]: {
    name: 'New',
    cssClass: 'new'
  },
  [EntityStatus.Pending]: {
    name: 'Pending',
    cssClass: 'pending'
  },
  [EntityStatus.Verified]: {
    name: 'Verified',
    cssClass: 'verified'
  }
};

@Component({
  selector: 'shiptech-entity-status',
  templateUrl: './entity-status.component.html',
  styleUrls: ['./entity-status.component.scss']
})
export class EntityStatusComponent implements OnInit, OnDestroy {

  @Input() statusName: string;
  @Input() color: string;
  @Input() backgroundColor: string;
  @Input() cssClass: string;

  private _destroy$ = new Subject();

  constructor(private service: EntityStatusService) {

    this.service.statusChanged.pipe(
      tap(status => {
        const newStatus = (status || emptyStatus);
        const statusConfig = status.custom || entityStatusMapping[status.value];

        if (statusConfig) {
          this.statusName = statusConfig.name;
          this.color = statusConfig.color;
          this.backgroundColor = statusConfig.backgroundColor;
          this.cssClass = statusConfig.cssClass;
        }
      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}


