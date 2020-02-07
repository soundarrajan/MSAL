import { commerce, random } from 'faker';
import { range } from 'lodash';
import { IQcSoundingReportDetailsItemDto } from '../dto/qc-report-sounding.dto';

export function getMockQcSoundingReportDetails(n: number): IQcSoundingReportDetailsItemDto[] {
  return range(1, n).map(id => getMockQcSoundingReportDetailsItem(id));
}

export function getMockQcSoundingReportDetailsItem(id: number): IQcSoundingReportDetailsItemDto {
  return <IQcSoundingReportDetailsItemDto>{
    fuelDescriptor: commerce.product(),
    fuelMass: random.number({ min: 5, max: 50 }),
    fuelTemperature: random.number({ min: 5, max: 100 }),
    fuelVolume: random.number({ min: 100, max: 2000 }),
    id: random.number({ min: 1000000, max: 9000000 }),
    tankCapacity: random.number({ min: 10, max: 200 }),
    tankId: random.number({ min: 100, max: 2000 }),
    tankName: commerce.product(),
    tankUnpumpableVolume: random.number({ min: 0, max: 20 }),
    measuredVesselReportId: random.number({ min: 1000000, max: 9000000 })
  };
}
