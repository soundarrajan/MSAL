export interface IEntityRelatedLink {
  type: EntityRelatedLinkType,
  id: any,
  url: string
}

export enum EntityRelatedLinkType {
  Request = 'Request',
  Offer = 'Offer',
  Order = 'Order',
  Delivery = 'Delivery',
  QuantityControl = 'QuantityControl',
  Labs = 'Labs',
  Claims = 'Claims',
  Invoices = 'Invoices',
  Recon = 'Recon',
}

export const AllEntityRelatedTypes: EntityRelatedLinkType[] = [
  EntityRelatedLinkType.Request,
  EntityRelatedLinkType.Offer,
  EntityRelatedLinkType.Order,
  EntityRelatedLinkType.Delivery,
  EntityRelatedLinkType.QuantityControl,
  EntityRelatedLinkType.Labs,
  EntityRelatedLinkType.Claims,
  EntityRelatedLinkType.Invoices,
  EntityRelatedLinkType.Recon,
];
