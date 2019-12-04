import { Inject, Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProductTypeListItemViewModel, ProductTypeListItemViewModelFactory } from './product-type-list-item.view-model';
import { map } from 'rxjs/operators';
import { Column } from 'ag-grid-community';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { Omit } from '@shiptech/core/utils/type-definitions';
import { QcProductTypeListItemStateModel } from '../../../../../../store/report/details/qc-product-type-list-item-state.model';
import _ from 'lodash';
import { LOOKUPS_API_SERVICE } from '@shiptech/core/services/lookups-api/lookups-api.service';
import { ILookupsApiService } from '@shiptech/core/services/lookups-api/lookups-api.service.interface';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../../../../../../store/report/details/qc-report-details.model';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { roundDecimals } from '@shiptech/core/utils/math';

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
  private quantityPrecision: number = 3;

  constructor(
    public gridViewModel: ProductDetailsGridViewModel,
    private store: Store,
    private detailsService: QcReportService,
    private viewModelBuilder: ProductTypeListItemViewModelFactory,
    private tenantSettings: TenantSettingsService,
    @Inject(LOOKUPS_API_SERVICE) private lookupsApi: ILookupsApiService
  ) {
    this.productTypes$ = this.selectReportDetails(state => state.productTypesById).pipe(
      map(productTypes => _.values(productTypes).map(productType => viewModelBuilder.build(productType)))
    );


    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();
    this.quantityPrecision = generalTenantSettings.defaultValues.quantityPrecision;
    this.minFractionDigits = this.quantityPrecision;
    this.maxFractionDigits = this.quantityPrecision;

    this.uoms$ = this.selectReportDetails(state => state.uoms);
  }

  private selectReportDetails<T>(select: ((state: IQcReportDetailsState) => T)): Observable<T> {
    return this.store.select((appState: IAppState) => select(appState?.quantityControl?.report?.details));
  }

  getNumberMaskFormat(options: { integerDigits?: number, fractionDigits?: number, delimiter?: string } = {
    integerDigits: 3,
    fractionDigits: this.quantityPrecision,
    delimiter: '.'
  }): string {
    return '9'.repeat(options.integerDigits) + options.delimiter + '9'.repeat(options.fractionDigits);
  }

  public updateProductType(column: Column, model: ProductTypeListItemViewModel, value: number): void {
    this.detailsService.updateProductType$(model.id, <QcProductTypeEditableProps>column.getUserProvidedColDef().field, roundDecimals(value, this.quantityPrecision));
  }
}
