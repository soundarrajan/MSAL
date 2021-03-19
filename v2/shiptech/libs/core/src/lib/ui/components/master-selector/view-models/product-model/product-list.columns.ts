export enum ProductListColumns {
  selection = 'selection',
  id = 'id',
  name = 'name',
  code = 'code',
  displayName = 'displayName',
  parent = 'parent',
  productType = 'product_type',
  specGroup = 'spec_group',
  uomMass = 'uom_mass',
  conversionFactorValue = 'conversionFactorValue',
  uomVolume = 'uom_volume',
  createdBy = 'created_by',
  createdOn = 'createdOn',
  lastModifiedBy = 'last_modified_by',
  lastModifiedOn = 'lastModifiedOn',
  customNonMandatoryAttribute1 = 'customNonMandatoryAttribute1'
}

export enum ProductListColumnsLabels {
  id = 'Id',
  name = 'Product Name',
  code = 'Code',
  displayName = 'Display Name',
  parent = 'Parent Name',
  productType = 'Product Type',
  specGroup = 'Default Spec Group',
  uomMass = 'Conversion Factor Mass Uom',
  conversionFactorValue = 'Conversion Factor Value',
  uomVolume = 'Conversion Factor Volume Uom',
  createdBy = 'Created By',
  createdOn = 'Created On',
  lastModifiedBy = 'Last Modified By',
  lastModifiedOn = 'Last Modified On',
  customNonMandatoryAttribute1 = 'Material'


}

export const ProductListColumnServerKeys: Record<
ProductListColumns,
  string
> = {
  [ProductListColumns.selection]: undefined,
  [ProductListColumns.id]: 'id',
  [ProductListColumns.name]: 'name',
  [ProductListColumns.code]: 'code',
  [ProductListColumns.displayName]: 'displayName',
  [ProductListColumns.parent]: 'parent',
  [ProductListColumns.productType]: 'product_type',
  [ProductListColumns.specGroup]: 'spec_group',
  [ProductListColumns.uomMass]: 'uom_mass',
  [ProductListColumns.conversionFactorValue]: 'conversionFactorValue',
  [ProductListColumns.uomVolume]: 'uom_volume',
  [ProductListColumns.createdBy]: 'created_by',
  [ProductListColumns.createdOn]: 'createdOn',
  [ProductListColumns.lastModifiedBy]: 'last_modified_by',
  [ProductListColumns.lastModifiedOn]: 'lastModifiedOn',
  [ProductListColumns.customNonMandatoryAttribute1]: 'customNonMandatoryAttribute1',

};
