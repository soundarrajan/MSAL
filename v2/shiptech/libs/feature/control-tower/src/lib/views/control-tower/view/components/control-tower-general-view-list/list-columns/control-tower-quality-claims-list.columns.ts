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
    claimSubType = 'claimSubtypes',
    estimatedSettlementAmount = 'estimatedSettlementAmount',
    createdBy = 'createdBy',
    createdDate = 'createdDate',
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
    claimSubType = 'claimSubtypes',
    seller = 'seller',
    estimatedSettlementAmount = 'estimatedSettlementAmount',
    createdBy = 'createdBy.name',
    createdDate = 'createdDate',
    noResponse = 'noResponseText'
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
    createdBy = 'Created By',
    createdDate = 'Created Date',
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
    [ControlTowerQualityClaimsListColumns.claimSubType]: 'claimSubtypes',
    [ControlTowerQualityClaimsListColumns.seller]: 'seller',
    [ControlTowerQualityClaimsListColumns.estimatedSettlementAmount]:
      'estimatedSettlementAmount',
      [ControlTowerQualityClaimsListColumns.createdBy]: 'createdBy_name',
    [ControlTowerQualityClaimsListColumns.createdDate]: 'createdDate',
    [ControlTowerQualityClaimsListColumns.noResponse]: 'noResponse'
  };
  