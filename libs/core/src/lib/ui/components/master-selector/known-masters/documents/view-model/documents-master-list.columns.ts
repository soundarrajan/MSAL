export enum DocumentsMasterListColumns {
  selection = 'selection',
  id = 'id',
  documentTypeName = 'name',
  documentTypeDisplayName = 'displayName',
  createdBy = 'createdBy',
  createdOn = 'createdOn',
  lastModifiedBy = 'lastModifiedBy',
  lastModifiedOn = 'lastModifiedOn',
  status = 'isDeleted'
}

export enum DocumentsMasterListColumnsLabels {
  id = 'ID',
  documentTypeName = 'Document Type Name',
  documentTypeDisplayName = 'Document Type Display Name',
  createdBy = 'Created By',
  createdOn = 'Created On',
  lastModifiedBy = 'Last Modified By',
  lastModifiedOn = 'Last Modified On',
  status = 'Status'
}

export const DocumentsMasterListColumnServerKeys: Record<DocumentsMasterListColumns, string> = {
  [DocumentsMasterListColumns.selection]: undefined,
  [DocumentsMasterListColumns.id]: 'id',
  [DocumentsMasterListColumns.documentTypeName]: 'name',
  [DocumentsMasterListColumns.documentTypeDisplayName]: 'displayName',
  [DocumentsMasterListColumns.createdBy]: 'createdBy',
  [DocumentsMasterListColumns.createdOn]: 'createdOn',
  [DocumentsMasterListColumns.lastModifiedBy]: 'lastModifiedBy',
  [DocumentsMasterListColumns.lastModifiedOn]: 'lastModifiedOn',
  [DocumentsMasterListColumns.status]: 'isDeleted',
};
