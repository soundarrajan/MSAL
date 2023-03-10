export enum VesselMasterListColumns {
  selection = 'selection',
  name = 'name',
  displayName = 'displayName',
  code = 'code',
  imoNo = 'imoNo',
  vesselFlag = 'vesselFlag',
  operatingCompany = 'operatingCompany',
  email = 'email',
  defaultHfo = 'defaultHfo',
  defaultMgo = 'defaultMgo',
  mgoSpecs = 'mgoSpecs',
  defaultUlsfo = 'defaultUlsfo',
  ulsfoSpecs = 'ulsfoSpecs',
  service = 'service',
  lab = 'lab',
  comments = 'comments',
  charteredVessel = 'charteredVessel',
  chartererName = 'chartererName',
  buyer = 'buyer',
  deliveryDate = 'deliveryDate',
  expiryDate = 'expiryDate',
  earliestRedeliveryDate = 'earliestRedeliveryDate',
  estimatedRedeliveryDate = 'estimatedRedeliveryDate',
  latestRedeliveryDate = 'latestRedeliveryDate',
  redeliveryPort = 'redeliveryPort',
  robHsfoOnDelivery = 'robHsfoOnDelivery',
  robLsfoOnDelivery = 'robLsfoOnDelivery',
  robDogoOnDelivery = 'robDogoOnDelivery',
  robHsfoOnRedelivery = 'robHsfoOnRedelivery',
  robLsfoOnRedelivery = 'robLsfoOnRedelivery',
  robDogoOnRedelivery = 'robDogoOnRedeliver',
  mainEngine = 'mainEngine',
  teuNominal = 'teuNominal',
  vesselType = 'vesselType',
  flowMeterAvailable = 'flowMeterAvailable',
  pumpingRateMtPerHour = 'pumpingRateMtPerHour',
  averageSpeedNmPerHour = 'averageSpeedNmPerHour',
  manifoldPressure = 'manifoldPressure',
  voyageUpdatedDate = 'voyageUpdatedDate',
  status = 'status',
  createdOn = 'createdOn',
  createdBy = 'createdBy',
  lastModifiedOn = 'lastModifiedOn',
  lastModifiedBy = 'lastModifiedBy',
  hfoSpecs = 'hfoSpecs'
}

