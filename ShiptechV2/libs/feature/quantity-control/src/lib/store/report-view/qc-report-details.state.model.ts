import { QcVesselResponseState } from './qc-vessel-response.state';

export class QcReportDetailsStateModel {
  id: number;

  productTypes: number[];
  productTypesById: Record<string, unknown>;
  vesselReports: unknown[];
  soundingReports: unknown[];
  eventsLog: unknown[];
  // Avem nevoie de el aici?
  //auditLogs: unknown[];

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

