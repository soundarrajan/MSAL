export enum PaymentTermListColumns {
  selection = 'selection',
  id = 'id',
  name = 'name',
  displayName = 'displayName',
  defaultPaymentTerm = 'defaultpaymentterm_name',
  parent = 'parent',
  isDeleted = 'isDeleted',
  reason = 'reason',
  status = 'status',
  comments = 'comments',
  defaultIncoterm = 'defaultIncoterm',
  supplier = 'supplier',
  seller = 'seller',
  broker = 'broker',
  customer = 'customer',
  agent = 'agent',
  surveyor = 'surveyor',
  barge = 'barge',
  lab = 'lab',
  planner = 'planner',
  internal = 'internal',
  sludge = 'sludge',
  country = 'country',
  createdBy = 'created_by',
  createdOn = 'createdOn',
  lastModifiedBy = 'last_modified_by',
  lastModifiedOn = 'lastModifiedOn',
  hasNoMoreChildren = 'has_no_more_children'
}

export enum PaymentTermListColumnsLabels {
  id = 'Id',
  name = 'Payment Term Name',
  displayName = 'Display Name',
  defaultPaymentTerm = 'Default Payment Term',
  parent = 'Parent',
  isDeleted = 'Blacklisted',
  reason = 'Blacklisted Reason',
  status = 'Status',
  comments = 'Comments',
  defaultIncoterm = 'Default Inconterm',
  supplier = 'Supplier',
  seller = 'Seller',
  broker = 'Broker',
  customer = 'Customer',
  agent = 'Agent',
  surveyor = 'Surveyor',
  barge = 'Barge',
  lab = 'Lab',
  planner = 'Planner',
  internal = 'Internal',
  sludge = 'Sludge',
  country = 'Country',
  createdBy = 'Created By',
  createdOn = 'Created On',
  lastModifiedBy = 'Last Modified By',
  lastModifiedOn = 'Last Modified On',
  hasNoMoreChildren = 'Has No More Children'

}

export const PaymentTermListColumnServerKeys: Record<
PaymentTermListColumns,
  string
> = {
  [PaymentTermListColumns.selection]: undefined,
  [PaymentTermListColumns.id]: 'id',
  [PaymentTermListColumns.name]: 'name',
  [PaymentTermListColumns.displayName]: 'displayName',
  [PaymentTermListColumns.defaultPaymentTerm]: 'defaultpaymentterm_name',
  [PaymentTermListColumns.parent]: 'parent',
  [PaymentTermListColumns.isDeleted]: 'isDeleted',
  [PaymentTermListColumns.reason]: 'reason',
  [PaymentTermListColumns.status]: 'status',
  [PaymentTermListColumns.comments]: 'comments',
  [PaymentTermListColumns.defaultIncoterm]: 'defaultIncoterm',
  [PaymentTermListColumns.supplier]: 'supplier',
  [PaymentTermListColumns.seller]: 'seller',
  [PaymentTermListColumns.broker]: 'broker',
  [PaymentTermListColumns.customer]: 'customer',
  [PaymentTermListColumns.agent]: 'agent',
  [PaymentTermListColumns.surveyor]: 'surveyor',
  [PaymentTermListColumns.barge]: 'barge',
  [PaymentTermListColumns.lab]: 'lab',
  [PaymentTermListColumns.planner]: 'planner',
  [PaymentTermListColumns.internal]: 'internal',
  [PaymentTermListColumns.sludge]: 'sludge',
  [PaymentTermListColumns.country]: 'country',
  [PaymentTermListColumns.createdBy]: 'created_by',
  [PaymentTermListColumns.createdOn]: 'createdOn',
  [PaymentTermListColumns.lastModifiedBy]: 'last_modified_by',
  [PaymentTermListColumns.lastModifiedOn]: 'lastModifiedOn',
  [PaymentTermListColumns.hasNoMoreChildren]: 'has_no_more_children',

};
