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
  vessel = 'vessel',
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
  [ControlTowerQuantityRobDifferenceListColumns.portCall]:
    'PortCall_PortCallId',
  [ControlTowerQuantityRobDifferenceListColumns.port]: 'Port',
  [ControlTowerQuantityRobDifferenceListColumns.vessel]: 'Vessel',
  [ControlTowerQuantityRobDifferenceListColumns.eta]: 'Eta',
  [ControlTowerQuantityRobDifferenceListColumns.surveyorDate]: 'SurveyorDate',
  [ControlTowerQuantityRobDifferenceListColumns.emailToVessel]: 'VesselEmail',
  [ControlTowerQuantityRobDifferenceListColumns.vesselToWatch]: 'VesselToWatch',
  [ControlTowerQuantityRobDifferenceListColumns.progress]: 'RobProgress_Name',
  [ControlTowerQuantityRobDifferenceListColumns.productType]:
    'quantityReportDetails_ProductType_Name',
  [ControlTowerQuantityRobDifferenceListColumns.logBookRobQtyBeforeDelivery]:
    'QuantityReportDetails_LogBookRobQtyBeforeDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.measuredRobQtyBeforeDelivery]:
    'QuantityReportDetails_MeasuredRobQtyBeforeDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.differenceInRobQuantity]:
    'QuantityReportDetails_DifferenceInRobQuantity',
  [ControlTowerQuantityRobDifferenceListColumns.robUom]:
    'QuantityReportDetails_RobUom_Name'
};
