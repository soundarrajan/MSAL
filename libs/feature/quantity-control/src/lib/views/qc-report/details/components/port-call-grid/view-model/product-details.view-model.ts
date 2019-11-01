import { Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { QcReportState } from '../../../../../../store/report-view/qc-report.state';

@Injectable()
export class ProductDetailsViewModel {

  @Select(QcReportState.getPortCallReportProductTypes) productTypes$: Observable<unknown[]>;

  constructor(public gridViewModel: ProductDetailsGridViewModel) {
  }
}
