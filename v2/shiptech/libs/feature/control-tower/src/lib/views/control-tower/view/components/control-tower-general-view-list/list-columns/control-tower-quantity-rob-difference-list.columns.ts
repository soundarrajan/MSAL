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
  logBookRobQtyBeforeDelivery = 'logBookRobQtyBeforeDelivery',
  measuredRobQtyBeforeDelivery = 'measuredRobQtyBeforeDelivery',
  differenceInRobQuantity = 'differenceInRobQuantity',
  robUom = 'robUom'
}

export enum ControlTowerQuantityRobDifferenceListExportColumns {
  portCall = 'portcall.portCallId',
  port = 'port',
  vessel = 'vessel.name',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  productType = 'quantityReportDetails.productType.name',
  logBookRobQtyBeforeDelivery = 'quantityReportDetails.logBookRobQtyBeforeDelivery',
  measuredRobQtyBeforeDelivery = 'quantityReportDetails.measuredRobQtyBeforeDelivery',
  differenceInRobQuantity = 'quantityReportDetails.differenceInRobQuantity',
  robUom = 'quantityReportDetails.robUom.name',
  progress = 'progress.name'
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
  logBookRobQtyBeforeDelivery = 'Log Book ROB',
  measuredRobQtyBeforeDelivery = 'Measured ROB',
  differenceInRobQuantity = 'Difference in Qty',
  robUom = 'Qty UOM',
  progress = 'Progress'
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
  [ControlTowerQuantityRobDifferenceListColumns.surveyorDate]: 'surveyorDate',
  [ControlTowerQuantityRobDifferenceListColumns.emailToVessel]: 'emailToVessel',
  [ControlTowerQuantityRobDifferenceListColumns.vesselToWatch]: 'vesselToWatch',
  [ControlTowerQuantityRobDifferenceListColumns.productType]:
    'quantityReportDetails_ProductType_Name',
  [ControlTowerQuantityRobDifferenceListColumns.logBookRobQtyBeforeDelivery]:
    'quantityReportDetails_LogBookRobQtyBeforeDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.measuredRobQtyBeforeDelivery]:
    'quantityReportDetails_MeasuredRobQtyBeforeDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.differenceInRobQuantity]:
    'quantityReportDetails_DifferenceInQty',
  [ControlTowerQuantityRobDifferenceListColumns.robUom]:
    'quantityReportDetails_BeforeDeliveryUom_Name',
  [ControlTowerQuantityRobDifferenceListColumns.progress]: 'progress_name'
};
