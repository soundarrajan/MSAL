import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';


@Component({
  selector: 'shiptech-entity-status',
  templateUrl: './entity-status.component.html',
  styleUrls: ['./entity-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityStatusComponent implements OnInit, OnDestroy {

  @Input() statusName: string;
  @Input() color: string;
  @Input() backgroundColor: string;
  @Input() cssClass: string;

  private _destroy$ = new Subject();

  constructor(private service: EntityStatusService, private changeDetector: ChangeDetectorRef) {

    this.service.statusChanged.pipe(
      tap(status => {
        this.statusName = status.name;
        this.color = status.color;
        this.backgroundColor = status.backgroundColor;
        this.cssClass = status.cssClass;

        this.changeDetector.markForCheck();

      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}