export enum VesselMasterListColumnsLabels {
  name = 'Name',
  displayName = 'Display Name',
  code = 'Code',
  imoNo = 'IMO No',
  vesselFlag = 'Vessel Flag',
  operatingCompany = 'Operating Company',
  email = 'Email',
  defaultHfo = 'Default HFO',
  defaultMgo = 'Default MGO',
  mgoSpecs = 'MGO Specs',
  defaultUlsfo = 'Default ULSFO',
  ulsfoSpecs = 'ULSFO Specs',
  service = 'Service',
  lab = 'Lab',
  comments = 'Comments',
  charteredVessel = 'Chartered Vessel',
  chartererName = 'Charterer Name',
  buyer = 'Buyer',
  deliveryDate = 'Delivery Date',
  expiryDate = 'Expiry Date',
  earliestRedeliveryDate = 'Earliest Redelivery Date',
  estimatedRedeliveryDate = 'Estimated Redelivery Date',
  latestRedeliveryDate = 'Latest Redelivery Date',
  redeliveryPort = 'Redelivery Port',
  robHsfoOnDelivery = 'ROB HSFO on Delivery',
  robLsfoOnDelivery = 'ROB LSFO on Delivery',
  robDogoOnDelivery = 'ROB DO/GO on Delivery',
  robHsfoOnRedelivery = 'ROB HSFO on Redelivery',
  robLsfoOnRedelivery = 'ROB LSFO on Redelivery',
  robDogoOnRedelivery = 'ROB DO/GO on Redeliver',
  mainEngine = 'Main Engine',
  teuNominal = 'Teu Nominal',
  vesselType = 'Vessel Type',
  flowMeterAvailable = 'Flow Meter Available',
  pumpingRateMtPerHour = 'Pumping rate (MT/Hour)',
  averageSpeedNmPerHour = 'Average Speed (NM/Hour)',
  manifoldPressure = 'Manifold Pressure',
  voyageUpdatedDate = 'Voyage Updated Date',
  status = 'Status',
  createdOn = 'Created On',
  createdBy = 'Created By',
  lastModifiedOn = 'Last Modified On',
  lastModifiedBy = 'Last Modified By',
  hfoSpecs = 'HFO Specs'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const VesselMasterListColumnServerKeys: Record<
  VesselMasterListColumns,
  string
> = {
  [VesselMasterListColumns.selection]: undefined,
  [VesselMasterListColumns.averageSpeedNmPerHour]: 'averageSpeed',
  [VesselMasterListColumns.buyer]: 'buyer',
  [VesselMasterListColumns.charteredVessel]: 'charteredVessel',
  [VesselMasterListColumns.chartererName]: 'chartererName',
  [VesselMasterListColumns.code]: 'code',
  [VesselMasterListColumns.comments]: 'comments',
  [VesselMasterListColumns.createdBy]: 'CreatedBy_Name',
  [VesselMasterListColumns.createdOn]: 'createdOn',
  [VesselMasterListColumns.defaultHfo]: 'Fuel_Name',
  [VesselMasterListColumns.defaultMgo]: 'Distillate_Name',
  [VesselMasterListColumns.defaultUlsfo]: 'Lsfo_Name',
  [VesselMasterListColumns.deliveryDate]: 'deliveryDate',
  [VesselMasterListColumns.displayName]: 'displayName',
  [VesselMasterListColumns.earliestRedeliveryDate]: 'earliestRedeliveryDate',
  [VesselMasterListColumns.email]: 'email',
  [VesselMasterListColumns.estimatedRedeliveryDate]: 'estimatedRedeliveryDate',
  [VesselMasterListColumns.expiryDate]: 'expiryDate',
  [VesselMasterListColumns.flowMeterAvailable]: 'isFlowMeterAvailable',
  [VesselMasterListColumns.imoNo]: 'imoNo',
  [VesselMasterListColumns.lab]: 'lab',
  [VesselMasterListColumns.lastModifiedBy]: 'LastModifiedBy_Name',
  [VesselMasterListColumns.lastModifiedOn]: 'lastModifiedOn',
  [VesselMasterListColumns.latestRedeliveryDate]: 'latestRedeliveryDate',
  [VesselMasterListColumns.mainEngine]: 'mainEngine',
  [VesselMasterListColumns.manifoldPressure]: 'manifoldPressure',
  [VesselMasterListColumns.mgoSpecs]: 'DistillateSpecGroup_Name',
  [VesselMasterListColumns.name]: 'name',
  [VesselMasterListColumns.operatingCompany]: 'operatingCompany',
  [VesselMasterListColumns.pumpingRateMtPerHour]: 'pumpingRate',
  [VesselMasterListColumns.redeliveryPort]: 'redeliveryPort',
  [VesselMasterListColumns.robDogoOnDelivery]: 'robDoGoDeliveryQuantity',
  [VesselMasterListColumns.robDogoOnRedelivery]: 'robDoGoRedeliveryQuantity',
  [VesselMasterListColumns.robHsfoOnDelivery]: 'robHsfoDeliveryQuantity',
  [VesselMasterListColumns.robHsfoOnRedelivery]: 'robHsfoRedeliveryQuantity',
  [VesselMasterListColumns.robLsfoOnDelivery]: 'robLsfoDeliveryQuantity',
  [VesselMasterListColumns.robLsfoOnRedelivery]: 'robLsfoRedeliveryQuantity',
  [VesselMasterListColumns.service]: 'service',
  [VesselMasterListColumns.status]: 'isDeleted',
  [VesselMasterListColumns.teuNominal]: 'teuNominal',
  [VesselMasterListColumns.ulsfoSpecs]: 'LsfoSpecsGroup_Name',
  [VesselMasterListColumns.vesselFlag]: 'vesselFlag',
  [VesselMasterListColumns.vesselType]: 'vesselType',
  [VesselMasterListColumns.voyageUpdatedDate]: 'updatedDate',
  [VesselMasterListColumns.hfoSpecs]: 'FuelSpecGroup_Name'
};
