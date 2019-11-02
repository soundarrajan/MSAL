import { Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { QcReportState } from '../../../../../../store/report-view/qc-report.state';

@Injectable()
export class ProductDetailsViewModel {

  @Select(QcReportState.getPortCallReportProductTypes) productTypes$: Observable<unknown[]>;
  private minIntegerDigits: number = 1;
  private minFractionDigits: number = 3;
  private maxFractionDigits: number = 5;
  public numberDisplayFormat: string = `${this.minIntegerDigits}.${this.minFractionDigits}-${this.maxFractionDigits}`;
  constructor(public gridViewModel: ProductDetailsGridViewModel) {
  }
}
