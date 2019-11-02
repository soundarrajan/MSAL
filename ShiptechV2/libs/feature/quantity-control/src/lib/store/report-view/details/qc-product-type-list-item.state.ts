import { IQcReportDetailsDeliveredQty, IQcReportDetailsRob } from '../../../services/api/dto/qc-report-details.dto';

export class QcProductTypeListItemState {
  productTypeName: string;
  productTypeId: number;
  robBeforeDelivery: IQcReportDetailsRob;
  deliveredQty: IQcReportDetailsDeliveredQty;
  robAfterDelivery: IQcReportDetailsRob;
}
