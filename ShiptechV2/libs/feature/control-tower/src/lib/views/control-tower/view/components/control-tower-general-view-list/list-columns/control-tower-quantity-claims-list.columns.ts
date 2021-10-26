export enum ControlTowerQuantityClaimsListColumns {
  order = 'order',
  lab = 'lab',
  id = 'id',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  product = 'product'
}

export enum ControlTowerQuantityClaimsListExportColumns {
  order = 'order.id',
  lab = 'lab.id',
  id = 'id',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  product = 'product'
}

export enum ControlTowerQuantityClaimsListColumnsLabels {
  order = 'Order No',
  lab = 'Lab ID',
  id = 'Claim No',
  port = 'Port',
  vessel = 'Vessel',
  eta = 'ETA',
  product = 'Product'
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
  [ControlTowerQuantityClaimsListColumns.product]: 'product'
};
