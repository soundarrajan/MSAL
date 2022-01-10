export enum QcReportsListColumns {
  selection = 'selection',
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
  logBookBilgeRobBeforeDischarge = 'logBookBilgeRobBeforeDischarge',
  measuredBilgeRobBeforeDischarge = 'measuredBilgeRobBeforeDischarge',
  diffBilgeRobBeforeDischarge = 'diffBilgeRobBeforeDischarge',
  bilgeDischargedQty = 'bilgeDischargedQty',
  qtyBilgeDischargedUom = 'qtyBilgeDischargedUom',
  logBookEGCSRobBeforeDischarge = 'logBookEGCSRobBeforeDischarge',
  measuredEGCSRobBeforeDischarge = 'measuredEGCSRobBeforeDischarge',
  diffEGCSRobBeforeDischarge = 'diffEGCSRobBeforeDischarge',
  egcsDischargedQty = 'egcsDischargedQty',
  qtyEGCSDischargedUom = 'qtyEGCSDischargedUom',
  comment = 'comment',
  isVerifiedSludgeQty = 'isVerifiedSludgeQty'
}

export enum QcReportsListColumnsLabels {
  portCallId = 'Call ID',
  portName = 'Port call',
  vesselName = 'Vessel',
  surveyDate = 'Survey Date',
  surveyStatus = 'Survey Status',
  qtyMatchedStatus = 'Qty Matched',

  logBookRobBeforeDelivery = 'Log Book ROB (before delivery) Qty',
  measuredRobBeforeDelivery = 'Measured ROB surveyor (before delivery) Qty',
  diffRobBeforeDelivery = 'ROB before Delivery diff',
  qtyBeforeDeliveryUom = 'ROB before Delivery Qty UOM',

  bdnQuantity = 'BDN Quantity (SUM)',
  measuredDeliveredQty = 'Measured Delivered Qty',
  diffDeliveredQty = 'Delivered Qty (diff)',
  qtyDeliveredUom = 'Delivered Qty Qty UOM',

  logBookRobAfterDelivery = 'Log Book ROB (after delivery) Qty',
  measuredRobAfterDelivery = 'Measured ROB surveyor (after delivery) Qty',
  diffRobAfterDelivery = 'ROB after Delivery diff',
  qtyAfterDeliveryUom = 'ROB after Delivery Qty UOM',

  logBookSludgeRobBeforeDischarge = 'Log Book Sludge ROB (before discharge) Qty',
  measuredSludgeRobBeforeDischarge = 'Measured Sludge ROB Surveyor (before discharge) Qty',
  diffSludgeRobBeforeDischarge = 'Sludge ROB before discharge diff',
  sludgeDischargedQty = 'Sludge Discharged Qty',
  qtySludgeDischargedUom = 'Sludge Discharged Qty UOM',

  logBookBilgeRobBeforeDischarge = 'Log Book Bilge ROB (Before discharge) Qty',
  measuredBilgeRobBeforeDischarge = 'Measured Bilge ROB (Before discharge) Qty',
  diffBilgeRobBeforeDischarge = 'Bilge ROB before discharge diff',
  bilgeDischargedQty = 'Bilge Discharged Qty',
  qtyBilgeDischargedUom = 'Bilge Discharged Qty UOM',

  logBookEGCSRobBeforeDischarge = 'Log Book EGCS Residue ROB (Before discharge) Qty',
  measuredEGCSRobBeforeDischarge = 'Measured EGCS Residue ROB (Before discharge) Qty',
  diffEGCSRobBeforeDischarge = 'EGCS ROB before discharge diff',
  egcsDischargedQty = 'EGCS Discharged Qty',
  qtyEGCSDischargedUom = 'EGCS Discharged Qty UOM',

