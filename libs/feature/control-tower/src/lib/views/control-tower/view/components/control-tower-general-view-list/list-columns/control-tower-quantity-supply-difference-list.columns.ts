export enum ControlTowerQuantitySupplyDifferenceListColumns {
  actions = 'actions',
  portCall = 'portcall.portCallId',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  productType = 'productType',
  progress = 'progress',
  bdnQuantity = 'bdnQuantity',
//   id = 'id',
  measuredDeliveredQty = 'measuredDeliveredQty',
  sumOfOrderQtyCol = 'sumOfOrderQtyCol',
  totalCount = 'totalCount',
  buyer = 'buyer',
  status = 'status'
}

export enum ControlTowerQuantitySupplyDifferenceListExportColumns {
  portCall = 'portcall.portCallId',
  port = 'port',
  vessel = 'vessel.name',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  productType = 'productType.name',
  progress = 'progress.name',
  bdnQuantity = 'bdnQuantity',
  id = 'id',
  measuredDeliveredQty = 'measuredDeliveredQty',
  sumOfOrderQtyCol = 'sumOfOrderQtyCol',
  totalCount = 'totalCount',
  buyer = 'buyer.name',
  status = 'status.name'
}

export enum ControlTowerQuantitySupplyDifferenceListColumnsLabels {
  actions = 'Actions',
  portCall = 'Port Call',
  port = 'Port',
  vessel = 'Vessel',
  eta = 'ETA',
  surveyorDate = 'Surveyor Date',
  emailToVessel = 'Email To Vessel',
  vesselToWatch = 'Vessel To Watch',
  productType = 'Product Type',
  progress = 'Progress',
  id = 'Log Book ROB',
  bdnQuantity = 'BDN Quantity',
  measuredDeliveredQty = 'Measured Delivered Quantity',
  sumOfOrderQtyCol = 'Sum Of Order Qty',
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
  [ControlTowerQuantitySupplyDifferenceListColumns.portCall]: 'order_id',
  [ControlTowerQuantitySupplyDifferenceListColumns.port]: 'port',
  [ControlTowerQuantitySupplyDifferenceListColumns.vessel]: 'vessel_name',
  [ControlTowerQuantitySupplyDifferenceListColumns.eta]: 'eta',
  [ControlTowerQuantitySupplyDifferenceListColumns.surveyorDate]: 'eta',
  [ControlTowerQuantitySupplyDifferenceListColumns.emailToVessel]: 'emailToVessel',
  [ControlTowerQuantitySupplyDifferenceListColumns.vesselToWatch]: 'vesselToWatch',
  [ControlTowerQuantitySupplyDifferenceListColumns.productType]: 'producttype_name',
  [ControlTowerQuantitySupplyDifferenceListColumns.progress]: 'progress',
  [ControlTowerQuantitySupplyDifferenceListColumns.bdnQuantity]: 'bdnQuantity',
//   [ControlTowerQuantitySupplyDifferenceListColumns.id]: 'id',
  [ControlTowerQuantitySupplyDifferenceListColumns.measuredDeliveredQty]: 'measuredDeliveredQty',
  [ControlTowerQuantitySupplyDifferenceListColumns.sumOfOrderQtyCol]: 'sumOfOrderQty',
  [ControlTowerQuantitySupplyDifferenceListColumns.totalCount]: 'totalCount',
  [ControlTowerQuantitySupplyDifferenceListColumns.buyer]: 'buyer_name',
  [ControlTowerQuantitySupplyDifferenceListColumns.status]: 'status_name'
};
