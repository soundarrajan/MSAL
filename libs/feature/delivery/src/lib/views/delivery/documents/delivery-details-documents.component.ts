import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { KnownDeliverylRoutes } from '../../../known-delivery.routes';
import { KnownTransactionTypes } from '@shiptech/core/enums/known-transaction-types.enum';

@Component({
  selector: 'shiptech-delivery-details-documents',
  templateUrl: './delivery-details-documents.component.html',
  styleUrls: ['./delivery-details-documents.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryDetailsDocumentsComponent implements OnInit, OnDestroy {
  deliveryId: number;
  entityName = KnownTransactionTypes.QuantityControlReport;
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
