export class PortCallStateModel {
  products: unknown[];
  vesselReports: unknown[];
  soundingReports: unknown[];
  events: unknown[];

  comment: string;
  vesselResponse: string;

  isRaisingClaim: boolean;
  isVerifying: boolean;
}

export interface IPortCallState extends PortCallStateModel {
}

