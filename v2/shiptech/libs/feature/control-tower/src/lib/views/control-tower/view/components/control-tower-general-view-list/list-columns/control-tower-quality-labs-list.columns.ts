import { ControlTowerQualityLabsListGridViewModel } from "../view-model/control-tower-quality-labs-grid.view-model";

export enum ControlTowerQualityLabsListColumns {
    lab = 'id',
    labcounterparty = 'counterparty',
    deliveryNo = 'deliveryId',
    order = 'order',
    vessel = 'vessel',
    port = 'port',
    eta = 'recentEta',
    product = 'product',
    specGroupName = 'specGroupName',
    labStatus = 'status',
    claimRaised = 'claimsRaised',
    createdBy = 'createdBy',
    createdDate = 'createdDate',
    progress = 'progress',
    // action = 'action'
  }
  
  export enum ControlTowerQualityLabsListExportColumns {
    lab = 'id',
    labcounterparty = 'counterparty.name',
    deliveryNo = 'deliveryId',
    order = 'order.id',
    vessel = 'vessel.name',
    port = 'port',
    eta = 'recentEta',
    product = 'product.name',
    specGroupName = 'specGroupName',
    labStatus = 'status.name',
    claimRaised = 'claimsRaised',
    createdBy = 'createdBy.name',
    createdDate = 'createdDate',
    progress = 'progress.displayName'
  }
  
  export enum ControlTowerQualityLabsListColumnsLabels {
    lab = 'Lab ID',
    labcounterparty = 'Lab Counterparty',
    deliveryNo = 'Delivery No',
    order = 'Order No',
    vessel = 'Vessel',
    port = 'Port',
    eta = 'ETA',
    product = 'Product',
    specGroupName = 'Spec Group',
    labStatus = 'Lab Status',
    claimRaised = 'Claim Raised',
    createdBy = 'Created By',
    createdDate = 'Created On',
    progress = 'Progress',
    action = 'Actions'
  }
  
  /**
   * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
   */
  export const ControlTowerQualityLabsListColumnServerKeys: Record<
  ControlTowerQualityLabsListColumns,
    string
  > = {
    [ControlTowerQualityLabsListColumns.lab]: 'id',
    [ControlTowerQualityLabsListColumns.labcounterparty]: 'counterparty_name',
    [ControlTowerQualityLabsListColumns.deliveryNo]: 'deliveryId',
    [ControlTowerQualityLabsListColumns.order]: 'order_id',
    [ControlTowerQualityLabsListColumns.vessel]: 'vessel_name',
    [ControlTowerQualityLabsListColumns.port]: 'port',
    [ControlTowerQualityLabsListColumns.eta]: 'recentEta',
    [ControlTowerQualityLabsListColumns.product]: 'product_name',
    [ControlTowerQualityLabsListColumns.specGroupName]: 'specGroupName',
    [ControlTowerQualityLabsListColumns.labStatus]: 'status_name',
    [ControlTowerQualityLabsListColumns.claimRaised]: 'claimsRaised',
    [ControlTowerQualityLabsListColumns.createdBy]: 'createdBy_name',
    [ControlTowerQualityLabsListColumns.createdDate]: 'createdDate',
    [ControlTowerQualityLabsListColumns.progress]: 'Progress_Name'
    // [ControlTowerQualityLabsListColumns.action]: 'action'
  };
  