  comment = 'Comment',
  isVerifiedSludgeQty = 'Verify Sludge Qty'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const QcReportsListColumnServerKeys: Record<
  QcReportsListColumns,
  string
> = {
  [QcReportsListColumns.selection]: undefined,
  [QcReportsListColumns.portCallId]: 'portCallId',
  [QcReportsListColumns.portName]: 'portName',
  [QcReportsListColumns.vesselName]: 'vesselName',
  [QcReportsListColumns.surveyDate]: 'surveyDate',
  [QcReportsListColumns.surveyStatus]: 'SurveyStatus_DisplayName',
  [QcReportsListColumns.qtyMatchedStatus]: 'QtyMatchedStatus_DisplayName',
  [QcReportsListColumns.logBookRobBeforeDelivery]: 'logBookRobBeforeDelivery',
  [QcReportsListColumns.measuredRobBeforeDelivery]: 'measuredRobBeforeDelivery',
  [QcReportsListColumns.diffRobBeforeDelivery]: 'diffRobBeforeDelivery',
  [QcReportsListColumns.qtyBeforeDeliveryUom]: 'QtyBeforeDeliveryUom_Name',
  [QcReportsListColumns.bdnQuantity]: 'bdnQuantity',
  [QcReportsListColumns.measuredDeliveredQty]: 'measuredDeliveredQty',
  [QcReportsListColumns.diffDeliveredQty]: 'diffDeliveredQty',
  [QcReportsListColumns.qtyDeliveredUom]: 'QtyDeliveredUom_Name',
  [QcReportsListColumns.logBookRobAfterDelivery]: 'logBookRobAfterDelivery',
  [QcReportsListColumns.measuredRobAfterDelivery]: 'measuredRobAfterDelivery',
  [QcReportsListColumns.diffRobAfterDelivery]: 'diffRobAfterDelivery',
  [QcReportsListColumns.qtyAfterDeliveryUom]: 'QtyAfterDeliveryUom_Name',
  [QcReportsListColumns.logBookSludgeRobBeforeDischarge]:
    'logBookSludgeRobBeforeDischarge',
  [QcReportsListColumns.measuredSludgeRobBeforeDischarge]:
    'measuredSludgeRobBeforeDischarge',
  [QcReportsListColumns.diffSludgeRobBeforeDischarge]:
    'diffSludgeRobBeforeDischarge',
  [QcReportsListColumns.sludgeDischargedQty]: 'sludgeDischargedQty',
  [QcReportsListColumns.qtySludgeDischargedUom]: 'QtySludgeDischargedUom_Name',
  [QcReportsListColumns.logBookBilgeRobBeforeDischarge]:
    'logBookBilgeRobBeforeDischarge',
  [QcReportsListColumns.measuredBilgeRobBeforeDischarge]:
    'measuredBilgeRobBeforeDischarge',
  [QcReportsListColumns.diffBilgeRobBeforeDischarge]:
    'diffBilgeRobBeforeDischarge',
  [QcReportsListColumns.bilgeDischargedQty]: 'bilgeDischargedQty',
  [QcReportsListColumns.qtyBilgeDischargedUom]: 'QtyBilgeDischargedUom_Name',
  [QcReportsListColumns.logBookEGCSRobBeforeDischarge]:
    'logBookEGCSRobBeforeDischarge',
  [QcReportsListColumns.measuredEGCSRobBeforeDischarge]:
    'measuredEGCSRobBeforeDischarge',
  [QcReportsListColumns.diffEGCSRobBeforeDischarge]:
    'diffEGCSRobBeforeDischarge',
  [QcReportsListColumns.egcsDischargedQty]: 'egcsDischargedQty',
  [QcReportsListColumns.qtyEGCSDischargedUom]: 'QtyEGCSDischargedUom_Name',
  [QcReportsListColumns.comment]: 'comment',
  [QcReportsListColumns.isVerifiedSludgeQty]: 'isVerifiedSludgeQty'
};

export enum QcReportsListExportColumns {
  portCallId = 'portCallId',
  portName = 'portName',
  vesselName = 'vesselName',
  surveyDate = 'surveyDate',
  surveyStatus = 'surveyStatus.name',
  qtyMatchedStatus = 'qtyMatchedStatus.name',

  logBookRobBeforeDelivery = 'logBookRobBeforeDelivery',
  measuredRobBeforeDelivery = 'measuredRobBeforeDelivery',
  diffRobBeforeDelivery = 'diffRobBeforeDelivery',
  qtyBeforeDeliveryUom = 'qtyBeforeDeliveryUom.name',

  bdnQuantity = 'bdnQuantity',
  measuredDeliveredQty = 'measuredDeliveredQty',
  diffDeliveredQty = 'diffDeliveredQty',
  qtyDeliveredUom = 'qtyDeliveredUom.name',

  logBookRobAfterDelivery = 'logBookRobAfterDelivery',
  measuredRobAfterDelivery = 'measuredRobAfterDelivery',
  diffRobAfterDelivery = 'diffRobAfterDelivery',
  qtyAfterDeliveryUom = 'qtyAfterDeliveryUom.name',

  logBookSludgeRobBeforeDischarge = 'logBookSludgeRobBeforeDischarge',
  measuredSludgeRobBeforeDischarge = 'measuredSludgeRobBeforeDischarge',
  diffSludgeRobBeforeDischarge = 'diffSludgeRobBeforeDischarge',
  sludgeDischargedQty = 'sludgeDischargedQty',
  qtySludgeDischargedUom = 'qtySludgeDischargedUom.name',

  logBookBilgeRobBeforeDischarge = 'logBookBilgeRobBeforeDischarge',
  measuredBilgeRobBeforeDischarge = 'measuredBilgeRobBeforeDischarge',
  diffBilgeRobBeforeDischarge = 'diffBilgeRobBeforeDischarge',
  bilgeDischargedQty = 'bilgeDischargedQty',
  qtyBilgeDischargedUom = 'qtyBilgeDischargedUom.name',

  logBookEGCSRobBeforeDischarge = 'logBookEGCSRobBeforeDischarge',
  measuredEGCSRobBeforeDischarge = 'measuredEGCSRobBeforeDischarge',
  diffEGCSRobBeforeDischarge = 'diffEGCSRobBeforeDischarge',
  egcsDischargedQty = 'egcsDischargedQty',
  qtyEGCSDischargedUom = 'qtyEGCSDischargedUom.name',

  comment = 'comment',
  isVerifiedSludgeQty = 'isVerifiedSludgeQty'
}
