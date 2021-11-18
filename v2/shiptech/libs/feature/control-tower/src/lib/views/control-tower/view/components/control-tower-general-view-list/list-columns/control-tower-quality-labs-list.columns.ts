import { ControlTowerQualityLabsListGridViewModel } from "../view-model/control-tower-quality-labs-grid.view-model";

export enum ControlTowerQualityLabsListColumns {
    order = 'order',
    lab = 'id',
    labcounterparty = 'counterparty',
    deliveryNo = 'deliveryId',
    vessel = 'vessel',
    port = 'port',
    eta = 'recentEta',
    product = 'product',
    labStatus = 'status',
    claimRaised = 'claimsRaised',
    createdDate = 'createdDate',
    createdBy = 'createdBy',
    progress = 'progress',
    action = 'action'
  }
  
  export enum ControlTowerQualityLabsListExportColumns {
    order = 'order.id',
    lab = 'id',
    labcounterparty = 'counterparty.name',
    deliveryNo = 'deliveryId',
    vessel = 'vessel.name',
    port = 'port',
    eta = 'recentEta',
    product = 'product.name',
    labStatus = 'status.name',
    claimRaised = 'claimsRaised',
    createdDate = 'createdDate',
    createdBy = 'createdBy.name',
    progress = 'progress.name'
  }
  
  export enum ControlTowerQualityLabsListColumnsLabels {
    order = 'Order No',
    lab = 'Lab ID',
    labcounterparty = 'Lab Counterparty',
    deliveryNo = 'Delivery No',
    vessel = 'Vessel',
    port = 'Port',
    eta = 'ETA',
    product = 'Product',
    labStatus = 'Lab Status',
    claimRaised = 'Claim Raised',
    createdDate = 'Created On',
    createdBy = 'Created By',
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
    [ControlTowerQualityLabsListColumns.order]: 'order_id',
    [ControlTowerQualityLabsListColumns.lab]: 'id',
    [ControlTowerQualityLabsListColumns.labcounterparty]: 'counterparty_name',
    [ControlTowerQualityLabsListColumns.deliveryNo]: 'deliveryId',
    [ControlTowerQualityLabsListColumns.vessel]: 'vessel_name',
    [ControlTowerQualityLabsListColumns.port]: 'port',
    [ControlTowerQualityLabsListColumns.eta]: 'recentEta',
    [ControlTowerQualityLabsListColumns.product]: 'product_name',
    [ControlTowerQualityLabsListColumns.labStatus]: 'status_name',
    [ControlTowerQualityLabsListColumns.claimRaised]: 'claimsRaised',
    [ControlTowerQualityLabsListColumns.createdDate]: 'createdDate',
    [ControlTowerQualityLabsListColumns.createdBy]: 'createdBy_name',
    [ControlTowerQualityLabsListColumns.progress]: 'Progress_Name',
    [ControlTowerQualityLabsListColumns.action]: 'userAction'
  };
  