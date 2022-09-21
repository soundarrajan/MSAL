export enum CompanyListColumns {
  selection = 'selection',
  id = 'id',
  name = 'name',
  displayName = 'displayName',
  parent = 'parent',
  paymentCompany = 'paymentCompany',
  operatingCompany = 'operatingCompany',
  currency = 'currency',
  uom = 'uom',
  timeZone = 'timeZone',
  country = 'country',
  createdBy = 'created_by',
  createdOn = 'createdOn',
  lastModifiedBy = 'last_modified_by',
  lastModifiedOn = 'lastModifiedOn',
  isDeleted = 'isDeleted',
  code = 'code',
  hasNoMoreChildren = 'has_no_more_children'
}

export enum CompanyListColumnsLabels {
  id = 'Id',
  name = 'Company',
  displayName = 'Display Name',
  parent = 'Parent',
  paymentCompany = 'Payment Company',
  operatingCompany = 'Operating Company',
  currency = 'Base Currency',
  uom = 'Base Uom',
  timeZone = 'Time Zone',
  country = 'Country',
  createdBy = 'Created By',
  createdOn = 'Created On',
  lastModifiedBy = 'Last Modified By',
  lastModifiedOn = 'Last Modified On',
  isDeleted = 'Status',
  code = 'Company Code',
  hasNoMoreChildren = 'Has No More Children'
}

export const CompanyListColumnServerKeys: Record<
CompanyListColumns,
  string
> = {
  [CompanyListColumns.selection]: undefined,
  [CompanyListColumns.id]: 'id',
  [CompanyListColumns.name]: 'name',
  [CompanyListColumns.displayName]: 'displayName',
  [CompanyListColumns.parent]: 'parent',
  [CompanyListColumns.paymentCompany]: 'paymentCompany',
  [CompanyListColumns.operatingCompany]: 'operatingCompany',
  [CompanyListColumns.currency]: 'currency',
  [CompanyListColumns.uom]: 'uom',
  [CompanyListColumns.timeZone]: 'timeZone',
  [CompanyListColumns.country]: 'country',
  [CompanyListColumns.createdBy]: 'created_by',
  [CompanyListColumns.createdOn]: 'createdOn',
  [CompanyListColumns.lastModifiedBy]: 'last_modified_by',
  [CompanyListColumns.lastModifiedOn]: 'lastModifiedOn',
  [CompanyListColumns.isDeleted]: 'isDeleted',
  [CompanyListColumns.code]: 'code',
  [CompanyListColumns.hasNoMoreChildren]: 'has_no_more_children',
};
