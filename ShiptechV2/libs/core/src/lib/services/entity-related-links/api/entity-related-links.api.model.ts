export type EntityRelatedLinksRequest = {
  [K in EntityTypeIdField]?: number;
};

export type EntityRelatedLinksResponse = {
  [K in EntityTypeIdField]?: string | number;
} & {
  hasQuote?: boolean;
};

export enum EntityTypeIdField {
  Request = 'requestId',
  Offer = 'requestGroupId',
  Order = 'orderId',
  Delivery = 'deliveryId',
  PortCall = 'portCallId',
  Lab = 'labId',
  Claim = 'claimId',
  Invoice = 'invoiceId',
  Recon = 'orderId'
}
