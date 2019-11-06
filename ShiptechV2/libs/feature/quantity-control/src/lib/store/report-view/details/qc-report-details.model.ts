import { QcVesselResponseByTypeState } from './qc-vessel-responses.state';
import { QcAuditLogModel } from '../audit-log/qc-audit-log.model';
import { QcEventsLogState } from './qc-events-log.state';
import { QcProductTypeListItemState } from './qc-product-type-list-item.state';

export class QcReportDetailsModel {
  id: number;
  portCallId: string;
// TODO: Use interfaces everyone
  productTypes: number[];
  productTypesById: Record<number, QcProductTypeListItemState>;
  eventsLog: QcEventsLogState;
  auditLog: QcAuditLogModel;

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
