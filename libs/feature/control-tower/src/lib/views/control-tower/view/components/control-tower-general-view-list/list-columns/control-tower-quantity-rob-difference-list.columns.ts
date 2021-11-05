export enum ControlTowerQuantityRobDifferenceListColumns {
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
  measuredDeliveredQty = 'measuredDeliveredQty',
  sumOfOrderQtyCol = 'sumOfOrderQtyCol',
  totalCount = 'totalCount',
  qtyUom = 'buyer',
  status = 'status'
}

export enum ControlTowerQuantityRobDifferenceListExportColumns {
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
  qtyUom = 'buyer.name',
  status = 'status.name'
}

export enum ControlTowerQuantityRobDifferenceListColumnsLabels {
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
  qtyUom = 'Qty UOM',
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
  [ControlTowerQuantityRobDifferenceListColumns.portCall]: 'order_id',
  [ControlTowerQuantityRobDifferenceListColumns.port]: 'port',
  [ControlTowerQuantityRobDifferenceListColumns.vessel]: 'vessel_name',
  [ControlTowerQuantityRobDifferenceListColumns.eta]: 'eta',
  [ControlTowerQuantityRobDifferenceListColumns.surveyorDate]: 'eta',
  [ControlTowerQuantityRobDifferenceListColumns.emailToVessel]: 'emailToVessel',
  [ControlTowerQuantityRobDifferenceListColumns.vesselToWatch]: 'vesselToWatch',
  [ControlTowerQuantityRobDifferenceListColumns.productType]:
    'producttype_name',
  [ControlTowerQuantityRobDifferenceListColumns.progress]: 'progress',
  [ControlTowerQuantityRobDifferenceListColumns.bdnQuantity]: 'bdnQuantity',
  //   [ControlTowerQuantityRobDifferenceListColumns.id]: 'id',
  [ControlTowerQuantityRobDifferenceListColumns.measuredDeliveredQty]:
    'measuredDeliveredQty',
  [ControlTowerQuantityRobDifferenceListColumns.sumOfOrderQtyCol]:
    'sumOfOrderQty',
  [ControlTowerQuantityRobDifferenceListColumns.totalCount]: 'totalCount',
  [ControlTowerQuantityRobDifferenceListColumns.qtyUom]: 'qtyUom',
  [ControlTowerQuantityRobDifferenceListColumns.status]: 'status_name'
};
