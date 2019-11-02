import { QcVesselResponseState } from './qc-vessel-response.state';
import { QcAuditLogModel } from '../audit-log/qc-audit-log.model';
import { QcSurveyReportsState } from './qc-survey-reports.state';
import { IQcSoundingReportsState } from './qc-sounding-reports.model';
import { QcEventsLogState } from './qc-events-log.state';
import { QcProductTypeListItemState } from './qc-product-type-list-item.state';

export class QcReportDetailsModel {
  id: number;
  portCallId: string;
// TODO: Use interfaces everyone
  productTypes: number[];
  productTypesById: Record<number, QcProductTypeListItemState>;
  soundingReports: IQcSoundingReportsState;
  surveyReports: QcSurveyReportsState;
  eventsLog: QcEventsLogState;

  auditLog: QcAuditLogModel;

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

export interface IQcReportDetailsState extends QcReportDetailsModel {
}

