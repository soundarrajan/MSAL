import { IQcSoundingReportDetailsItemDto } from '../api/dto/qc-report-sounding.dto';

export class QcSoundingReportDetailsItemModel implements IQcSoundingReportDetailsItemDto {
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
