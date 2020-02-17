import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { KnownQuantityControlRoutes } from '../../../known-quantity-control.routes';
import { KnownTransactionTypes } from '@shiptech/core/enums/known-transaction-types.enum';

@Component({
  selector: 'shiptech-qc-report-details-documents',
  templateUrl: './qc-report-details-documents.component.html',
  styleUrls: ['./qc-report-details-documents.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsDocumentsComponent implements OnInit, OnDestroy {
  reportId: number;
  entityName = KnownTransactionTypes.QuantityControlReport;
  private _destroy$ = new Subject();

  constructor(route: ActivatedRoute) {
    this.reportId =
      route.snapshot.params[KnownQuantityControlRoutes.ReportIdParam];
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
