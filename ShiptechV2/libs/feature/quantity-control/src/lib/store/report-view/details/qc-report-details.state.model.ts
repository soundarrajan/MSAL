import { QcVesselResponseState } from './qc-vessel-response.state';
import { QcAuditLogState } from '../audit-log/qc-audit-log.state';
import { QcSurveyReportsState } from './qc-survey-reports.state';
import { QcSoundingReportsState } from './qc-sounding-reports.state';
import { QcEventsLogState } from './qc-events-log.state';
import { QcProductTypeListItemState } from './qc-product-type-list-item.state';

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

