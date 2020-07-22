import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'shiptech-main-quantity-control',
  templateUrl: './main-ete.component.html',
  styleUrls: ['./main-ete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainEteComponent implements OnDestroy {
  private _destroy$ = new Subject();

  constructor() {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
