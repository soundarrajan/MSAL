export enum AuditLogListColumns {
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

export enum AuditLogColumnsLabels {
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
export const AuditLogColumnServerKeys: Record<AuditLogListColumns, string> = {
  [AuditLogListColumns.date]: 'date',
  [AuditLogListColumns.modulePathUrl]: 'modulePathUrl',
  [AuditLogListColumns.businessName]: 'businessName',
  [AuditLogListColumns.transactionType]: 'transactionType',
  [AuditLogListColumns.fieldName]: 'fieldName',
  [AuditLogListColumns.oldValue]: 'oldValue',
  [AuditLogListColumns.newValue]: 'newValue',
  [AuditLogListColumns.modifiedBy]: 'ModifiedBy_Name',
  [AuditLogListColumns.clientIpAddress]: 'clientIpAddress',
  [AuditLogListColumns.userAction]: 'userAction'
};
