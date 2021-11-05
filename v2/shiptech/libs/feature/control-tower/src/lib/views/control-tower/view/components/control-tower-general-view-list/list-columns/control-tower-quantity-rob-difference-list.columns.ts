export enum ControlTowerQuantityRobDifferenceListColumns {
  actions = 'actions',
  portCall = 'portCall',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  quantityReportDetails = 'quantityReportDetails',
  logBookRob = 'quantityReportDetails',
  deliveryProductId = 'deliveryProductId',
  totalCount = 'totalCount',
  buyer = 'buyer',
  status = 'status'
}

export enum ControlTowerQuantityRobDifferenceListExportColumns {
  portCall = 'portCall.portCallId',
  port = 'port',
  vessel = 'vessel',
  eta = 'eta',
  surveyorDate = 'surveyorDate',
  emailToVessel = 'emailToVessel',
  vesselToWatch = 'vesselToWatch',
  quantityReportDetails = 'quantityReportDetails',
  logBookRob = 'quantityReportDetails',
  deliveryProductId = 'deliveryProductId',
  totalCount = 'totalCount',
  buyer = 'buyer.name',
  status = 'status.name'
}

export enum ControlTowerQuantityRobDifferenceListColumnsLabels {
  actions = 'Actions',
  portCall = 'Port Call',
  port = 'Port',
  vessel = 'Vessel',
  eta = 'ETA',
  surveyorDate = 'Surveyor Date',
  emailToVessel = 'Email To Vessel',
  vesselToWatch = 'Vessel To Watch',
  quantityReportDetails = 'Product Type',
  logBookRob = 'Log Book ROB',
  deliveryProductId = 'Measured ROB',
  totalCount = 'Difference in Qty',
  buyer = 'Qty UOM',
  status = 'Progress'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */

export const ControlTowerQuantityRobDifferenceListColumnServerKeys: Record<
  ControlTowerQuantityRobDifferenceListColumns,
  string
> = {
  [ControlTowerQuantityRobDifferenceListColumns.actions]: undefined,
  [ControlTowerQuantityRobDifferenceListColumns.portCall]:
    'portCall_portCallId',
  [ControlTowerQuantityRobDifferenceListColumns.port]: 'port',
  [ControlTowerQuantityRobDifferenceListColumns.vessel]: 'vessel',
  [ControlTowerQuantityRobDifferenceListColumns.eta]: 'eta',
  [ControlTowerQuantityRobDifferenceListColumns.surveyorDate]: 'surveyorDate',
  [ControlTowerQuantityRobDifferenceListColumns.emailToVessel]: 'emailToVessel',
  [ControlTowerQuantityRobDifferenceListColumns.vesselToWatch]: 'vesselToWatch',
  [ControlTowerQuantityRobDifferenceListColumns.quantityReportDetails]:
    'quantityReportDetails',
  [ControlTowerQuantityRobDifferenceListColumns.logBookRob]:
    'quantityReportDetails',
  [ControlTowerQuantityRobDifferenceListColumns.deliveryProductId]:
    'deliveryProductId',
  [ControlTowerQuantityRobDifferenceListColumns.totalCount]: 'totalCount',
  [ControlTowerQuantityRobDifferenceListColumns.buyer]: 'buyer_name',
  [ControlTowerQuantityRobDifferenceListColumns.status]: 'status_name'
};
