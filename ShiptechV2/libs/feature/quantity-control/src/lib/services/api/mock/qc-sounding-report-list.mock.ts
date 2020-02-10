import { random, date, commerce, name } from 'faker';
import { range } from 'lodash';
import { IQcSoundingReportItemDto } from '../dto/qc-report-sounding.dto';


export function getMockQcSoundingReportList(n: number): IQcSoundingReportItemDto[] {
  return range(1, n).map(id => getMockQcSoundingReportListItem(id));
}

export function getMockQcSoundingReportListItem(id: number): IQcSoundingReportItemDto {
  return {
    id: random.number(),
    computedRobDogo: random.number({ min: 1000, max: 3000 }),
    computedRobHsfo: random.number({ min: 1000, max: 3000 }),
    computedRobLsfo: random.number({ min: 1000, max: 3000 }),
    imoNo: random.alphaNumeric(10).toUpperCase(),
    measuredRobDogo: random.number({ min: -500, max: 500 }),
    measuredRobHsfo: random.number({ min: -500, max: 500 }),
    measuredRobLsfo: random.number({ min: -500, max: 500 }),
    reportId: random.number({ min: 1000000, max: 9000000 }),
    robDogoDiff: random.number({ min: 1000, max: 3000 }),
    robHsfoDiff: random.number({ min: 1000, max: 3000 }),
    robLsfoDiff: random.number({ min: 1000, max: 3000 }),
    soundedOn: date.recent(30).toISOString(),
    soundingReason: `Request frok ${commerce.department()}`,
    vesselCode: random.alphaNumeric(4),
    vesselName: `${name.firstName()}`,
    voyageReference: random.alphaNumeric(9)
  };
}
