import { QcVesselResponseState } from './models/qc-vessel-response.state';
import { QcAuditLogState } from './models/qc-audit-log.state';
import { QcSurveyReportsState } from './models/qc-survey-reports.state';
import { QcSoundingReportsState } from './models/qc-sounding-reports.state';
import { QcEventsLogState } from './models/qc-events-log.state';
import { QcProductTypeListItemState } from './models/qc-product-type-list-item.state';

export class QcReportDetailsStateModel {
  id: number;
  portCallId: string;

  productTypes: number[];
  productTypesById: Record<number, QcProductTypeListItemState>;
  soundingReports: QcSoundingReportsState;
  surveyReports: QcSurveyReportsState;
  eventsLog: QcEventsLogState;

  auditLog: QcAuditLogState;

  comment: string;
  vesselResponse: QcVesselResponseState;

  isInitialising = false;
  isInitialised = false;
  isSaving = false;
  isRaisingClaim: boolean;
  isVerifying: boolean;

  _hasLoaded: boolean;
  _isLoading: boolean;
}

export interface IQcReportDetailsState extends QcReportDetailsStateModel {
}

