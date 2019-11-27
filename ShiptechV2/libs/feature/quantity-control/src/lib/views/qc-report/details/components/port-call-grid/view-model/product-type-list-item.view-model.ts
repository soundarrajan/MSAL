import { QcProductTypeListItemStateModel } from '../../../../../../store/report/details/qc-product-type-list-item-state.model';
import { INumberFormat, NUMBER_FORMAT } from './number.format';
import { Inject, Injectable } from '@angular/core';
import { truncateDecimals } from '@shiptech/core/utils/math';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

@Injectable()
export class ProductTypeListItemViewModelBuilder {
  constructor(@Inject(NUMBER_FORMAT) private numberFormat: INumberFormat) {
  }

  build(itemState: QcProductTypeListItemStateModel): ProductTypeListItemViewModel {
    return new ProductTypeListItemViewModel(itemState, this.numberFormat);
  }
}

export class ProductTypeListItemViewModel {
  productType: IDisplayLookupDto;
  robBeforeDeliveryLogBookROB: number;
  robBeforeDeliveryMeasuredROB: number;
  bdnQty: number;
  measuredDeliveredQty: number;
  robAfterDeliveryLogBookROB: number;
  robAfterDeliveryMeasuredROB: number;


  constructor(itemState: QcProductTypeListItemStateModel, numberFormat: INumberFormat) {
    this.productType = itemState.productType;

    this.robBeforeDeliveryLogBookROB = truncateDecimals(itemState.robBeforeDeliveryLogBookROB?.toNumber(), numberFormat.maxFractionDigits);
    this.robBeforeDeliveryMeasuredROB = truncateDecimals(itemState.robBeforeDeliveryMeasuredROB?.toNumber(), numberFormat.maxFractionDigits);
    this.bdnQty = truncateDecimals(itemState.deliveredQuantityBdnQty?.toNumber(), numberFormat.maxFractionDigits);
    this.measuredDeliveredQty = truncateDecimals(itemState.deliveredQuantityMeasuredQty?.toNumber(), numberFormat.maxFractionDigits);
    this.robAfterDeliveryLogBookROB = truncateDecimals(itemState.robAfterDeliveryLogBookROB?.toNumber(), numberFormat.maxFractionDigits);
    this.robAfterDeliveryMeasuredROB = truncateDecimals(itemState.robAfterDeliveryMeasuredROB?.toNumber(), numberFormat.maxFractionDigits);
  }

}
