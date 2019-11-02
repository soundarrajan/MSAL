import {
  IQcReportDetailsDeliveredQty,
  IQcReportDetailsProductTypeDto,
  IQcReportDetailsRob
} from '../../../services/api/dto/qc-report-details.dto';
import { Decimal } from 'decimal.js';

export class QcProductTypeListItemState {
  productTypeName: string;
  productTypeId: number;
  robBeforeDelivery: QcReportDetailsRobState;
  deliveredQty: QcReportDetailsDeliveredQtyState;
  robAfterDelivery: QcReportDetailsRobState;

  constructor(productType: IQcReportDetailsProductTypeDto) {
    this.productTypeName = productType.productTypeName;
    this.productTypeId = productType.productTypeId;
    this.robBeforeDelivery = new QcReportDetailsRobState(productType.robBeforeDelivery);
    this.deliveredQty = new QcReportDetailsDeliveredQtyState(productType.deliveredQty);
    this.robAfterDelivery = new QcReportDetailsRobState(productType.robAfterDelivery);
  }
}


export class QcReportDetailsDeliveredQtyState {
  bdnQty: Decimal;
  messuredDeliveredQty: Decimal;

  constructor(content: IQcReportDetailsDeliveredQty) {
    this.bdnQty = new Decimal(content.bdnQty);
    this.messuredDeliveredQty = new Decimal(content.messuredDeliveredQty);
  }
}

export class QcReportDetailsRobState {
  logBookROB: Decimal;
  measuredROB: Decimal;

  constructor(content: IQcReportDetailsRob) {
    this.logBookROB = new Decimal(content.logBookROB);
    this.measuredROB = new Decimal(content.measuredROB);
  }
}
