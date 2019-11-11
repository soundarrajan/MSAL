export interface IQcSoundingReportItemDto {
  soundingReportId: number;
  vesselName: string;
  vesselCode: string;
  imoNo: number;
  reportId: number;
  voyageReference: string;
  soundedOn: string;
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
  reportId: number;
  tankId: number;
  tankName: string;
  fuelDescription: string;
  fuelVolume: number;
  tankCapacity: number;
  fuelTemp: number;
  tankUnpumpableVolume: number;
  fuelMass: number;
}


