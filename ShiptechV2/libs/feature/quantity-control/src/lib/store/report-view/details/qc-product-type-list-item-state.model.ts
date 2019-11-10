import { IQcReportDetailsProductTypeDto } from '../../../services/api/dto/qc-report-details.dto';
import { Decimal } from 'decimal.js';

export class QcProductTypeListItemStateModel {
  productTypeName: string;
  productTypeId: number;
  robBeforeDeliveryLogBookROB: Decimal;
  robBeforeDeliveryMeasuredROB: Decimal;
  deliveredQuantityBdnQty: Decimal;
  deliveredQuantityMessuredDeliveredQuantity: Decimal;
  robAfterDeliveryLogBookROB: Decimal;
  robAfterDeliveryMeasuredROB: Decimal;

  constructor(productType: IQcReportDetailsProductTypeDto) {
    this.productTypeName = productType.productTypeName;
    this.productTypeId = productType.productTypeId;

    this.robBeforeDeliveryLogBookROB = new Decimal(productType.robBeforeDelivery.logBookROB);
    this.robBeforeDeliveryMeasuredROB = new Decimal(productType.robBeforeDelivery.measuredROB);
    this.deliveredQuantityBdnQty = new Decimal(productType.deliveredQty.bdnQty);
    this.deliveredQuantityMessuredDeliveredQuantity = new Decimal(productType.deliveredQty.messuredDeliveredQty);
    this.robAfterDeliveryLogBookROB = new Decimal(productType.robAfterDelivery.logBookROB);
    this.robAfterDeliveryMeasuredROB = new Decimal(productType.robAfterDelivery.measuredROB);
  }
}
