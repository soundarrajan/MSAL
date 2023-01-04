import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'shiptech-main-contract-negotiation',
  templateUrl: './main-contract-negotiation.component.html',
  styleUrls: ['./main-contract-negotiation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainContractNegotiationComponent implements OnDestroy {
  private _destroy$ = new Subject();

  constructor() {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    // Note: On module destroy we have to reset the module states
    // Note: to prevent displaying irrelevant data on delayed switching of modules
  }
}
