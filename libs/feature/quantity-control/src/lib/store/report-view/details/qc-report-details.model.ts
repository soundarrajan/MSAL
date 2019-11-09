import { QcVesselResponseByTypeState } from './qc-vessel-responses.state';
import { QcAuditLogModel } from '../audit-log/qc-audit-log.model';
import { QcEventsLogState } from './qc-events-log.state';
import { QcProductTypeListItemState } from './qc-product-type-list-item.state';
import { IQcUomState, QcUomStateModel } from '../models/uom.state';

export class QcReportDetailsModel {
  id: number;
  portCallId: string;
// TODO: Use interfaces everyone
  productTypes: number[];
  productTypesById: Record<number, QcProductTypeListItemState>;
  eventsLog: QcEventsLogState;
  auditLog: QcAuditLogModel;

  robBeforeDeliveryUom: IQcUomState = new QcUomStateModel();
  robAfterDeliveryUom: IQcUomState = new QcUomStateModel();
  deliveredQtyUom: IQcUomState = new QcUomStateModel();


  nbOfCliams: number;
  nbOfDeliveries: number;

  comment: string;
  vesselResponse = new QcVesselResponseByTypeState();


  isInitialising = false;
  isInitialised = false;
  isSaving = false;
  isRaisingClaim: boolean;
  isVerifying: boolean;

  _hasLoaded: boolean;
  _isLoading: boolean;
}

export interface IQcReportDetailsState extends QcReportDetailsModel {
}
