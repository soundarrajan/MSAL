export enum ControlTowerResidueSludgeDifferenceListColumns {
  actions = 'actions',
  portCall = 'portcall.portCallId',
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

export enum ControlTowerResidueSludgeDifferenceListExportColumns {
  portCall = 'portcall.portCallId',
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

export enum ControlTowerResidueSludgeDifferenceListColumnsLabels {
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
export const ControlTowerResidueSludgeDifferenceListColumnServerKeys: Record<
  ControlTowerResidueSludgeDifferenceListColumns,
  string
> = {
  [ControlTowerResidueSludgeDifferenceListColumns.actions]: undefined,
  [ControlTowerResidueSludgeDifferenceListColumns.portCall]:
    'PortCall_PortCallId',
  [ControlTowerResidueSludgeDifferenceListColumns.port]: 'Port',
  [ControlTowerResidueSludgeDifferenceListColumns.vessel]: 'Vessel',
  [ControlTowerResidueSludgeDifferenceListColumns.eta]: 'Eta',
  [ControlTowerResidueSludgeDifferenceListColumns.surveyorDate]: 'SurveyorDate',
  [ControlTowerResidueSludgeDifferenceListColumns.emailToVessel]: 'VesselEmail',
  [ControlTowerResidueSludgeDifferenceListColumns.vesselToWatch]:
    'VesselToWatch',
  [ControlTowerResidueSludgeDifferenceListColumns.progress]:
    'SludgeProgress_DisplayName',
  [ControlTowerResidueSludgeDifferenceListColumns.sludgePercentage]:
    'SludgePercentage',
  [ControlTowerResidueSludgeDifferenceListColumns.logBookRobQtyBeforeDelivery]:
    'QuantityReportDetails_LogBookRobQtyBeforeDelivery',
  [ControlTowerResidueSludgeDifferenceListColumns.measuredRobQtyBeforeDelivery]:
    'QuantityReportDetails_MeasuredRobQtyBeforeDelivery',
  [ControlTowerResidueSludgeDifferenceListColumns.differenceInRobQuantity]:
    'QuantityReportDetails_DifferenceInRobQuantity',
  [ControlTowerResidueSludgeDifferenceListColumns.robUom]:
    'QuantityReportDetails_RobUom_Name'
};
