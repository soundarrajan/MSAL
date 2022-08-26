export enum SystemInstrumentListColumns {
  selection = 'selection',
  id = 'id',
  name = 'name',
  code = 'code',
  marketInstrument = 'marketinstrument_name',
  createdBy = 'created_by',
  createdOn = 'createdOn',
  lastModifiedBy = 'last_modified_by',
  lastModifiedOn = 'lastModifiedOn',
  isDeleted = 'isDeleted'

}

export enum SystemInstrumentListColumnsLabels {
  id = 'Id',
  name = 'System Instrument',
  code = 'System Instrument Code',
  marketInstrument = 'Market Instrument',
  createdBy = 'Created By',
  createdOn = 'Created On',
  lastModifiedBy = 'Last Modified By',
  lastModifiedOn = 'Last Modified On',
  hasNoMoreChildren = 'Has No More Children',
  isDeleted = 'Active'

}

export const SystemInstrumentListColumnServerKeys: Record<
SystemInstrumentListColumns,
  string
> = {
  [SystemInstrumentListColumns.selection]: undefined,
  [SystemInstrumentListColumns.id]: 'id',
  [SystemInstrumentListColumns.name]: 'name',
  [SystemInstrumentListColumns.code]: 'code',
  [SystemInstrumentListColumns.marketInstrument]: 'marketinstrument_name',
  [SystemInstrumentListColumns.createdBy]: 'created_by',
  [SystemInstrumentListColumns.createdOn]: 'createdOn',
  [SystemInstrumentListColumns.lastModifiedBy]: 'last_modified_by',
  [SystemInstrumentListColumns.lastModifiedOn]: 'lastModifiedOn',
  [SystemInstrumentListColumns.isDeleted]: 'isDeleted'

};
