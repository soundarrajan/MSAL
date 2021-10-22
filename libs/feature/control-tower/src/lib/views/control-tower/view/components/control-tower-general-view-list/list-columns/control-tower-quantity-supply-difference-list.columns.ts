export enum ControlTowerQuantitySupplyDifferenceListColumns {
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

export enum ControlTowerQuantitySupplyDifferenceListExportColumns {
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

export enum ControlTowerQuantitySupplyDifferenceListColumnsLabels {
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
export const ControlTowerQuantitySupplyDifferenceListColumnServerKeys: Record<
  ControlTowerQuantitySupplyDifferenceListColumns,
  string
> = {
  [ControlTowerQuantitySupplyDifferenceListColumns.actions]: undefined,
  [ControlTowerQuantitySupplyDifferenceListColumns.order]: 'order_id',
  [ControlTowerQuantitySupplyDifferenceListColumns.port]: 'port',
  [ControlTowerQuantitySupplyDifferenceListColumns.vessel]: 'vessel_name',
  [ControlTowerQuantitySupplyDifferenceListColumns.deliveryDate]:
    'deliveryDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.createdOn]: 'createdOn',
  [ControlTowerQuantitySupplyDifferenceListColumns.claimsRaised]:
    'claimsRaised',
  [ControlTowerQuantitySupplyDifferenceListColumns.isDeleted]: 'isDeleted',
  [ControlTowerQuantitySupplyDifferenceListColumns.productType]:
    'producttype_name',
  [ControlTowerQuantitySupplyDifferenceListColumns.id]: 'id',
  [ControlTowerQuantitySupplyDifferenceListColumns.deliveryProductId]:
    'deliveryProductId',
  [ControlTowerQuantitySupplyDifferenceListColumns.totalCount]: 'totalCount',
  [ControlTowerQuantitySupplyDifferenceListColumns.buyer]: 'buyer_name',
  [ControlTowerQuantitySupplyDifferenceListColumns.status]: 'status_name'
};
