export interface IQcSoundingReportItemDto {
  id: number;
  vesselName: string;
  vesselCode: string;
  imoNo: string;
  reportId: number;
  voyageReference: string;
  soundedOn: Date | string;
  soundingReason: string;
  computedRobHsfo: number;
  measuredRobHsfo: number;
  robHsfoDiff: number;
  computedRobLsfo: number;
  measuredRobLsfo: number;
  robLsfoDiff: number;
  computedRobDogo: number;
  measuredRobDogo: number;
  robDogoDiff: number;
}

export interface IQcSoundingReportDetailsItemDto {
  id: number;
  reportId: number;
  tankId: number;
  tankName: string;
  fuelDescriptor: string;
  fuelVolume: number;
  tankCapacity: number;
  fuelTemperature: number;
  tankUnpumpableVolume: number;
  fuelMass: number;
  measuredVesselReportId: number;
}
