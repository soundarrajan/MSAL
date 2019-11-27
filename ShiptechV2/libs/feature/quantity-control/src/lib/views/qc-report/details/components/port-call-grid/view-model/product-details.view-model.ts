import { Inject, Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProductTypeListItemViewModel, ProductTypeListItemViewModelBuilder } from './product-type-list-item.view-model';
import { map, tap } from 'rxjs/operators';
import { Column } from 'ag-grid-community';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { Omit } from '@shiptech/core/utils/type-definitions';
import { QcProductTypeListItemStateModel } from '../../../../../../store/report/details/qc-product-type-list-item-state.model';
import _ from 'lodash';
import { LOOKUPS_API_SERVICE } from '@shiptech/core/services/lookups-api/lookups-api.service';
import { ILookupsApiService } from '@shiptech/core/services/lookups-api/lookups-api.service.interface';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../../../../../../store/report/details/qc-report-details.model';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export type QcProductTypeEditableProps = keyof Omit<QcProductTypeListItemStateModel, 'productType'>;

@Injectable()
export class ProductDetailsViewModel {

  productTypes$: Observable<ProductTypeListItemViewModel[]>;
  uoms$: Observable<IDisplayLookupDto[]>;

  public numberMaskFormat: string = this.getNumberMaskFormat();
  private minIntegerDigits: number = 1;
  private minFractionDigits: number = 3;
  private maxFractionDigits: number = 5;
  public numberDisplayFormat: string = `${this.minIntegerDigits}.${this.minFractionDigits}-${this.maxFractionDigits}`;

  constructor(
    public gridViewModel: ProductDetailsGridViewModel,
    private store: Store,
    private detailsService: QcReportService,
    private viewModelBuilder: ProductTypeListItemViewModelBuilder,
    @Inject(LOOKUPS_API_SERVICE) private lookupsApi: ILookupsApiService
  ) {
    this.productTypes$ = this.selectReportDetails(state => state.productTypesById).pipe(
      map(productTypes => _.values(productTypes).map(productType => viewModelBuilder.build(productType)))
    );

    this.uoms$ = this.selectReportDetails(state => state.uoms);
  }

  private selectReportDetails<T>(select: ((state: IQcReportDetailsState) => T)): Observable<T> {
    return this.store.select((appState: IAppState) => select(appState?.quantityControl?.report?.details));
  }

  getNumberMaskFormat(options: { integerDigits?: number, fractionDigits?: number, delimiter?: string } = {
    integerDigits: 3,
    fractionDigits: 5,
    delimiter: '.'
  }): string {
    return '9'.repeat(options.integerDigits) + options.delimiter + '9'.repeat(options.fractionDigits);
  }

  public updateProductType(column: Column, model: ProductTypeListItemViewModel, value: number): void {
    this.detailsService.updateProductType(model.productType.id, <QcProductTypeEditableProps>column.getUserProvidedColDef().field, value);
  }
}
