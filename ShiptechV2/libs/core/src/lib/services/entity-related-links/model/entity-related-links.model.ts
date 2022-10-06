import { EntityTypeIdField } from '@shiptech/core/services/entity-related-links/api/entity-related-links.api.model';

export interface IEntityRelatedLink {
  type: EntityType;
  id: any;
  url: string;
}

export enum EntityType {
  Request = 'Request',
  Offer = 'Offer',
  Order = 'Order',
  Delivery = 'Delivery',
  PortCall = 'PortCall',
  Lab = 'Lab',
  Claim = 'Claim',
  Invoice = 'Invoice',
  Recon = 'Recon'
}

export const AllEntityTypes: EntityType[] = [
  EntityType.Request,
  EntityType.Offer,
  EntityType.Order,
  EntityType.Delivery,
  EntityType.PortCall,
  EntityType.Lab,
  EntityType.Claim,
  EntityType.Invoice,
  EntityType.Recon
];

export const EntityToEntityIdFieldMap: Record<EntityType, EntityTypeIdField> = {
  [EntityType.Request]: EntityTypeIdField.Request,
  [EntityType.Offer]: EntityTypeIdField.Offer,
  [EntityType.Order]: EntityTypeIdField.Order,
  [EntityType.Delivery]: EntityTypeIdField.Delivery,
  [EntityType.PortCall]: EntityTypeIdField.PortCall,
  [EntityType.Lab]: EntityTypeIdField.Lab,
  [EntityType.Claim]: EntityTypeIdField.Claim,
  [EntityType.Invoice]: EntityTypeIdField.Invoice,
  [EntityType.Recon]: EntityTypeIdField.Recon
};
