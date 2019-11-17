import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { ResetQcModuleStateAction } from '../store/report-view/qc-module.actions';

@Component({
  selector: 'shiptech-main-quantity-control',
  templateUrl: './main-quantity-control.component.html',
  styleUrls: ['./main-quantity-control.component.scss']
})
export class MainQuantityControlComponent implements OnDestroy {
  private _destroy$ = new Subject();

  constructor(private store: Store) {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    // Note: On module destroy we have to reset the module states
    // Note: to prevent displaying irrelevant data on delayed switching of modules
    this.store.dispatch(ResetQcModuleStateAction);
  }
}

