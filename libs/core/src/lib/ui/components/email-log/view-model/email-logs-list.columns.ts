export enum EmailLogsListColumns {
  from = 'from',
  status = 'status',
  to = 'to',
  subject = 'subject',
  sentAt = 'sentAt',
}

export enum EmailLogsListColumnsLabels {
  from = 'Sender',
  status = 'Status',
  to = 'Mail sent to',
  subject = 'Subject',
  sentAt = 'Mail date',
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const EmailLogsListColumnServerKeys: Record<EmailLogsListColumns, string> = {
  [EmailLogsListColumns.from]: 'from',
  [EmailLogsListColumns.status]: 'Status_DisplayName',
  [EmailLogsListColumns.to]: 'to',
  [EmailLogsListColumns.subject]: 'subject',
  [EmailLogsListColumns.sentAt]: 'sentAt'
};
