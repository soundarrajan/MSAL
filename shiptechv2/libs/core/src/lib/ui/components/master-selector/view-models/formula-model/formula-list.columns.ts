export enum FormulaListColumns {
  selection = 'selection',
  id = 'id',
  name = 'name',
  createdBy = 'created_by',
  createdOn = 'createdOn',
  lastModifiedBy = 'last_modified_by',
  lastModifiedOn = 'lastModifiedOn',
  isDeleted = 'isDeleted'
}

export enum FormulaListColumnsLabels {
  id = 'Id',
  name = 'Formula Description',
  createdBy = 'Created By',
  createdOn = 'Created On',
  lastModifiedBy = 'Last Modified By',
  lastModifiedOn = 'Last Modified On',
  isDeleted = 'Active'

}

export const FormulaListColumnServerKeys: Record<
FormulaListColumns,
  string
> = {
  [FormulaListColumns.selection]: undefined,
  [FormulaListColumns.id]: 'id',
  [FormulaListColumns.name]: 'name',
  [FormulaListColumns.createdBy]: 'created_by',
  [FormulaListColumns.createdOn]: 'createdOn',
  [FormulaListColumns.lastModifiedBy]: 'last_modified_by',
  [FormulaListColumns.lastModifiedOn]: 'lastModifiedOn',
  [FormulaListColumns.isDeleted]: 'isDeleted'

};
