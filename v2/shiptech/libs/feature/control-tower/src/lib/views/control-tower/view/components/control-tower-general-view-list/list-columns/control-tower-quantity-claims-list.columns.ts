export enum ControlTowerQuantityClaimsListColumns {
  order = 'order',
  lab = 'lab',
  id = 'id',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  product = 'product',
  seller = 'seller',
  quantityShortage = 'quantityShortage',
  quantityUom = 'quantityUom',
  estimatedSettlementAmount = 'estimatedSettlementAmount',
  createdDate = 'createdDate',
  createdBy = 'createdBy',
  orderPrice = 'orderPrice',
  currency = 'currency',
  noResponse = 'noResponse'
}

export enum ControlTowerQuantityClaimsListExportColumns {
  order = 'order.id',
  lab = 'lab.id',
  id = 'id',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  product = 'product',
  seller = 'seller',
  quantityShortage = 'quantityShortage',
  quantityUom = 'quantityUom.name',
  estimatedSettlementAmount = 'estimatedSettlementAmount',
  createdDate = 'createdDate',
  createdBy = 'createdBy.name',
  orderPrice = 'orderPrice',
  currency = 'currency',
  noResponse = 'noResponse'
}

export enum ControlTowerQuantityClaimsListColumnsLabels {
  order = 'Order No',
  lab = 'Lab ID',
  id = 'Claim No',
  port = 'Port',
  vessel = 'Vessel',
  eta = 'ETA',
  product = 'Product',
  seller = 'Seller',
  quantityShortage = 'Qty Shortage',
  quantityUom = 'Qty UOM',
  estimatedSettlementAmount = 'Estimated Settlement Amount',
  createdDate = 'Created Date',
  createdBy = 'Created By',
  orderPrice = 'Order Price',
  currency = 'Currency',
  noResponse = 'No Response'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const ControlTowerQuantityClaimsListColumnServerKeys: Record<
  ControlTowerQuantityClaimsListColumns,
  string
> = {
  [ControlTowerQuantityClaimsListColumns.order]: 'order_id',
  [ControlTowerQuantityClaimsListColumns.lab]: 'lab_id',
  [ControlTowerQuantityClaimsListColumns.id]: 'id',
  [ControlTowerQuantityClaimsListColumns.port]: 'port',
  [ControlTowerQuantityClaimsListColumns.vessel]: 'vessel',
  [ControlTowerQuantityClaimsListColumns.eta]: 'eta',
  [ControlTowerQuantityClaimsListColumns.product]: 'product',
  [ControlTowerQuantityClaimsListColumns.seller]: 'seller',
  [ControlTowerQuantityClaimsListColumns.quantityShortage]: 'quantityShortage',
  [ControlTowerQuantityClaimsListColumns.quantityUom]: 'quantityUom_name',
  [ControlTowerQuantityClaimsListColumns.estimatedSettlementAmount]:
    'estimatedSettlementAmount',
  [ControlTowerQuantityClaimsListColumns.createdDate]: 'createdDate',
  [ControlTowerQuantityClaimsListColumns.createdBy]: 'createdBy_name',
  [ControlTowerQuantityClaimsListColumns.orderPrice]: 'orderPrice',
  [ControlTowerQuantityClaimsListColumns.currency]: 'currency_name',
  [ControlTowerQuantityClaimsListColumns.noResponse]: 'noResponse'
};
