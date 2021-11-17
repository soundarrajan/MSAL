export enum ControlTowerQuantitySupplyDifferenceListColumns {
  actions = 'actions',
  portCall = 'portCall',
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
  qtyUom = 'qtyUom'
  // status = 'status'
}

export enum ControlTowerQuantitySupplyDifferenceListExportColumns {
  portCall = 'portCall',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  productType = 'quantityReportDetails.productType.Name',
  progress = 'progress.name',
  bdnQuantity = 'bdnQuantity',
  // id = 'id',
  measuredDeliveredQty = 'quantityReportDetails.measuredDeliveredQuantity',
  sumOfOrderQtyCol = 'quantityReportDetails.sumOfOrderQuantity',
  differenceInQty = 'quantityReportDetails.differenceInSupplyQuantity',
  qtyUom = 'qtyUom',
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
  [ControlTowerQuantitySupplyDifferenceListColumns.portCall]:
    'PortCall_PortCallId',
  [ControlTowerQuantitySupplyDifferenceListColumns.port]: 'Port',
  [ControlTowerQuantitySupplyDifferenceListColumns.vessel]: 'Vessel',
  [ControlTowerQuantitySupplyDifferenceListColumns.eta]: 'Eta',
  [ControlTowerQuantitySupplyDifferenceListColumns.surveyorDate]:
    'SurveyorDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.emailToVessel]:
    'VesselEmail',
  [ControlTowerQuantitySupplyDifferenceListColumns.vesselToWatch]:
    'VesselToWatch',
  [ControlTowerQuantitySupplyDifferenceListColumns.productType]:
    'QuantityReportDetails_ProductType_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.progress]:
    'SupplyProgress_DisplayName',
  [ControlTowerQuantitySupplyDifferenceListColumns.bdnQuantity]:
    'QuantityReportDetails_BdnQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.measuredDeliveredQty]:
    'QuantityReportDetails_MeasuredDeliveredQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.sumOfOrderQtyCol]:
    'QuantityReportDetails_SumOfOrderQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.differenceInQty]:
    'QuantityReportDetails_DifferenceInSupplyQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.qtyUom]:
    'QuantityReportDetails_SupplyUom_Name'
};
