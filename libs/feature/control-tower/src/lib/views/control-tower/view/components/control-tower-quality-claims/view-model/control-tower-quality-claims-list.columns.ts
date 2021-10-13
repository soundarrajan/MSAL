export enum ControlTowerListColumns {
  selection = 'selection',
  actions = 'actions',
  portCallId = 'portCallId',
  portName = 'portName',
  vesselName = 'vesselName',
  surveyDate = 'surveyDate',
  surveyStatus = 'surveyStatus',
  qtyMatchedStatus = 'qtyMatchedStatus',
  logBookRobBeforeDelivery = 'logBookRobBeforeDelivery',
  measuredRobBeforeDelivery = 'measuredRobBeforeDelivery',
  diffRobBeforeDelivery = 'diffRobBeforeDelivery',
  qtyBeforeDeliveryUom = 'qtyBeforeDeliveryUom',
  bdnQuantity = 'bdnQuantity',
  measuredDeliveredQty = 'measuredDeliveredQty',
  diffDeliveredQty = 'diffDeliveredQty',
  qtyDeliveredUom = 'qtyDeliveredUom',
  logBookRobAfterDelivery = 'logBookRobAfterDelivery',
  measuredRobAfterDelivery = 'measuredRobAfterDelivery',
  diffRobAfterDelivery = 'diffRobAfterDelivery',
  qtyAfterDeliveryUom = 'qtyAfterDeliveryUom',
  logBookSludgeRobBeforeDischarge = 'logBookSludgeRobBeforeDischarge',
  measuredSludgeRobBeforeDischarge = 'measuredSludgeRobBeforeDischarge',
  diffSludgeRobBeforeDischarge = 'diffSludgeRobBeforeDischarge',
  sludgeDischargedQty = 'sludgeDischargedQty',
  qtySludgeDischargedUom = 'qtySludgeDischargedUom',
  comment = 'comment',
  isVerifiedSludgeQty = 'isVerifiedSludgeQty'
}

export enum ControlTowerListColumnsLabels {
  actions = 'Actions',
  portCallId = 'Call ID',
  portName = 'Port call',
  vesselName = 'Vessel',
  surveyDate = 'Survey Date',
  surveyStatus = 'Survey Status',
  qtyMatchedStatus = 'Qty Matched',
  logBookRobBeforeDelivery = 'Log Book ROB (before delivery) Qty',
  measuredRobBeforeDelivery = 'Measured ROB surveyor (before delivery) Qty',
  diffRobBeforeDelivery = 'ROB before the delivery diff',
  qtyBeforeDeliveryUom = 'Qty UOM',
  bdnQuantity = 'BDN Quantity (SUM)',
  measuredDeliveredQty = 'Measured Delivered Qty',
  diffDeliveredQty = 'Delivered Qty (diff)',
  qtyDeliveredUom = 'Qty UOM',
  logBookRobAfterDelivery = 'Log Book ROB (after delivery) Qty',
  measuredRobAfterDelivery = 'Measured ROB surveyor (after delivery) Qty',
  diffRobAfterDelivery = 'ROB after the delivery diff',
  qtyAfterDeliveryUom = 'Qty UOM',
  logBookSludgeRobBeforeDischarge = 'Log Book Sludge ROB (before discharge) Qty',
  measuredSludgeRobBeforeDischarge = 'Measured Sludge ROB Surveyor (before discharge) Qty',
  diffSludgeRobBeforeDischarge = 'ROB before discharge diff',
  sludgeDischargedQty = 'Discharged Qty',
  qtySludgeDischargedUom = 'Qty UOM',
  comment = 'Comment',
  isVerifiedSludgeQty = 'Verify Sludge Qty'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const ControlTowerListColumnServerKeys: Record<
  ControlTowerListColumns,
  string
> = {
  [ControlTowerListColumns.selection]: undefined,
  [ControlTowerListColumns.actions]: undefined,
  [ControlTowerListColumns.portCallId]: 'portCallId',
  [ControlTowerListColumns.portName]: 'portName',
  [ControlTowerListColumns.vesselName]: 'vesselName',
  [ControlTowerListColumns.surveyDate]: 'surveyDate',
  [ControlTowerListColumns.surveyStatus]: 'SurveyStatus_DisplayName',
  [ControlTowerListColumns.qtyMatchedStatus]: 'QtyMatchedStatus_DisplayName',
  [ControlTowerListColumns.logBookRobBeforeDelivery]:
    'logBookRobBeforeDelivery',
  [ControlTowerListColumns.measuredRobBeforeDelivery]:
    'measuredRobBeforeDelivery',
  [ControlTowerListColumns.diffRobBeforeDelivery]: 'diffRobBeforeDelivery',
  [ControlTowerListColumns.qtyBeforeDeliveryUom]: 'QtyBeforeDeliveryUom_Name',
  [ControlTowerListColumns.bdnQuantity]: 'bdnQuantity',
  [ControlTowerListColumns.measuredDeliveredQty]: 'measuredDeliveredQty',
  [ControlTowerListColumns.diffDeliveredQty]: 'diffDeliveredQty',
  [ControlTowerListColumns.qtyDeliveredUom]: 'QtyDeliveredUom_Name',
  [ControlTowerListColumns.logBookRobAfterDelivery]: 'logBookRobAfterDelivery',
  [ControlTowerListColumns.measuredRobAfterDelivery]:
    'measuredRobAfterDelivery',
  [ControlTowerListColumns.diffRobAfterDelivery]: 'diffRobAfterDelivery',
  [ControlTowerListColumns.qtyAfterDeliveryUom]: 'QtyAfterDeliveryUom_Name',
  [ControlTowerListColumns.logBookSludgeRobBeforeDischarge]:
    'logBookSludgeRobBeforeDischarge',
  [ControlTowerListColumns.measuredSludgeRobBeforeDischarge]:
    'measuredSludgeRobBeforeDischarge',
  [ControlTowerListColumns.diffSludgeRobBeforeDischarge]:
    'diffSludgeRobBeforeDischarge',
  [ControlTowerListColumns.sludgeDischargedQty]: 'sludgeDischargedQty',
  [ControlTowerListColumns.qtySludgeDischargedUom]:
    'QtySludgeDischargedUom_Name',
  [ControlTowerListColumns.comment]: 'comment',
  [ControlTowerListColumns.isVerifiedSludgeQty]: 'isVerifiedSludgeQty'
};
