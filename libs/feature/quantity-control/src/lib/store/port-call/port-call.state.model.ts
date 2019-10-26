export class PortCallStateModel {
  products: unknown[];
  vesselReports: unknown[];
  soundingReports: unknown[];
  events: unknown[];

  comment: string;
  vesselResponse: string;

  isInitialising = false;
  isInitialised = false;
  isSaving = false;
  isRaisingClaim: boolean;
  isVerifying: boolean;
}

export interface IPortCallState extends PortCallStateModel {
}

