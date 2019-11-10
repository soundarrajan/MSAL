import { Inject, Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { QcReportState } from '../../../../../../store/report-view/qc-report.state';
import { ProductTypeListItemViewModel, ProductTypeListItemViewModelBuilder } from './product-type-list-item.view-model';
import { map, shareReplay } from 'rxjs/operators';
import { Column } from 'ag-grid-community';
import { QcReportDetailsService } from '../../../../../../services/qc-report-details.service';
import { Omit } from '@shiptech/core/utils/type-definitions';
import { QcProductTypeListItemStateModel } from '../../../../../../store/report-view/details/qc-product-type-list-item-state.model';
import _ from 'lodash';
import { LOOKUPS_API_SERVICE } from '@shiptech/core/services/lookups-api/lookups-api.service';
import { ILookupsApiService } from '@shiptech/core/services/lookups-api/lookups-api.service.interface';
import { IUomLookupDto } from '@shiptech/core/services/lookups-api/mock-data/uoms.mock';

export type QcProductTypeEditableProps = keyof Omit<QcProductTypeListItemStateModel, 'productTypeId' | 'productTypeName'>;

@Injectable()
export class ProductDetailsViewModel {

  productTypes$: Observable<ProductTypeListItemViewModel[]>;
  uomsLookup$: Observable<IUomLookupDto[]>;

  public numberMaskFormat: string = this.getNumberMaskFormat();
  private minIntegerDigits: number = 1;
  private minFractionDigits: number = 3;
  private maxFractionDigits: number = 5;
  public numberDisplayFormat: string = `${this.minIntegerDigits}.${this.minFractionDigits}-${this.maxFractionDigits}`;

  constructor(
    public gridViewModel: ProductDetailsGridViewModel,
    private store: Store,
    private detailsService: QcReportDetailsService,
    private viewModelBuilder: ProductTypeListItemViewModelBuilder,
    @Inject(LOOKUPS_API_SERVICE) private lookupsApi: ILookupsApiService
  ) {
    this.productTypes$ = this.store.select(QcReportState.getPortCallReportProductTypes).pipe(
      map(productTypes => _.values(productTypes).map(productType => viewModelBuilder.build(productType)))
    );
    this.uomsLookup$ = this.lookupsApi.getUoms({}).pipe(map(response => response.items), shareReplay());
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
