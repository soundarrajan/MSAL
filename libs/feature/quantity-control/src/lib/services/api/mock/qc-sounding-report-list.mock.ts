import * as faker from 'faker';
import * as _ from 'lodash';
import { IQcSoundingReportItemDto } from '../dto/qc-report-sounding.dto';


export function getMockQcSoundingReportList(n: number): IQcSoundingReportItemDto[] {
  return _.range(1, n).map(id => getMockQcSoundingReportListItem(id));
}

export function getMockQcSoundingReportListItem(id: number): IQcSoundingReportItemDto {
  return {
    computedRobDogo: faker.random.number({ min: 1000, max: 3000 }),
    computedRobHsfo: faker.random.number({ min: 1000, max: 3000 }),
    computedRobLsfo: faker.random.number({ min: 1000, max: 3000 }),
    imoNo: faker.random.number({ min: 1000000, max: 9000000 }),
    measuredRobDogo: faker.random.number({ min: -500, max: 500 }),
    measuredRobHsfo: faker.random.number({ min: -500, max: 500 }),
    measuredRobLsfo: faker.random.number({ min: -500, max: 500 }),
    reportId: faker.random.number({ min: 1000000, max: 9000000 }),
    robDogoDiff: faker.random.number({ min: 1000, max: 3000 }),
    robHsfoDiff: faker.random.number({ min: 1000, max: 3000 }),
    robLsfoDiff: faker.random.number({ min: 1000, max: 3000 }),
    soundedOn: faker.date.recent(30).toString(),
    soundingReason: `Request frok ${faker.commerce.department()}`,
    vesselCode: faker.random.alphaNumeric(4),
    vesselName: `${faker.name.firstName()}`,
    voyageReference: faker.random.alphaNumeric(9)
  };
}
