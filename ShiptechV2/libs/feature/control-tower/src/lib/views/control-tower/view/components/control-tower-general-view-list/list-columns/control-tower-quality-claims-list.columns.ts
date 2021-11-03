import { ControlTowerQualityClaimsListGridViewModel } from "../view-model/control-tower-quality-claims-grid.view-model";

export enum ControlTowerQualityClaimsListColumns {
    order = 'order',
    lab = 'lab',
    id = 'id',
    port = 'port',
    vessel = 'vessel',
    eta = 'eta',
    product = 'product',
    seller = 'seller',
    claimSubType = 'claimSubType',
    estimatedSettlementAmount = 'estimatedSettlementAmount',
    createdDate = 'createdDate',
    createdBy = 'createdBy',
    noResponse = 'noResponse'
  }
  
  export enum ControlTowerQualityClaimsListExportColumns {
    order = 'order.id',
    lab = 'lab.id',
    id = 'id',
    port = 'port',
    vessel = 'vessel',
    eta = 'eta',
    product = 'product',
    seller = 'seller',
    claimSubType = 'claimSubType',
    estimatedSettlementAmount = 'estimatedSettlementAmount',
    createdDate = 'createdDate',
    createdBy = 'createdBy.name',
    noResponse = 'noResponse'
  }
  
  export enum ControlTowerQualityClaimsListColumnsLabels {
    order = 'Order No',
    lab = 'Lab ID',
    id = 'Claim No',
    port = 'Port',
    vessel = 'Vessel',
    eta = 'ETA',
    product = 'Product',
    seller = 'Seller',
    claimSubType = 'Claim Sub Type',
    estimatedSettlementAmount = 'Estimated Settlement Amount',
    createdDate = 'Created Date',
    createdBy = 'Created By',
    noResponse = 'No Response'
  }
  
  /**
   * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
   */
  export const ControlTowerQualityClaimsListColumnServerKeys: Record<
  ControlTowerQualityClaimsListColumns,
    string
  > = {
    [ControlTowerQualityClaimsListColumns.order]: 'order_id',
    [ControlTowerQualityClaimsListColumns.lab]: 'lab_id',
    [ControlTowerQualityClaimsListColumns.id]: 'id',
    [ControlTowerQualityClaimsListColumns.port]: 'port',
    [ControlTowerQualityClaimsListColumns.vessel]: 'vessel',
    [ControlTowerQualityClaimsListColumns.eta]: 'eta',
    [ControlTowerQualityClaimsListColumns.product]: 'product',
    [ControlTowerQualityClaimsListColumns.seller]: 'seller',
    [ControlTowerQualityClaimsListColumns.claimSubType]: 'claimSubType',
    [ControlTowerQualityClaimsListColumns.estimatedSettlementAmount]:
      'estimatedSettlementAmount',
    [ControlTowerQualityClaimsListColumns.createdDate]: 'createdDate',
    [ControlTowerQualityClaimsListColumns.createdBy]: 'createdBy_name',
    [ControlTowerQualityClaimsListColumns.noResponse]: 'noResponse'
  };
  