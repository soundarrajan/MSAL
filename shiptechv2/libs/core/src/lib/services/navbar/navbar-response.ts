
export interface INavBarResponse {
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

export interface INavBarRequest {
  deliveryId: number;
}
