import { Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  ProductTypeListItemViewModel,
  ProductTypeListItemViewModelFactory
} from './product-type-list-item.view-model';
import { map } from 'rxjs/operators';
import { Column } from '@ag-grid-community/core';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { Omit } from '@shiptech/core/utils/type-definitions';
import { QcProductTypeListItemStateModel } from '../../../../../../store/report/details/qc-product-type-list-item-state.model';
import _ from 'lodash';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../../../../../../store/report/details/qc-report-details.model';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { roundDecimals } from '@shiptech/core/utils/math';
import { QcReportState } from '../../../../../../store/report/qc-report.state';

export type QcProductTypeEditableProps = keyof Omit<
  QcProductTypeListItemStateModel,
  'productType'
>;

@Injectable()
export class ProductDetailsViewModel {
  productTypes$: Observable<ProductTypeListItemViewModel[]>;
  uoms$: Observable<IDisplayLookupDto[]>;
  public readonly quantityPrecision: number = 3;

  constructor(
    public gridViewModel: ProductDetailsGridViewModel,
    private store: Store,
    private detailsService: QcReportService,
    private viewModelBuilder: ProductTypeListItemViewModelFactory,
    private tenantSettings: TenantSettingsService
  ) {
    this.productTypes$ = this.store
      .select(QcReportState.productTypes)
      .pipe(
        map(productTypes =>
          _.values(productTypes).map(productType =>
            viewModelBuilder.build(productType)
          )
        )
      );

    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();
    this.quantityPrecision =
      generalTenantSettings.defaultValues.quantityPrecision;

    this.uoms$ = this.selectReportDetails(state => state.uoms);
  }

  public updateProductType(
    column: Column,
    model: ProductTypeListItemViewModel,
    value: number
  ): void {
    this.detailsService.updateProductType$(
      model.productType.id,
      <QcProductTypeEditableProps>column.getUserProvidedColDef().field,
      roundDecimals(value, this.quantityPrecision)
    );
  }

  private selectReportDetails<T>(
    select: (state: IQcReportDetailsState) => T
  ): Observable<T> {
    return this.store.select((appState: IAppState) =>
      select(appState?.quantityControl?.report?.details)
    );
  }
}
