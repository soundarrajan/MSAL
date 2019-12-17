import { IQcReportDetailsProductTypeDto } from '../../../services/api/dto/qc-report-details.dto';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export class QcProductTypeListItemStateModel {
  productType: IDisplayLookupDto;
  robBeforeDeliveryLogBookROB: number;
  robBeforeDeliveryMeasuredROB: number;
  deliveredQuantityBdnQty: number;
  measuredDeliveredQty: number;
  robAfterDeliveryLogBookROB: number;
  robAfterDeliveryMeasuredROB: number;

  constructor(productType: IQcReportDetailsProductTypeDto) {
    this.productType = productType.productType;

    this.robBeforeDeliveryLogBookROB = productType.robBeforeDelivery?.logBookROB;
    this.robBeforeDeliveryMeasuredROB = productType.robBeforeDelivery?.measuredROB;
    this.deliveredQuantityBdnQty = productType.deliveredQty?.bdnQuantity;
    this.measuredDeliveredQty = productType.deliveredQty?.measuredQty;
    this.robAfterDeliveryLogBookROB = productType.robAfterDelivery?.logBookROB;
    this.robAfterDeliveryMeasuredROB = productType.robAfterDelivery?.measuredROB;
  }
}

export interface IQcProductTypeListItemState extends QcProductTypeListItemStateModel {

}
