export enum DocumentsListColumns {
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

export enum DocumentsListColumnsLabels {
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
export const DocumentsListColumnServerKeys: Record<DocumentsListColumns, string> = {
  [DocumentsListColumns.name]: 'name',
  [DocumentsListColumns.size]: 'size',
  [DocumentsListColumns.documentType]: 'documentType_DisplayName',
  [DocumentsListColumns.fileType]: 'fileType',
  [DocumentsListColumns.transactionType]: 'TransactionType_DisplayName',
  [DocumentsListColumns.referenceNo]: 'referenceNo',
  [DocumentsListColumns.uploadedBy]: 'uploadedBy',
  [DocumentsListColumns.uploadedOn]: 'uploadedOn',
  [DocumentsListColumns.notes]: 'notes',
  [DocumentsListColumns.isVerified]: 'isVerified',
  [DocumentsListColumns.verifiedOn]: 'verifiedOn',
  [DocumentsListColumns.verifiedBy]: 'verifiedBy'
};
