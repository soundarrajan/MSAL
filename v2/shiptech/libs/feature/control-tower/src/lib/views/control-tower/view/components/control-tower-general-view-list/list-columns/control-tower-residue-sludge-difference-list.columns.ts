export enum ControlTowerResidueSludgeDifferenceListColumns {
  actions = 'actions',
  portCall = 'portCall',
  order='order',
  buyer='buyer',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  sludgePercentage = 'sludgePercentage',
  sumOfOrderQuantity='sumOfOrderQuantity',
  measuredDeliveredQuantity='measuredDeliveredQuantity',
  differenceInSludgeQuantity='differenceInSludgeQuantity',
  progress = 'progress',
  logBookRobQtyBeforeDelivery = 'logBookRobQtyBeforeDelivery',
  measuredRobQtyBeforeDelivery = 'measuredRobQtyBeforeDelivery',
  differenceInRobQuantity = 'differenceInRobQuantity',
  robUom = 'robUom'
}

export enum ControlTowerResidueSludgeDifferenceListExportColumns {
  portCall = 'portCall.portCallId',
  order='order.id',
  buyer='buyer.name',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  sludgePercentage = 'sludgePercentage',
  sumOfOrderQuantity='quantityReportDetails.sumOfOrderQuantity',
  measuredDeliveredQuantity='quantityReportDetails.measuredDeliveredQuantity',
  differenceInSludgeQuantity='quantityReportDetails.differenceInSludgeQuantity',
  logBookRobQtyBeforeDelivery = 'quantityReportDetails.logBookRobQtyBeforeDelivery',
  measuredRobQtyBeforeDelivery = 'quantityReportDetails.measuredRobQtyBeforeDelivery',
  differenceInRobQuantity = 'quantityReportDetails.differenceInRobQuantity',
  robUom = 'quantityReportDetails.robUom.name',
  progress = 'progress.name'
}

export enum ControlTowerResidueSludgeDifferenceListColumnsLabels {
  actions = 'Actions',
  portCall = 'Port Call',
  order='Po Number',
  buyer='Buyer',
  port = 'Port',
  vessel = 'Vessel',
  eta = 'ETA',
  surveyorDate = 'Surveyor Date',
  emailToVessel = 'Email To Vessel',
  vesselToWatch = 'Vessel To Watch',
  sludgePercentage = 'Sludge %',
  sumOfOrderQuantity='Ordered Qty',
  measuredDeliveredQuantity='Discharged Qty',
  differenceInSludgeQuantity='Difference',
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
  [ControlTowerResidueSludgeDifferenceListColumns.order]:
    'Order_Id',
    [ControlTowerResidueSludgeDifferenceListColumns.buyer]:
    'Buyer_Name',
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
  [ControlTowerResidueSludgeDifferenceListColumns.sumOfOrderQuantity]:
   'QuantityReportDetails_SumOfOrderQuantity',
  [ControlTowerResidueSludgeDifferenceListColumns.measuredDeliveredQuantity]:
    'QuantityReportDetails_MeasuredDeliveredQuantity',
  [ControlTowerResidueSludgeDifferenceListColumns.differenceInSludgeQuantity]:
    'QuantityReportDetails_DifferenceInSludgeQuantity',
  [ControlTowerResidueSludgeDifferenceListColumns.logBookRobQtyBeforeDelivery]:
    'QuantityReportDetails_LogBookRobQtyBeforeDelivery',
  [ControlTowerResidueSludgeDifferenceListColumns.measuredRobQtyBeforeDelivery]:
    'QuantityReportDetails_MeasuredRobQtyBeforeDelivery',
  [ControlTowerResidueSludgeDifferenceListColumns.differenceInRobQuantity]:
    'QuantityReportDetails_DifferenceInRobQuantity',
  [ControlTowerResidueSludgeDifferenceListColumns.robUom]:
    'QuantityReportDetails_RobUom_Name'
};
