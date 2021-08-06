import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';

@Component({
  selector: 'shiptech-main-spot-negotiation',
  templateUrl: './main-spot-negotiation.component.html',
  styleUrls: ['./main-spot-negotiation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainSpotNegotiationComponent implements OnDestroy {
  private _destroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    // Note: On module destroy we have to reset the module states
    // Note: to prevent displaying irrelevant data on delayed switching of modules
  }
}
