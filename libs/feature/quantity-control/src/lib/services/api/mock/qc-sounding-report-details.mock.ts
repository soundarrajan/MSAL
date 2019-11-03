import * as faker from 'faker';
import * as _ from 'lodash';
import { IQcSoundingReportDetailsItemDto, IQcSoundingReportItemDto } from '../dto/qc-report-sounding.dto';

export function getMockQcSoundingReportDetails(n: number): IQcSoundingReportDetailsItemDto[] {
  return _.range(1, n).map(id => getMockQcSoundingReportDetailsItem(id));
}

export function getMockQcSoundingReportDetailsItem(id: number): IQcSoundingReportDetailsItemDto {
  return {
    fuelDescription: faker.commerce.product(),
    fuelMass: faker.random.number({ min: 5, max: 50}),
    fuelTemp: faker.random.number({ min: 5, max: 100}),
    fuelVolume: faker.random.number({ min: 100, max: 2000}),
    reportId: faker.random.number({ min: 1000000, max: 9000000 }),
    tankCapacity: faker.random.number({ min: 10, max: 200}),
    tankId: faker.random.number({ min: 100, max: 2000}),
    tankName: faker.commerce.product(),
    tankUnpumpableVolume: faker.random.number({ min: 0, max: 20})
  };
}
