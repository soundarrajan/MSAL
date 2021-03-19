import { IQcReportsListItemDto } from '../dto/qc-reports-list-item.dto';
import { range, sample, values } from 'lodash';
import { MockStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { MockReconStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.enum';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockQcReportsListItem(id: number): IQcReportsListItemDto {
  const quantityBefore: number = chance.integer({ max: 500 });
  const rob: number = chance.integer({ max: 200 });
  const sludge: number = chance.integer({ max: 20 });

  return {
    id,
    nbOfMatched: chance.d100(),
    nbOfMatchedWithinLimit: chance.d100(),
    nbOfNotMatched: chance.d100(),
    portCallId: chance
      .integer({ min: Math.pow(10, 15), max: Math.pow(10, 16) - 1 })
      .toString(),
    portName: chance.last(),
    vesselName: chance.word(),
    surveyDate: chance.date().toISOString(),
    surveyStatus: sample(values(MockStatusLookupEnumMap)),
    qtyMatchedStatus: sample(values(MockReconStatusLookupEnumMap)),
    logBookRobBeforeDelivery: rob * 0.95,
    measuredRobBeforeDelivery: rob * 0.9,
    diffRobBeforeDelivery: rob * 0.7,
    qtyBeforeDeliveryUom: {
      id: 1,
      name: 'MT',
      displayName: 'MT',
      minTolerance: 2,
      maxTolerance: 10
    },
    bdnQuantity: chance.integer({ max: 500 }),
    measuredDeliveredQty: quantityBefore - rob - sludge,
    diffDeliveredQty: chance.d6(),
    qtyDeliveredUom: {
      id: 1,
      name: 'MT',
      displayName: 'MT',
      minTolerance: 2,
      maxTolerance: 10
    },
    logBookRobAfterDelivery: rob * 1.3,
    measuredRobAfterDelivery: rob * 1.1,
    diffRobAfterDelivery: chance.d100(),
    qtyAfterDeliveryUom: {
      id: 1,
      name: 'MT',
      displayName: 'MT',
      minTolerance: 2,
      maxTolerance: 10
    },
    logBookSludgeRobBeforeDischarge: rob * 1.1,
    measuredSludgeRobBeforeDischarge: sludge * 0.96,
    diffSludgeRobBeforeDischarge: chance.integer({ max: 500 }),
    sludgeDischargedQty: chance.integer({ max: 500 }),
    qtySludgeDischargedUom: {
      id: 1,
      name: 'MT',
      displayName: 'MT',
      minTolerance: 2,
      maxTolerance: 10
    },
    comment: chance.word(),
    isVerifiedSludgeQty: chance.bool(),
    totalCount: chance.integer({ max: 20 }),
    emailTransactionTypeId: chance.integer({ max: 500 }),
    vesselToWatchFlag: chance.bool()
  };
}

export function getMockQcReportsList(n: number): IQcReportsListItemDto[] {
  return range(1, n).map(id => getMockQcReportsListItem(id));
}
