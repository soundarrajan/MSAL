export enum ControlTowerQuantityRobDifferenceListColumns {
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

export enum ControlTowerQuantityRobDifferenceListColumnsLabels {
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
export const ControlTowerQuantityRobDifferenceListColumnServerKeys: Record<
  ControlTowerQuantityRobDifferenceListColumns,
  string
> = {
  [ControlTowerQuantityRobDifferenceListColumns.selection]: undefined,
  [ControlTowerQuantityRobDifferenceListColumns.actions]: undefined,
  [ControlTowerQuantityRobDifferenceListColumns.portCallId]: 'portCallId',
  [ControlTowerQuantityRobDifferenceListColumns.portName]: 'portName',
  [ControlTowerQuantityRobDifferenceListColumns.vesselName]: 'vesselName',
  [ControlTowerQuantityRobDifferenceListColumns.surveyDate]: 'surveyDate',
  [ControlTowerQuantityRobDifferenceListColumns.surveyStatus]:
    'SurveyStatus_DisplayName',
  [ControlTowerQuantityRobDifferenceListColumns.qtyMatchedStatus]:
    'QtyMatchedStatus_DisplayName',
  [ControlTowerQuantityRobDifferenceListColumns.logBookRobBeforeDelivery]:
    'logBookRobBeforeDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.measuredRobBeforeDelivery]:
    'measuredRobBeforeDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.diffRobBeforeDelivery]:
    'diffRobBeforeDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.qtyBeforeDeliveryUom]:
    'QtyBeforeDeliveryUom_Name',
  [ControlTowerQuantityRobDifferenceListColumns.bdnQuantity]: 'bdnQuantity',
  [ControlTowerQuantityRobDifferenceListColumns.measuredDeliveredQty]:
    'measuredDeliveredQty',
  [ControlTowerQuantityRobDifferenceListColumns.diffDeliveredQty]:
    'diffDeliveredQty',
  [ControlTowerQuantityRobDifferenceListColumns.qtyDeliveredUom]:
    'QtyDeliveredUom_Name',
  [ControlTowerQuantityRobDifferenceListColumns.logBookRobAfterDelivery]:
    'logBookRobAfterDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.measuredRobAfterDelivery]:
    'measuredRobAfterDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.diffRobAfterDelivery]:
    'diffRobAfterDelivery',
  [ControlTowerQuantityRobDifferenceListColumns.qtyAfterDeliveryUom]:
    'QtyAfterDeliveryUom_Name',
  [ControlTowerQuantityRobDifferenceListColumns.logBookSludgeRobBeforeDischarge]:
    'logBookSludgeRobBeforeDischarge',
  [ControlTowerQuantityRobDifferenceListColumns.measuredSludgeRobBeforeDischarge]:
    'measuredSludgeRobBeforeDischarge',
  [ControlTowerQuantityRobDifferenceListColumns.diffSludgeRobBeforeDischarge]:
    'diffSludgeRobBeforeDischarge',
  [ControlTowerQuantityRobDifferenceListColumns.sludgeDischargedQty]:
    'sludgeDischargedQty',
  [ControlTowerQuantityRobDifferenceListColumns.qtySludgeDischargedUom]:
    'QtySludgeDischargedUom_Name',
  [ControlTowerQuantityRobDifferenceListColumns.comment]: 'comment',
  [ControlTowerQuantityRobDifferenceListColumns.isVerifiedSludgeQty]:
    'isVerifiedSludgeQty'
};
