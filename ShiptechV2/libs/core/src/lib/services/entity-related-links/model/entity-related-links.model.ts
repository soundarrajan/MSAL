export interface IEntityRelatedLink {
  type: EntityRelatedLinkType,
  id: any,
  url: string
}

export enum EntityRelatedLinkType {
  Request,
  Offer,
  Order,
  Delivery,
  QuantityControl,
  Labs,
  Claims,
  Invoices,
  Recon,
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
