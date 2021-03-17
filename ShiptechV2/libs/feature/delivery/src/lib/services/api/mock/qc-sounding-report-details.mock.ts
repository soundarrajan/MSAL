import { range } from 'lodash';
import { IQcSoundingReportDetailsItemDto } from '../dto/qc-report-sounding.dto';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockQcSoundingReportDetailsItem(
  id: number
): IQcSoundingReportDetailsItemDto {
  return <IQcSoundingReportDetailsItemDto>{
    fuelDescriptor: chance.word(),
    fuelMass: chance.integer({ min: 5, max: 50 }),
    fuelTemperature: chance.integer({ min: 5, max: 100 }),
    fuelVolume: chance.integer({ min: 100, max: 2000 }),
    id: id,
    tankCapacity: chance.integer({ min: 10, max: 200 }),
    tankId: chance.integer({ min: 100, max: 2000 }),
    tankName: chance.word(),
    tankUnpumpableVolume: chance.integer({ min: 0, max: 20 }),
    measuredVesselReportId: chance.integer({ min: 1000000, max: 9000000 })
  };
}

export function getMockQcSoundingReportDetails(
  n: number
): IQcSoundingReportDetailsItemDto[] {
  return range(1, n).map(id => getMockQcSoundingReportDetailsItem(id));
}
