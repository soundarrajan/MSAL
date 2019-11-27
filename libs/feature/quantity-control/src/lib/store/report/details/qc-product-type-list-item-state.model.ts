import { IQcReportDetailsProductTypeDto } from '../../../services/api/dto/qc-report-details.dto';
import { Decimal } from 'decimal.js';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export class QcProductTypeListItemStateModel {
  id: number;
  productType: IDisplayLookupDto;
  robBeforeDeliveryLogBookROB: Decimal;
  robBeforeDeliveryMeasuredROB: Decimal;
  deliveredQuantityBdnQty: Decimal;
  deliveredQuantityMeasuredQty: Decimal;
  robAfterDeliveryLogBookROB: Decimal;
  robAfterDeliveryMeasuredROB: Decimal;

  constructor(productType: IQcReportDetailsProductTypeDto) {
    this.id = productType.id;
    this.productType = productType.productType;

    this.robBeforeDeliveryLogBookROB = productType.robBeforeDelivery.logBookROB ? new Decimal(productType.robBeforeDelivery.logBookROB): undefined;
    this.robBeforeDeliveryMeasuredROB = productType.robBeforeDelivery.measuredROB ? new Decimal(productType.robBeforeDelivery.measuredROB): undefined;
    this.deliveredQuantityBdnQty = productType.deliveredQty.bdnQuantity ? new Decimal(productType.deliveredQty.bdnQuantity): undefined;
    this.deliveredQuantityMeasuredQty = productType.deliveredQty.measuredQty ? new Decimal(productType.deliveredQty.measuredQty) : undefined;
    this.robAfterDeliveryLogBookROB = productType.robAfterDelivery.logBookROB ? new Decimal(productType.robAfterDelivery.logBookROB): undefined;
    this.robAfterDeliveryMeasuredROB = productType.robAfterDelivery.measuredROB ?new Decimal(productType.robAfterDelivery.measuredROB) : undefined;
  }
}

export interface IQcProductTypeListItemState extends  QcProductTypeListItemStateModel{

}
