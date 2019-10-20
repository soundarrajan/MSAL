export interface IEntityRelatedLinksRequestDto {
  InvoiceId: string
}

export interface IEntityRelatedLinksResponseDto {
  requestId?: number,
  contractId?: number,
  requestGroupId?: number,
  orderId?: number,
  deliveryId?: number,
  labId?: number,
  claimId?: number,
  invoiceId?: number,
  hasQuote?: boolean
}
