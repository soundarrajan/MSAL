import { Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { QcReportState } from '../../../../../../store/report-view/qc-report.state';
import { ProductTypeListItemViewModel } from './product-type-list-item.view-model';
import { map } from 'rxjs/operators';
import { Column } from 'ag-grid-community';

@Injectable()
export class ProductDetailsViewModel {

  productTypes$: Observable<ProductTypeListItemViewModel[]>;
  private minIntegerDigits: number = 1;
  private minFractionDigits: number = 3;
  private maxFractionDigits: number = 5;
  public numberMaskFormat: string = this.getNumberMaskFormat();
  public numberDisplayFormat: string = `${this.minIntegerDigits}.${this.minFractionDigits}-${this.maxFractionDigits}`;

  constructor(public gridViewModel: ProductDetailsGridViewModel, private store: Store) {
    this.productTypes$ = this.store.select(QcReportState.getPortCallReportProductTypes).pipe(
      map(productTypes => productTypes.map(productType => new ProductTypeListItemViewModel(productType)))
    );
  }

  getNumberMaskFormat(options: { integerDigits?: number, fractionDigits?: number, delimiter?: string } = {
    integerDigits: 3,
    fractionDigits: this.maxFractionDigits,
    delimiter: '.'
  }): string {
    return '9'.repeat(options.integerDigits) + options.delimiter + '9'.repeat(options.fractionDigits);
  }

  public updateProductType(column: Column, model: ProductTypeListItemViewModel, value: number): void {
    console.log(column.getUserProvidedColDef().field, model.productTypeId, value);
  }
}
