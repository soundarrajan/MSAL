import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProductDetailsViewModel } from './view-model/product-details.view-model';
import { ProductDetailsGridViewModel } from './view-model/product-details-grid.view-model';
import { ProductTypeListItemViewModelFactory } from './view-model/product-type-list-item.view-model';
import { Select } from '@ngxs/store';
import { QcReportState } from '../../../../../store/report/qc-report.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'shiptech-port-call-grid',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [
    ProductDetailsViewModel,
    ProductDetailsGridViewModel,
    ProductTypeListItemViewModelFactory
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
  @Select(QcReportState.isReadOnly) isReadOnly$: Observable<boolean>;

  constructor(public viewModel: ProductDetailsViewModel) {}

  ngOnInit(): void {}
}
