import { range } from 'lodash';
import { IQcSoundingReportItemDto } from '../dto/qc-report-sounding.dto';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockQcSoundingReportListItem(
  id: number
): IQcSoundingReportItemDto {
  return {
    id: id,
    computedRobDogo: chance.integer({ min: 1000, max: 3000 }),
    computedRobHsfo: chance.integer({ min: 1000, max: 3000 }),
    computedRobLsfo: chance.integer({ min: 1000, max: 3000 }),
    imoNo: chance
      .string({ alpha: true, numeric: true, length: 5 })
      .toUpperCase(),
    measuredRobDogo: chance.integer({ min: -500, max: 500 }),
    measuredRobHsfo: chance.integer({ min: -500, max: 500 }),
    measuredRobLsfo: chance.integer({ min: -500, max: 500 }),
    reportId: chance.integer({ min: 1000000, max: 9000000 }),
    robDogoDiff: chance.integer({ min: 1000, max: 3000 }),
    robHsfoDiff: chance.integer({ min: 1000, max: 3000 }),
    robLsfoDiff: chance.integer({ min: 1000, max: 3000 }),
    soundedOn: chance.date().toISOString(),
    soundingReason: `Request from ${chance.word()}`,
    vesselCode: chance.string({ alpha: true, numeric: true, length: 4 }),
    vesselName: `${chance.first()}`,
    voyageReference: chance.string({ alpha: true, numeric: true, length: 9 })
  };
}

export function getMockQcSoundingReportList(
  n: number
): IQcSoundingReportItemDto[] {
  return range(1, n).map(id => getMockQcSoundingReportListItem(id));
}
