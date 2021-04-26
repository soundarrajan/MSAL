export enum CurrencyListColumns {
  selection = 'selection',
  id = 'id',
  name = 'name',
  code = 'code',
  createdBy = 'created_by',
  createdOn = 'createdOn',
  lastModifiedBy = 'last_modified_by',
  lastModifiedOn = 'lastModifiedOn',
  isDeleted = 'isDeleted'

}

export enum CurrencyListColumnsLabels {
  id = 'Id',
  name = 'Currency Description',
  code = 'Currency Code',
  createdBy = 'Created By',
  createdOn = 'Created On',
  lastModifiedBy = 'Last Modified By',
  lastModifiedOn = 'Last Modified On',
  hasNoMoreChildren = 'Has No More Children',
  isDeleted = 'Active'

}

export const CurrencyListColumnServerKeys: Record<CurrencyListColumns,
  string
> = {
  [CurrencyListColumns.selection]: undefined,
  [CurrencyListColumns.id]: 'id',
  [CurrencyListColumns.name]: 'name',
  [CurrencyListColumns.code]: 'code',
  [CurrencyListColumns.createdBy]: 'created_by',
  [CurrencyListColumns.createdOn]: 'createdOn',
  [CurrencyListColumns.lastModifiedBy]: 'last_modified_by',
  [CurrencyListColumns.lastModifiedOn]: 'lastModifiedOn',
  [CurrencyListColumns.isDeleted]: 'isDeleted'

};
