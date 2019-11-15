import { QcVesselResponseByTypeState } from './qc-vessel-responses.state';
import { QcAuditLogStateModel } from '../audit-log/qc-audit-log-state.model';
import { IQcEventsLogState, QcEventsLogStateModel } from './qc-events-log-state.model';
import { QcProductTypeListItemStateModel } from './qc-product-type-list-item-state.model';
import { IQcUomState, QcUomStateModel } from '../models/uom.state';

export class QcReportDetailsModel {
  id: number;
  portCallId: string;
// TODO: Use interfaces everyone
  productTypes: number[];
  productTypesById: Record<number, QcProductTypeListItemStateModel>;
  eventsLog:IQcEventsLogState = new QcEventsLogStateModel();
  auditLog: QcAuditLogStateModel;

  robBeforeDeliveryUom: IQcUomState = new QcUomStateModel();
  robAfterDeliveryUom: IQcUomState = new QcUomStateModel();
  deliveredQtyUom: IQcUomState = new QcUomStateModel();

  //TODO: Rename, fix typo, rename to countOfClaims, rename others too
  nbOfCliams: number;
  nbOfDeliveries: number;

  comment: string;
  vesselResponse = new QcVesselResponseByTypeState();

  isSaving = false;
  isRaisingClaim: boolean;
  isVerifying: boolean;
  hasChanges: boolean;

  _hasLoaded: boolean;
  _isLoading: boolean;
}

export interface IQcReportDetailsState extends QcReportDetailsModel {
}
