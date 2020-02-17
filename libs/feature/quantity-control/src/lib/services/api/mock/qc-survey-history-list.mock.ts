import { range, sample, values } from 'lodash';
import { MockStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { IQcSurveyHistoryListItemDto } from '../dto/qc-survey-history-list-item.dto';
import { MockReconStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.enum';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockQcSurveyHistoryListItem(
  id: number
): IQcSurveyHistoryListItemDto {
  const quantityBefore: number = chance.integer({ max: 5000 });
  const rob: number = chance.integer({ max: 200 });
  const sludge: number = chance.integer({ max: 200 });
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
    qtyBeforeDeliveryUom: { id: 1, name: 'MT', displayName: 'MT' },
    bdnQuantity: chance.integer({ max: 500 }),
    measuredDeliveredQty: quantityBefore - rob - sludge,
    diffDeliveredQty: chance.d6(),
    qtyDeliveredUom: { id: 1, name: 'MT', displayName: 'MT' },
    logBookRobAfterDelivery: rob * 1.3,
    measuredRobAfterDelivery: rob * 1.1,
    diffRobAfterDelivery: chance.d100(),
    qtyAfterDeliveryUom: { id: 1, name: 'MT', displayName: 'MT' },
    logBookSludgeRobBeforeDischarge: rob * 1.1,
    measuredSludgeRobBeforeDischarge: sludge * 0.96,
    diffSludgeRobBeforeDischarge: chance.integer({ max: 500 }),
    sludgeDischargedQty: chance.integer({ max: 500 }),
    qtySludgeDischargedUom: { id: 1, name: 'MT', displayName: 'MT' },
    comment: chance.paragraph(),
    isVerifiedSludgeQty: chance.bool()
  };
}

export function getMockQcSurveyHistoryList(
  n: number
): IQcSurveyHistoryListItemDto[] {
  return range(1, n).map(id => getMockQcSurveyHistoryListItem(id));
}
