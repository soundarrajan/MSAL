import { QcProductTypeListItemState } from '../../../../../../store/report-view/details/qc-product-type-list-item.state';
import {
  IQcReportDetailsDeliveredQty,
  IQcReportDetailsRob
} from '../../../../../../services/api/dto/qc-report-details.dto';

export class ProductTypeListItemViewModel {
  productTypeName: string;
  productTypeId: number;
  robBeforeDelivery: IQcReportDetailsRob;
  deliveredQty: IQcReportDetailsDeliveredQty;
  robAfterDelivery: IQcReportDetailsRob;

  constructor(itemState: QcProductTypeListItemState) {
    this.productTypeId = itemState.productTypeId;
    this.productTypeName = itemState.productTypeName;
    this.robBeforeDelivery = {
      measuredROB: itemState.robBeforeDelivery.measuredROB.toNumber(),
      logBookROB: itemState.robBeforeDelivery.logBookROB.toNumber()
    };
    this.deliveredQty = {
      bdnQty: itemState.deliveredQty.bdnQty.toNumber(),
      messuredDeliveredQty: itemState.deliveredQty.messuredDeliveredQty.toNumber()
    };
    this.robAfterDelivery = {
      measuredROB: itemState.robAfterDelivery.measuredROB.toNumber(),
      logBookROB: itemState.robAfterDelivery.logBookROB.toNumber()
    };
  }

}
