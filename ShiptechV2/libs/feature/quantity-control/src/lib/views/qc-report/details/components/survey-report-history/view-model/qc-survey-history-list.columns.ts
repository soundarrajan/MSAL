export enum QcSurveyHistoryListColumns {
  portCallId = 'id',
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

export enum QcSurveyHistoryListColumnsLabels {
  portCallId = 'Call ID',
  portName = 'Port',
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
export const QcSurveyHistoryListColumnServerKeys: Record<
  QcSurveyHistoryListColumns,
  string
> = {
  [QcSurveyHistoryListColumns.portCallId]: 'id',
  [QcSurveyHistoryListColumns.portName]: 'portName',
  [QcSurveyHistoryListColumns.vesselName]: 'vesselName',
  [QcSurveyHistoryListColumns.surveyDate]: 'surveyDate',
  [QcSurveyHistoryListColumns.surveyStatus]: 'SurveyStatus_DisplayName',
  [QcSurveyHistoryListColumns.qtyMatchedStatus]: 'QtyMatchedStatus_DisplayName',
  [QcSurveyHistoryListColumns.logBookRobBeforeDelivery]:
    'logBookRobBeforeDelivery',
  [QcSurveyHistoryListColumns.measuredRobBeforeDelivery]:
    'measuredRobBeforeDelivery',
  [QcSurveyHistoryListColumns.diffRobBeforeDelivery]: 'diffRobBeforeDelivery',
  [QcSurveyHistoryListColumns.qtyBeforeDeliveryUom]:
    'QtyBeforeDeliveryUom_Name',
  [QcSurveyHistoryListColumns.bdnQuantity]: 'bdnQuantity',
  [QcSurveyHistoryListColumns.measuredDeliveredQty]: 'measuredDeliveredQty',
  [QcSurveyHistoryListColumns.diffDeliveredQty]: 'diffDeliveredQty',
  [QcSurveyHistoryListColumns.qtyDeliveredUom]: 'QtyDeliveredUom_DisplayName',
  [QcSurveyHistoryListColumns.logBookRobAfterDelivery]:
    'logBookRobAfterDelivery',
  [QcSurveyHistoryListColumns.measuredRobAfterDelivery]:
    'measuredRobAfterDelivery',
  [QcSurveyHistoryListColumns.diffRobAfterDelivery]: 'diffRobAfterDelivery',
  [QcSurveyHistoryListColumns.qtyAfterDeliveryUom]: 'QtyAfterDeliveryUom_Name',
  [QcSurveyHistoryListColumns.logBookSludgeRobBeforeDischarge]:
    'logBookSludgeRobBeforeDischarge',
  [QcSurveyHistoryListColumns.measuredSludgeRobBeforeDischarge]:
    'measuredSludgeRobBeforeDischarge',
  [QcSurveyHistoryListColumns.diffSludgeRobBeforeDischarge]:
    'diffSludgeRobBeforeDischarge',
  [QcSurveyHistoryListColumns.sludgeDischargedQty]: 'sludgeDischargedQty',
  [QcSurveyHistoryListColumns.qtySludgeDischargedUom]:
    'QtySludgeDischargedUom_Name',
  [QcSurveyHistoryListColumns.comment]: 'comment',
  [QcSurveyHistoryListColumns.isVerifiedSludgeQty]: 'isVerifiedSludgeQty'
};
