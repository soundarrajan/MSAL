import { IQcReportDetailsProductTypeDto } from '../../../services/api/dto/qc-report-details.dto';
import { Decimal } from 'decimal.js';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { safeDecimal } from '@shiptech/core/utils/math';

export class QcProductTypeListItemStateModel {
  id: number;
  productType: IDisplayLookupDto;
  robBeforeDeliveryLogBookROB: Decimal;
  robBeforeDeliveryMeasuredROB: Decimal;
  deliveredQuantityBdnQty: Decimal;
  measuredDeliveredQty: Decimal;
  robAfterDeliveryLogBookROB: Decimal;
  robAfterDeliveryMeasuredROB: Decimal;

  constructor(productType: IQcReportDetailsProductTypeDto) {
    this.id = productType.id;
    this.productType = productType.productType;

    this.robBeforeDeliveryLogBookROB = safeDecimal(productType.robBeforeDelivery?.logBookROB);
    this.robBeforeDeliveryMeasuredROB = safeDecimal(productType.robBeforeDelivery?.measuredROB);
    this.deliveredQuantityBdnQty = safeDecimal(productType.deliveredQty?.bdnQuantity);
    this.measuredDeliveredQty = safeDecimal(productType.deliveredQty?.measuredQty);
    this.robAfterDeliveryLogBookROB = safeDecimal(productType.robAfterDelivery?.logBookROB);
    this.robAfterDeliveryMeasuredROB = safeDecimal(productType.robAfterDelivery?.measuredROB);
  }
}

export interface IQcProductTypeListItemState extends QcProductTypeListItemStateModel {

}
