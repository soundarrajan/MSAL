export enum ControlTowerResidueEGCSDifferenceListColumns {
  actions = 'actions',
  portCall = 'portCall',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  sludgePercentage = 'sludgePercentage',
  progress = 'progress',
  logBookRobQtyBeforeDelivery = 'logBookRobQtyBeforeDelivery',
  measuredRobQtyBeforeDelivery = 'measuredRobQtyBeforeDelivery',
  differenceInRobQuantity = 'differenceInRobQuantity',
  robUom = 'robUom'
}

export enum ControlTowerResidueEGCSDifferenceListExportColumns {
  portCall = 'portCall.portCallId',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  sludgePercentage = 'sludgePercentage',
  logBookRobQtyBeforeDelivery = 'quantityReportDetails.logBookRobQtyBeforeDelivery',
  measuredRobQtyBeforeDelivery = 'quantityReportDetails.measuredRobQtyBeforeDelivery',
  differenceInRobQuantity = 'quantityReportDetails.differenceInRobQuantity',
  robUom = 'quantityReportDetails.robUom.name',
  progress = 'progress.name'
}

export enum ControlTowerResidueEGCSDifferenceListColumnsLabels {
  actions = 'Actions',
  portCall = 'Port Call',
  port = 'Port',
  vessel = 'Vessel',
  eta = 'ETA',
  surveyorDate = 'Surveyor Date',
  emailToVessel = 'Email To Vessel',
  vesselToWatch = 'Vessel To Watch',
  sludgePercentage = 'Sludge %',
  logBookRobQtyBeforeDelivery = 'Log Book ROB',
  measuredRobQtyBeforeDelivery = 'Measured ROB',
  differenceInRobQuantity = 'Difference in Qty',
  robUom = 'Qty UOM',
  progress = 'Progress'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const ControlTowerResidueEGCSDifferenceListColumnServerKeys: Record<
  ControlTowerResidueEGCSDifferenceListColumns,
  string
> = {
  [ControlTowerResidueEGCSDifferenceListColumns.actions]: undefined,
  [ControlTowerResidueEGCSDifferenceListColumns.portCall]:
    'PortCall_PortCallId',
  [ControlTowerResidueEGCSDifferenceListColumns.port]: 'Port',
  [ControlTowerResidueEGCSDifferenceListColumns.vessel]: 'Vessel',
  [ControlTowerResidueEGCSDifferenceListColumns.eta]: 'Eta',
  [ControlTowerResidueEGCSDifferenceListColumns.surveyorDate]: 'SurveyorDate',
  [ControlTowerResidueEGCSDifferenceListColumns.emailToVessel]: 'VesselEmail',
  [ControlTowerResidueEGCSDifferenceListColumns.vesselToWatch]: 'VesselToWatch',
  [ControlTowerResidueEGCSDifferenceListColumns.progress]:
    'EgcsProgress_DisplayName',
  [ControlTowerResidueEGCSDifferenceListColumns.sludgePercentage]:
    'SludgePercentage',
  [ControlTowerResidueEGCSDifferenceListColumns.logBookRobQtyBeforeDelivery]:
    'QuantityReportDetails_LogBookRobQtyBeforeDelivery',
  [ControlTowerResidueEGCSDifferenceListColumns.measuredRobQtyBeforeDelivery]:
    'QuantityReportDetails_MeasuredRobQtyBeforeDelivery',
  [ControlTowerResidueEGCSDifferenceListColumns.differenceInRobQuantity]:
    'QuantityReportDetails_DifferenceInRobQuantity',
  [ControlTowerResidueEGCSDifferenceListColumns.robUom]:
    'QuantityReportDetails_RobUom_Name'
};
