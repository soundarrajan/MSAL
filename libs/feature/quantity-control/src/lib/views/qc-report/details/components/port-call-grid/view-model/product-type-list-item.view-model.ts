import { QcProductTypeListItemStateModel } from '../../../../../../store/report/details/qc-product-type-list-item-state.model';
import { INumberFormat, NUMBER_FORMAT } from './number.format';
import { Inject, Injectable } from '@angular/core';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

@Injectable()
export class ProductTypeListItemViewModelBuilder {
  constructor(@Inject(NUMBER_FORMAT) private numberFormat: INumberFormat) {
  }

  build(itemState: QcProductTypeListItemStateModel): ProductTypeListItemViewModel {
    return new ProductTypeListItemViewModel(itemState);
  }
}

export class ProductTypeListItemViewModel {
  id: number;
  productType: IDisplayLookupDto;
  robBeforeDeliveryLogBookROB: number;
  robBeforeDeliveryMeasuredROB: number;
  deliveredQuantityBdnQty: number;
  measuredDeliveredQty: number;
  robAfterDeliveryLogBookROB: number;
  robAfterDeliveryMeasuredROB: number;


  constructor(itemState: QcProductTypeListItemStateModel) {
    this.id = itemState.id;
    this.productType = itemState.productType;

    this.robBeforeDeliveryLogBookROB = itemState.robBeforeDeliveryLogBookROB;
    this.robBeforeDeliveryMeasuredROB = itemState.robBeforeDeliveryMeasuredROB;
    this.deliveredQuantityBdnQty = itemState.deliveredQuantityBdnQty;
    this.measuredDeliveredQty = itemState.measuredDeliveredQty;
    this.robAfterDeliveryLogBookROB = itemState.robAfterDeliveryLogBookROB;
    this.robAfterDeliveryMeasuredROB = itemState.robAfterDeliveryMeasuredROB;
  }
}
