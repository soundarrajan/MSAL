export enum QcEmailLogsListColumns {
  from = 'from',
  status = 'status',
  to = 'to',
  subject = 'subject',
  sentAt = 'sentAt',
}

export enum QcEmailLogsListColumnsLabels {
  from = 'Sender',
  status = 'Status',
  to = 'Mail sent to',
  subject = 'Subject',
  sentAt = 'Mail date',
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const QcEmailLogsListColumnServerKeys: Record<QcEmailLogsListColumns, string> = {
  [QcEmailLogsListColumns.from]: 'from',
  [QcEmailLogsListColumns.status]: 'Status_DisplayName',
  [QcEmailLogsListColumns.to]: 'to',
  [QcEmailLogsListColumns.subject]: 'subject',
  [QcEmailLogsListColumns.sentAt]: 'sentAt'
};
