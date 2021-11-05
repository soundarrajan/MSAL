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
  differenceInQty = 'differenceInQty',
  qtyUom = 'buyer',
  // status = 'status'
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
  differenceInQty = 'differenceInQty',
  qtyUom = 'buyer.name',
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
  differenceInQty = 'Difference in Qty',
  qtyUom = 'Qty UOM',
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
  [ControlTowerQuantitySupplyDifferenceListColumns.portCall]: 'PortCall_PortCallId',
  [ControlTowerQuantitySupplyDifferenceListColumns.port]: 'Port',
  [ControlTowerQuantitySupplyDifferenceListColumns.vessel]: 'Vessel',
  [ControlTowerQuantitySupplyDifferenceListColumns.eta]: 'Eta',
  [ControlTowerQuantitySupplyDifferenceListColumns.surveyorDate]: 'SurveyorDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.emailToVessel]: 'VesselEmail',
  [ControlTowerQuantitySupplyDifferenceListColumns.vesselToWatch]: 'VesselToWatch',
  [ControlTowerQuantitySupplyDifferenceListColumns.productType]: 'ProductType', /* TO DO */
  [ControlTowerQuantitySupplyDifferenceListColumns.progress]: 'Progress_Id',
  [ControlTowerQuantitySupplyDifferenceListColumns.bdnQuantity]: 'QuantityReportDetails_BdnQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.measuredDeliveredQty]: 'QuantityReportDetails_MeasuredDeliveredQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.sumOfOrderQtyCol]: 'sumOfOrderQty', /* TO DO */
  [ControlTowerQuantitySupplyDifferenceListColumns.differenceInQty]: 'QuantityReportDetails_DifferenceInSupplyQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.qtyUom]: 'QuantityReportDetails_SupplyUom_Name',
};
