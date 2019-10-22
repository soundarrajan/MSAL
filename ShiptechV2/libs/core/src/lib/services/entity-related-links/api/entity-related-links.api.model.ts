export type EntityRelatedLinksRequestDto = {
  [K in EntityTypeIdField]?: number
};

export type EntityRelatedLinksResponseDto = {
  [K in EntityTypeIdField]?: number
} & {
  hasQuote?: boolean
}

export enum EntityTypeIdField {
  Request = 'requestId',
  Offer = 'requestGroupId',
  Order = 'orderId',
  Delivery = 'deliveryId',
  PortCall = 'portCallId',
  Lab = 'labId',
  Claim = 'claimId',
  Invoice = 'invoiceId',
  Recon = 'orderId',
}
