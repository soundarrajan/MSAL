export enum InvoiceCompleteListColumns {
  selection = 'selection',
  portCallId = 'portCallId',
  portName = 'portName'
}

export enum CompleteListColumnsLabels {
  portCallId = 'Call ID',
  portName = 'Port call'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const CompleteListColumnServerKeys: Record<InvoiceCompleteListColumns, string> = {
  [InvoiceCompleteListColumns.selection]: undefined,
  [InvoiceCompleteListColumns.portCallId]: 'portCallId',
  [InvoiceCompleteListColumns.portName]: 'portName'
};
