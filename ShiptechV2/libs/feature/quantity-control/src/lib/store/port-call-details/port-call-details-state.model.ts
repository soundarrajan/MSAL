export class PortCallDetailsStateModel {
  _hasLoaded: boolean;
  _isLoading: boolean;
  portCallId: string;

  products: unknown[];
  vesselReports: unknown[];
  soundingReports: unknown[];
  events: unknown[];
  productsById: Record<string, unknown>;

  comment: string;
  vesselResponse: string;

  isInitialising = false;
  isInitialised = false;
  isSaving = false;
  isRaisingClaim: boolean;
  isVerifying: boolean;
}

export interface IPortCallDetailsState extends PortCallDetailsStateModel {
}

