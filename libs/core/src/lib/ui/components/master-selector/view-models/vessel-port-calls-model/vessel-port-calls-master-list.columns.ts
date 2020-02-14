export enum VesselPortCallsMasterListColumns {
  selection = 'selection',
  locationPort = 'locationPort',
  voyageId = 'voyageId',
  eta = 'eta',
  etb = 'etb',
  etd = 'etd',
  portCallId = 'portCallId',
  service = 'service'
}

export enum VesselPortCallsMasterListColumnsLabels {
  locationPort = 'Location/Port',
  voyageId = 'Voyage Id',
  eta = 'ETA',
  etb = 'ETB',
  etd = 'ETD',
  portCallId = 'Port Call Id',
  service = 'Service'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const VesselPortCallsMasterListColumnServerKeys: Record<
  VesselPortCallsMasterListColumns,
  string
> = {
  [VesselPortCallsMasterListColumns.selection]: undefined,
  [VesselPortCallsMasterListColumns.locationPort]: 'Location_Name',
  [VesselPortCallsMasterListColumns.voyageId]: 'VoyageId_Name',
  [VesselPortCallsMasterListColumns.eta]: 'eta',
  [VesselPortCallsMasterListColumns.etb]: 'etb',
  [VesselPortCallsMasterListColumns.etd]: 'etd',
  [VesselPortCallsMasterListColumns.portCallId]: 'portCallId',
  [VesselPortCallsMasterListColumns.service]: 'Service_Name'
};
