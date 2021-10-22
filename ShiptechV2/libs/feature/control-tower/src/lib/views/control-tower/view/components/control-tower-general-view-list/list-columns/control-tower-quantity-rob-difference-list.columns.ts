export enum ControlTowerQuantityRobDifferenceListColumns {
  actions = 'actions',
  order = 'order',
  port = 'port',
  vessel = 'vessel',
  deliveryDate = 'deliveryDate',
  createdOn = 'createdOn',
  claimsRaised = 'claimsRaised',
  isDeleted = 'isDeleted',
  productType = 'productType',
  id = 'id',
  deliveryProductId = 'deliveryProductId',
  totalCount = 'totalCount',
  buyer = 'buyer',
  status = 'status'
}

export enum ControlTowerQuantityRobDifferenceListExportColumns {
  order = 'order.name',
  port = 'port',
  vessel = 'vessel.name',
  deliveryDate = 'deliveryDate',
  createdOn = 'createdOn',
  claimsRaised = 'claimsRaised',
  isDeleted = 'isDeleted',
  productType = 'productType.name',
  id = 'id',
  deliveryProductId = 'deliveryProductId',
  totalCount = 'totalCount',
  buyer = 'buyer.name',
  status = 'status.name'
}

export enum ControlTowerQuantityRobDifferenceListColumnsLabels {
  actions = 'Actions',
  order = 'Port Call',
  port = 'Port',
  vessel = 'Vessel',
  deliveryDate = 'ETA',
  createdOn = 'Surveyor Date',
  claimsRaised = 'Email To Vessel',
  isDeleted = 'Vessel To Watch',
  productType = 'Product Type',
  id = 'Log Book ROB',
  deliveryProductId = 'Measured ROB',
  totalCount = 'Difference in Qty',
  buyer = 'Qty UOM',
  status = 'Progress'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const ControlTowerQuantityRobDifferenceListColumnServerKeys: Record<
  ControlTowerQuantityRobDifferenceListColumns,
  string
> = {
  [ControlTowerQuantityRobDifferenceListColumns.actions]: undefined,
  [ControlTowerQuantityRobDifferenceListColumns.order]: 'order_id',
  [ControlTowerQuantityRobDifferenceListColumns.port]: 'port',
  [ControlTowerQuantityRobDifferenceListColumns.vessel]: 'vessel_name',
  [ControlTowerQuantityRobDifferenceListColumns.deliveryDate]: 'deliveryDate',
  [ControlTowerQuantityRobDifferenceListColumns.createdOn]: 'createdOn',
  [ControlTowerQuantityRobDifferenceListColumns.claimsRaised]: 'claimsRaised',
  [ControlTowerQuantityRobDifferenceListColumns.isDeleted]: 'isDeleted',
  [ControlTowerQuantityRobDifferenceListColumns.productType]:
    'producttype_name',
  [ControlTowerQuantityRobDifferenceListColumns.id]: 'id',
  [ControlTowerQuantityRobDifferenceListColumns.deliveryProductId]:
    'deliveryProductId',
  [ControlTowerQuantityRobDifferenceListColumns.totalCount]: 'totalCount',
  [ControlTowerQuantityRobDifferenceListColumns.buyer]: 'buyer_name',
  [ControlTowerQuantityRobDifferenceListColumns.status]: 'status_name'
};
