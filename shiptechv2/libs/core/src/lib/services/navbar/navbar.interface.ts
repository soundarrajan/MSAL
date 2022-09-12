export interface INavBarDto {
  claimId: number;
  contractId: number;
  deliveryId: number;
  hasQuote: number;
  invoiceClaimDetailId: number;
  invoiceId: number;
  labId: number;
  orderId: number;
  requestGroupId: number;
  requestId: number;
}

export class NavBarModel {
  hasChanges: boolean;
  isDefault: boolean;
  isClear: boolean;
  canPin: boolean;
  id: string;
  isActive: boolean;
  isPinned: boolean;
  filterModels: Record<string, unknown>;
  name: string;

  constructor(navbar: Partial<INavBarDto> = {}) {
    Object.assign(this, navbar);
  }
}

