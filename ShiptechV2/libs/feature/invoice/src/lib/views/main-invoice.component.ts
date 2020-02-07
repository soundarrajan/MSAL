import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'shiptech-main-invoice',
  templateUrl: './main-invoice.component.html',
  styleUrls: ['./main-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainInvoiceComponent implements OnDestroy {
  private _destroy$ = new Subject();

  constructor() {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
