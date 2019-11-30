import * as faker from 'faker';
import * as _ from 'lodash';
import { IQcSoundingReportDetailsItemDto } from '../dto/qc-report-sounding.dto';

export function getMockQcSoundingReportDetails(n: number): IQcSoundingReportDetailsItemDto[] {
  return _.range(1, n).map(id => getMockQcSoundingReportDetailsItem(id));
}

export function getMockQcSoundingReportDetailsItem(id: number): IQcSoundingReportDetailsItemDto {
  return <IQcSoundingReportDetailsItemDto>{
    fuelDescriptor: faker.commerce.product(),
    fuelMass: faker.random.number({ min: 5, max: 50 }),
    fuelTemperature: faker.random.number({ min: 5, max: 100 }),
    fuelVolume: faker.random.number({ min: 100, max: 2000 }),
    id: faker.random.number({ min: 1000000, max: 9000000 }),
    tankCapacity: faker.random.number({ min: 10, max: 200 }),
    tankId: faker.random.number({ min: 100, max: 2000 }),
    tankName: faker.commerce.product(),
    tankUnpumpableVolume: faker.random.number({ min: 0, max: 20 }),
    measuredVesselReportId: faker.random.number({ min: 1000000, max: 9000000 })
  };
}
