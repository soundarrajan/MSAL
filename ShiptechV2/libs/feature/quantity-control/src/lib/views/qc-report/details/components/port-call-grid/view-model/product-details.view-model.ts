import { Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { QcReportState } from '../../../../../../store/report-view/qc-report.state';
import { ProductTypeListItemViewModel } from './product-type-list-item.view-model';
import { map } from 'rxjs/operators';
import { Column } from 'ag-grid-community';
import { QcReportDetailsService } from '../../../../../../services/qc-report-details.service';
import { Omit } from '@shiptech/core/utils/type-definitions';
import { QcProductTypeListItemState } from '../../../../../../store/report-view/details/qc-product-type-list-item.state';
import _ from 'lodash';

export type QcProductTypeEditableProps = keyof Omit<QcProductTypeListItemState, 'productTypeId' | 'productTypeName'>;

@Injectable()
export class ProductDetailsViewModel {

  productTypes$: Observable<ProductTypeListItemViewModel[]>;

  public numberMaskFormat: string = this.getNumberMaskFormat();
  private minIntegerDigits: number = 1;
  private minFractionDigits: number = 3;
  private maxFractionDigits: number = 5;
  public numberDisplayFormat: string = `${this.minIntegerDigits}.${this.minFractionDigits}-${this.maxFractionDigits}`;

  constructor(public gridViewModel: ProductDetailsGridViewModel, private store: Store, private detailsService: QcReportDetailsService) {
    this.productTypes$ = this.store.select(QcReportState.getPortCallReportProductTypes).pipe(
      map(productTypes => _.values(productTypes).map(productType => new ProductTypeListItemViewModel(productType)))
    );
  }

  getNumberMaskFormat(options: { integerDigits?: number, fractionDigits?: number, delimiter?: string } = {
    integerDigits: 3,
    fractionDigits: 5,
    delimiter: '.'
  }): string {
    return '9'.repeat(options.integerDigits) + options.delimiter + '9'.repeat(options.fractionDigits);
  }

  public updateProductType(column: Column, model: ProductTypeListItemViewModel, value: number): void {
    this.detailsService.updateProductType(model.productTypeId, <QcProductTypeEditableProps>column.getUserProvidedColDef().field, value);
  }
}
