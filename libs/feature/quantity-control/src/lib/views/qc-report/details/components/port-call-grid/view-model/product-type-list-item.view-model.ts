import { QcProductTypeListItemState } from '../../../../../../store/report-view/details/qc-product-type-list-item.state';

export class ProductTypeListItemViewModel {
  productTypeName: string;
  productTypeId: number;
  robBeforeDeliveryLogBookROB: number;
  robBeforeDeliveryMeasuredROB: number;
  deliveredQuantityBdnQty: number;
  deliveredQuantityMessuredDeliveredQuantity: number;
  robAfterDeliveryLogBookROB: number;
  robAfterDeliveryMeasuredROB: number;


  constructor(itemState: QcProductTypeListItemState) {
    this.productTypeId = itemState.productTypeId;
    this.productTypeName = itemState.productTypeName;

    this.robBeforeDeliveryLogBookROB = itemState.robBeforeDeliveryLogBookROB.toNumber(),
      this.robBeforeDeliveryMeasuredROB = itemState.robBeforeDeliveryMeasuredROB.toNumber(),
      this.deliveredQuantityBdnQty = itemState.deliveredQuantityBdnQty.toNumber(),
      this.deliveredQuantityMessuredDeliveredQuantity = itemState.deliveredQuantityMessuredDeliveredQuantity.toNumber(),
      this.robAfterDeliveryLogBookROB = itemState.robAfterDeliveryLogBookROB.toNumber(),
      this.robAfterDeliveryMeasuredROB = itemState.robAfterDeliveryMeasuredROB.toNumber();
  }

}
