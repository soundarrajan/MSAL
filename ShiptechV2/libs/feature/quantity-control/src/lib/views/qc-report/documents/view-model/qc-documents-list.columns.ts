export enum QcDocumentsListColumns {
  name = 'name',
  size = 'size',
  documentType = 'documentType',
  fileType = 'fileType',
  transactionType = 'transactionType',
  referenceNo = 'referenceNo',
  uploadedBy = 'uploadedBy',
  uploadedOn = 'uploadedOn',
  notes = 'notes',
  isVerified = 'isVerified',
  verifiedOn = 'verifiedOn',
  verifiedBy = 'verifiedBy'
}

export enum QcDocumentsListColumnsLabels {
  name = 'Document Name',
  size = 'Size',
  documentType = 'Document Type',
  fileType = 'File Type',
  transactionType = 'Entity',
  referenceNo = 'Reference No',
  uploadedBy = 'Uploaded By',
  uploadedOn = 'Uploaded On',
  notes = 'Add/View Notes',
  isVerified = 'Verified',
  verifiedOn = 'Verified On',
  verifiedBy = 'Verified By'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const QcDocumentsListColumnServerKeys: Record<QcDocumentsListColumns, string> = {
  [QcDocumentsListColumns.name]: 'name',
  [QcDocumentsListColumns.size]: 'size',
  [QcDocumentsListColumns.documentType]: 'documentType_DisplayName',
  [QcDocumentsListColumns.fileType]: 'fileType',
  [QcDocumentsListColumns.transactionType]: 'TransactionType_DisplayName',
  [QcDocumentsListColumns.referenceNo]: 'referenceNo',
  [QcDocumentsListColumns.uploadedBy]: 'uploadedBy',
  [QcDocumentsListColumns.uploadedOn]: 'uploadedOn',
  [QcDocumentsListColumns.notes]: 'notes',
  [QcDocumentsListColumns.isVerified]: 'isVerified',
  [QcDocumentsListColumns.verifiedOn]: 'verifiedOn',
  [QcDocumentsListColumns.verifiedBy]: 'verifiedBy'
};
