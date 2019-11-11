import { QcProductTypeListItemStateModel } from '../../../../../../store/report-view/details/qc-product-type-list-item-state.model';
import { INumberFormat, NUMBER_FORMAT } from './number.format';
import { Inject, Injectable } from '@angular/core';
import { truncateDecimals } from '@shiptech/core/utils/math';

@Injectable()
export class ProductTypeListItemViewModelBuilder {
  constructor(@Inject(NUMBER_FORMAT) private numberFormat: INumberFormat) {
  }

  build(itemState: QcProductTypeListItemStateModel): ProductTypeListItemViewModel {
    return new ProductTypeListItemViewModel(itemState, this.numberFormat);
  }
}

export class ProductTypeListItemViewModel {
  productTypeName: string;
  productTypeId: number;
  robBeforeDeliveryLogBookROB: number;
  robBeforeDeliveryMeasuredROB: number;
  deliveredQuantityBdnQty: number;
  deliveredQuantityMessuredDeliveredQuantity: number;
  robAfterDeliveryLogBookROB: number;
  robAfterDeliveryMeasuredROB: number;


  constructor(itemState: QcProductTypeListItemStateModel, numberFormat: INumberFormat) {
    this.productTypeId = itemState.productTypeId;
    this.productTypeName = itemState.productTypeName;

    this.robBeforeDeliveryLogBookROB = truncateDecimals(itemState.robBeforeDeliveryLogBookROB.toNumber(), numberFormat.maxFractionDigits);
    this.robBeforeDeliveryMeasuredROB = truncateDecimals(itemState.robBeforeDeliveryMeasuredROB.toNumber(), numberFormat.maxFractionDigits);
    this.deliveredQuantityBdnQty = truncateDecimals(itemState.deliveredQuantityBdnQty.toNumber(), numberFormat.maxFractionDigits);
    this.deliveredQuantityMessuredDeliveredQuantity = truncateDecimals(itemState.deliveredQuantityMessuredDeliveredQuantity.toNumber(), numberFormat.maxFractionDigits);
    this.robAfterDeliveryLogBookROB = truncateDecimals(itemState.robAfterDeliveryLogBookROB.toNumber(), numberFormat.maxFractionDigits);
    this.robAfterDeliveryMeasuredROB = truncateDecimals(itemState.robAfterDeliveryMeasuredROB.toNumber(), numberFormat.maxFractionDigits);
  }

}
