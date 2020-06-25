import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';

@Component({
  selector: 'shiptech-main-quantity-control',
  templateUrl: './main-ete.component.html',
  styleUrls: ['./main-ete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainEteComponent implements OnDestroy {
  private _destroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
