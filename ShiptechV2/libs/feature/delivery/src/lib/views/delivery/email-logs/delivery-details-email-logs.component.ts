import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { KnownEmailTransactionTypes } from '@shiptech/core/enums/known-email-transaction-types.enum';
import { KnownDeliverylRoutes } from '../../../known-delivery.routes';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'shiptech-delivery-details-email-logs',
  templateUrl: './delivery-details-email-logs.component.html',
  styleUrls: ['./delivery-details-email-logs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryDetailsEmailLogsComponent implements OnInit, OnDestroy {
  deliveryId: number;
  entityName = KnownEmailTransactionTypes.QuantityControlReport;
  private _destroy$ = new Subject();

  constructor(route: ActivatedRoute) {
    this.deliveryId =
      route.snapshot.params[KnownDeliverylRoutes.DeliveryIdParam];
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
