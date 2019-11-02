import { BaseModel } from '../models/base.sub-state';

export class QcSoundingReportItemDetailsItemModel {
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

export interface IQcSoundingReportItemDetailsItemState extends QcSoundingReportItemDetailsItemModel  {
}

export class QcSoundingReportItemDetailsModel extends BaseModel {
  items: IQcSoundingReportItemDetailsItemState[];

  vesselName: string;
  vesselCode: string;
  imoNo: number;
  reportId: number;
  voyageReference: string;
  soundedOn: string;
  soundingReason: string;
  computedRobLsfo: number;
  measuredRobLsfo	: number;
  robLsfoDiff: number;
  computedRobDogo: number;
  measuredRobDogo: number;
  robDogoDiff: number;
}

export interface IQcSoundingReportItemDetailsState extends QcSoundingReportItemDetailsModel {
}

export class QcSoundingReportsModel extends BaseModel {
  items: number[];
  itemsById: Record<number, IQcSoundingReportItemDetailsState>;
}

export class QcSoundingReportItemModel extends BaseModel {
  items: number[];
}

export interface IQcSoundingReportsState extends QcSoundingReportsModel {
}
