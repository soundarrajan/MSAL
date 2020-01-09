export enum QcEmailLogsColumns {
  from = 'from',
  status = 'status',
  to = 'to',
  subject = 'subject',
  sentAt = 'sentAt',
}

export enum QcEmailLogsColumnsLabels {
  from = 'Sender',
  status = 'Status',
  to = 'Mail sent to',
  subject = 'Subject',
  sentAt = 'Mail date',
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const QcEmailLogsColumnServerKeys: Record<QcEmailLogsColumns, string> = {
  [QcEmailLogsColumns.from]: 'from',
  [QcEmailLogsColumns.status]: 'Status_Name',
  [QcEmailLogsColumns.to]: 'to',
  [QcEmailLogsColumns.subject]: 'subject',
  [QcEmailLogsColumns.sentAt]: 'sentAt'
};
