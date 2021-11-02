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
  progress = 'progress',
  bdnQuantity = 'bdnQuantity',
  id = 'id',
  measuredDeliveryQty = 'measuredDeliveryQty',
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
  progress = 'progress.name',
  bdnQuantity = 'bdnQuantity',
  id = 'id',
  measuredDeliveryQty = 'measuredDeliveryQty',
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
  progress = 'Progress',
  id = 'Log Book ROB',
  bdnQuantity = 'BDN Quantity',
  measuredDeliveryQty = 'Measured ROB',
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
  [ControlTowerQuantitySupplyDifferenceListColumns.deliveryDate]: 'deliveryDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.createdOn]: 'eta',
  [ControlTowerQuantitySupplyDifferenceListColumns.claimsRaised]: 'claimsRaised',
  [ControlTowerQuantitySupplyDifferenceListColumns.isDeleted]: 'isDeleted',
  [ControlTowerQuantitySupplyDifferenceListColumns.productType]: 'producttype_name',
  [ControlTowerQuantitySupplyDifferenceListColumns.progress]: 'progress_name',
  [ControlTowerQuantitySupplyDifferenceListColumns.bdnQuantity]: 'bdnQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.id]: 'id',
  [ControlTowerQuantitySupplyDifferenceListColumns.measuredDeliveryQty]: 'measuredDeliveryQty',
  [ControlTowerQuantitySupplyDifferenceListColumns.totalCount]: 'totalCount',
  [ControlTowerQuantitySupplyDifferenceListColumns.buyer]: 'buyer_name',
  [ControlTowerQuantitySupplyDifferenceListColumns.status]: 'status_name'
};
