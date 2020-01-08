export enum QcReportDetailsAuditLogColumns {
  date = 'date',
  modulePathUrl = 'modulePathUrl',
  businessName = 'businessName',
  transactionType = 'transactionType',
  fieldName = 'fieldName',
  oldValue = 'oldValue',
  newValue = 'newValue',
  modifiedBy = 'modifiedBy',
  clientIpAddress = 'clientIpAddress',
  userAction = 'userAction'
}

export enum QcReportDetailsAuditLogColumnsLabels {
  date = 'Date (UTC)',
  modulePathUrl = 'Module',
  businessName = 'Transaction',
  transactionType = 'Transaction Type',
  fieldName = 'Field Name',
  oldValue = 'Old Value',
  newValue = 'New Value',
  modifiedBy = 'User',
  clientIpAddress = 'User IP Address',
  userAction = 'User action'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const QcReportDetailsAuditLogColumnServerKeys: Record<QcReportDetailsAuditLogColumns, string> = {
  [QcReportDetailsAuditLogColumns.date]: 'date',
  [QcReportDetailsAuditLogColumns.modulePathUrl]: 'modulePathUrl',
  [QcReportDetailsAuditLogColumns.businessName]: 'businessName',
  [QcReportDetailsAuditLogColumns.transactionType]: 'transactionType',
  [QcReportDetailsAuditLogColumns.fieldName]: 'fieldName',
  [QcReportDetailsAuditLogColumns.oldValue]: 'oldValue',
  [QcReportDetailsAuditLogColumns.newValue]: 'newValue',
  [QcReportDetailsAuditLogColumns.modifiedBy]: 'modifiedBy',
  [QcReportDetailsAuditLogColumns.clientIpAddress]: 'clientIpAddress',
  [QcReportDetailsAuditLogColumns.userAction]: 'userAction'
};
